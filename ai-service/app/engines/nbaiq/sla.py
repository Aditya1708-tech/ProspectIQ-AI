from typing import Optional
from schemas.analyze import PriorityIQProfile

def determine_sla(priority_profile: Optional[PriorityIQProfile]) -> str:
  if not priority_profile:
    return "7 Days"
    
  score = priority_profile.finalPriority.score
  if score >= 85.0:
    return "24 Hours"
  elif score >= 70.0:
    return "48 Hours"
  elif score >= 55.0:
    return "3 Days"
  elif score >= 35.0:
    return "7 Days"
  elif score >= 15.0:
    return "30 Days"
  else:
    return "Next Quarter"
