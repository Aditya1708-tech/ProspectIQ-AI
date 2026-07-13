from typing import List, Optional
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData, FinancialDNAProfile, PriorityIQProfile

class CoPilotBriefingGenerator:
  def generate_briefs(
    self,
    profile: CustomerProfileRequest,
    trust: TrustLayerData,
    behavior: Optional[BehaviorIQData],
    dna: Optional[FinancialDNAProfile],
    priority: Optional[PriorityIQProfile]
  ) -> tuple[List[str], List[str], List[str]]:
    
    # 1. Base Variables
    inc_stab = dna.incomeStability.score if dna else 50.0
    exp_disc = dna.expenseDiscipline.score if dna else 50.0
    sav_hlth = dna.savingsHealth.score if dna else 50.0
    liq_str = dna.liquidityStrength.score if dna else 50.0
    dig_adp = dna.digitalAdoption.score if dna else 50.0
    crd_hlth = dna.creditHealth.score if dna else 50.0
    inv_read = dna.investmentReadiness.score if dna else 50.0
    wlh_pot = dna.wealthPotential.score if dna else 50.0
    
    ret_risk = priority.retentionRisk.score if priority else 10.0
    trust_score = trust.qualityScore

    # 2. Compute Strengths
    strengths = []
    if inc_stab >= 70.0:
      strengths.append("Stable Income Source")
    if liq_str >= 70.0:
      strengths.append("Healthy Liquidity Reserves")
    if wlh_pot >= 70.0:
      strengths.append("Strong Wealth Potential")
    if dig_adp >= 75.0:
      strengths.append("Excellent Digital Adoption")
    if crd_hlth >= 80.0:
      strengths.append("Low Operational Risk Category")
    if exp_disc >= 70.0:
      strengths.append("Disciplined Expense Restraint")

    if len(strengths) < 2:
      strengths.append("Consistent Account Activity")
      strengths.append("Active Banking Participant")

    # 3. Compute Watch Areas
    watches = []
    if sav_hlth < 50.0:
      watches.append("Savings Trend Declining")
    if exp_disc < 55.0:
      watches.append("High Cash Dependency Ratio")
    if ret_risk >= 40.0:
      watches.append("Moderate Retention Risk")
    if inv_read < 50.0:
      watches.append("Limited Investment Readiness")
    if trust_score < 85.0:
      watches.append("Operational Verification Gaps")

    if len(watches) < 2:
      watches.append("Nurture Cycle Required")
      watches.append("Periodic Profile Check Recommended")

    # 4. Compute Growth Opportunities
    opportunities = []
    if wlh_pot >= 80.0:
      opportunities.append("Premium Relationship Growth Potential")
    if dig_adp >= 80.0:
      opportunities.append("Digital-First Engagement Profile")
    if inc_stab >= 75.0:
      opportunities.append("High Customer Lifetime Value Headroom")
    if profile.segment == 'MSME':
      opportunities.append("Business Working Capital Expansion Potential")
    else:
      opportunities.append("Personal Assets Diversification Capacity")

    if len(opportunities) < 2:
      opportunities.append("Cross-channel Relationship Deepening")
      opportunities.append("Loyalty Index Maximization Opportunity")

    return strengths, watches, opportunities
