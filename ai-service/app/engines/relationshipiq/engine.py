from typing import Optional
from schemas.analyze import (
  CustomerProfileRequest, TrustLayerData, BehaviorIQData,
  FinancialDNAProfile, PriorityIQProfile, NBAIQProfile
)
from schemas.relationship import RelationshipIQProfile
from engines.relationshipiq.health import evaluate_health
from engines.relationshipiq.timeline import generate_timeline
from engines.relationshipiq.interactions import aggregate_interactions, evaluate_touchpoints
from engines.relationshipiq.engagement import calculate_engagement
from engines.relationshipiq.milestones import identify_milestones
from engines.relationshipiq.trends import detect_risks
from engines.relationshipiq.summary import generate_summary
from engines.relationshipiq.confidence import resolve_confidence

class RelationshipIQEngine:
  def name(self) -> str:
    return "RelationshipIQ"
      
  def analyze(
    self,
    profile: CustomerProfileRequest,
    trust: TrustLayerData,
    behavior: Optional[BehaviorIQData],
    dna: Optional[FinancialDNAProfile],
    priority: Optional[PriorityIQProfile],
    copilot: Optional[dict] = None,
    nbaiq: Optional[NBAIQProfile] = None
  ) -> RelationshipIQProfile:
    
    # 1. Health Evaluator
    health_data = evaluate_health(profile, trust, behavior, priority)
    
    # 2. Timeline Journey
    journey_timeline = generate_timeline(profile, behavior, priority)
    
    # 3. Interaction Intelligence
    interactions_data = aggregate_interactions(profile)
    
    # 4. Engagement Analytics
    engagement_data = calculate_engagement(profile)
    
    # 5. Milestones Detection
    milestones_data = identify_milestones(profile, trust, behavior, priority)
    
    # 6. Touchpoint Effectiveness Evaluator
    touchpoints_data = evaluate_touchpoints(profile)
    
    # 7. Relationship Risks
    risks_data = detect_risks(profile, trust, behavior, priority)
    
    # 8. Executive Customer 360 Summary
    summary_data = generate_summary(profile, trust, behavior, priority, health_data, interactions_data)
    
    # 9. Resolve overall confidence
    overall_confidence = resolve_confidence(trust, profile)
    
    return RelationshipIQProfile(
      health=health_data,
      journey=journey_timeline,
      interactions=interactions_data,
      engagement=engagement_data,
      milestones=milestones_data,
      touchpoints=touchpoints_data,
      risks=risks_data,
      summary=summary_data,
      confidence=overall_confidence
    )
