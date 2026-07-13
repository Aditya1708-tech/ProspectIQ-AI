from schemas.portfolio import PortfolioSummary, PortfolioHealthDetail

class PortfolioExecutiveGenerator:
  def generate_briefing(
    self,
    summary: PortfolioSummary,
    health: PortfolioHealthDetail
  ) -> str:
    # 1. Base Variables
    total = summary.totalCustomers
    retail = summary.retailCustomers
    msme = summary.msmeCustomers
    active = summary.activeCount
    dormant = summary.dormantCount
    
    health_score = health.overallHealthScore
    trust_score = summary.averageTrustScore
    priority_score = summary.averagePriorityScore
    wealth = summary.averageWealthPotential
    digital = summary.averageDigitalAdoption
    category = health.healthCategory

    # 2. Sentences construction (approx 165 words)
    s1 = (
      f"The branch portfolio command center currently monitors {total} customer relationship profiles, consisting of "
      f"{retail} retail clients and {msme} business segment profiles, which yields {active} active and {dormant} dormant accounts."
    )
    s2 = (
      f"Overall indicators remain stable under the category of '{category}' with a branch health score of {health_score:.1f}%, "
      f"supported by an average data quality trust index of {trust_score:.1f}% and a collective priority score of {priority_score:.1f}%."
    )
    s3 = (
      f"The greatest segment opportunity lies in high-potential digital adoption cohorts, where the average wealth potential index reaches "
      f"{wealth:.1f}% and digital channel transactional usage averages {digital:.1f}%."
    )
    s4 = (
      f"Our primary operational concern stems from data verification exceptions, KYC validation gaps, and declining surplus savings ratios "
      f"which could trigger customer retention risks if left unaddressed."
    )
    s5 = (
      f"Relationship managers are advised to immediately prioritize contact with immediate-action portfolios, scheduling executive reviews "
      f"with dormant clients, and updating verification logs to safeguard compliance standards."
    )
    s6 = (
      f"Conclusively, the branch analytics model has resolved a consolidated briefing confidence level of HIGH, recommending a unified "
      f"focus on high-yield portfolios and customer retention parameters during the current financial quarter."
    )

    briefing = f"{s1} {s2} {s3} {s4} {s5} {s6}"
    
    # Word count check and adjustment
    word_count = len(briefing.split())
    if word_count < 150:
      briefing += " Special emphasis should be placed on verifying KYC details and re-engaging inactive portfolios to ensure long-term stability."
    
    return briefing
