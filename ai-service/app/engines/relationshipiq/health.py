import datetime
from typing import Optional, List, Any
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData
from schemas.relationship import RelationshipHealthData

def evaluate_health(
  profile: CustomerProfileRequest,
  trust: TrustLayerData,
  behavior: Optional[BehaviorIQData],
  priority: Optional[Any],
) -> RelationshipHealthData:
  trust_score = trust.qualityScore if trust else 100.0
  
  priority_val = 50.0
  retention_risk_val = 10.0
  if priority:
    priority_val = priority.finalPriority.score
    retention_risk_val = priority.retentionRisk.score
      
  # RM interaction frequency
  interactions = profile.interactions
  interaction_count = len(interactions)
  
  # Task completion rate
  tasks = profile.tasks
  total_tasks = len(tasks)
  completed_tasks = len([t for t in tasks if t.status.lower() == "completed"])
  task_completion_rate = (completed_tasks / total_tasks * 100.0) if total_tasks > 0 else 100.0
  
  # Digital adoption
  digital_adoption_val = 50.0
  if behavior:
    digital_adoption_val = behavior.expenses.digitalPaymentRatio
      
  # Engagement Score
  engagement_val = 50.0
  if interaction_count > 0:
    engagement_val = min(100.0, 40.0 + interaction_count * 10.0)
    if profile.lastInteractionAt:
      try:
        dt = datetime.datetime.fromisoformat(profile.lastInteractionAt.replace("Z", "+00:00"))
        days = (datetime.datetime.now(datetime.timezone.utc) - dt).days
        if days > 30:
          engagement_val = max(10.0, engagement_val - (days - 30) * 1.5)
      except Exception:
        pass
              
  # Combined health score formula
  components = {
    "trust": trust_score * 0.2, # 20%
    "engagement": engagement_val * 0.2, # 20%
    "digital": digital_adoption_val * 0.15, # 15%
    "tasks": task_completion_rate * 0.15, # 15%
    "retention": (100.0 - retention_risk_val) * 0.2, # 20%
    "priority": (100.0 - abs(50.0 - priority_val)) * 0.1 # 10%
  }
  
  health_score = round(sum(components.values()), 2)
  health_score = max(0.0, min(100.0, health_score))
  
  if health_score >= 80.0:
    category = "Healthy"
  elif health_score >= 70.0:
    category = "Growing"
  elif health_score >= 50.0:
    category = "Needs Attention"
  else:
    category = "Critical"
      
  # Drivers
  positive_drivers = []
  negative_drivers = []
  
  if trust_score >= 90:
    positive_drivers.append("Exceptional profile data integrity and compliance standing.")
  else:
    negative_drivers.append("Data validation warnings present in customer registration records.")
      
  if task_completion_rate >= 80:
    positive_drivers.append("Excellent operational response rate with prompt task resolutions.")
  elif task_completion_rate < 50:
    negative_drivers.append("Overdue relationship tasks indicate communication gaps.")
      
  if digital_adoption_val >= 75:
    positive_drivers.append("High digital banking channel adoption and card/UPI utilization.")
  elif digital_adoption_val < 35:
    negative_drivers.append("High dependency on cash withdrawals over digital channels.")
      
  if retention_risk_val < 25:
    positive_drivers.append("Low attrition exposure; client signals stable banking relationship.")
  elif retention_risk_val > 50:
    negative_drivers.append("High attrition risk detected from savings and engagement cues.")
      
  if interaction_count >= 3:
    positive_drivers.append("Consistent RM contact frequency meets touchpoint targets.")
  elif interaction_count == 0:
    negative_drivers.append("Lack of proactive contact logs in relationship ledger.")
      
  if not positive_drivers:
    positive_drivers.append("Basic banking operations are actively maintained.")
  if not negative_drivers:
    negative_drivers.append("No critical relationship concerns currently flagged.")
      
  confidence = "HIGH"
  trust_confidence = trust.confidence if trust else "HIGH"
  if trust_confidence == "LOW" or interaction_count == 0:
    confidence = "LOW"
  elif trust_confidence == "MEDIUM" or interaction_count < 2:
    confidence = "MEDIUM"
      
  return RelationshipHealthData(
    score=health_score,
    category=category,
    positiveDrivers=positive_drivers,
    negativeDrivers=negative_drivers,
    confidence=confidence
  )
