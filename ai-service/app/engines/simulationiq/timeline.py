from typing import List, Dict
from schemas.simulation import SimulationTimelineNode, ProjectedMetric
from engines.simulationiq.adjustments import ScenarioMultipliers

def generate_simulation_timeline(
  comparisons: Dict[str, ProjectedMetric],
  mult: ScenarioMultipliers,
  overall_conf: str
) -> List[SimulationTimelineNode]:
  health = comparisons["relationshipHealth"]
  churn = comparisons["churnProbability"]

  # Today Node
  today_node = SimulationTimelineNode(
    timeframe="Today",
    expectedEvent="Hypothetical Action Plan Initialized",
    expectedMetricChange="Parameters baseline registered.",
    confidence="HIGH",
    recommendedRMAction="Confirm parameters and run the comparative analysis."
  )

  # 30 Days Node
  if mult.kyc_event is True:
    d30_event = "KYC Verification Finalized"
    d30_change = f"Relationship health index stabilized. Risk Category drops."
    d30_action = "Execute KYC update validation task in CRM workspace."
  elif mult.kyc_event is False:
    d30_event = "KYC Verification Overdue Alert"
    d30_change = "Relationship health index degraded. Compliance priority raised."
    d30_action = "Initiate emergency contact workflow to request missing documents."
  else:
    d30_event = "Routine Telemetry Monitoring"
    d30_change = "Customer behavior aligns with descriptive telemetry profiles."
    d30_action = "Proceed with scheduled check-in call."

  d30_node = SimulationTimelineNode(
    timeframe="30 Days",
    expectedEvent=d30_event,
    expectedMetricChange=d30_change,
    confidence=overall_conf,
    recommendedRMAction=d30_action
  )

  # 90 Days Node
  if mult.interactions > 1.2:
    d90_event = "Outreach Optimization Benchmark Achieved"
    d90_change = f"Relationship health improved by {health.difference}%. Attrition risk minimized."
    d90_action = "Transition relationship stage to next tier and schedule annual portfolio check-in."
  elif mult.interactions < 0.8:
    d90_event = "Interaction Decay Alert Triggered"
    d90_change = f"Engagement score declines. Attrition risk increased by {abs(churn.difference)}%."
    d90_action = "Schedule a priority engagement meeting to check client satisfaction."
  else:
    d90_event = "Standard Relationship Maintenance Checkpoint"
    d90_change = "Account values and balance reserves matching descriptive projections."
    d90_action = "Deliver standard quarterly relationship service review."

  d90_node = SimulationTimelineNode(
    timeframe="90 Days",
    expectedEvent=d90_event,
    expectedMetricChange=d90_change,
    confidence=overall_conf,
    recommendedRMAction=d90_action
  )

  # 180 Days Node
  if churn.projectedValue > 35.0:
    d180_event = "Attrition Risk Escalation Checkpoint"
    d180_change = f"Attrition index rises to {churn.projectedValue}%. High risk of dormancy."
    d180_action = "Execute dormancy prevention playbook protocol immediately."
  else:
    d180_event = "Long-Term Trajectory Assessment"
    d180_change = f"Overall relationship health tracking stable at {health.projectedValue}%."
    d180_action = "Maintain contact schedule and log client satisfaction review."

  d180_node = SimulationTimelineNode(
    timeframe="180 Days",
    expectedEvent=d180_event,
    expectedMetricChange=d180_change,
    confidence=overall_conf,
    recommendedRMAction=d180_action
  )

  return [today_node, d30_node, d90_node, d180_node]
