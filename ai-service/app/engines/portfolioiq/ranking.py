from typing import List
from schemas.analyze import CustomerProfileRequest
from schemas.portfolio import OpportunityRecord

class PortfolioOpportunityRanker:
  def rank_opportunities(
    self,
    profiles: List[CustomerProfileRequest],
    individual_analyses: List[dict]
  ) -> List[OpportunityRecord]:
    
    records = []
    
    for i, profile in enumerate(profiles):
      analysis = individual_analyses[i]
      
      persona = "Growth Builder"
      priority_score = 50.0
      opp_score = 50.0
      recommended_action = "Call Customer"
      
      if analysis.get('financialDNA'):
        persona = analysis['financialDNA']['data']['persona']['name']
      if analysis.get('priorityIQ'):
        priority_score = analysis['priorityIQ']['data']['finalPriority']['score']
        opp_score = analysis['priorityIQ']['data']['opportunity']['score']
        recommended_action = analysis['priorityIQ']['data']['opportunityMatrix']['actionType']
        
      records.append(OpportunityRecord(
        customerId=profile.id,
        customerName=profile.name,
        assignedRM=profile.segment, # Default RM indicator
        persona=persona,
        priorityScore=priority_score,
        opportunityScore=opp_score,
        recommendedAction=recommended_action
      ))

    # Sort: Priority score DESC, Opportunity score DESC
    records.sort(key=lambda r: (r.priorityScore, r.opportunityScore), reverse=True)

    # Return top 10
    return records[:10]
