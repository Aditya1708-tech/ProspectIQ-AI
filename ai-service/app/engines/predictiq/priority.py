from typing import Optional
from schemas.analyze import CustomerProfileRequest, BehaviorIQData, PriorityIQProfile
from schemas.relationship import RelationshipIQProfile
from schemas.predict import ForecastMetric
from engines.predictiq.forecast import compute_forecast_metric

def forecast_priority(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData],
  priority: Optional[PriorityIQProfile],
  relationship: Optional[RelationshipIQProfile]
) -> ForecastMetric:
  current_priority = 50.0
  confidence = "MEDIUM"

  if priority and priority.finalPriority:
    current_priority = priority.finalPriority.score
    confidence = priority.finalPriority.confidence

  rate = -0.01 # default priority slightly drops as tasks get completed

  # Adjust rate based on pending/overdue tasks
  pending_tasks = 0
  overdue_tasks = 0
  for t in profile.tasks:
    if t.status in ["Pending", "In Progress", "Waiting Customer"]:
      pending_tasks += 1
    if t.status == "Overdue":
      overdue_tasks += 1

  if overdue_tasks > 0:
    rate += 0.08
  elif pending_tasks > 2:
    rate += 0.04

  if relationship and relationship.interactions:
    if relationship.interactions.daysSinceLastContact > 30:
      rate += 0.03

  reason_30 = "Priority remains stable with active operations." if rate <= 0.02 else "Priority increases due to active action list backlog."
  reason_90 = "Expect standard baseline level as workflows resolve." if rate <= 0.02 else "Escalated focus is likely to continue until pending check-ins are logged."
  reason_180 = "Long-term normalized priority levels stabilized." if rate <= 0.02 else "Urgency flags remains high if tasks remain uncompleted."

  return compute_forecast_metric(
    current_value=current_priority,
    rate_per_day=rate,
    confidence=confidence,
    reason_30=reason_30,
    reason_90=reason_90,
    reason_180=reason_180
  )
