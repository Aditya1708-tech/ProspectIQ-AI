# Confidence Resolver for NotificationIQ
from typing import List
from schemas.analyze import CustomerProfileRequest

def resolve_notification_confidence(profile: CustomerProfileRequest) -> float:
  """
  Deterministic confidence resolver based on customer data completeness
  """
  score = 100.0
  
  # Basic profile checks
  if not profile.email:
    score -= 10.0
  if not profile.phone:
    score -= 10.0
  if not profile.lastInteractionAt:
    score -= 15.0
    
  # Address check
  if not profile.addresses:
    score -= 15.0
    
  # Account verification
  if not profile.accounts:
    score -= 20.0
  else:
    # Transaction logs
    has_tx = False
    for acc in profile.accounts:
      if acc.transactions:
        has_tx = True
        break
    if not has_tx:
      score -= 15.0
      
  return max(score / 100.0, 0.1)
