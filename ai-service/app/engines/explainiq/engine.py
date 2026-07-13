import time
from typing import List, Dict, Any
from schemas.analyze import CustomerProfileRequest
from schemas.explain import ExplainIQProfile, DecisionTreeNode, ExplainabilityRating
from engines.explainiq.reasoning import ExplainIQReasoningEngine
from engines.explainiq.confidence import ExplainIQConfidenceEngine
from engines.explainiq.evidence import ExplainIQEvidenceEngine
from engines.explainiq.timeline import ExplainIQTimelineEngine
from engines.explainiq.comparison import ExplainIQComparisonEngine
from engines.explainiq.audit import ExplainIQAuditEngine
from engines.explainiq.contracts import (
  EXPLAINIQ_ENGINE_VERSION, DEFAULT_TRANSPARENCY_RATING, DEFAULT_EXPLAINABILITY_SCORE,
  AUDIT_COMPLETENESS_RATIO, DECISION_CONSISTENCY_RATIO
)

class ExplainIQEngine:
  def __init__(self):
    self.reasoning_eng = ExplainIQReasoningEngine()
    self.confidence_eng = ExplainIQConfidenceEngine()
    self.evidence_eng = ExplainIQEvidenceEngine()
    self.timeline_eng = ExplainIQTimelineEngine()
    self.comparison_eng = ExplainIQComparisonEngine()
    self.audit_eng = ExplainIQAuditEngine()

  def name(self) -> str:
    return "ExplainIQ"

  def explain(
    self,
    profile: CustomerProfileRequest,
    trust: Any,
    behavior: Any,
    dna: Any,
    priority: Any,
    copilot: Any
  ) -> ExplainIQProfile:
    
    start_time = time.perf_counter()
    
    # Safe extraction of copilot data fields (which could be dict or model)
    copilot_title = "Schedule Meeting"
    copilot_reason = "review relationship status"
    copilot_watch = []
    
    if copilot:
      if isinstance(copilot, dict):
        nba = copilot.get("nextBestAction", {})
        if isinstance(nba, dict):
          copilot_title = nba.get("title", copilot_title)
          copilot_reason = nba.get("reason", copilot_reason)
        else:
          copilot_title = getattr(nba, "title", copilot_title)
          copilot_reason = getattr(nba, "reason", copilot_reason)
        copilot_watch = copilot.get("watchAreas", [])
      else:
        nba = getattr(copilot, "nextBestAction", None)
        if nba:
          copilot_title = getattr(nba, "title", copilot_title)
          copilot_reason = getattr(nba, "reason", copilot_reason)
        copilot_watch = getattr(copilot, "watchAreas", [])

    # 1. Package analysis context for sub-engines
    individual_analysis = {
      "trustLayer": {"data": {"qualityScore": trust.qualityScore, "confidence": trust.confidence}},
      "behaviorIQ": {"data": {
        "income": {"totalCredits": behavior.income.totalCredits},
        "expenses": {"cashDependencyRatio": behavior.expenses.cashDependencyRatio},
        "savings": {"savingsRatio": behavior.savings.savingsRatio}
      }} if behavior else {},
      "financialDNA": {"data": {
        "persona": {
          "name": dna.persona.name,
          "strengths": dna.persona.strengths,
          "watchAreas": dna.persona.watchAreas
        },
        "digitalAdoption": {"score": dna.digitalAdoption.score},
        "wealthPotential": {"score": dna.wealthPotential.score}
      }} if dna else {},
      "priorityIQ": {"data": {
        "finalPriority": {"score": priority.finalPriority.score},
        "opportunity": {"score": priority.opportunity.score},
        "engagement": {"score": priority.engagement.score},
        "growthPotential": {"score": priority.growthPotential.score},
        "retentionRisk": {"score": priority.retentionRisk.score},
        "opportunityMatrix": {"category": priority.opportunityMatrix.category}
      }} if priority else {},
      "copilot": {
        "nextBestAction": {
          "title": copilot_title,
          "reason": copilot_reason
        },
        "watchAreas": copilot_watch
      }
    }

    # 2. Executive summary explanation (strictly 120-180 words)
    exec_explanation = self.reasoning_eng.generate_executive_explanation(profile, trust, dna, priority, copilot)
    
    # 3. Explanations by engine
    explanations = self.reasoning_eng.generate_engine_explanations(profile, trust, behavior, dna, priority, copilot)
    
    # 4. Decision Tree Reasoning Graph
    decision_tree = [
      DecisionTreeNode(
        title="Client Profile Loaded",
        summary="Reads customer attributes, contact fields, addresses list, and bank accounts.",
        inputReferences=["Customer database row"],
        outputReferences=["Demographic parameters payload"],
        dependencies=[],
        executionLatencyMs=0.25
      ),
      DecisionTreeNode(
        title="Trust Validation",
        summary="TrustLayer evaluates contact completeness and residential address mapping.",
        inputReferences=["phone", "email", "addresses"],
        outputReferences=[f"qualityScore: {trust.qualityScore:.0f}"],
        dependencies=["Client Profile Loaded"],
        executionLatencyMs=0.08
      ),
      DecisionTreeNode(
        title="Behavior Cashflow Analysis",
        summary="BehaviorIQ computes salary credits, monthly margins, and cash dependency ratios.",
        inputReferences=["transactions history"],
        outputReferences=["cashDependencyRatio", "savingsRatio"],
        dependencies=["Trust Validation"],
        executionLatencyMs=0.10
      ),
      DecisionTreeNode(
        title="Financial DNA Engine",
        summary="FinDNA resolves customer persona classifications and digital adoption rates.",
        inputReferences=["savingsRatio", "cashDependencyRatio"],
        outputReferences=[dna.persona.name if dna else "Retail Client"],
        dependencies=["Behavior Cashflow Analysis"],
        executionLatencyMs=0.15
      ),
      DecisionTreeNode(
        title="Priority Segment Ranking",
        summary="PriorityIQ evaluates SLA action segment categories and growth targets.",
        inputReferences=["digitalAdoption", "wealthPotential", "qualityScore"],
        outputReferences=[f"priorityScore: {priority.finalPriority.score:.1f}" if priority else "50.0"],
        dependencies=["Financial DNA Engine"],
        executionLatencyMs=0.07
      ),
      DecisionTreeNode(
        title="Co-Pilot Briefing Workspace",
        summary="RM CoPilot builds discussion topics and schedules next best outreach tasks.",
        inputReferences=["priorityScore", "watchAreas"],
        outputReferences=[copilot_title],
        dependencies=["Priority Segment Ranking"],
        executionLatencyMs=0.87
      ),
      DecisionTreeNode(
        title="Explainability Engine",
        summary="ExplainIQ maps reasoning metrics and registers verification compliance logs.",
        inputReferences=["priorityScore", "qualityScore", "nextBestAction"],
        outputReferences=["Decision tree chain", "Audit ledger hash"],
        dependencies=["Co-Pilot Briefing Workspace"],
        executionLatencyMs=0.05
      )
    ]

    # 5. Evidence Matrix
    evidence_matrix = self.evidence_eng.extract_evidence(profile, individual_analysis)

    # 6. Confidence Model
    confidence_model = self.confidence_eng.evaluate_confidence(profile, individual_analysis)

    # 7. Timeline events
    timeline = self.timeline_eng.generate_timeline(individual_analysis)

    # 8. Comparison Analysis
    comparison = self.comparison_eng.compare_profile(profile, individual_analysis)

    # 9. Audit Record
    elapsed_ms = (time.perf_counter() - start_time) * 1000.0
    trust_val = trust.qualityScore if trust else 100.0
    priority_val = priority.finalPriority.score if priority else 50.0
    audit_record = self.audit_eng.generate_audit_record(profile.id, elapsed_ms, trust_val, priority_val)

    # 10. Explainability Rating
    rating = ExplainabilityRating(
      explainabilityScore=DEFAULT_EXPLAINABILITY_SCORE,
      transparencyRating=DEFAULT_TRANSPARENCY_RATING,
      coverage=100.0,
      auditCompleteness=AUDIT_COMPLETENESS_RATIO,
      decisionConsistency=DECISION_CONSISTENCY_RATIO
    )

    return ExplainIQProfile(
      executiveExplanation=exec_explanation,
      explanations=explanations,
      decisionTree=decision_tree,
      evidenceMatrix=evidence_matrix,
      confidenceModel=confidence_model,
      reasoningTimeline=timeline,
      comparisonAnalysis=comparison,
      auditRecord=audit_record,
      explainabilityRating=rating
    )
