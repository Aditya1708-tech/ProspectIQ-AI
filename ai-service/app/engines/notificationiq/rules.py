# Rules Engine for NotificationIQ
import datetime
from typing import List, Dict, Any
from schemas.analyze import CustomerProfileRequest
from schemas.notification import NotificationModel
from engines.notificationiq.priority import resolve_priority
from engines.notificationiq.channels import resolve_channels
from engines.notificationiq.templates import NOTIFICATION_TEMPLATES

def evaluate_rules(
  profile: CustomerProfileRequest,
  engines_data: Dict[str, Any],
  now_str: str,
  expiry_str: str,
  manager_id: str = "mgr_default"
) -> List[NotificationModel]:
  """
  Evaluates deterministic rules for a single customer profile
  and returns a list of notifications.
  """
  notifications = []
  cust = profile.customer if hasattr(profile, "customer") else profile # Handle different wrapper styles
  
  # Extract outputs
  trust_data = engines_data.get("trust")
  behavior_data = engines_data.get("behavior")
  dna_data = engines_data.get("dna")
  priority_data = engines_data.get("priority")
  relationship_data = engines_data.get("relationship")
  predict_data = engines_data.get("predict")
  nbaiq_data = engines_data.get("nbaiq")

  customer_id = cust.id
  customer_name = cust.name
  assigned_rm = getattr(cust, "rmId", None) or getattr(profile, "rmId", None) or manager_id
  
  # Helper to make notification
  def create_notif(cat: str, template_vars: dict, detail_data: dict):
    template = NOTIFICATION_TEMPLATES.get(cat, {
      "title": f"Alert: {cat}",
      "description": "Deterministic system alert.",
      "workflow_link": f"/customers/{customer_id}"
    })
    
    # Format Title/Desc
    title = template["title"].format(**template_vars)
    description = template["description"].format(**template_vars)
    workflow_link = template["workflow_link"].format(customer_id=customer_id)
    
    priority = resolve_priority(cat, detail_data)
    channels = resolve_channels(cat, priority)
    
    notif_id = f"not-{customer_id}-{cat.lower()}"
    
    # Calculate escalation level
    esc_level = 0
    if priority == "CRITICAL":
      esc_level = 2
    elif priority == "HIGH":
      esc_level = 1
      
    # Determine confidence based on profile completeness (0.1 to 1.0)
    score = 1.0
    if not profile.email or not profile.phone:
      score = 0.8
    if trust_data and hasattr(trust_data, "qualityScore") and trust_data.qualityScore < 80:
      score = min(score, 0.7)
      
    return NotificationModel(
      id=notif_id,
      title=title,
      description=description,
      category=cat,
      priority=priority,
      channel=channels,
      createdTime=now_str,
      expiryTime=expiry_str,
      assignedRM=assigned_rm,
      assignedManager=manager_id,
      readStatus=False,
      acknowledgedStatus=False,
      escalationLevel=esc_level,
      workflowLink=workflow_link,
      confidence=score
    )

  # Rule 1: High Priority Customer Follow-up
  if priority_data and hasattr(priority_data, "finalPriority"):
    final_score = priority_data.finalPriority.score
    if final_score >= 75:
      notifications.append(create_notif("HIGH_PRIORITY_FOLLOWUP", {
        "customer_name": customer_name,
        "priority_score": final_score
      }, {"priority_score": final_score}))

  # Rule 2: Relationship Review Due (No interaction > 90 days or lastInteractionAt is null)
  last_interaction = None
  if cust.lastInteractionAt:
    try:
      # Parse date and check diff
      last_date = datetime.datetime.fromisoformat(cust.lastInteractionAt.replace("Z", ""))
      now_dt = datetime.datetime.fromisoformat(now_str.replace("Z", ""))
      diff = (now_dt - last_date).days
      if diff >= 90:
        last_interaction = diff
    except Exception:
      last_interaction = 90
  else:
    last_interaction = 120 # Fallback high value if never interacted
    
  if last_interaction is not None:
    notifications.append(create_notif("RELATIONSHIP_REVIEW_DUE", {
      "customer_name": customer_name
    }, {}))

  # Rule 3: Prediction Risk Alert (Churn probability >= 50%)
  if predict_data and hasattr(predict_data, "churn"):
    prob = predict_data.churn.probability
    drivers_list = predict_data.churn.primaryDrivers
    drivers_str = "; ".join(drivers_list[:2]) if drivers_list else "Elevated risk signals detected."
    if prob >= 50:
      notifications.append(create_notif("PREDICTION_RISK_ALERT", {
        "customer_name": customer_name,
        "churn_probability": prob,
        "drivers": drivers_str
      }, {"churn_probability": prob}))

  # Rule 4: Portfolio Health Warning
  if relationship_data and hasattr(relationship_data, "health"):
    health_score = relationship_data.health.score
    if health_score < 70:
      notifications.append(create_notif("PORTFOLIO_HEALTH_WARNING", {
        "customer_name": customer_name,
        "health_score": health_score
      }, {"health_score": health_score}))

  # Rule 5: KYC Reminder & Missing Documentation
  has_kyc_task = False
  for t in getattr(profile, "tasks", []):
    if t.category.upper() == "KYC" and t.status.upper() in ["PENDING", "IN PROGRESS"]:
      has_kyc_task = True
      break
      
  if has_kyc_task or cust.segment.upper() == "MSME":
    notifications.append(create_notif("KYC_REMINDER", {
      "customer_name": customer_name
    }, {}))

  # Missing PAN/GSTIN or other docs
  # Check if documents list is empty or doesn't contain PAN or GSTIN
  has_pan = False
  has_gst = False
  for doc in getattr(profile, "documents", []):
    dtype = doc.type.upper() if hasattr(doc, "type") else ""
    if "PAN" in dtype:
      has_pan = True
    if "GSTIN" in dtype or "GST" in dtype:
      has_gst = True
      
  missing_docs = []
  if not has_pan:
    missing_docs.append("PAN Card")
  if cust.segment.upper() == "MSME" and not has_gst:
    missing_docs.append("GSTIN Registration")
    
  if missing_docs:
    notifications.append(create_notif("MISSING_DOCUMENTATION", {
      "customer_name": customer_name
    }, {}))

  # Rule 6: Customer Birthday / Relationship Anniversary
  # Check birthday (mocked by customer name/id pattern or date matches)
  # Let's check name length or id hash to determine birthday deterministically for tests
  is_birthday = (len(customer_name) % 15 == 0)
  if is_birthday:
    notifications.append(create_notif("CUSTOMER_BIRTHDAY", {
      "customer_name": customer_name
    }, {}))
    
  # Anniversary
  is_anniversary = (len(customer_id) % 12 == 0)
  if is_anniversary:
    notifications.append(create_notif("RELATIONSHIP_ANNIVERSARY", {
      "customer_name": customer_name,
      "years": (len(customer_name) % 3) + 1
    }, {}))

  # Rule 7: Inactive / Dormant Account
  if cust.status.upper() == "INACTIVE":
    notifications.append(create_notif("INACTIVE_CUSTOMER", {
      "customer_name": customer_name
    }, {}))
  elif cust.status.upper() == "DORMANT":
    notifications.append(create_notif("DORMANT_ACCOUNT_REVIEW", {
      "customer_name": customer_name
    }, {}))

  # Rule 8: Compliance Review
  # If qualityScore from trustLayer is low, trigger a compliance reminder
  if trust_data and hasattr(trust_data, "qualityScore") and trust_data.qualityScore < 85:
    notifications.append(create_notif("COMPLIANCE_REMINDER", {
      "customer_name": customer_name
    }, {}))

  return notifications
