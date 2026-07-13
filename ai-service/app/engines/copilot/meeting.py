from typing import List, Optional
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData, FinancialDNAProfile, PriorityIQProfile

class CoPilotMeetingPreparer:
  def prepare_meeting(
    self,
    profile: CustomerProfileRequest,
    trust: TrustLayerData,
    behavior: Optional[BehaviorIQData],
    dna: Optional[FinancialDNAProfile],
    priority: Optional[PriorityIQProfile]
  ) -> dict:
    
    # 1. Generate customerProfileSummary
    segment = profile.segment
    occ = profile.occupation
    persona = dna.persona.name if dna else "Growth Builder"
    
    summary_text = (
      f"Client Ravi Sen is classified in the {segment} segment as an active '{persona}' occupationally engaged as a "
      f"{occ}. The ledger shows consistent transaction volumes with localized verification checkpoints."
    )
    if profile.name != "Ravi Sen":
      summary_text = summary_text.replace("Ravi Sen", profile.name)

    # 2. Likely Discussion Topics
    topics = []
    if segment == 'MSME':
      topics.extend(["Business Cash Flow Tracking", "Working Capital Overdraft Needs", "Supplier Payments Cycles"])
    else:
      topics.extend(["Personal Wealth Goals", "Savings and Deposit Optimization", "Digital Channels Enrollment"])
    
    # DNA additions
    if dna:
      if dna.digitalAdoption.score >= 70.0:
        topics.append("Digital Banking Usage & Security")
      if dna.investmentReadiness.score >= 60.0:
        topics.append("Future Investment & Assets Strategy")
    else:
      topics.append("Future Financial Planning")

    # 3. Potential Concerns
    concerns = []
    if dna:
      if dna.savingsHealth.score < 50.0:
        concerns.append("Declining surplus savings reserves")
      if dna.expenseDiscipline.score < 50.0:
        concerns.append("Offline cash withdrawal transaction dependency")
      if dna.creditHealth.score < 60.0:
        concerns.append("Adjustments in internal credit risk profiles")
    
    if len(concerns) == 0:
      concerns.append("Maintaining seasonal cash reserves")
      concerns.append("Managing macro interest rate fluctuations")

    return {
      "customerProfileSummary": summary_text,
      "likelyDiscussionTopics": topics,
      "potentialConcerns": concerns
    }
