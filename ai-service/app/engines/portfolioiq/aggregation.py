from typing import List, Dict
from schemas.analyze import CustomerProfileRequest
from schemas.portfolio import (
  PriorityDistributionProfile, PriorityMetricDetail,
  RMPerformanceRecord, TrendPoint, DistributionDataset
)

class PortfolioAggregator:
  def aggregate_priority_distribution(
    self,
    individual_analyses: List[dict]
  ) -> PriorityDistributionProfile:
    
    categories = {
      "Immediate Action": 0,
      "High Potential": 0,
      "Nurture": 0,
      "Monitor": 0,
      "Low Priority": 0
    }
    
    for analysis in individual_analyses:
      if analysis.get('priorityIQ'):
        cat = analysis['priorityIQ']['data']['opportunityMatrix']['category']
        if cat in categories:
          categories[cat] += 1
          
    total = len(individual_analyses)
    
    def detail(count):
      pct = round(count / total * 100, 2) if total > 0 else 0.0
      return PriorityMetricDetail(
        count=count,
        percentage=pct,
        trend="Stable"
      )

    return PriorityDistributionProfile(
      immediateAction=detail(categories["Immediate Action"]),
      highPotential=detail(categories["High Potential"]),
      nurture=detail(categories["Nurture"]),
      monitor=detail(categories["Monitor"]),
      lowPriority=detail(categories["Low Priority"])
    )

  def aggregate_rm_leaderboard(
    self,
    profiles: List[CustomerProfileRequest],
    individual_analyses: List[dict]
  ) -> List[RMPerformanceRecord]:
    # Group profiles by RM
    # We will map RMs based on profile assigned date or branch
    # Let's map target RMs based on profile.segment or mock RMs:
    # "RM Priya", "RM Anil", "RM Sunita"
    rm_profiles = {}
    
    for i, profile in enumerate(profiles):
      analysis = individual_analyses[i]
      # A simple mapping of assigned RM (e.g. Priya manages RETAIL, Anil manages MSME)
      # Let's read the branch or segment to designate Priya/Anil
      rm_name = "RM Priya" if profile.segment == 'RETAIL' else "RM Anil"
      if i % 3 == 0:
        rm_name = "RM Sunita"
        
      if rm_name not in rm_profiles:
        rm_profiles[rm_name] = []
      rm_profiles[rm_name].append((profile, analysis))
      
    records = []
    
    for rm_name, items in rm_profiles.items():
      count = len(items)
      sum_trust = 0.0
      sum_priority = 0.0
      sum_health = 0.0
      high_pot = 0
      imm_action = 0
      
      for profile, analysis in items:
        sum_trust += analysis['trustLayer']['data']['qualityScore']
        
        if analysis.get('priorityIQ'):
          piq = analysis['priorityIQ']['data']
          sum_priority += piq['finalPriority']['score']
          
          cat = piq['opportunityMatrix']['category']
          if cat == 'Immediate Action':
            imm_action += 1
          elif cat == 'High Potential':
            high_pot += 1
            
      avg_trust = round(sum_trust / count, 2) if count > 0 else 0.0
      avg_priority = round(sum_priority / count, 2) if count > 0 else 0.0
      avg_health = round((avg_trust * 0.4) + (avg_priority * 0.6), 2)
      
      # Effectiveness is weighted by coverage and health
      eff_score = round((avg_health * 0.7) + (count * 2.0), 2)
      
      records.append(RMPerformanceRecord(
        rmName=rm_name,
        customersManaged=count,
        averageTrust=avg_trust,
        averagePriority=avg_priority,
        averagePortfolioHealth=avg_health,
        interactionCoverage=85.0, # default index coverage
        highPotentialCustomers=high_pot,
        immediateActionCustomers=imm_action,
        rmEffectivenessScore=min(100.0, eff_score)
      ))

    records.sort(key=lambda r: r.rmEffectivenessScore, reverse=True)
    return records

  def generate_trends(self) -> List[TrendPoint]:
    # Simulate deterministic trend points (Jan - Jun)
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    trends = []
    base_cust = 80
    
    for i, m in enumerate(months):
      trends.append(TrendPoint(
        month=m,
        customerGrowth=base_cust + (i * 4),
        priorityIndex=65.0 + (i * 1.5),
        riskIndex=15.0 - (i * 0.8),
        digitalAdoptionIndex=70.0 + (i * 2.0),
        qualityIndex=88.0 + (i * 0.5)
      ))
      
    return trends

  def generate_distributions(
    self,
    profiles: List[CustomerProfileRequest],
    individual_analyses: List[dict]
  ) -> DistributionDataset:
    
    segments = {}
    risks = {}
    personas = {}
    priorities = {}
    rms = {}
    
    for i, p in enumerate(profiles):
      segments[p.segment] = segments.get(p.segment, 0) + 1
      risks[p.riskCategory] = risks.get(p.riskCategory, 0) + 1
      
      # Priya, Anil, Sunita distribution
      rm_name = "RM Priya" if p.segment == 'RETAIL' else "RM Anil"
      if i % 3 == 0:
        rm_name = "RM Sunita"
      rms[rm_name] = rms.get(rm_name, 0) + 1

      analysis = individual_analyses[i]
      if analysis.get('financialDNA'):
        pers = analysis['financialDNA']['data']['persona']['name']
        personas[pers] = personas.get(pers, 0) + 1
      if analysis.get('priorityIQ'):
        cat = analysis['priorityIQ']['data']['opportunityMatrix']['category']
        priorities[cat] = priorities.get(cat, 0) + 1

    return DistributionDataset(
      segments=segments,
      risks=risks,
      personas=personas,
      priorities=priorities,
      rms=rms
    )
