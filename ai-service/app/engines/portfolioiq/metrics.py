from typing import List, Dict
from schemas.analyze import CustomerProfileRequest
from schemas.portfolio import PortfolioSummary

class PortfolioMetricsCalculator:
  def calculate_summary(
    self,
    profiles: List[CustomerProfileRequest],
    individual_analyses: List[dict]
  ) -> PortfolioSummary:
    total = len(profiles)
    
    retail = 0
    msme = 0
    active = 0
    dormant = 0
    prospect = 0
    
    for p in profiles:
      if p.segment.upper() == 'MSME':
        msme += 1
      else:
        retail += 1
        
      status = p.status.upper()
      if status == 'ACTIVE':
        active += 1
      elif status == 'DORMANT':
        dormant += 1
      else:
        prospect += 1

    # Totals/Averages
    avg_trust = 0.0
    avg_dna = 0.0
    avg_priority = 0.0
    avg_wealth = 0.0
    avg_digital = 0.0

    for analysis in individual_analyses:
      avg_trust += analysis['trustLayer']['data']['qualityScore']
      if analysis.get('financialDNA'):
        dna_data = analysis['financialDNA']['data']
        avg_dna += dna_data['incomeStability']['score'] # representative DNA index
        avg_wealth += dna_data['wealthPotential']['score']
        avg_digital += dna_data['digitalAdoption']['score']
      if analysis.get('priorityIQ'):
        avg_priority += analysis['priorityIQ']['data']['finalPriority']['score']

    if total > 0:
      avg_trust = round(avg_trust / total, 2)
      avg_dna = round(avg_dna / total, 2)
      avg_priority = round(avg_priority / total, 2)
      avg_wealth = round(avg_wealth / total, 2)
      avg_digital = round(avg_digital / total, 2)

    # Portfolio health average is weighted by trust and priority
    avg_health_score = round((avg_trust * 0.4) + (avg_priority * 0.6), 2)

    return PortfolioSummary(
      totalCustomers=total,
      retailCustomers=retail,
      msmeCustomers=msme,
      prospectsCount=prospect,
      dormantCount=dormant,
      activeCount=active,
      averageTrustScore=avg_trust,
      averageFinDNAScore=avg_dna,
      averagePriorityScore=avg_priority,
      averageWealthPotential=avg_wealth,
      averageDigitalAdoption=avg_digital,
      averagePortfolioHealth=avg_health_score
    )
