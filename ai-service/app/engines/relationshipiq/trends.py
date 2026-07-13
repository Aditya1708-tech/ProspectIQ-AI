import datetime
from typing import Optional, List, Any
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData
from schemas.relationship import RelationshipRisk

def detect_risks(
  profile: CustomerProfileRequest,
  trust: TrustLayerData,
  behavior: Optional[BehaviorIQData],
  priority: Optional[Any]
) -> List[RelationshipRisk]:
  risks = []
  
  interactions = profile.interactions
  tasks = profile.tasks
  
  # Calculate days since last contact
  days_since_last = 99
  if profile.lastInteractionAt:
    try:
      dt = datetime.datetime.fromisoformat(profile.lastInteractionAt.replace("Z", "+00:00"))
      days_since_last = (datetime.datetime.now(datetime.timezone.utc) - dt).days
      days_since_last = max(0, days_since_last)
    except Exception:
      pass
      
  # 1. No RM interaction >30 days
  if days_since_last > 30:
    risks.append(RelationshipRisk(
      severity="MEDIUM",
      reason=f"No relationship touchpoints recorded in the last {days_since_last} days.",
      suggestedRMWorkflow="Schedule courtesy check-in call to re-engage the customer and log feedback.",
      confidence=0.90
    ))
    
  # 2. Multiple overdue tasks
  overdue_tasks = [t for t in tasks if t.status.lower() == "overdue"]
  if len(overdue_tasks) > 1:
    risks.append(RelationshipRisk(
      severity="HIGH",
      reason=f"Customer profile has {len(overdue_tasks)} overdue tasks requiring resolution.",
      suggestedRMWorkflow="Review task priorities, execute compliance or KYC updates, and clear backlogs.",
      confidence=0.95
    ))
  elif len(overdue_tasks) == 1:
    risks.append(RelationshipRisk(
      severity="MEDIUM",
      reason="Customer profile has 1 overdue relationship task.",
      suggestedRMWorkflow="Resolve the pending task or adjust the due date to restore SLA compliance.",
      confidence=0.90
    ))
    
  # 3. Declining engagement
  if len(interactions) == 0:
    risks.append(RelationshipRisk(
      severity="HIGH",
      reason="Communication gaps detected: Zero proactive contact logged in database registry.",
      suggestedRMWorkflow="Initiate initial relationship introduction call and complete profile records.",
      confidence=1.00
    ))
    
  # 4. Incomplete profile
  if trust.qualityScore < 80.0:
    risks.append(RelationshipRisk(
      severity="MEDIUM",
      reason=f"Customer profile integrity is low (Quality Score: {trust.qualityScore}%). Missing or unverified fields.",
      suggestedRMWorkflow="Initiate document verification task, request updated contact fields, and verify KYC.",
      confidence=0.90
    ))
    
  # 5. Relationship deterioration (net balance drain in transaction history)
  if behavior:
    credits = behavior.income.totalCredits
    debits = behavior.expenses.totalDebits
    savings_ratio = behavior.savings.savingsRatio
    
    if credits > 0 and debits > credits * 1.1 and savings_ratio < 5.0:
      risks.append(RelationshipRisk(
        severity="MEDIUM",
        reason="Cash flow deterioration: Monthly expenses exceed income credits causing account balance decline.",
        suggestedRMWorkflow="Schedule wealth review to discuss cash reserves, savings plans, or overdraft support.",
        confidence=0.85
      ))
      
  # 6. High retention risk from PriorityIQ
  if priority and priority.retentionRisk.score > 50:
    risks.append(RelationshipRisk(
      severity="HIGH",
      reason=f"Priority model flags high customer retention risk (Score: {priority.retentionRisk.score}%).",
      suggestedRMWorkflow="Initiate relationship recovery workflow. Coordinate face-to-face meeting with branch manager.",
      confidence=0.95
    ))
    
  return risks
