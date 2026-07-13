from typing import Dict, Any, Optional
from schemas.analyze import CustomerProfileRequest, BehaviorIQData
from schemas.relationship import RelationshipIQProfile
from schemas.predict import PredictIQProfile
from schemas.simulation import ProjectedMetric

def build_comparisons(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData],
  relationship: Optional[RelationshipIQProfile],
  predict: Optional[PredictIQProfile],
  projected: Dict[str, float],
  overall_conf: str
) -> Dict[str, ProjectedMetric]:
  # Extract baseline current values
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

  baselines = {
    "relationshipHealth": health_base,
    "priorityScore": priority_base,
    "opportunityScore": opp_base,
    "growthScore": growth_base,
    "retentionRisk": retention_risk_base,
    "churnProbability": churn_base,
    "digitalAdoption": digital_base,
    "savingsHealth": savings_base,
    "portfolioContribution": portfolio_base,
    "rmEffectiveness": rm_effectiveness_base,
    "branchHealthContribution": branch_base,
    "customerLifetimeValue": clv_base,
    "relationshipMomentum": momentum_base
  }

  comparisons = {}
  for key, baseline_val in baselines.items():
    proj_val = projected.get(key, baseline_val)
    diff = proj_val - baseline_val
    
    # Calculate percentage difference
    if baseline_val != 0.0:
      pct_diff = (diff / baseline_val) * 100.0
    else:
      pct_diff = 0.0
      
    # Determine positive indicators (for churn/risk, negative differences are positive outcomes!)
    if key in ["churnProbability", "retentionRisk"]:
      is_positive = diff < 0.0
    else:
      is_positive = diff >= 0.0

    # Local confidence calibration based on delta magnitude
    local_conf = overall_conf
    if abs(pct_diff) > 75.0 and overall_conf == "HIGH":
      local_conf = "MEDIUM"
    elif abs(pct_diff) > 120.0:
      local_conf = "LOW"

    comparisons[key] = ProjectedMetric(
      currentValue=round(baseline_val, 2),
      projectedValue=round(proj_val, 2),
      difference=round(diff, 2),
      percentageDifference=round(pct_diff, 2),
      isPositive=is_positive,
      confidence=local_conf
    )

  return comparisons
