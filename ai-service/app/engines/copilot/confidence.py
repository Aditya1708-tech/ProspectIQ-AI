from typing import Optional
from schemas.analyze import TrustLayerData, FinancialDNAProfile, PriorityIQProfile

class CoPilotConfidenceEvaluator:
  def resolve_confidence(
    self,
    trust: TrustLayerData,
    dna: Optional[FinancialDNAProfile],
    priority: Optional[PriorityIQProfile]
  ) -> str:
    # Resolve confidence rating from all pipelines
    trust_score = trust.qualityScore
    dna_conf = dna.incomeStability.confidence if dna else "MEDIUM"
    priority_conf = priority.opportunity.confidence if priority else "MEDIUM"

    if trust_score >= 85.0 and dna_conf == "HIGH" and priority_conf == "HIGH":
      return "HIGH"
    elif trust_score < 60.0 or dna_conf == "LOW" or priority_conf == "LOW":
      return "LOW"
    else:
      return "MEDIUM"
