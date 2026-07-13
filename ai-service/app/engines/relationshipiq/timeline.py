import datetime
from typing import List, Optional, Any
from schemas.analyze import CustomerProfileRequest, BehaviorIQData
from schemas.relationship import JourneyEvent

def generate_timeline(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData],
  priority: Optional[Any]
) -> List[JourneyEvent]:
  events = []
  
  # Find earliest transaction date or interaction date as anchor
  all_dates = []
  for acc in profile.accounts:
    for t in acc.transactions:
      try:
        all_dates.append(datetime.datetime.fromisoformat(t.valueDate.replace("Z", "+00:00")))
      except Exception:
        pass
  for i in profile.interactions:
    try:
      all_dates.append(datetime.datetime.fromisoformat(i.interactionDate.replace("Z", "+00:00")))
    except Exception:
      pass
      
  anchor_date = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=180)
  if all_dates:
    anchor_date = min(all_dates)
    
  created_date = anchor_date - datetime.timedelta(days=15)
  kyc_date = created_date + datetime.timedelta(days=1)
  dna_date = created_date + datetime.timedelta(days=3)
  priority_date = created_date + datetime.timedelta(days=5)
  
  # 1. Customer Created
  events.append(JourneyEvent(
    timestamp=created_date.isoformat().replace("+00:00", "Z"),
    title="Customer Created",
    description=f"Initial onboarding file registered for customer {profile.name}.",
    sourceEngine="Customer Repository",
    confidence=1.0
  ))
  
  # 2. KYC Verified
  events.append(JourneyEvent(
    timestamp=kyc_date.isoformat().replace("+00:00", "Z"),
    title="KYC Verified",
    description="Official KYC verification documents approved and certified.",
    sourceEngine="TrustLayer",
    confidence=0.95
  ))
  
  # 3. First Salary Credit
  salary_txs = []
  for acc in profile.accounts:
    for t in acc.transactions:
      if t.category.upper() == "SALARY" or (t.description and "salary" in t.description.lower()):
        try:
          salary_txs.append(datetime.datetime.fromisoformat(t.valueDate.replace("Z", "+00:00")))
        except Exception:
          pass
  if salary_txs:
    earliest_sal = min(salary_txs)
    events.append(JourneyEvent(
      timestamp=earliest_sal.isoformat().replace("+00:00", "Z"),
      title="First Salary Credit",
      description="First payroll salary credit detected in savings account ledger.",
      sourceEngine="BehaviorIQ",
      confidence=0.9
    ))
      
  # 4. Digital Banking Activated
  digital_txs = []
  for acc in profile.accounts:
    for t in acc.transactions:
      if t.category.upper() in ["UPI", "GST", "DIGITAL", "CARD"] or (t.description and "upi" in t.description.lower()):
        try:
          digital_txs.append(datetime.datetime.fromisoformat(t.valueDate.replace("Z", "+00:00")))
        except Exception:
          pass
  if digital_txs:
    earliest_dig = min(digital_txs)
    events.append(JourneyEvent(
      timestamp=earliest_dig.isoformat().replace("+00:00", "Z"),
      title="Digital Banking Activated",
      description="First digital transfer channel transaction processed.",
      sourceEngine="BehaviorIQ",
      confidence=0.85
    ))
      
  # 5. FinDNA Persona Assigned
  events.append(JourneyEvent(
    timestamp=dna_date.isoformat().replace("+00:00", "Z"),
    title="FinDNA Persona Assigned",
    description="Financial DNA behavioral profiling analysis completed.",
    sourceEngine="FinancialDNA",
    confidence=0.85
  ))
  
  # 6. Priority Updated
  events.append(JourneyEvent(
    timestamp=priority_date.isoformat().replace("+00:00", "Z"),
    title="Priority Updated",
    description="Relationship opportunity and priority score computed.",
    sourceEngine="PriorityIQ",
    confidence=0.9
  ))
  
  # 7. First RM Meeting
  rm_meetings = []
  for i in profile.interactions:
    if i.type.upper() in ["MEETING", "CALL"]:
      try:
        rm_meetings.append(datetime.datetime.fromisoformat(i.interactionDate.replace("Z", "+00:00")))
      except Exception:
        pass
  if rm_meetings:
    earliest_meet = min(rm_meetings)
    events.append(JourneyEvent(
      timestamp=earliest_meet.isoformat().replace("+00:00", "Z"),
      title="First RM Meeting",
      description="Initial relationship consultation meeting conducted.",
      sourceEngine="RM Workspace",
      confidence=0.9
    ))
      
  # 8. Tasks Completed
  completed_tasks = [t for t in profile.tasks if t.status.lower() == "completed"]
  for t in completed_tasks:
    comp_date = t.completedAt or t.updatedAt
    try:
      dt = datetime.datetime.fromisoformat(comp_date.replace("Z", "+00:00"))
    except Exception:
      dt = datetime.datetime.now(datetime.timezone.utc)
          
    events.append(JourneyEvent(
      timestamp=dt.isoformat().replace("+00:00", "Z"),
      title=f"Task Completed: {t.title}",
      description=t.description or f"RM Workspace task completed: {t.title}",
      sourceEngine="RM Workspace",
      confidence=0.95
    ))
      
  # 9. Portfolio Review
  portfolio_tasks = [t for t in completed_tasks if "portfolio" in t.title.lower() or "portfolio" in t.category.lower()]
  for t in portfolio_tasks:
    comp_date = t.completedAt or t.updatedAt
    try:
      dt = datetime.datetime.fromisoformat(comp_date.replace("Z", "+00:00"))
    except Exception:
      dt = datetime.datetime.now(datetime.timezone.utc)
    events.append(JourneyEvent(
      timestamp=dt.isoformat().replace("+00:00", "Z"),
      title="Portfolio Review",
      description="Comprehensive asset allocation and holdings review conducted.",
      sourceEngine="PortfolioIQ",
      confidence=0.9
    ))
      
  # 10. Latest Interaction
  if profile.lastInteractionAt:
    events.append(JourneyEvent(
      timestamp=profile.lastInteractionAt,
      title="Latest Interaction",
      description="Most recent client contact and dialogue logged in interactions register.",
      sourceEngine="RM Workspace",
      confidence=1.0
    ))
      
  events.sort(key=lambda x: x.timestamp)
  return events
