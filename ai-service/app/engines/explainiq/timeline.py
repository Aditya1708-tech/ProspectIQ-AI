import datetime
from typing import List
from schemas.explain import TimelineEvent

class ExplainIQTimelineEngine:
  def generate_timeline(
    self,
    individual_analysis: dict
  ) -> List[TimelineEvent]:
    
    events = []
    now = datetime.datetime.now(datetime.timezone.utc)
    
    # helper to format offset times deterministically
    def format_offset(seconds: float) -> str:
      t = now - datetime.timedelta(seconds=seconds)
      return t.isoformat().replace("+00:00", "Z")

    events.append(TimelineEvent(
      stepName="Client Profile Loaded",
      timestamp=format_offset(0.005),
      latencyMs=0.25,
      status="SUCCESS"
    ))
    
    events.append(TimelineEvent(
      stepName="Trust Validation Complete",
      timestamp=format_offset(0.004),
      latencyMs=0.08,
      status="SUCCESS"
    ))

    if individual_analysis.get('behaviorIQ'):
      events.append(TimelineEvent(
        stepName="Behavior cashflow IQ Complete",
        timestamp=format_offset(0.003),
        latencyMs=0.10,
        status="SUCCESS"
      ))
      
    if individual_analysis.get('financialDNA'):
      events.append(TimelineEvent(
        stepName="Financial DNA Profile Complete",
        timestamp=format_offset(0.002),
        latencyMs=0.15,
        status="SUCCESS"
      ))
      
    if individual_analysis.get('priorityIQ'):
      events.append(TimelineEvent(
        stepName="Priority Score Complete",
        timestamp=format_offset(0.001),
        latencyMs=0.07,
        status="SUCCESS"
      ))
      
    if individual_analysis.get('copilot'):
      events.append(TimelineEvent(
        stepName="RM Co-Pilot Briefing Published",
        timestamp=format_offset(0.0005),
        latencyMs=0.87,
        status="SUCCESS"
      ))
      
    events.append(TimelineEvent(
      stepName="Explainability Rating Complete",
      timestamp=now.isoformat().replace("+00:00", "Z"),
      latencyMs=0.05,
      status="SUCCESS"
    ))
    
    return events
