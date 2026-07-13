from typing import Optional, Dict
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData
from schemas.relationship import RelationshipIQProfile

def evaluate_confidence(
  profile: CustomerProfileRequest,
  trust: TrustLayerData,
  behavior: Optional[BehaviorIQData],
  relationship: Optional[RelationshipIQProfile]
) -> Dict[str, any]:
  # Trust Layer quality score
  quality = trust.qualityScore
  
  # Data Completeness based on accounts and profiles
  completeness = 85.0
  if not profile.email or not profile.phone:
    completeness -= 15.0
    
  # Transaction Coverage (based on number of transactions)
  tx_count = sum(len(acc.transactions) for acc in profile.accounts)
  tx_coverage = min(100.0, 40.0 + (tx_count * 2.0))

  # Interaction Coverage
  int_coverage = 70.0
  if relationship and relationship.interactions:
    int_coverage = relationship.interactions.interactionCoverage

  # Relationship Stability
  stability = 80.0
  if relationship and relationship.health:
    if relationship.health.category == "Critical":
      stability = 45.0
    elif relationship.health.category == "Needs Attention":
      stability = 65.0

  # Prediction Stability
  prediction_stability = 85.0

  # Overall Confidence derived from average
  avg = (quality + completeness + tx_coverage + int_coverage + stability + prediction_stability) / 6.0
  
  if avg >= 80.0:
    overall = "HIGH"
  elif avg >= 50.0:
    overall = "MEDIUM"
  else:
    overall = "LOW"

  return {
    "trustLayerQuality": round(quality, 2),
    "dataCompleteness": round(completeness, 2),
    "transactionCoverage": round(tx_coverage, 2),
    "interactionCoverage": round(int_coverage, 2),
    "relationshipStability": round(stability, 2),
    "predictionStability": round(prediction_stability, 2),
    "overallConfidence": overall
  }
