import datetime
from typing import Optional
from schemas.analyze import CustomerProfileRequest, BehaviorIQData
from schemas.relationship import EngagementMetrics

def calculate_engagement(profile: CustomerProfileRequest) -> EngagementMetrics:
  interactions = profile.interactions
  tasks = profile.tasks
  
  # Days since last contact
  days_since_last = 99
  if profile.lastInteractionAt:
    try:
      dt = datetime.datetime.fromisoformat(profile.lastInteractionAt.replace("Z", "+00:00"))
      days_since_last = (datetime.datetime.now(datetime.timezone.utc) - dt).days
      days_since_last = max(0, days_since_last)
    except Exception:
      pass
  
  # 1. Interaction Score
  # Base: 40. Each interaction adds 15 points. Penalty of 1 point per day since last contact beyond 15 days.
  interaction_score = 40.0 + (len(interactions) * 15.0)
  if days_since_last > 15:
    interaction_score -= (days_since_last - 15) * 1.2
  interaction_score = max(10.0, min(100.0, interaction_score))
  
  # 2. Follow-up Quality
  # Ratio of completed follow-up tasks vs total follow-up tasks
  follow_up_tasks = [t for t in tasks if t.category.lower() == "follow-up"]
  if follow_up_tasks:
    fu_completed = len([t for t in follow_up_tasks if t.status.lower() == "completed"])
    fu_quality = (fu_completed / len(follow_up_tasks)) * 100.0
  else:
    fu_quality = 85.0 # default baseline when no explicit follow-up tasks exist
    
  # 3. Response Consistency
  # Based on tasks completed on/before due date
  completed_tasks = [t for t in tasks if t.status.lower() == "completed"]
  if completed_tasks:
    on_time = 0
    for t in completed_tasks:
      try:
        due = datetime.datetime.fromisoformat(t.dueDate.replace("Z", "+00:00"))
        comp = datetime.datetime.fromisoformat((t.completedAt or t.updatedAt).replace("Z", "+00:00"))
        if comp <= due:
          on_time += 1
      except Exception:
        on_time += 1
    response_consistency = (on_time / len(completed_tasks)) * 100.0
  else:
    response_consistency = 90.0 # default baseline consistency
    
  # 4. RM Coverage
  # Scaled by number of total interactions
  rm_coverage = min(100.0, len(interactions) * 25.0)
  if len(interactions) == 0:
    rm_coverage = 30.0
    
  # 5. Meeting Completion
  # Meetings completed out of meetings scheduled
  meetings = [i for i in interactions if i.type.upper() == "MEETING"]
  meeting_tasks = [t for t in tasks if t.category.lower() == "meeting"]
  if meeting_tasks:
    completed_mt = len([t for t in meeting_tasks if t.status.lower() == "completed"])
    meeting_completion = (completed_mt / len(meeting_tasks)) * 100.0
  else:
    meeting_completion = 95.0 # default baseline when no scheduled meeting tasks are pending
    
  # 6. Touchpoint Frequency
  # Average touchpoints per month (based on 3-month window, min 0.5 per month)
  touchpoint_frequency = max(0.5, len(interactions) / 2.0)
  
  return EngagementMetrics(
    interactionScore=round(interaction_score, 2),
    followUpQuality=round(fu_quality, 2),
    responseConsistency=round(response_consistency, 2),
    rmCoverage=round(rm_coverage, 2),
    meetingCompletion=round(meeting_completion, 2),
    touchpointFrequency=round(touchpoint_frequency, 2)
  )
