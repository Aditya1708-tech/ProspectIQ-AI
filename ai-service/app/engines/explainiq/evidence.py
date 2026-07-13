from typing import List
from schemas.analyze import CustomerProfileRequest
from schemas.explain import EvidenceItem

class ExplainIQEvidenceEngine:
  def extract_evidence(
    self,
    profile: CustomerProfileRequest,
    individual_analysis: dict
  ) -> List[EvidenceItem]:
    
    evidence = []
    
    # 1. Trust score validation
    trust_score = 100.0
    if individual_analysis.get('trustLayer'):
      trust_score = individual_analysis['trustLayer']['data']['qualityScore']
      
    evidence.append(EvidenceItem(
      evidenceName="KYC Profile Validation",
      engine="TrustLayer",
      contribution="+25%" if trust_score >= 90.0 else "+10%",
      confidenceWeight="HIGH",
      status="Positive" if trust_score >= 80.0 else "Negative",
      evidenceSource="Validation Engine"
    ))

    # 2. Transaction logs
    tx_count = 0
    for acc in profile.accounts:
      tx_count += len(acc.transactions)
      
    evidence.append(EvidenceItem(
      evidenceName=f"Transaction Volume ({tx_count} transactions)",
      engine="BehaviorIQ",
      contribution="+15%" if tx_count > 10 else "+5%",
      confidenceWeight="HIGH" if tx_count > 5 else "MEDIUM",
      status="Positive" if tx_count > 0 else "Negative",
      evidenceSource="Ledger Logs"
    ))

    # 3. Savings trend (from BehaviorIQ)
    if individual_analysis.get('behaviorIQ'):
      beh_data = individual_analysis['behaviorIQ']['data']
      savings_ratio = beh_data['savings']['savingsRatio']
      
      evidence.append(EvidenceItem(
        evidenceName="Account Savings Margin",
        engine="BehaviorIQ",
        contribution=f"+10%" if savings_ratio > 10.0 else "-12%",
        confidenceWeight="HIGH",
        status="Positive" if savings_ratio > 10.0 else "Negative",
        evidenceSource="Monthly Cashflow Balances"
      ))
      
      cash_ratio = beh_data['expenses']['cashDependencyRatio']
      if cash_ratio > 25.0:
        evidence.append(EvidenceItem(
          evidenceName="Elevated Cash Withdrawals",
          engine="BehaviorIQ",
          contribution="-8%",
          confidenceWeight="HIGH",
          status="Negative",
          evidenceSource="Debit Ledger"
        ))

    # 4. Priority category contribution
    if individual_analysis.get('priorityIQ'):
      priority_data = individual_analysis['priorityIQ']['data']
      cat = priority_data['opportunityMatrix']['category']
      
      evidence.append(EvidenceItem(
        evidenceName=f"Priority Segment ({cat})",
        engine="PriorityIQ",
        contribution="+20%" if cat in ["Immediate Action", "High Potential"] else "+5%",
        confidenceWeight="HIGH",
        status="Positive",
        evidenceSource="Opportunity Matrix Model"
      ))
      
    return evidence
