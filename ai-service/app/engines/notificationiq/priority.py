# Priority Calculator for NotificationIQ

def resolve_priority(category: str, detail_data: dict) -> str:
  """
  Deterministic priority scoring based on category and transaction/risk metrics
  Returns 'LOW', 'MEDIUM', 'HIGH', or 'CRITICAL'
  """
  category = category.upper()
  
  if category in ["MANAGER_ESCALATION", "SLA_BREACH_WARNING"]:
    return "CRITICAL"
    
  if category == "PREDICTION_RISK_ALERT":
    prob = detail_data.get("churn_probability", 0)
    if prob >= 80:
      return "CRITICAL"
    elif prob >= 50:
      return "HIGH"
    return "MEDIUM"
    
  if category == "PORTFOLIO_HEALTH_WARNING":
    health = detail_data.get("health_score", 100)
    if health < 45:
      return "CRITICAL"
    elif health < 65:
      return "HIGH"
    return "MEDIUM"

  if category == "TASK_OVERDUE":
    priority = detail_data.get("task_priority", "MEDIUM").upper()
    if priority == "HIGH":
      return "CRITICAL"
    return "HIGH"

  if category in ["KYC_REMINDER", "MISSING_DOCUMENTATION", "HIGH_PRIORITY_FOLLOWUP"]:
    return "HIGH"

  if category in ["RELATIONSHIP_REVIEW_DUE", "COMPLIANCE_REMINDER", "DORMANT_ACCOUNT_REVIEW", "INACTIVE_CUSTOMER"]:
    return "MEDIUM"

  if category in ["UPCOMING_RM_MEETING", "TASK_DUE_TODAY", "BRANCH_HEALTH_ALERT"]:
    return "MEDIUM"

  # Default low priority
  return "LOW"
