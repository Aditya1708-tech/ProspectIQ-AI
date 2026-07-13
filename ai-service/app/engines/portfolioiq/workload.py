from typing import List
from schemas.analyze import CustomerProfileRequest
from schemas.portfolio import RMWorkloadRecord

class PortfolioWorkloadBalancer:
  def calculate_workload(
    self,
    profiles: List[CustomerProfileRequest],
    individual_analyses: List[dict]
  ) -> List[RMWorkloadRecord]:
    
    rm_buckets = {
      "RM Priya": {"profiles": [], "analyses": []},
      "RM Anil": {"profiles": [], "analyses": []},
      "RM Sunita": {"profiles": [], "analyses": []}
    }
    
    for i, profile in enumerate(profiles):
      analysis = individual_analyses[i]
      
      rm_name = "RM Priya" if profile.segment == 'RETAIL' else "RM Anil"
      if i % 3 == 0:
        rm_name = "RM Sunita"
        
      if rm_name in rm_buckets:
        rm_buckets[rm_name]["profiles"].append(profile)
        rm_buckets[rm_name]["analyses"].append(analysis)
        
    records = []
    
    for rm_name, data in rm_buckets.items():
      assigned_count = len(data["profiles"])
      if assigned_count == 0:
        # Avoid empty RMs if profiles are few
        continue
        
      imm_count = 0
      high_pot = 0
      sum_health = 0.0
      sum_priority = 0.0
      pending = 0
      overdue = 0
      
      for j, profile in enumerate(data["profiles"]):
        analysis = data["analyses"][j]
        
        # Calculate health
        trust = analysis['trustLayer']['data']['qualityScore']
        priority_score = 50.0
        
        if analysis.get('priorityIQ'):
          piq = analysis['priorityIQ']['data']
          priority_score = piq['finalPriority']['score']
          cat = piq['opportunityMatrix']['category']
          
          if cat == 'Immediate Action':
            imm_count += 1
          elif cat == 'High Potential':
            high_pot += 1
            
        sum_priority += priority_score
        sum_health += (trust * 0.4) + (priority_score * 0.6)
        
        # Inactivity or dormant acts as pending follow-up
        if profile.status == 'DORMANT':
          overdue += 1
        elif not profile.lastInteractionAt:
          pending += 1
          
      avg_health = round(sum_health / assigned_count, 2)
      avg_priority = round(sum_priority / assigned_count, 2)
      
      # Calculate Utilization percentage
      # Formula: (assigned_count * 1.5) + (imm_count * 8) + (pending * 3) + (overdue * 5)
      util = (assigned_count * 1.5) + (imm_count * 8.0) + (pending * 3.0) + (overdue * 5.0)
      util_pct = min(100.0, max(15.0, round(util, 2)))
      
      records.append(RMWorkloadRecord(
        rmName=rm_name,
        customersAssigned=assigned_count,
        immediateActionCount=imm_count,
        highPotentialCount=high_pot,
        averagePortfolioHealth=avg_health,
        averagePriority=avg_priority,
        pendingFollowUps=pending,
        overdueFollowUps=overdue,
        interactionCoverage=85.0, # Target default indicator
        utilizationPercentage=util_pct
      ))
      
    # Fallback default records if no profiles
    if len(records) == 0:
      records.append(RMWorkloadRecord(
        rmName="RM Priya",
        customersAssigned=0,
        immediateActionCount=0,
        highPotentialCount=0,
        averagePortfolioHealth=0.0,
        averagePriority=0.0,
        pendingFollowUps=0,
        overdueFollowUps=0,
        interactionCoverage=0.0,
        utilizationPercentage=0.0
      ))
      
    # Sort by utilization percentage descending
    records.sort(key=lambda r: r.utilizationPercentage, reverse=True)
    return records
