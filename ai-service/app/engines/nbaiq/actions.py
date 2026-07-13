from typing import List, Optional
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData, FinancialDNAProfile, PriorityIQProfile

def select_actions(
  profile: CustomerProfileRequest,
  trust: TrustLayerData,
  behavior: Optional[BehaviorIQData],
  dna: Optional[FinancialDNAProfile],
  priority: Optional[PriorityIQProfile]
) -> List[str]:
  priority_score = priority.finalPriority.score if priority else 50.0
  trust_score = trust.qualityScore if trust else 100.0
  
  if trust_score == 100.0 and profile.riskCategory == "LOW" and priority_score < 30.0:
    return ["No Immediate Action"]
    
  actions = []
  
  # Rule 1: Dormancy Reactivation
  if profile.status in ["DORMANT", "INACTIVE"]:
    actions.append("Dormancy Reactivation")
    
  # Rule 2: KYC Update Reminder
  has_kyc_warning = False
  if trust and trust.warnings:
    for w in trust.warnings:
      if "kyc" in w.lower() or "unverified" in w.lower():
        has_kyc_warning = True
        break
  if not profile.phone or not profile.email or has_kyc_warning:
    actions.append("KYC Update Reminder")
    
  # Rule 3: Document Verification
  has_doc_error = False
  if trust and trust.errors:
    for e in trust.errors:
      if "document" in e.lower() or "format" in e.lower() or "invalid" in e.lower():
        has_doc_error = True
        break
  if has_doc_error:
    actions.append("Document Verification")
    
  # Rule 4: Income Verification Follow-up
  if behavior and behavior.income and not behavior.income.salaryDetected:
    actions.append("Income Verification Follow-up")
  elif dna and dna.incomeStability and dna.incomeStability.score < 55.0:
    actions.append("Income Verification Follow-up")
    
  # Rule 5: Business Health Check
  if profile.segment == "MSME" and profile.status == "ACTIVE":
    actions.append("Business Health Check")
    
  # Rule 6: Annual Financial Review
  if dna and dna.wealthPotential and dna.wealthPotential.score >= 75.0 and profile.status == "ACTIVE":
    actions.append("Annual Financial Review")
    
  # Rule 7: Savings Trend Discussion
  if behavior and behavior.savings and behavior.savings.savingsRatio < 10.0:
    actions.append("Savings Trend Discussion")
  elif dna and dna.savingsHealth and dna.savingsHealth.score < 50.0:
    actions.append("Savings Trend Discussion")
    
  # Rule 8: Digital Engagement Follow-up
  if dna and dna.digitalAdoption and dna.digitalAdoption.score < 40.0:
    actions.append("Digital Engagement Follow-up")
  elif behavior and behavior.expenses and behavior.expenses.digitalPaymentRatio < 30.0:
    actions.append("Digital Engagement Follow-up")
    
  # Rule 9: Portfolio Review
  if dna and dna.investmentReadiness and dna.investmentReadiness.score >= 70.0:
    actions.append("Portfolio Review")
  elif profile.accounts and any(acc.balance > 100000.0 for acc in profile.accounts):
    actions.append("Portfolio Review")
    
  # Rule 10: Relationship Review
  if profile.status == "PROSPECT":
    actions.append("Relationship Review")
    
  # Rule 11: Customer Appreciation Call
  if dna and dna.savingsHealth and dna.savingsHealth.score >= 80.0 and priority and priority.engagement and priority.engagement.score >= 70.0:
    actions.append("Customer Appreciation Call")
    
  # Rule 12: Schedule Meeting
  if priority and priority.urgency and priority.urgency.score >= 80.0:
    actions.append("Schedule Meeting")
    
  # Rule 13: Call Customer
  actions.append("Call Customer")
  
  # Rule 14: Quarterly Touchpoint
  actions.append("Quarterly Touchpoint")
  
  unique_actions = []
  for act in actions:
    if act not in unique_actions:
      unique_actions.append(act)
      
  return unique_actions
