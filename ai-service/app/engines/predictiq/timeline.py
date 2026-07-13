from typing import List, Optional
from schemas.predict import PredictionTimelineNode
from schemas.analyze import CustomerProfileRequest

def build_timeline(
  profile: CustomerProfileRequest,
  churn_prob: float,
  growth_score: float
) -> List[PredictionTimelineNode]:
  nodes = []

  # Today Node
  nodes.append(PredictionTimelineNode(
    timeframe="Today",
    predictedEvent="Telemetry Checkpoint Logged",
    confidence="HIGH",
    reason="All historical interaction layers and cash flow signals successfully loaded.",
    expectedRMAction="Review standard Customer 360 intelligence briefing sheet."
  ))

  # 30 Days Node
  event_30 = "Relationship Stability Re-evaluated"
  action_30 = "Conduct routine touchpoint call to verify profile data."
  if churn_prob > 50:
    event_30 = "Elevated Retention Warning Active"
    action_30 = "Initiate targeted contact cycle to resolve logged customer service concerns."
  
  nodes.append(PredictionTimelineNode(
    timeframe="30 Days",
    predictedEvent=event_30,
    confidence="MEDIUM",
    reason="Short-term interaction decay forecasts suggest potential alignment deviation.",
    expectedRMAction=action_30
  ))

  # 90 Days Node
  event_90 = "Quarterly Business Review Due"
  action_90 = "Prepare a relationship health summary statement for client review."
  if growth_score > 70:
    event_90 = "Wealth Potential Advisory Window Opens"
    action_90 = "Schedule face-to-face portfolio review meeting with senior advisory desk."

  nodes.append(PredictionTimelineNode(
    timeframe="90 Days",
    predictedEvent=event_90,
    confidence="MEDIUM",
    reason="Derived from behavioral deposit stability indicators and tenure milestones.",
    expectedRMAction=action_90
  ))

  # 180 Days Node
  event_180 = "Semi-annual Milestone Audit"
  action_180 = "Conduct full regulatory documentation and KYC credential review."
  
  nodes.append(PredictionTimelineNode(
    timeframe="180 Days",
    predictedEvent=event_180,
    confidence="LOW",
    reason="Long-term projections baseline carries general variance factors.",
    expectedRMAction=action_180
  ))

  return nodes
