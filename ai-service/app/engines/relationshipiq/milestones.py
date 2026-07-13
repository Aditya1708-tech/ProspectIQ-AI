import datetime
from typing import Optional, List, Any
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData
from schemas.relationship import Milestone

def identify_milestones(
  profile: CustomerProfileRequest,
  trust: TrustLayerData,
  behavior: Optional[BehaviorIQData],
  priority: Optional[Any]
) -> List[Milestone]:
  milestones = []
  
  # Helper to resolve dates
  all_tx_dates = []
  for acc in profile.accounts:
    for t in acc.transactions:
      try:
        all_tx_dates.append(datetime.datetime.fromisoformat(t.valueDate.replace("Z", "+00:00")))
      except Exception:
        pass
        
  earliest_tx_date = min(all_tx_dates) if all_tx_dates else datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=120)
  latest_tx_date = max(all_tx_dates) if all_tx_dates else datetime.datetime.now(datetime.timezone.utc)
  
  # 1. First Meeting Milestone
  meetings = [i for i in profile.interactions if i.type.upper() in ["MEETING", "CALL"]]
  if meetings:
    meet_dates = []
    for m in meetings:
      try:
        meet_dates.append(datetime.datetime.fromisoformat(m.interactionDate.replace("Z", "+00:00")))
      except Exception:
        pass
    if meet_dates:
      first_meet = min(meet_dates)
      milestones.append(Milestone(
        title="First Meeting",
        description="First formal relationship meeting conducted.",
        category="Relationship",
        importance="MEDIUM",
        date=first_meet.date().isoformat()
      ))
      
  # 2. One Year Customer
  time_span_days = (latest_tx_date - earliest_tx_date).days
  if time_span_days >= 365:
    milestones.append(Milestone(
      title="One Year Customer Anniversary",
      description="Successfully maintained relationship active for over one year.",
      category="Anniversary",
      importance="HIGH",
      date=(earliest_tx_date + datetime.timedelta(days=365)).date().isoformat()
    ))
  else:
    # default fallback milestone
    milestones.append(Milestone(
      title="Relationship Established",
      description="Customer onboarding and setup completed successfully.",
      category="Relationship",
      importance="LOW",
      date=earliest_tx_date.date().isoformat()
    ))
    
  # 3. KYC Renewal / Verified
  if trust.qualityScore >= 80:
    milestones.append(Milestone(
      title="KYC Certified",
      description="Trust verification check approved with no critical compliance errors.",
      category="Compliance",
      importance="MEDIUM",
      date=earliest_tx_date.date().isoformat()
    ))
    
  # 4. High Value Customer
  total_balance = sum(acc.balance for acc in profile.accounts)
  if total_balance >= 500000.0:
    milestones.append(Milestone(
      title="High Value Customer",
      description="Total aggregate deposits exceed premium relationship bounds (INR 5L+).",
      category="Tier Promotion",
      importance="HIGH",
      date=latest_tx_date.date().isoformat()
    ))
    
  # 5. Digital Adoption Milestone
  if behavior and behavior.expenses.digitalPaymentRatio >= 75.0:
    milestones.append(Milestone(
      title="Digital Adoption Milestone",
      description="Over 75% of outgoing funds processed via digital channels (UPI/CARD).",
      category="Digital Channels",
      importance="MEDIUM",
      date=latest_tx_date.date().isoformat()
    ))
    
  # 6. Priority Promotion
  if priority and priority.finalPriority.score >= 75:
    milestones.append(Milestone(
      title="High Priority Escalation",
      description="Flagged as a high priority client due to high opportunity score.",
      category="Priority",
      importance="HIGH",
      date=latest_tx_date.date().isoformat()
    ))
    
  # 7. Portfolio Review
  portfolio_actions = [t for t in profile.tasks if "portfolio" in t.title.lower() or "portfolio" in t.category.lower()]
  if any(t.status.lower() == "completed" for t in portfolio_actions):
    completed_port = [t for t in portfolio_actions if t.status.lower() == "completed"][0]
    milestones.append(Milestone(
      title="Portfolio Review Completed",
      description="Asset holdings and risk profile alignment check completed.",
      category="Wealth",
      importance="HIGH",
      date=completed_port.completedAt[:10] if completed_port.completedAt else latest_tx_date.date().isoformat()
    ))
    
  # 8. Business Expansion (for MSME with high turnover)
  if profile.segment.upper() == "MSME" and behavior and behavior.income.totalCredits >= 1000000.0:
    milestones.append(Milestone(
      title="Business Expansion Catalyst",
      description="Turnover credits exceed business growth baseline (INR 10L+).",
      category="MSME Growth",
      importance="HIGH",
      date=latest_tx_date.date().isoformat()
    ))
    
  # 9. Task Streak
  completed_tasks = [t for t in profile.tasks if t.status.lower() == "completed"]
  overdue_tasks = [t for t in profile.tasks if t.status.lower() == "overdue"]
  if len(completed_tasks) >= 3 and len(overdue_tasks) == 0:
    milestones.append(Milestone(
      title="Task Resolution Streak",
      description="Maintained consecutive task completion SLA checks without delay.",
      category="Operations",
      importance="MEDIUM",
      date=latest_tx_date.date().isoformat()
    ))
    
  return milestones
