from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData

class ConfidenceEvaluator:
  def evaluate_confidence(
    self,
    profile: CustomerProfileRequest,
    trust: TrustLayerData,
    behavior: Optional[BehaviorIQData]
  ) -> tuple[str, list[str]]:
    factors = []
    
    # 1. Base score from TrustLayer quality
    base_score = trust.qualityScore
    factors.append(f"TrustLayer quality score base weight: {base_score:.0f}/100.")

    # 2. Data Completeness checks
    completeness_deductions = 0.0
    if not profile.email:
      completeness_deductions += 10.0
      factors.append("Missing email contact decreases profile completeness.")
    if not profile.phone:
      completeness_deductions += 10.0
      factors.append("Missing phone number decreases verification accuracy.")
    if len(profile.addresses) == 0:
      completeness_deductions += 15.0
      factors.append("No residential or office addresses linked.")
    if len(profile.accounts) == 0:
      completeness_deductions += 25.0
      factors.append("No active bank accounts linked.")

    # 3. Behavioral Consistency checks
    consistency_deductions = 0.0
    if behavior:
      tx_count = behavior.transactions.totalCount
      frequency = behavior.transactions.frequencyPerMonth
      
      if tx_count < 10:
        consistency_deductions += 20.0
        factors.append(f"Sparse transaction history ({tx_count} txs) limits model visibility.")
      else:
        factors.append(f"Historical ledger is consistent with {tx_count} recorded transactions.")

      if frequency < 2.0:
        consistency_deductions += 10.0
        factors.append(f"Low monthly transaction frequency ({frequency:.1f}/mo) raises signal volatility.")
    else:
      consistency_deductions += 30.0
      factors.append("Behavioral transactions telemetry missing.")

    # Final logic
    final_score = base_score - completeness_deductions - consistency_deductions
    final_score = max(0.0, final_score)

    if final_score >= 80.0:
      confidence = "HIGH"
    elif final_score >= 50.0:
      confidence = "MEDIUM"
    else:
      confidence = "LOW"

    return confidence, factors
