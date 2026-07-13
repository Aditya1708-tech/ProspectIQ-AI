from typing import Optional
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData
from schemas.relationship import RelationshipIQProfile
from schemas.predict import PredictIQProfile
from schemas.simulation import SimulationScenario, SimulationIQProfile, ScenarioAdjustment
from engines.simulationiq.scenario import validate_scenario
from engines.simulationiq.adjustments import evaluate_multipliers
from engines.simulationiq.projection import project_metrics
from engines.simulationiq.comparison import build_comparisons
from engines.simulationiq.impact import calculate_impacts
from engines.simulationiq.decision import evaluate_decision
from engines.simulationiq.confidence import evaluate_simulation_confidence
from engines.simulationiq.timeline import generate_simulation_timeline
from engines.simulationiq.summary import generate_summary_briefing

class SimulationIQEngine:
  def analyze(
    self,
    profile: CustomerProfileRequest,
    trust: TrustLayerData,
    behavior: Optional[BehaviorIQData],
    relationship: Optional[RelationshipIQProfile],
    predict: Optional[PredictIQProfile],
    scenario: Optional[SimulationScenario] = None
  ) -> SimulationIQProfile:
    
    if scenario is None:
      scenario = SimulationScenario(
        scenarioName="Baseline Simulation",
        description="Baseline customer trajectory projections without adjustments.",
        adjustments=ScenarioAdjustment()
      )
      
    # 1. Validate scenario adjustments
    if not validate_scenario(scenario):
      raise ValueError("Invalid simulation scenario adjustment bounds.")

    # 2. Evaluate adjustments to multipliers
    multipliers = evaluate_multipliers(scenario.adjustments)

    # 3. Evaluate overall confidence
    overall_conf = evaluate_simulation_confidence(profile, relationship, predict, scenario.adjustments)

    # 4. Project metrics
    projected = project_metrics(profile, trust, behavior, relationship, predict, multipliers)

    # 5. Build comparisons
    comparisons = build_comparisons(profile, behavior, relationship, predict, projected, overall_conf)

    # 6. Evaluate business impacts
    impacts = calculate_impacts(comparisons)

    # 7. Evaluate decision matrix
    decision = evaluate_decision(comparisons, multipliers, overall_conf)

    # 8. Generate simulation timeline
    timeline = generate_simulation_timeline(comparisons, multipliers, overall_conf)

    # 9. Generate summary briefing
    summary = generate_summary_briefing(scenario.scenarioName, comparisons, scenario.adjustments, overall_conf)

    return SimulationIQProfile(
      scenarioName=scenario.scenarioName,
      projectedMetrics=comparisons,
      impact=impacts,
      decision=decision,
      timeline=timeline,
      summary=summary,
      confidence=overall_conf
    )
