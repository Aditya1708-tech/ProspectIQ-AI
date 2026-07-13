from typing import List, Optional
from schemas.analyze import CustomerProfileRequest, BehaviorIQData, PriorityIQProfile

class CoPilotTimelineGenerator:
  def generate_timeline(
    self,
    profile: CustomerProfileRequest,
    behavior: Optional[BehaviorIQData],
    priority: Optional[PriorityIQProfile]
  ) -> List[dict]:
    
    events = []
    
    # 1. Today (always present)
    events.append({
      "time": "Today",
      "event": "Priority status recalculated and synchronized."
    })
    
    # 2. Yesterday (if active status)
    if profile.status == 'ACTIVE':
      events.append({
        "time": "Yesterday",
        "event": "Customer interaction checklist verified."
      })
      
    # 3. 3 Days Ago (if salary detected)
    salary_detected = behavior.income.salaryDetected if behavior else False
    if salary_detected:
      events.append({
        "time": "3 Days Ago",
        "event": "Regular corporate salary credit detected."
      })

    # 4. 7 Days Ago (if digital adoption is active)
    digital_ratio = behavior.expenses.digitalPaymentRatio if behavior else 0.0
    if digital_ratio >= 60.0:
      events.append({
        "time": "7 Days Ago",
        "event": "Digital transaction activity velocity checked."
      })
      
    # 5. 15 Days Ago (if savings are positive)
    total_savings = behavior.savings.totalSavings if behavior else 0.0
    if total_savings > 10000.0:
      events.append({
        "time": "15 Days Ago",
        "event": "Account interest rate yield verified."
      })

    return events
