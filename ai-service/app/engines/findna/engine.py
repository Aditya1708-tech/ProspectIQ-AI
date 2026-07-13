from typing import Optional
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData, FinancialDNAProfile
from engines.findna.scorer import FinDNAScorer

class FinDNAEngine:
  def __init__(self):
    self.scorer = FinDNAScorer()

  def name(self) -> str:
    return "FinancialDNA"

  def analyze(
    self,
    profile: CustomerProfileRequest,
    trust: TrustLayerData,
    behavior: Optional[BehaviorIQData]
  ) -> FinancialDNAProfile:
    return self.scorer.calculate_dna(profile, trust, behavior)
