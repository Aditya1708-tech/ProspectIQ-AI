from typing import List, Dict, Any
from engines.nbaiq.calendar import calculate_completion_window

def generate_schedule(workflows: Dict[str, Any]) -> List[str]:
  schedule = []
  
  primary = workflows.get("primaryAction")
  if primary:
    schedule.append(calculate_completion_window(primary["sla"]))
    
  secondary = workflows.get("secondaryAction")
  if secondary:
    schedule.append(calculate_completion_window(secondary["sla"]))
    
  optional = workflows.get("optionalFollowUp")
  if optional:
    schedule.append(calculate_completion_window(optional["sla"]))
    
  return schedule
