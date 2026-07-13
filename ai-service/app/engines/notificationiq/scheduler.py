# Scheduler and Task Alert Processor for NotificationIQ
import datetime
from typing import List, Dict, Any
from schemas.analyze import TaskSchema
from schemas.notification import NotificationModel
from engines.notificationiq.priority import resolve_priority
from engines.notificationiq.channels import resolve_channels
from engines.notificationiq.templates import NOTIFICATION_TEMPLATES

def evaluate_task_alerts(
  tasks: List[TaskSchema],
  now_str: str,
  expiry_str: str,
  manager_id: str = "mgr_default"
) -> List[NotificationModel]:
  """
  Analyzes tasks to trigger Task Overdue, Task Due Today,
  SLA Breach Warning, and Manager Escalation alerts.
  """
  notifications = []
  now_dt = datetime.datetime.fromisoformat(now_str.replace("Z", ""))
  
  for task in tasks:
    # If completed, ignore alerts
    if task.status.upper() in ["COMPLETED", "CANCELLED"]:
      continue
      
    try:
      due_dt = datetime.datetime.fromisoformat(task.dueDate.replace("Z", ""))
    except Exception:
      # If date parsing fails, skip or mock
      due_dt = now_dt + datetime.timedelta(days=1)
      
    is_today = due_dt.date() == now_dt.date()
    is_overdue = due_dt < now_dt and not is_today
    days_overdue = (now_dt - due_dt).days
    
    # Helper to construct task notification
    def build_task_notif(cat: str, priority_val: str = None):
      template = NOTIFICATION_TEMPLATES.get(cat, {
        "title": f"Task Alert: {cat}",
        "description": "Deterministic task alert.",
        "workflow_link": "/workspace"
      })
      
      title = template["title"].format(task_title=task.title)
      description = template["description"].format(
        task_title=task.title,
        due_date=task.dueDate[:10],
        assigned_rm=task.assignedRM if hasattr(task, "assignedRM") else "Relationship Manager"
      )
      
      priority = priority_val or resolve_priority(cat, {"task_priority": task.priority})
      channels = resolve_channels(cat, priority)
      
      # Unique id
      notif_id = f"not-task-{task.id}-{cat.lower()}"
      
      esc_level = 0
      if priority == "CRITICAL":
        esc_level = 2
      elif priority == "HIGH":
        esc_level = 1
        
      return NotificationModel(
        id=notif_id,
        title=title,
        description=description,
        category=cat,
        priority=priority,
        channel=channels,
        createdTime=now_str,
        expiryTime=expiry_str,
        assignedRM=task.assignedRM if hasattr(task, "assignedRM") else "rm_default",
        assignedManager=manager_id,
        readStatus=False,
        acknowledgedStatus=False,
        escalationLevel=esc_level,
        workflowLink="/workspace",
        confidence=0.95
      )

    # 1. Manager Escalation: Overdue high-priority task, or overdue by more than 3 days
    if is_overdue and (task.priority.upper() == "HIGH" or days_overdue >= 3):
      notifications.append(build_task_notif("MANAGER_ESCALATION", "CRITICAL"))
      
    # 2. SLA Breach Warning: Task due today and high priority, or overdue by 1-2 days
    elif (is_today and task.priority.upper() == "HIGH") or (is_overdue and days_overdue > 0):
      notifications.append(build_task_notif("SLA_BREACH_WARNING", "HIGH"))
      
    # 3. Task Overdue: overdue by less than 24 hours (not critical or high priority)
    elif is_overdue:
      notifications.append(build_task_notif("TASK_OVERDUE", "HIGH"))
      
    # 4. Task Due Today
    elif is_today:
      notifications.append(build_task_notif("TASK_DUE_TODAY", "MEDIUM"))

  return notifications
