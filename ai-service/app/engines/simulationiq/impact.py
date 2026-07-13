from typing import Dict
from schemas.simulation import BusinessImpact, ProjectedMetric

def calculate_impacts(comparisons: Dict[str, ProjectedMetric]) -> BusinessImpact:
  health = comparisons["relationshipHealth"]
  churn = comparisons["churnProbability"]
  savings = comparisons["savingsHealth"]
  rm_eff = comparisons["rmEffectiveness"]
  branch = comparisons["branchHealthContribution"]

  # Generate deterministic statements based on the deltas
  if health.difference > 0:
    rel_impact = f"Stronger RM alignment increases relationship health by {health.difference}%."
  elif health.difference < 0:
    rel_impact = f"Reduced touchpoints result in relationship health degradation of {abs(health.difference)}%."
  else:
    rel_impact = "Relationship health remains unchanged under baseline settings."

  if churn.difference < 0:
    cust_impact = f"Retention outreach successfully lowers churn probability by {abs(churn.difference)}%."
  elif churn.difference > 0:
    cust_impact = f"KYC delays or interaction gaps raise predicted attrition risk by {churn.difference}%."
  else:
    cust_impact = "Customer satisfaction indicators show no deviation from baseline."

  if savings.difference > 0:
    port_impact = f"Savings growth increases projected portfolio deposits by {savings.percentageDifference}%."
  elif savings.difference < 0:
    port_impact = f"Reduced savings velocity results in {abs(savings.difference)}% balance reduction."
  else:
    port_impact = "Portfolio balances trace stable at baseline rates."

  if rm_eff.difference > 0:
    rm_stmt = f"Optimized task scheduling improves RM effectiveness index by {rm_eff.difference}%."
  elif rm_eff.difference < 0:
    rm_stmt = f"Backlog task delays degrade RM workflow coverage efficiency by {abs(rm_eff.difference)}%."
  else:
    rm_stmt = "RM service efficiency matches baseline operational benchmarks."

  if branch.difference > 0:
    br_impact = f"Increased compliance checks raise branch health contribution index by {branch.difference}%."
  else:
    br_impact = "Branch operations track stable with standard regulatory coverage."

  op_impact = "Process updates show positive operational alignment with guidelines." if health.isPositive else "Backlog delays lead to heightened operational friction."

  return BusinessImpact(
    customerImpact=cust_impact,
    rmImpact=rm_stmt,
    portfolioImpact=port_impact,
    branchImpact=br_impact,
    operationalImpact=op_impact,
    relationshipImpact=rel_impact
  )
