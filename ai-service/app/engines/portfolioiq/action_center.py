from typing import List
from schemas.analyze import CustomerProfileRequest
from schemas.portfolio import ActionCenterItem

class PortfolioActionCenterEngine:
  def generate_actions(
    self,
    profiles: List[CustomerProfileRequest],
    individual_analyses: List[dict]
  ) -> List[ActionCenterItem]:
    
    actions = []
    
    for i, profile in enumerate(profiles):
      analysis = individual_analyses[i]
      
      # 1. Immediate Actions: Priority is "Immediate Action"
      if analysis.get('priorityIQ'):
        piq = analysis['priorityIQ']['data']
        cat = piq['opportunityMatrix']['category']
        
        if cat == 'Immediate Action':
          actions.append(ActionCenterItem(
            customerName=profile.name,
            customerId=profile.id,
            reason="High Priority customer with urgent transaction velocity changes.",
            assignedRM="RM Priya" if profile.segment == 'RETAIL' else "RM Anil",
            priority="Immediate Action",
            recommendedAction="Schedule Relationship Review",
            dueTimeline="Today"
          ))
          
      # 2. Document Verification: Low Trust score
      trust_score = analysis['trustLayer']['data']['qualityScore']
      if trust_score < 90.0:
        actions.append(ActionCenterItem(
          customerName=profile.name,
          customerId=profile.id,
          reason=f"Verification gaps detected (Trust Score: {trust_score:.0f}/100).",
          assignedRM="RM Priya" if profile.segment == 'RETAIL' else "RM Anil",
          priority="High Potential",
          recommendedAction="Verify KYC Documents",
          dueTimeline="2 Days"
        ))
        
      # 3. Relationship Review: Dormant or low savings health
      if profile.status == 'DORMANT':
        actions.append(ActionCenterItem(
          customerName=profile.name,
          customerId=profile.id,
          reason="Account status marked as Dormant.",
          assignedRM="RM Priya" if profile.segment == 'RETAIL' else "RM Anil",
          priority="Nurture",
          recommendedAction="Schedule Relationship Review",
          dueTimeline="Today"
        ))
        
      if analysis.get('financialDNA'):
        dna = analysis['financialDNA']['data']
        sav_hlth = dna['savingsHealth']['score']
        if sav_hlth < 45.0:
          actions.append(ActionCenterItem(
            customerName=profile.name,
            customerId=profile.id,
            reason=f"Savings Health declined to {sav_hlth:.0f}%.",
            assignedRM="RM Priya" if profile.segment == 'RETAIL' else "RM Anil",
            priority="High Potential",
            recommendedAction="Call Customer regarding savings trend",
            dueTimeline="3 Days"
          ))

    # Fallback to make sure there is at least one item if no profile triggers rules
    if len(actions) == 0 and len(profiles) > 0:
      p = profiles[0]
      actions.append(ActionCenterItem(
        customerName=p.name,
        customerId=p.id,
        reason="Scheduled quarterly relationship parameter check.",
        assignedRM="RM Priya",
        priority="Nurture",
        recommendedAction="Personalized Follow-up",
        dueTimeline="7 Days"
      ))
      
    return actions
