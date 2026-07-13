from typing import Optional
from schemas.analyze import CustomerProfileRequest, BehaviorIQData, PriorityIQProfile
from schemas.relationship import RelationshipIQProfile
from schemas.predict import ForecastMetric
from engines.predictiq.forecast import compute_forecast_metric

def forecast_health(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData],
  priority: Optional[PriorityIQProfile],
  relationship: Optional[RelationshipIQProfile]
) -> ForecastMetric:
  current_health = 70.0
  confidence = "MEDIUM"

  if relationship and relationship.health:
    current_health = relationship.health.score
    confidence = relationship.health.confidence

  # Calculate rate of change per day based on drivers
  rate = 0.02 # default slightly positive

  if priority and priority.retentionRisk:
    if priority.retentionRisk.score > 60:
      rate -= 0.08
    elif priority.retentionRisk.score < 30:
      rate += 0.03

  if relationship and relationship.interactions:
    days_since_contact = relationship.interactions.daysSinceLastContact
    if days_since_contact > 30:
      rate -= 0.05
    elif days_since_contact <= 10:
      rate += 0.02

  reason_30 = "Stability maintained via scheduled contact frequencies." if rate >= 0 else "Minor deterioration expected due to contact gaps."
  reason_90 = "Projected steady growth based on digital transaction adoption." if rate >= 0 else "Decline likely unless a structured touchpoint is logged."
  reason_180 = "Long-term relationship health expected to stabilize around target ranges." if rate >= 0 else "Long-term client stability at risk without immediate intervention."

  return compute_forecast_metric(
    current_value=current_health,
    rate_per_day=rate,
    confidence=confidence,
    reason_30=reason_30,
    reason_90=reason_90,
    reason_180=reason_180
  )
