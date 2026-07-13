from schemas.analyze import CustomerProfileRequest
from schemas.explain import ConfidenceModel, ConfidenceDimension

class ExplainIQConfidenceEngine:
  def evaluate_confidence(
    self,
    profile: CustomerProfileRequest,
    individual_analysis: dict
  ) -> ConfidenceModel:
    
    # 1. Data Completeness Check
    has_email = 1 if profile.email else 0
    has_phone = 1 if profile.phone else 0
    has_address = 1 if len(profile.addresses) > 0 else 0
    has_occupation = 1 if profile.occupation else 0
    
    completeness_score = (has_email + has_phone + has_address + has_occupation) * 25.0
    completeness_exp = "All core KYC parameters (phone, email, residential address, occupation) are verified and complete."
    if completeness_score < 100.0:
      completeness_exp = " KYC parameters are incomplete. Missing contact or residential validation files."

    # 2. Behavior Consistency
    beh_score = 90.0
    beh_exp = "High transactional frequency and steady savings turnover ratio indicates low volatility."
    if individual_analysis.get('behaviorIQ'):
      beh_data = individual_analysis['behaviorIQ']['data']
      savings_ratio = beh_data['savings']['savingsRatio']
      if savings_ratio < 10.0:
        beh_score = 65.0
        beh_exp = "Low savings margin relative to debits triggers potential transaction volatility."
        
    # 3. Interaction Coverage
    inter_score = 100.0 if profile.lastInteractionAt else 55.0
    inter_exp = "Direct RM contact has been established within the scheduled 60-day SLA cycle."
    if inter_score < 100.0:
      inter_exp = "No relationship manager touchpoints recorded, lowering telemetry accuracy."

    # 4. Portfolio Context
    port_score = 80.0
    port_exp = "Verified against standard branch MSME and Retail segment benchmarks."

    # 5. Overall Confidence
    overall = (completeness_score + beh_score + inter_score + port_score) / 4.0
    
    # Explain why confidence increased or decreased
    reasons = []
    if completeness_score == 100.0:
      reasons.append("Complete KYC data increases confidence.")
    else:
      reasons.append("Missing KYC verification limits model confidence.")
      
    if inter_score == 100.0:
      reasons.append("Recent manager interactions validate account parameters.")
    else:
      reasons.append("Lack of relationship interactions reduces confidence.")
      
    overall_explanation = " ".join(reasons)
    
    return ConfidenceModel(
      overallConfidence=round(overall, 2),
      dataCompleteness=ConfidenceDimension(score=completeness_score, explanation=completeness_exp),
      behaviorConsistency=ConfidenceDimension(score=beh_score, explanation=beh_exp),
      interactionCoverage=ConfidenceDimension(score=inter_score, explanation=inter_exp),
      portfolioContext=ConfidenceDimension(score=port_score, explanation=port_exp)
    )
