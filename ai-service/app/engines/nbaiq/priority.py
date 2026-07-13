from typing import Optional
from schemas.analyze import PriorityIQProfile

def determine_priority(priority_profile: Optional[PriorityIQProfile]) -> str:
  if not priority_profile:
    return "MEDIUM"
  
  urgency = priority_profile.urgency.score
  retention_risk = priority_profile.retentionRisk.score
  
  if urgency >= 75.0 or retention_risk >= 60.0:
    return "HIGH"
  elif urgency >= 40.0:
    return "MEDIUM"
  else:
    return "LOW"
