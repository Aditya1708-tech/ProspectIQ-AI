from typing import Dict
from schemas.simulation import DecisionMatrix, ProjectedMetric
from engines.simulationiq.adjustments import ScenarioMultipliers

def evaluate_decision(
  comparisons: Dict[str, ProjectedMetric],
  mult: ScenarioMultipliers,
  overall_conf: str
) -> DecisionMatrix:
  health = comparisons["relationshipHealth"]
  churn = comparisons["churnProbability"]
  
  if mult.kyc_event is False or churn.difference > 15.0:
    category = "High Risk"
    reason = "Delayed compliance checks and increased interaction gaps signal high risk profile."
    outcome = "Potential account freezing or audit flags due to pending KYC."
  elif health.difference < -5.0:
    category = "Negative"
    reason = "Reduced communication frequency degrades relationship health score."
    outcome = "Gradual decay in trust indices and higher attrition probability."
  elif health.difference > 5.0 and mult.kyc_event is True:
    category = "Highly Beneficial"
    reason = " KYC renewal combined with outreach frequency optimization secures relationship stability."
    outcome = "Strengthened customer loyalty, complete compliance clearance, and positive savings momentum."
  elif health.difference > 2.0 or churn.difference < -2.0:
    category = "Beneficial"
    reason = "Incremental outreach improvements show positive trajectory updates."
    outcome = "Moderately improved trust index and stable capital deposits."
  else:
    category = "Neutral"
    reason = "Adjustment parameters match current baseline patterns."
    outcome = "Relationship indicators remain stable without trend shift."

  return DecisionMatrix(
    category=category,
    reason=reason,
    expectedOutcome=outcome,
    confidence=overall_conf
  )
