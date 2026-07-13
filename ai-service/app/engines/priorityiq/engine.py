import datetime
from typing import Optional
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData, FinancialDNAProfile, PriorityIQProfile, ScoreDetail, OpportunityMatrix

class PriorityIQEngine:
  def name(self) -> str:
    return "PriorityIQ"

  def analyze(
    self,
    profile: CustomerProfileRequest,
    trust: TrustLayerData,
    behavior: Optional[BehaviorIQData],
    dna: Optional[FinancialDNAProfile]
  ) -> PriorityIQProfile:
    # Set default values if DNA is missing
    savings_health = dna.savingsHealth.score if dna else 50.0
    wealth_potential = dna.wealthPotential.score if dna else 50.0
    liquidity_strength = dna.liquidityStrength.score if dna else 50.0
    investment_readiness = dna.investmentReadiness.score if dna else 50.0
    digital_adoption = dna.digitalAdoption.score if dna else 50.0
    income_stability = dna.incomeStability.score if dna else 50.0
    dna_confidence = dna.incomeStability.confidence if dna else "MEDIUM"

    # 1. Opportunity Score (Savings 30%, Wealth 30%, Liquidity 20%, Investment 20%)
    opp_score = (savings_health * 0.3) + (wealth_potential * 0.3) + (liquidity_strength * 0.2) + (investment_readiness * 0.2)
    opp_drivers = [
      f"Savings Health baseline contributes {savings_health * 0.3:.1f} pts.",
      f"Wealth Potential cap contributes {wealth_potential * 0.3:.1f} pts.",
      f"Liquidity Strength reserves contribute {liquidity_strength * 0.2:.1f} pts.",
      f"Investment Readiness potential contributes {investment_readiness * 0.2:.1f} pts."
    ]
    opp_detail = ScoreDetail(
      score=round(opp_score, 2),
      confidence=dna_confidence,
      drivers=opp_drivers
    )

    # 2. Engagement Score (Digital 40%, Tx Frequency 30%, Interaction Recency 30%)
    freq_metric = behavior.transactions.frequencyPerMonth if behavior else 5.0
    freq_score = min(100.0, freq_metric * 5.0) # 20 txs/mo yields 100 points
    
    # Interaction Recency
    recency_score = 30.0
    days_since_interaction = 365.0
    if profile.accounts and len(profile.accounts) > 0:
      # Assume last interaction was recorded on customer
      # Simple heuristic: fallback to 60 if status is ACTIVE
      if profile.status == 'ACTIVE':
        recency_score = 80.0
        days_since_interaction = 10.0
    
    eng_score = (digital_adoption * 0.4) + (freq_score * 0.3) + (recency_score * 0.3)
    eng_drivers = [
      f"Digital channels usage ratio ({digital_adoption:.1f}%) contributes {digital_adoption * 0.4:.1f} pts.",
      f"Transaction density of {freq_metric:.1f}/mo contributes {freq_score * 0.3:.1f} pts.",
      f"Relationship touchpoint recency index contributes {recency_score * 0.3:.1f} pts."
    ]
    eng_detail = ScoreDetail(
      score=round(eng_score, 2),
      confidence=dna_confidence,
      drivers=eng_drivers
    )

    # 3. Growth Potential (Wealth 50%, Digital 25%, Income Stability 25%)
    growth_score = (wealth_potential * 0.5) + (digital_adoption * 0.25) + (income_stability * 0.25)
    growth_drivers = [
      f"Wealth bracket modifiers contribute {wealth_potential * 0.5:.1f} pts.",
      f"Digital adoption potential contributes {digital_adoption * 0.25:.1f} pts.",
      f"Income stability indexes contribute {income_stability * 0.25:.1f} pts."
    ]
    growth_detail = ScoreDetail(
      score=round(growth_score, 2),
      confidence=dna_confidence,
      drivers=growth_drivers
    )

    # 4. Retention Risk (Low savings health, low interactions, high cash dependence)
    risk_drivers = []
    risk_score = 10.0 # Base friction
    
    if savings_health < 40.0:
      risk_score += 40.0
      risk_drivers.append("Drop in relative savings reserves increases churn risk.")
    if recency_score < 50.0:
      risk_score += 30.0
      risk_drivers.append("Lack of relationship checkpoints indicates portfolio detachment.")
    if behavior and behavior.expenses.cashDependencyRatio > 40.0:
      risk_score += 20.0
      risk_drivers.append(f"High cash dependence ({behavior.expenses.cashDependencyRatio:.1f}%) signals offline banking leakage.")
    
    if risk_score == 10.0:
      risk_drivers.append("Active relationship parameters indicate stable retention bounds.")
      
    risk_detail = ScoreDetail(
      score=round(risk_score, 2),
      confidence=dna_confidence,
      drivers=risk_drivers
    )

    # 5. Urgency Score (Retention Risk 60% + Opportunity 40%)
    urgency_score = (risk_score * 0.6) + (opp_score * 0.4)
    urgency_drivers = [
      f"Customer retention exposure weights {risk_score * 0.6:.1f} pts.",
      f"Unresolved growth opportunity weights {opp_score * 0.4:.1f} pts."
    ]
    urgency_detail = ScoreDetail(
      score=round(urgency_score, 2),
      confidence=dna_confidence,
      drivers=urgency_drivers
    )

    # 6. Final Priority Score
    # Translate TrustLayer Confidence: HIGH=100, MEDIUM=60, LOW=20
    trust_conf_map = {"HIGH": 100.0, "MEDIUM": 60.0, "LOW": 20.0}
    trust_confidence_score = trust_conf_map.get(trust.confidence, 60.0)
    
    final_score = (
      (opp_score * 0.30) +
      (growth_score * 0.25) +
      (risk_score * 0.20) +
      (eng_score * 0.15) +
      (trust_confidence_score * 0.10)
    )
    
    final_drivers = [
      f"Weighted Opportunity: {opp_score * 0.30:.1f} pts.",
      f"Weighted Growth: {growth_score * 0.25:.1f} pts.",
      f"Weighted Retention Risk: {risk_score * 0.20:.1f} pts.",
      f"Weighted Engagement: {eng_score * 0.15:.1f} pts.",
      f"Trust Audit Confidence ({trust.confidence}): {trust_confidence_score * 0.10:.1f} pts."
    ]
    
    final_detail = ScoreDetail(
      score=round(final_score, 2),
      confidence=dna_confidence,
      drivers=final_drivers
    )

    # 7. Opportunity Matrix Classification
    if final_score >= 85.0:
      category = "Immediate Action"
      rank = 1
      sla = "24 Hours"
      color = "red"
      action = "Schedule RM Meeting"
    elif final_score >= 70.0:
      category = "High Potential"
      rank = 2
      sla = "48 Hours"
      color = "amber"
      action = "Call Customer"
    elif final_score >= 50.0:
      category = "Nurture"
      rank = 3
      sla = "7 Days"
      color = "blue"
      action = "Personalized Follow-up"
    elif final_score >= 35.0:
      category = "Monitor"
      rank = 4
      sla = "30 Days"
      color = "slate"
      action = "Quarterly Review"
    else:
      category = "Low Priority"
      rank = 5
      sla = "Quarterly"
      color = "gray"
      action = "Passive Monitoring"

    matrix = OpportunityMatrix(
      category=category,
      priorityRank=rank,
      sla=sla,
      color=color,
      actionType=action
    )

    # Opportunity Drivers list
    opp_drivers_list = []
    if opp_score >= 70:
      opp_drivers_list.append("High capital reserves and liquidity strength.")
    if growth_score >= 70:
      opp_drivers_list.append("Significant wealth tier with high growth potential.")
    if risk_score >= 50:
      opp_drivers_list.append("Anomalous balances drop or cash dependence rise.")
    if len(opp_drivers_list) == 0:
      opp_drivers_list.append("Stable transaction activity with consistent deposits.")

    return PriorityIQProfile(
      opportunity=opp_detail,
      engagement=eng_detail,
      growthPotential=growth_detail,
      retentionRisk=risk_detail,
      urgency=urgency_detail,
      finalPriority=final_detail,
      opportunityMatrix=matrix,
      opportunityDrivers=opp_drivers_list
    )
