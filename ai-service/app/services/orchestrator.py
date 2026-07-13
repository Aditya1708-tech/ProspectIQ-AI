import time
import datetime
import uuid
from typing import Optional
from schemas.analyze import CustomerProfileRequest, AnalyzeResponse, EngineResponseContract, TrustLayerData, BehaviorIQData, FinancialDNAProfile, PriorityIQProfile, NBAIQProfile
from schemas.relationship import RelationshipIQProfile
from schemas.predict import PredictIQProfile
from engines.trustlayer.engine import TrustLayerEngine
from engines.behavioriq.engine import BehaviorIQEngine
from engines.findna.engine import FinDNAEngine
from engines.priorityiq.engine import PriorityIQEngine
from engines.copilot.engine import RMCopilotEngine
from engines.nbaiq.engine import NBAIQEngine
from engines.relationshipiq.engine import RelationshipIQEngine
from engines.predictiq.engine import PredictIQEngine
from engines.simulationiq.engine import SimulationIQEngine
from schemas.simulation import SimulationIQProfile

class AIOrchestrator:
  def __init__(self):
    self.trust_engine = TrustLayerEngine()
    self.behavior_engine = BehaviorIQEngine()
    self.findna_engine = FinDNAEngine()
    self.priority_engine = PriorityIQEngine()
    self.copilot_engine = RMCopilotEngine()
    self.nbaiq_engine = NBAIQEngine()
    self.relationship_engine = RelationshipIQEngine()
    self.predict_engine = PredictIQEngine()
    self.simulation_engine = SimulationIQEngine()

  def run_analysis(self, profile: CustomerProfileRequest, request_id: Optional[str] = None) -> AnalyzeResponse:
    if not request_id:
      request_id = str(uuid.uuid4())

    now_str = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")

    # 1. Execute TrustLayer Engine
    start_time = time.perf_counter()
    warnings = []
    errors = []
    
    try:
      trust_data = self.trust_engine.analyze(profile)
      warnings = trust_data.warnings
      errors = trust_data.errors
    except Exception as e:
      trust_data = TrustLayerData(
        qualityScore=0.0,
        confidence="LOW",
        warnings=["TrustLayer Engine failed to execute."],
        errors=[str(e)]
      )
      errors.append(str(e))

    trust_elapsed = (time.perf_counter() - start_time) * 1000.0

    trust_contract = EngineResponseContract[TrustLayerData](
      analysisVersion="1.0.0",
      generatedAt=now_str,
      executionTimeMs=round(trust_elapsed, 2),
      engine=self.trust_engine.name(),
      reasoning=[f"Data quality validation parsed {len(profile.accounts)} accounts."],
      data=trust_data
    )

    # Log TrustLayer execution
    self.log_engine_run(
      request_id=request_id,
      customer_id=profile.id,
      engine_name=self.trust_engine.name(),
      execution_time=trust_elapsed,
      warnings=warnings,
      errors=errors
    )

    # 2. Execute BehaviorIQ Engine
    behavior_contract = None
    behavior_data = None
    behavior_warnings = []
    behavior_errors = []

    # Run BehaviorIQ only if there are no catastrophic TrustLayer block errors
    if trust_data.qualityScore > 0:
      start_time = time.perf_counter()
      try:
        behavior_data = self.behavior_engine.analyze(profile)
      except Exception as e:
        behavior_data = None
        behavior_errors.append(str(e))
        print(f"[AI ORCHESTRATOR ERROR] BehaviorIQ failed: {str(e)}", flush=True)

      behavior_elapsed = (time.perf_counter() - start_time) * 1000.0

      if behavior_data:
        behavior_contract = EngineResponseContract[BehaviorIQData](
          analysisVersion="1.0.0",
          generatedAt=now_str,
          executionTimeMs=round(behavior_elapsed, 2),
          engine=self.behavior_engine.name(),
          reasoning=[f"Cash flow turnovers computed over transaction history logs."],
          data=behavior_data
        )

        # Log BehaviorIQ execution
        self.log_engine_run(
          request_id=request_id,
          customer_id=profile.id,
          engine_name=self.behavior_engine.name(),
          execution_time=behavior_elapsed,
          warnings=behavior_warnings,
          errors=behavior_errors
        )

    # 3. Execute Financial DNA Engine
    findna_contract = None
    findna_data = None
    findna_warnings = []
    findna_errors = []

    # FinDNA runs if TrustLayer successfully executed
    if trust_data.qualityScore > 0:
      start_time = time.perf_counter()
      try:
        findna_data = self.findna_engine.analyze(profile, trust_data, behavior_data)
      except Exception as e:
        findna_data = None
        findna_errors.append(str(e))
        print(f"[AI ORCHESTRATOR ERROR] FinancialDNA failed: {str(e)}", flush=True)

      findna_elapsed = (time.perf_counter() - start_time) * 1000.0

      if findna_data:
        findna_contract = EngineResponseContract[FinancialDNAProfile](
          analysisVersion="1.0.0",
          generatedAt=now_str,
          executionTimeMs=round(findna_elapsed, 2),
          engine=self.findna_engine.name(),
          reasoning=["Financial DNA profiling based on structured quality and cash flow signals."],
          data=findna_data
        )

        # Log FinancialDNA execution
        self.log_engine_run(
          request_id=request_id,
          customer_id=profile.id,
          engine_name=self.findna_engine.name(),
          execution_time=findna_elapsed,
          warnings=findna_warnings,
          errors=findna_errors
        )

    # 4. Execute PriorityIQ Engine
    priority_contract = None
    priority_data = None
    priority_warnings = []
    priority_errors = []

    # PriorityIQ runs if TrustLayer successfully executed
    if trust_data.qualityScore > 0:
      start_time = time.perf_counter()
      try:
        priority_data = self.priority_engine.analyze(profile, trust_data, behavior_data, findna_data)
      except Exception as e:
        priority_data = None
        priority_errors.append(str(e))
        print(f"[AI ORCHESTRATOR ERROR] PriorityIQ failed: {str(e)}", flush=True)

      priority_elapsed = (time.perf_counter() - start_time) * 1000.0

      if priority_data:
        priority_contract = EngineResponseContract[PriorityIQProfile](
          analysisVersion="1.0.0",
          generatedAt=now_str,
          executionTimeMs=round(priority_elapsed, 2),
          engine=self.priority_engine.name(),
          reasoning=["Priority score and opportunity matrix computed from behavioral dimensions."],
          data=priority_data
        )

        # Log PriorityIQ execution
        self.log_engine_run(
          request_id=request_id,
          customer_id=profile.id,
          engine_name=self.priority_engine.name(),
          execution_time=priority_elapsed,
          warnings=priority_warnings,
          errors=priority_errors
        )

    # 5. Execute RM Co-Pilot Engine
    copilot_contract = None
    copilot_warnings = []
    copilot_errors = []

    # CoPilot runs if TrustLayer successfully executed
    if trust_data.qualityScore > 0:
      start_time = time.perf_counter()
      try:
        copilot_data = self.copilot_engine.analyze(profile, trust_data, behavior_data, findna_data, priority_data)
      except Exception as e:
        copilot_data = None
        copilot_errors.append(str(e))
        print(f"[AI ORCHESTRATOR ERROR] RMCopilot failed: {str(e)}", flush=True)

      copilot_elapsed = (time.perf_counter() - start_time) * 1000.0

      if copilot_data:
        # Wrap in EngineResponseContract
        copilot_contract = {
          "analysisVersion": "1.0.0",
          "generatedAt": now_str,
          "executionTimeMs": round(copilot_elapsed, 2),
          "engine": self.copilot_engine.name(),
          "reasoning": ["Intelligent executive-ready RM briefing and meeting prep checklist synthesis."],
          "data": copilot_data
        }

        # Log CoPilot execution
        self.log_engine_run(
          request_id=request_id,
          customer_id=profile.id,
          engine_name=self.copilot_engine.name(),
          execution_time=copilot_elapsed,
          warnings=copilot_warnings,
          errors=copilot_errors
        )

    # 6. Execute ExplainIQ Engine
    explain_contract = None
    if trust_data.qualityScore > 0:
      from engines.explainiq.engine import ExplainIQEngine
      from schemas.explain import ExplainIQProfile
      explain_engine = ExplainIQEngine()
      start_time = time.perf_counter()
      try:
        explain_data = explain_engine.explain(profile, trust_data, behavior_data, findna_data, priority_data, copilot_data)
      except Exception as e:
        explain_data = None
        print(f"[AI ORCHESTRATOR ERROR] ExplainIQ failed: {str(e)}", flush=True)

      explain_elapsed = (time.perf_counter() - start_time) * 1000.0

      if explain_data:
        explain_contract = EngineResponseContract[ExplainIQProfile](
          analysisVersion="1.0.0",
          generatedAt=now_str,
          executionTimeMs=round(explain_elapsed, 2),
          engine=explain_engine.name(),
          reasoning=["Stateless deterministic explainability mapping and SHA256 audit digest generation."],
          data=explain_data
        )

    # 7. Execute NBAIQ Engine
    nbaiq_contract = None
    nbaiq_warnings = []
    nbaiq_errors = []

    if trust_data.qualityScore > 0:
      start_time = time.perf_counter()
      try:
        nbaiq_data = self.nbaiq_engine.analyze(
          profile, trust_data, behavior_data, findna_data, priority_data, copilot_data
        )
      except Exception as e:
        nbaiq_data = None
        nbaiq_errors.append(str(e))
        print(f"[AI ORCHESTRATOR ERROR] NBAIQ failed: {str(e)}", flush=True)

      nbaiq_elapsed = (time.perf_counter() - start_time) * 1000.0

      if nbaiq_data:
        nbaiq_contract = EngineResponseContract[NBAIQProfile](
          analysisVersion="1.0.0",
          generatedAt=now_str,
          executionTimeMs=round(nbaiq_elapsed, 2),
          engine=self.nbaiq_engine.name(),
          reasoning=["Deterministic relationship workflow and completion SLA calculation."],
          data=nbaiq_data
        )

        # Log NBAIQ execution
        self.log_engine_run(
          request_id=request_id,
          customer_id=profile.id,
          engine_name=self.nbaiq_engine.name(),
          execution_time=nbaiq_elapsed,
          warnings=nbaiq_warnings,
          errors=nbaiq_errors
        )

    # 8. Execute RelationshipIQ Engine
    relationship_contract = None
    relationship_warnings = []
    relationship_errors = []

    if trust_data.qualityScore > 0:
      start_time = time.perf_counter()
      try:
        relationship_data = self.relationship_engine.analyze(
          profile, trust_data, behavior_data, findna_data, priority_data, copilot_data, nbaiq_data
        )
      except Exception as e:
        relationship_data = None
        relationship_errors.append(str(e))
        print(f"[AI ORCHESTRATOR ERROR] RelationshipIQ failed: {str(e)}", flush=True)

      relationship_elapsed = (time.perf_counter() - start_time) * 1000.0

      if relationship_data:
        relationship_contract = EngineResponseContract[RelationshipIQProfile](
          analysisVersion="1.0.0",
          generatedAt=now_str,
          executionTimeMs=round(relationship_elapsed, 2),
          engine=self.relationship_engine.name(),
          reasoning=["Deterministic customer 360 relationship intelligence aggregation."],
          data=relationship_data
        )

        # Log RelationshipIQ execution
        self.log_engine_run(
          request_id=request_id,
          customer_id=profile.id,
          engine_name=self.relationship_engine.name(),
          execution_time=relationship_elapsed,
          warnings=relationship_warnings,
          errors=relationship_errors
        )

    # 9. Execute PredictIQ Engine
    predict_contract = None
    predict_warnings = []
    predict_errors = []

    if trust_data.qualityScore > 0:
      start_time = time.perf_counter()
      try:
        predict_data = self.predict_engine.analyze(
          profile, trust_data, behavior_data, findna_data, priority_data, copilot_data, nbaiq_data, relationship_data
        )
      except Exception as e:
        predict_data = None
        predict_errors.append(str(e))
        print(f"[AI ORCHESTRATOR ERROR] PredictIQ failed: {str(e)}", flush=True)

      predict_elapsed = (time.perf_counter() - start_time) * 1000.0

      if predict_data:
        predict_contract = EngineResponseContract[PredictIQProfile](
          analysisVersion="1.0.0",
          generatedAt=now_str,
          executionTimeMs=round(predict_elapsed, 2),
          engine=self.predict_engine.name(),
          reasoning=["Deterministic customer future outcomes and predictive forecasting."],
          data=predict_data
        )

        # Log PredictIQ execution
        self.log_engine_run(
          request_id=request_id,
          customer_id=profile.id,
          engine_name=self.predict_engine.name(),
          execution_time=predict_elapsed,
          warnings=predict_warnings,
          errors=predict_errors
        )

    # 10. Execute SimulationIQ Engine
    simulation_contract = None
    simulation_warnings = []
    simulation_errors = []

    if trust_data.qualityScore > 0:
      start_time = time.perf_counter()
      try:
        simulation_data = self.simulation_engine.analyze(
          profile, trust_data, behavior_data, relationship_data, predict_data, None
        )
      except Exception as e:
        simulation_data = None
        simulation_errors.append(str(e))
        print(f"[AI ORCHESTRATOR ERROR] SimulationIQ failed: {str(e)}", flush=True)

      simulation_elapsed = (time.perf_counter() - start_time) * 1000.0

      if simulation_data:
        simulation_contract = EngineResponseContract[SimulationIQProfile](
          analysisVersion="1.0.0",
          generatedAt=now_str,
          executionTimeMs=round(simulation_elapsed, 2),
          engine="SimulationIQ",
          reasoning=["Deterministic simulation projections based on baseline parameters."],
          data=simulation_data
        )

        # Log SimulationIQ execution
        self.log_engine_run(
          request_id=request_id,
          customer_id=profile.id,
          engine_name="SimulationIQ",
          execution_time=simulation_elapsed,
          warnings=simulation_warnings,
          errors=simulation_errors
        )

    return AnalyzeResponse(
      trustLayer=trust_contract,
      behaviorIQ=behavior_contract,
      financialDNA=findna_contract,
      priorityIQ=priority_contract,
      copilot=copilot_contract,
      explainIQ=explain_contract,
      nextBestActionIQ=nbaiq_contract,
      relationshipIQ=relationship_contract,
      predictIQ=predict_contract,
      simulationIQ=simulation_contract
    )

  def log_engine_run(self, request_id: str, customer_id: str, engine_name: str, execution_time: float, warnings: list, errors: list):
    print(
      f"[AI SERVICE LOG] requestId={request_id} | "
      f"customerId={customer_id} | "
      f"engineName={engine_name} | "
      f"executionTimeMs={execution_time:.2f} | "
      f"warningsCount={len(warnings)} | "
      f"errorsCount={len(errors)} | "
      f"warnings={warnings} | "
      f"errors={errors}",
      flush=True
    )
