# Channel Resolver for NotificationIQ
from typing import List

def resolve_channels(category: str, priority: str) -> List[str]:
  """
  Determines recommended channels based on category and priority.
  Available channels:
    'RM Dashboard', 'Manager Dashboard', 'Branch Dashboard',
    'Email (Simulated)', 'SMS (Simulated)', 'Push Notification (Simulated)',
    'In-App Alert', 'Timeline Feed'
  """
  priority = priority.upper()
  category = category.upper()
  
  channels = ["RM Dashboard", "In-App Alert", "Timeline Feed"]
  
  if priority == "CRITICAL":
    channels.extend(["SMS (Simulated)", "Push Notification (Simulated)", "Manager Dashboard"])
    
  if priority == "HIGH":
    channels.extend(["Email (Simulated)", "Push Notification (Simulated)"])
    
  if category in ["BRANCH_HEALTH_ALERT", "MANAGER_ESCALATION"]:
    channels.append("Branch Dashboard")
    channels.append("Manager Dashboard")
    
  # De-duplicate
  return list(set(channels))
