import datetime
from typing import Optional, List, Dict, Any
from schemas.analyze import CustomerProfileRequest, PriorityIQProfile
from engines.nbaiq.templates import ACTION_TEMPLATES
from engines.nbaiq.priority import determine_priority
from engines.nbaiq.sla import determine_sla
from engines.nbaiq.calendar import calculate_due_date

def build_action_object(action_type: str, priority_val: str, sla_val: str, base_date: datetime.datetime) -> Dict[str, Any]:
  tpl = ACTION_TEMPLATES.get(action_type, ACTION_TEMPLATES["Call Customer"])
  due_date = calculate_due_date(sla_val, base_date)
  
  return {
    "title": tpl["title"],
    "description": tpl["description"],
    "reason": tpl["reason"],
    "expectedDuration": tpl["expectedDuration"],
    "priority": priority_val if tpl["title"] in ["Call Customer", "Schedule Meeting"] else tpl["priority"],
    "owner": tpl["owner"],
    "recommendedDueDate": due_date,
    "sla": sla_val
  }

def generate_workflows(
  profile: CustomerProfileRequest,
  selected_action_types: List[str],
  priority_profile: Optional[PriorityIQProfile],
  base_date: datetime.datetime
) -> Dict[str, Any]:
  priority_val = determine_priority(priority_profile)
  sla_val = determine_sla(priority_profile)
  
  primary_type = selected_action_types[0] if len(selected_action_types) > 0 else "Call Customer"
  secondary_type = selected_action_types[1] if len(selected_action_types) > 1 else None
  optional_type = selected_action_types[2] if len(selected_action_types) > 2 else None
  
  if primary_type == "No Immediate Action":
    primary_action = build_action_object("No Immediate Action", "LOW", "Next Quarter", base_date)
    return {
      "primaryAction": primary_action,
      "secondaryAction": None,
      "optionalFollowUp": None
    }
  
  fallbacks = ["Call Customer", "Quarterly Touchpoint", "Relationship Review"]
  if not secondary_type:
    for fb in fallbacks:
      if fb != primary_type:
        secondary_type = fb
        break
  if not optional_type:
    for fb in fallbacks:
      if fb != primary_type and fb != secondary_type:
        optional_type = fb
        break
        
  primary_action = build_action_object(primary_type, priority_val, sla_val, base_date)
  
  secondary_sla = "7 Days" if sla_val in ["24 Hours", "48 Hours"] else "30 Days"
  secondary_priority = "MEDIUM" if priority_val == "HIGH" else "LOW"
  secondary_action = build_action_object(secondary_type, secondary_priority, secondary_sla, base_date)
  
  optional_sla = "30 Days" if sla_val in ["24 Hours", "48 Hours", "3 Days"] else "Next Quarter"
  optional_priority = "LOW"
  optional_action = build_action_object(optional_type, optional_priority, optional_sla, base_date)
  
  return {
    "primaryAction": primary_action,
    "secondaryAction": secondary_action,
    "optionalFollowUp": optional_action
  }
