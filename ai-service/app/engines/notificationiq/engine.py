# NotificationIQ Main Engine Orchestrator
import datetime
from typing import List, Dict, Any
from schemas.analyze import CustomerProfileRequest, TaskSchema
from schemas.notification import (
  NotificationModel, TimelineEvent,
  NotificationAnalyticsModel, NotificationIQProfile
)
from engines.notificationiq.notifications import compile_notifications, run_profile_engines
from engines.notificationiq.summary import generate_morning_brief, generate_executive_brief
from engines.notificationiq.confidence import resolve_notification_confidence

class NotificationIQEngine:
  def name(self) -> str:
    return "NotificationIQ"

  def analyze(
    self,
    profiles: List[CustomerProfileRequest],
    tasks: List[TaskSchema],
    user_id: str,
    user_role: str
  ) -> NotificationIQProfile:
    # 1. Setup timestamps
    now = datetime.datetime.now(datetime.timezone.utc)
    now_str = now.isoformat().replace("+00:00", "Z")
    
    expiry = now + datetime.timedelta(days=7)
    expiry_str = expiry.isoformat().replace("+00:00", "Z")

    # 2. Compile notifications
    notifications = compile_notifications(profiles, tasks, user_id, user_role, now_str, expiry_str)

    # 3. Generate Timeline Events
    timeline_events = self._generate_timeline(profiles, tasks, now)

    # 4. Compute Metrics for Briefings and Analytics
    metrics = self._compute_portfolio_metrics(profiles, tasks, notifications)

    # 5. Generate Morning Brief and Executive Brief
    def get_cust(p):
      return p.customer if hasattr(p, "customer") else p

    urgent_names = [get_cust(p).name for p in profiles if get_cust(p).riskCategory.upper() in ["HIGH", "CRITICAL"]]
    if not urgent_names:
      urgent_names = [get_cust(p).name for p in profiles[:2]] # Fallback names if none high risk
      
    pending_tasks_count = len([t for t in tasks if t.status.upper() in ["PENDING", "IN PROGRESS"]])
    
    morning_brief = generate_morning_brief(metrics, urgent_names, pending_tasks_count, confidence="HIGH")
    executive_brief = generate_executive_brief(metrics, confidence="HIGH")

    # 6. Build Analytics Model
    analytics = self._build_analytics(tasks, notifications)

    return NotificationIQProfile(
      notifications=notifications,
      morningBrief=morning_brief,
      executiveBrief=executive_brief,
      timeline=timeline_events,
      analytics=analytics
    )

  def _generate_timeline(
    self,
    profiles: List[CustomerProfileRequest],
    tasks: List[TaskSchema],
    now: datetime.datetime
  ) -> List[TimelineEvent]:
    events = []
    
    # helper for dates
    def get_date_str(days_ago: int) -> str:
      dt = now - datetime.timedelta(days=days_ago)
      return dt.isoformat()[:10] + "T10:00:00Z"

    # A. Add Task Events
    for idx, task in enumerate(tasks):
      status = task.status.upper()
      created_days_ago = (idx % 4) * 3
      completed_days_ago = (idx % 3) * 5
      
      # Task Creation
      events.append(TimelineEvent(
        id=f"evt-task-created-{task.id}",
        title=f"Task Assigned: {task.title}",
        description=f"Task categorized as {task.category} was assigned to RM.",
        category="RM Tasks",
        timestamp=get_date_str(created_days_ago),
        type="TASK",
        sourceEngine="RM Workspace",
        workflowLink="/workspace"
      ))
      
      # Task Completion
      if status == "COMPLETED":
        events.append(TimelineEvent(
          id=f"evt-task-completed-{task.id}",
          title=f"Task Completed: {task.title}",
          description=f"Task resolved successfully. Time elapsed: {task.actualDuration or 15} minutes.",
          category="RM Tasks",
          timestamp=get_date_str(completed_days_ago),
          type="TASK",
          sourceEngine="RM Workspace",
          workflowLink="/workspace"
        ))

    # B. Add Customer Interaction Events
    for profile in profiles:
      cust = profile.customer if hasattr(profile, "customer") else profile
      for inter in getattr(profile, "interactions", []):
        events.append(TimelineEvent(
          id=f"evt-inter-{inter.id}",
          title=f"Client Contact: {cust.name}",
          description=f"Conducted {inter.type} outreach. Summary: {inter.summary}",
          category="Interactions",
          timestamp=inter.interactionDate,
          type="INTERACTION",
          sourceEngine="RelationshipIQ",
          customerId=cust.id,
          customerName=cust.name,
          workflowLink=f"/customers/{cust.id}"
        ))

    # C. Add Milestones / Alerts
    for idx, profile in enumerate(profiles):
      cust = profile.customer if hasattr(profile, "customer") else profile
      # Mocking milestone event
      if idx % 2 == 0:
        events.append(TimelineEvent(
          id=f"evt-milestone-{cust.id}",
          title=f"Relationship Anniversary: {cust.name}",
          description=f"Celebrating relationship milestone at Branch {cust.branchCode}.",
          category="Milestones",
          timestamp=get_date_str(7),
          type="MILESTONES",
          sourceEngine="RelationshipIQ",
          customerId=cust.id,
          customerName=cust.name,
          workflowLink=f"/customers/{cust.id}"
        ))
      
      # Mocking prediction alerts
      if cust.riskCategory.upper() in ["HIGH", "CRITICAL"]:
        events.append(TimelineEvent(
          id=f"evt-alert-{cust.id}",
          title=f"Prediction Risk: Attrition Warning",
          description=f"Volatility detected in capital savings ratio for {cust.name}.",
          category="Alerts",
          timestamp=get_date_str(1),
          type="ALERTS",
          sourceEngine="PredictIQ",
          customerId=cust.id,
          customerName=cust.name,
          workflowLink=f"/customers/{cust.id}"
        ))

    # Sort events chronologically (descending: newest first)
    events.sort(key=lambda x: x.timestamp, reverse=True)
    return events[:30] # Limit to top 30 events

  def _compute_portfolio_metrics(
    self,
    profiles: List[CustomerProfileRequest],
    tasks: List[TaskSchema],
    notifications: List[NotificationModel]
  ) -> Dict[str, Any]:
    total_profiles = len(profiles)
    
    # Calculate simple health/trust averages for morning/weekly templates
    avg_health = 75.0
    avg_trust = 85.0
    avg_priority = 60.0
    
    if total_profiles > 0:
      healths = []
      trusts = []
      priorities = []
      
      for p in profiles:
        # PredictIQ or RelationshipIQ scores could be approximated or run
        # To make it high performance, use simple heuristics on profile status & balance
        bal = sum(acc.balance for acc in p.accounts)
        cust_status = p.customer.status if hasattr(p, "customer") else p.status
        health_score = 85.0 if cust_status == "ACTIVE" else 45.0
        if bal < 50000:
          health_score -= 10
        healths.append(health_score)
        
        trust_score = 90.0 if p.phone and p.email else 60.0
        trusts.append(trust_score)
        
        pri_score = 45.0
        cust_risk = p.customer.riskCategory if hasattr(p, "customer") else p.riskCategory
        if cust_risk == "HIGH":
          pri_score += 35
        priorities.append(pri_score)
        
      avg_health = sum(healths) / len(healths)
      avg_trust = sum(trusts) / len(trusts)
      avg_priority = sum(priorities) / len(priorities)

    critical_count = len([n for n in notifications if n.priority == "CRITICAL"])
    overdue_count = len([t for t in tasks if t.status.upper() == "OVERDUE"])

    branch_code = "BR001"
    if total_profiles > 0:
      p0 = profiles[0]
      branch_code = p0.customer.branchCode if hasattr(p0, "customer") else p0.branchCode

    return {
      "average_health": avg_health,
      "average_trust": avg_trust,
      "average_priority": avg_priority,
      "critical_alerts_count": critical_count,
      "overdue_tasks_count": overdue_count,
      "branch_code": branch_code,
      "rm_productivity": 92.5,
      "total_customers": total_profiles
    }

  def _build_analytics(
    self,
    tasks: List[TaskSchema],
    notifications: List[NotificationModel]
  ) -> NotificationAnalyticsModel:
    unread_count = len(notifications) # At start, all are unread
    critical_count = len([n for n in notifications if n.priority == "CRITICAL"])
    
    # Count task alerts representing overdue tasks
    overdue_alerts = len([n for n in notifications if n.category in ["TASK_OVERDUE", "SLA_BREACH_WARNING"]])
    
    completed_tasks = [t for t in tasks if t.status.upper() == "COMPLETED"]
    total_tasks = len(tasks)
    
    # Calculate deterministic rates
    ack_rate = 85.0
    res_rate = 90.0
    if total_tasks > 0:
      res_rate = (len(completed_tasks) / total_tasks) * 100.0
      
    avg_resp = 2.4 # average response time in hours
    
    daily_vol = len(notifications)
    weekly_vol = daily_vol * 4
    monthly_vol = daily_vol * 15

    return NotificationAnalyticsModel(
      unreadNotifications=unread_count,
      criticalAlerts=critical_count,
      overdueAlerts=overdue_alerts,
      averageResponseTime=round(avg_resp, 1),
      acknowledgementRate=round(ack_rate, 1),
      resolutionRate=round(res_rate, 1),
      escalationRate=4.5,
      dailyVolume=daily_vol,
      weeklyVolume=weekly_vol,
      monthlyVolume=monthly_vol
    )
