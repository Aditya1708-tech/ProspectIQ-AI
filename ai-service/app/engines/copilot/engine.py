import time
from typing import Optional
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData, FinancialDNAProfile, PriorityIQProfile
from engines.copilot.confidence import CoPilotConfidenceEvaluator
from engines.copilot.summary import CoPilotSummaryGenerator
from engines.copilot.briefing import CoPilotBriefingGenerator
from engines.copilot.meeting import CoPilotMeetingPreparer
from engines.copilot.conversation import CoPilotConversationGenerator
from engines.copilot.timeline import CoPilotTimelineGenerator

class RMCopilotEngine:
  def __init__(self):
    self.confidence_evaluator = CoPilotConfidenceEvaluator()
    self.summary_generator = CoPilotSummaryGenerator()
    self.briefing_generator = CoPilotBriefingGenerator()
    self.meeting_preparer = CoPilotMeetingPreparer()
    self.conversation_generator = CoPilotConversationGenerator()
    self.timeline_generator = CoPilotTimelineGenerator()

  def name(self) -> str:
    return "RMCopilot"

  def analyze(
    self,
    profile: CustomerProfileRequest,
    trust: TrustLayerData,
    behavior: Optional[BehaviorIQData],
    dna: Optional[FinancialDNAProfile],
    priority: Optional[PriorityIQProfile]
  ) -> dict:
    
    # 1. Resolve consolidated confidence
    confidence = self.confidence_evaluator.resolve_confidence(trust, dna, priority)

    # 2. Executive Summary
    summary = self.summary_generator.generate_summary(profile, trust, behavior, dna, priority, confidence)

    # 3. Strengths, Watch Areas, Growth Opportunities
    strengths, watch_areas, growth_opps = self.briefing_generator.generate_briefs(profile, trust, behavior, dna, priority)

    # 4. Meeting Preparation
    meeting_prep = self.meeting_preparer.prepare_meeting(profile, trust, behavior, dna, priority)

    # 5. Conversation Starters
    starters = self.conversation_generator.generate_starters(profile, dna)

    # 6. Timeline
    timeline = self.timeline_generator.generate_timeline(profile, behavior, priority)

    # 7. Next Best Action
    action_title = priority.opportunityMatrix.actionType if priority else "Call Customer"
    action_timeline = priority.opportunityMatrix.sla if priority else "48 Hours"
    action_reason = "High growth potential with moderate retention risk."
    if priority and priority.retentionRisk.score > 40:
      action_reason = "Customer risk profile triggers prioritized relationship contact."
    elif priority and priority.opportunity.score >= 70:
      action_reason = "High wealth potential segment warrants proactive credit review."

    next_best = {
      "title": action_title,
      "timeline": action_timeline,
      "reason": action_reason
    }

    # 8. Snapshot
    snapshot = {
      "persona": dna.persona.name if dna else "Growth Builder",
      "priorityCategory": priority.opportunityMatrix.category if priority else "Nurture",
      "priorityScore": priority.finalPriority.score if priority else 50.0,
      "urgency": f"{priority.urgency.score}%" if priority else "50%",
      "relationshipManager": profile.segment, # Default or segment classification
      "branch": profile.branchCode,
      "confidence": confidence
    }

    return {
      "executiveSummary": summary,
      "snapshot": snapshot,
      "strengths": strengths,
      "watchAreas": watch_areas,
      "growthOpportunities": growth_opps,
      "meetingPreparation": meeting_prep,
      "conversationStarters": starters,
      "timeline": timeline,
      "nextBestAction": next_best
    }
