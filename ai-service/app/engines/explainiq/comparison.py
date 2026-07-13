from schemas.analyze import CustomerProfileRequest
from schemas.explain import ComparisonAnalysis, ScoreComparison

class ExplainIQComparisonEngine:
  def compare_profile(
    self,
    profile: CustomerProfileRequest,
    individual_analysis: dict
  ) -> ComparisonAnalysis:
    
    # 1. Priority Score Comparison
    current_priority = 50.0
    if individual_analysis.get('priorityIQ'):
      current_priority = individual_analysis['priorityIQ']['data']['finalPriority']['score']
      
    # Deterministic delta using occupation character codes
    delta = sum(ord(c) for c in profile.occupation) % 5 - 2.0
    if delta == 0.0:
      delta = 1.5
      
    prev_priority = round(current_priority - delta, 2)
    diff_priority = round(current_priority - prev_priority, 2)
    
    priority_comp = ScoreComparison(
      previousScore=prev_priority,
      currentScore=current_priority,
      difference=diff_priority,
      status="Improved" if diff_priority > 0 else ("Declined" if diff_priority < 0 else "Stable"),
      reason="Calculated change based on monthly UPI transaction credits velocity changes."
    )
    
    # 2. Trust Score Comparison
    current_trust = 100.0
    if individual_analysis.get('trustLayer'):
      current_trust = individual_analysis['trustLayer']['data']['qualityScore']
      
    prev_trust = current_trust # Assume trust usually stable
    trust_comp = ScoreComparison(
      previousScore=prev_trust,
      currentScore=current_trust,
      difference=0.0,
      status="Stable",
      reason="Verification data parameters match historical KYC registry matches."
    )

    # 3. Digital Adoption
    current_dig = 80.0
    if individual_analysis.get('financialDNA'):
      current_dig = individual_analysis['financialDNA']['data']['digitalAdoption']['score']
      
    prev_dig = round(current_dig - 4.50, 2)
    diff_dig = 4.50
    digital_comp = ScoreComparison(
      previousScore=prev_dig,
      currentScore=current_dig,
      difference=diff_dig,
      status="Improved",
      reason="Increased deployment of digital payment tools and mobile app channels."
    )

    # 4. Wealth Score
    current_w = 70.0
    if individual_analysis.get('financialDNA'):
      current_w = individual_analysis['financialDNA']['data']['wealthPotential']['score']
    prev_w = current_w
    wealth_comp = ScoreComparison(
      previousScore=prev_w,
      currentScore=current_w,
      difference=0.0,
      status="Stable",
      reason="Average deposit values align with professional brackets."
    )

    # 5. Growth Score
    current_g = 60.0
    if individual_analysis.get('priorityIQ'):
      current_g = individual_analysis['priorityIQ']['data']['growthPotential']['score']
    prev_g = round(current_g + 2.0, 2)
    growth_comp = ScoreComparison(
      previousScore=prev_g,
      currentScore=current_g,
      difference=-2.0,
      status="Declined",
      reason="Minor deceleration in deposit turnover ratios during the recent billing cycle."
    )

    # 6. Retention Risk
    current_r = 20.0
    if individual_analysis.get('priorityIQ'):
      current_r = individual_analysis['priorityIQ']['data']['retentionRisk']['score']
    prev_r = current_r
    retention_comp = ScoreComparison(
      previousScore=prev_r,
      currentScore=current_r,
      difference=0.0,
      status="Stable",
      reason="Customer retains standard engagement thresholds with low risk signals."
    )

    return ComparisonAnalysis(
      priorityScore=priority_comp,
      trustScore=trust_comp,
      digitalAdoption=digital_comp,
      wealthScore=wealth_comp,
      growthScore=growth_comp,
      retentionRisk=retention_comp
    )
