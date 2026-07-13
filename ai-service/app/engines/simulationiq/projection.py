from typing import Dict, Any, Optional
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData
from schemas.relationship import RelationshipIQProfile
from schemas.predict import PredictIQProfile
from engines.simulationiq.adjustments import ScenarioMultipliers

def project_metrics(
  profile: CustomerProfileRequest,
  trust: TrustLayerData,
  behavior: Optional[BehaviorIQData],
  relationship: Optional[RelationshipIQProfile],
  predict: Optional[PredictIQProfile],
  mult: ScenarioMultipliers
) -> Dict[str, float]:
  # Base default scores
  health_base = relationship.health.score if relationship and relationship.health else 75.0
  priority_base = 65.0
  opp_base = 70.0
  growth_base = predict.growth.growthScore if predict and predict.growth else 65.0
  churn_base = predict.churn.probability if predict and predict.churn else 20.0
  retention_risk_base = 100.0 - health_base

  digital_base = (behavior.expenses.digitalPaymentRatio * 100.0) if behavior and behavior.expenses else 70.0
  savings_base = (behavior.savings.savingsRatio * 100.0) if behavior and behavior.savings else 65.0
  
  portfolio_base = 60.0
  rm_effectiveness_base = relationship.interactions.interactionCoverage if relationship and relationship.interactions else 72.0
  branch_base = 68.0
  
  clv_base = predict.opportunity.expectedRelationshipValue if predict and predict.opportunity else 500000.0
  momentum_base = predict.relationship.momentum if predict and predict.relationship else 60.0

  # Projections
  health_proj = health_base + (12.0 * (mult.interactions - 1.0)) + (8.0 * (mult.followups - 1.0))
  if mult.kyc_event is True:
    health_proj += 10.0
  elif mult.kyc_event is False:
    health_proj -= 15.0

  priority_proj = priority_base + (6.0 * (mult.interactions - 1.0))
  if mult.close_tasks is True:
    priority_proj += 12.0
  elif mult.close_tasks is False:
    priority_proj -= 10.0

  opp_proj = opp_base + (10.0 * (mult.savings - 1.0)) + (5.0 * (mult.digital - 1.0))
  growth_proj = growth_base + (14.0 * (mult.savings - 1.0)) + (6.0 * (mult.digital - 1.0))
  
  churn_proj = churn_base - (15.0 * (mult.interactions - 1.0)) - (10.0 * (mult.engagement - 1.0))
  if mult.kyc_event is False:
    churn_proj += 12.0
    
  retention_risk_proj = 100.0 - health_proj
  digital_proj = digital_base * mult.digital
  savings_proj = savings_base * mult.savings
  portfolio_proj = portfolio_base + (8.0 * (mult.savings - 1.0)) + (4.0 * (mult.digital - 1.0))
  
  rm_effectiveness_proj = rm_effectiveness_base + (12.0 * (mult.interactions - 1.0)) + (8.0 * (mult.meetings - 1.0))
  if mult.close_tasks is True:
    rm_effectiveness_proj += 8.0
    
  branch_proj = branch_base + (4.0 * (mult.interactions - 1.0)) + (8.0 * (mult.kyc_event == True))
  clv_proj = clv_base * (1.0 + 0.12 * (mult.savings - 1.0) + 0.04 * (mult.interactions - 1.0))
  momentum_proj = momentum_base + (14.0 * (mult.engagement - 1.0))

  # Clamp utility
  def clamp(val: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
    return max(min_val, min(max_val, val))

  return {
    "relationshipHealth": round(clamp(health_proj), 2),
    "priorityScore": round(clamp(priority_proj), 2),
    "opportunityScore": round(clamp(opp_proj), 2),
    "growthScore": round(clamp(growth_proj), 2),
    "retentionRisk": round(clamp(retention_risk_proj), 2),
    "churnProbability": round(clamp(churn_proj), 2),
    "digitalAdoption": round(clamp(digital_proj), 2),
    "savingsHealth": round(clamp(savings_proj), 2),
    "portfolioContribution": round(clamp(portfolio_proj), 2),
    "rmEffectiveness": round(clamp(rm_effectiveness_proj), 2),
    "branchHealthContribution": round(clamp(branch_proj), 2),
    "customerLifetimeValue": round(clamp(clv_proj, min_val=0.0, max_val=99999999.0), 2),
    "relationshipMomentum": round(clamp(momentum_proj), 2)
  }
