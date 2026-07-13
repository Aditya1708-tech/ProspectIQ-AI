from typing import Optional
from schemas.analyze import CustomerProfileRequest
from schemas.relationship import RelationshipIQProfile
from schemas.predict import PredictIQProfile
from engines.simulationiq.adjustments import ScenarioAdjustment

def evaluate_simulation_confidence(
  profile: CustomerProfileRequest,
  relationship: Optional[RelationshipIQProfile],
  predict: Optional[PredictIQProfile],
  adj: ScenarioAdjustment
) -> str:
  # Check data completeness
  completeness = 85.0
  if not profile.email or not profile.phone:
    completeness -= 15.0

  # Prediction base confidence
  pred_conf = 80.0
  if predict:
    if predict.confidence == "MEDIUM":
      pred_conf = 70.0
    elif predict.confidence == "LOW":
      pred_conf = 45.0

  # Simulation complexity (penalize if multiple adjustments are modified simultaneously)
  complexity_penalty = 0.0
  adjustments_modified = 0
  if abs(adj.rmInteractionsChange) > 0.1: adjustments_modified += 1
  if abs(adj.savingsRatioChange) > 0.1: adjustments_modified += 1
  if abs(adj.digitalPaymentsChange) > 0.1: adjustments_modified += 1
  if adj.kycEvent is not None: adjustments_modified += 1
  if adj.closePendingTasks is not None: adjustments_modified += 1

  complexity_penalty = adjustments_modified * 8.0
  complexity_score = max(30.0, 100.0 - complexity_penalty)

  # Calculate average confidence
  avg = (completeness + pred_conf + complexity_score) / 3.0

  if avg >= 80.0:
    return "HIGH"
  elif avg >= 50.0:
    return "MEDIUM"
  else:
    return "LOW"
