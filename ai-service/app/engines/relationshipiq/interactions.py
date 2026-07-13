import datetime
from typing import Optional, List, Dict
from schemas.analyze import CustomerProfileRequest, BehaviorIQData
from schemas.relationship import (
  InteractionIntelligenceData,
  TouchpointEffectivenessData,
  TouchpointChannelDetail
)

def aggregate_interactions(profile: CustomerProfileRequest) -> InteractionIntelligenceData:
  interactions = profile.interactions
  tasks = profile.tasks
  
  meetings = len([i for i in interactions if i.type.upper() == "MEETING"])
  calls = len([i for i in interactions if i.type.upper() == "CALL"])
  emails = len([i for i in interactions if i.type.upper() == "EMAIL"])
  
  # Follow-ups: tasks with 'Follow-up' category or interactions containing follow-up
  follow_ups_count = len([t for t in tasks if t.category.lower() == "follow-up"]) + \
                     len([i for i in interactions if "follow-up" in i.summary.lower() or (i.notes and "follow-up" in i.notes.lower())])
  
  completed_tasks = len([t for t in tasks if t.status.lower() == "completed"])
  pending_tasks = len([t for t in tasks if t.status.lower() in ["pending", "in progress", "waiting customer"]])
  missed_tasks = len([t for t in tasks if t.status.lower() == "overdue"])
  
  # Calculate average response time in days (derived from actualDuration in tasks if present, default to 1.5 days)
  durations = [t.actualDuration for t in tasks if t.actualDuration is not None and t.status.lower() == "completed"]
  if durations:
    # Convert minutes to days
    avg_response = round(sum(durations) / len(durations) / 1440.0, 2)
  else:
    avg_response = 1.5 # default 1.5 days
    
  # Interaction coverage (percentage of target touchpoints, let's say target is 4 touchpoints)
  total_touchpoints = len(interactions)
  interaction_coverage = min(100.0, float(total_touchpoints) * 25.0)
  
  # Days since last contact
  days_since_last = 99
  if profile.lastInteractionAt:
    try:
      dt = datetime.datetime.fromisoformat(profile.lastInteractionAt.replace("Z", "+00:00"))
      days_since_last = (datetime.datetime.now(datetime.timezone.utc) - dt).days
      days_since_last = max(0, days_since_last)
    except Exception:
      pass
  elif interactions:
    # Fallback to latest interaction in array
    dates = []
    for i in interactions:
      try:
        dates.append(datetime.datetime.fromisoformat(i.interactionDate.replace("Z", "+00:00")))
      except Exception:
        pass
    if dates:
      days_since_last = (datetime.datetime.now(datetime.timezone.utc) - max(dates)).days
      days_since_last = max(0, days_since_last)
      
  return InteractionIntelligenceData(
    meetings=meetings,
    calls=calls,
    emails=emails,
    followUps=follow_ups_count,
    completedTasks=completed_tasks,
    pendingTasks=pending_tasks,
    missedTasks=missed_tasks,
    averageResponseTime=avg_response,
    interactionCoverage=round(interaction_coverage, 2),
    daysSinceLastContact=days_since_last
  )

def evaluate_touchpoints(profile: CustomerProfileRequest) -> TouchpointEffectivenessData:
  interactions = profile.interactions
  tasks = profile.tasks
  
  # Calls
  call_list = [i for i in interactions if i.type.upper() == "CALL"]
  calls_count = len(call_list)
  calls_detail = TouchpointChannelDetail(
    count=calls_count,
    completionRate=100.0 if calls_count > 0 else 0.0,
    successRate=80.0 if calls_count > 0 else 0.0,
    resolutionTime=0.5,
    effectivenessScore=80.0 if calls_count > 0 else 0.0
  )
  
  # Meetings
  meet_list = [i for i in interactions if i.type.upper() == "MEETING"]
  meetings_count = len(meet_list)
  meetings_detail = TouchpointChannelDetail(
    count=meetings_count,
    completionRate=100.0 if meetings_count > 0 else 0.0,
    successRate=90.0 if meetings_count > 0 else 0.0,
    resolutionTime=1.5,
    effectivenessScore=90.0 if meetings_count > 0 else 0.0
  )
  
  # Emails
  email_list = [i for i in interactions if i.type.upper() == "EMAIL"]
  emails_count = len(email_list)
  emails_detail = TouchpointChannelDetail(
    count=emails_count,
    completionRate=100.0 if emails_count > 0 else 0.0,
    successRate=70.0 if emails_count > 0 else 0.0,
    resolutionTime=4.0,
    effectivenessScore=70.0 if emails_count > 0 else 0.0
  )
  
  # Follow-ups
  follow_up_tasks = [t for t in tasks if t.category.lower() == "follow-up"]
  fu_count = len(follow_up_tasks)
  fu_completed = len([t for t in follow_up_tasks if t.status.lower() == "completed"])
  fu_rate = (fu_completed / fu_count * 100.0) if fu_count > 0 else 100.0
  followUps_detail = TouchpointChannelDetail(
    count=fu_count,
    completionRate=round(fu_rate, 2),
    successRate=85.0 if fu_count > 0 else 0.0,
    resolutionTime=24.0,
    effectivenessScore=round(fu_rate * 0.6 + 85.0 * 0.4, 2) if fu_count > 0 else 0.0
  )
  
  # Tasks (All tasks)
  tasks_count = len(tasks)
  tasks_completed = len([t for t in tasks if t.status.lower() == "completed"])
  tasks_completion_rate = (tasks_completed / tasks_count * 100.0) if tasks_count > 0 else 100.0
  
  task_durations = [t.actualDuration for t in tasks if t.actualDuration is not None and t.status.lower() == "completed"]
  avg_task_res = round(sum(task_durations) / len(task_durations) / 60.0, 2) if task_durations else 12.0
  
  # Success rate based on compliance
  non_overdue_completed = len([t for t in tasks if t.status.lower() == "completed" and t.dueDate >= (t.completedAt or t.updatedAt)])
  task_success_rate = (non_overdue_completed / tasks_completed * 100.0) if tasks_completed > 0 else 90.0
  
  tasks_detail = TouchpointChannelDetail(
    count=tasks_count,
    completionRate=round(tasks_completion_rate, 2),
    successRate=round(task_success_rate, 2),
    resolutionTime=avg_task_res,
    effectivenessScore=round(tasks_completion_rate * 0.5 + task_success_rate * 0.5, 2) if tasks_count > 0 else 0.0
  )
  
  return TouchpointEffectivenessData(
    calls=calls_detail,
    meetings=meetings_detail,
    emails=emails_detail,
    followUps=followUps_detail,
    tasks=tasks_detail
  )
