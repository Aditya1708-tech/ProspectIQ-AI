# Templates for NotificationIQ

NOTIFICATION_TEMPLATES = {
  "HIGH_PRIORITY_FOLLOWUP": {
    "title": "High Priority Follow-up: {customer_name}",
    "description": "Customer {customer_name} requires immediate follow-up due to high urgency indicators (Priority Score: {priority_score:.0f}).",
    "workflow_link": "/customers/{customer_id}"
  },
  "RELATIONSHIP_REVIEW_DUE": {
    "title": "Relationship Review Due: {customer_name}",
    "description": "No interactions recorded in the last 90 days. Schedule a check-in with {customer_name}.",
    "workflow_link": "/customers/{customer_id}"
  },
  "PREDICTION_RISK_ALERT": {
    "title": "Prediction Risk Alert: {customer_name}",
    "description": "Significant risk detected: Churn probability is {churn_probability:.1f}% with primary drivers: {drivers}.",
    "workflow_link": "/customers/{customer_id}"
  },
  "UPCOMING_RM_MEETING": {
    "title": "Upcoming RM Meeting: {customer_name}",
    "description": "Meeting scheduled for {customer_name} on {due_date}. Prepare agenda topics.",
    "workflow_link": "/workspace"
  },
  "PORTFOLIO_HEALTH_WARNING": {
    "title": "Portfolio Health Warning: {customer_name}",
    "description": "Portfolio health index has dropped to {health_score:.0f}/100. Watch list triggers active.",
    "workflow_link": "/customers/{customer_id}"
  },
  "KYC_REMINDER": {
    "title": "KYC Reminder: {customer_name}",
    "description": "Pending KYC updates detected for {customer_name}. Complete before regulatory deadline.",
    "workflow_link": "/customers/{customer_id}"
  },
  "MISSING_DOCUMENTATION": {
    "title": "Missing Documentation: {customer_name}",
    "description": "Required identification or business registration documents are missing from profile.",
    "workflow_link": "/customers/{customer_id}"
  },
  "CUSTOMER_BIRTHDAY": {
    "title": "Customer Birthday: {customer_name}",
    "description": "Send birthday greetings and client relation outreach to {customer_name} today.",
    "workflow_link": "/customers/{customer_id}"
  },
  "RELATIONSHIP_ANNIVERSARY": {
    "title": "Relationship Anniversary: {customer_name}",
    "description": "Celebrate relationship milestone: Customer {customer_name} has been with IDBI for {years} year(s).",
    "workflow_link": "/customers/{customer_id}"
  },
  "INACTIVE_CUSTOMER": {
    "title": "Inactive Customer Review: {customer_name}",
    "description": "Customer status is marked INACTIVE. Initiate reactivation workflow.",
    "workflow_link": "/customers/{customer_id}"
  },
  "DORMANT_ACCOUNT_REVIEW": {
    "title": "Dormant Account Review: {customer_name}",
    "description": "Dormant account flags triggered for {customer_name}. Review account activity history.",
    "workflow_link": "/customers/{customer_id}"
  },
  "TASK_DUE_TODAY": {
    "title": "Task Due Today: {task_title}",
    "description": "Task '{task_title}' is scheduled for completion today. Assigned to {assigned_rm}.",
    "workflow_link": "/workspace"
  },
  "TASK_OVERDUE": {
    "title": "Task Overdue: {task_title}",
    "description": "Task '{task_title}' has breached its due date ({due_date}). Resolve immediately.",
    "workflow_link": "/workspace"
  },
  "SLA_BREACH_WARNING": {
    "title": "SLA Breach Warning: {task_title}",
    "description": "Urgent task '{task_title}' is close to SLA timeline limits. Escalation imminent.",
    "workflow_link": "/workspace"
  },
  "MANAGER_ESCALATION": {
    "title": "Manager Escalation: {task_title}",
    "description": "Overdue high-priority task '{task_title}' escalated. Assigned to manager review desk.",
    "workflow_link": "/workspace"
  },
  "BRANCH_HEALTH_ALERT": {
    "title": "Branch Health Alert: Uptime Warning",
    "description": "Regional branch systems report workload backlogs or transaction processing limits.",
    "workflow_link": "/admin"
  },
  "COMPLIANCE_REMINDER": {
    "title": "Compliance Review: {customer_name}",
    "description": "Verify customer transactions against updated anti-money laundering and regulatory standards.",
    "workflow_link": "/customers/{customer_id}"
  },
  "SYSTEM_INFORMATION": {
    "title": "System Alert: Platform Status Normal",
    "description": "All AI pipelines, data integrity check routines, and database integrations are running at peak health.",
    "workflow_link": "/admin"
  }
}
