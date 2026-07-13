import datetime
from typing import Optional, List, Dict, Any
from schemas.analyze import (
  CustomerProfileRequest, TrustLayerData, BehaviorIQData,
  FinancialDNAProfile, PriorityIQProfile, NBAIQProfile,
  NBAAction, ConfidenceDetails, BusinessJustification, CustomerTaskCard
)
from engines.nbaiq.actions import select_actions
from engines.nbaiq.workflows import generate_workflows
from engines.nbaiq.scheduler import generate_schedule
from engines.nbaiq.calendar import calculate_completion_window
from engines.nbaiq.confidence import calculate_confidence_details
from engines.nbaiq.templates import ACTION_TEMPLATES

class NBAIQEngine:
  def name(self) -> str:
    return "NBAIQ"

  def analyze(
    self,
    profile: CustomerProfileRequest,
    trust: TrustLayerData,
    behavior: Optional[BehaviorIQData],
    dna: Optional[FinancialDNAProfile],
    priority: Optional[PriorityIQProfile],
    copilot: Optional[dict] = None
  ) -> NBAIQProfile:
    
    base_date = datetime.datetime.now(datetime.timezone.utc)
    
    # 1. Select actions deterministically based on rules
    action_types = select_actions(profile, trust, behavior, dna, priority)
    primary_type = action_types[0] if len(action_types) > 0 else "Call Customer"
    
    # 2. Compile Workflows
    workflows = generate_workflows(profile, action_types, priority, base_date)
    
    primary_act = workflows["primaryAction"]
    secondary_act = workflows["secondaryAction"]
    optional_act = workflows["optionalFollowUp"]
    
    # 3. Generate Schedules
    schedule_list = generate_schedule(workflows)
    
    # 4. Calculate Confidence Details
    confidence_data = calculate_confidence_details(profile, trust, priority)
    
    # 5. Fetch Templates metadata for Primary Action
    tpl = ACTION_TEMPLATES.get(primary_type, ACTION_TEMPLATES["Call Customer"])
    
    # 6. Recommendation Category Mapping
    category_map = {
      "KYC Update Reminder": "Compliance & Risk",
      "Document Verification": "Compliance & Risk",
      "Dormancy Reactivation": "Operations & Reactivation",
      "Income Verification Follow-up": "Compliance & Risk",
      "Business Health Check": "Commercial Review",
      "Annual Financial Review": "Strategic Advisory",
      "Savings Trend Discussion": "Cash Flow Counseling",
      "Digital Engagement Follow-up": "Digital Support",
      "Portfolio Review": "Wealth Management",
      "Relationship Review": "General Advisory",
      "Customer Appreciation Call": "Client Relations",
      "Schedule Meeting": "Relationship Growth",
      "Call Customer": "General Touchpoint",
      "Quarterly Touchpoint": "General Touchpoint",
      "No Immediate Action": "Maintenance"
    }
    recommendation_category = category_map.get(primary_type, "General Touchpoint")
    
    # 7. Urgency mapping
    urgency_val = primary_act["priority"]
    
    # 8. Business Justification details
    triggers = {
      "KYC Update Reminder": ("TrustLayer", ["qualityScore"], "Ensures compliance and prevents account lock constraints."),
      "Document Verification": ("TrustLayer", ["qualityScore"], "Completes profile audit compliance check."),
      "Dormancy Reactivation": ("BehaviorIQ", ["frequencyPerMonth"], "Re-activates client portfolio cash flow."),
      "Income Verification Follow-up": ("FinancialDNA", ["incomeStability"], "Resolves data gaps and clarifies credit health suitability."),
      "Business Health Check": ("FinancialDNA", ["wealthPotential"], "Assesses seasonal liquidity needs."),
      "Annual Financial Review": ("FinancialDNA", ["wealthPotential"], "Aligns strategic annual planning goals."),
      "Savings Trend Discussion": ("BehaviorIQ", ["savingsRatio"], "Reduces savings leakage and targets cash conversion."),
      "Digital Engagement Follow-up": ("FinancialDNA", ["digitalAdoption"], "Improves client convenience and net banking utility."),
      "Portfolio Review": ("FinancialDNA", ["investmentReadiness"], "Optimizes asset allocation and returns."),
      "Relationship Review": ("PriorityIQ", ["finalPriority"], "Introduces relationship coverage bounds."),
      "Customer Appreciation Call": ("PriorityIQ", ["engagement"], "Reinforces relationship trust and loyalty."),
      "Schedule Meeting": ("PriorityIQ", ["urgency"], "Proactively addresses immediate client priorities."),
      "Call Customer": ("PriorityIQ", ["finalPriority"], "Maintains active client engagement."),
      "Quarterly Touchpoint": ("PriorityIQ", ["finalPriority"], "Sustains standard communication intervals."),
      "No Immediate Action": ("TrustLayer", ["qualityScore"], "Optimizes RM time by avoiding unnecessary contact.")
    }
    triggering_engine, contributing_metrics, expected_benefit = triggers.get(
      primary_type, ("PriorityIQ", ["finalPriority"], "Maintains active client engagement.")
    )
    
    justification = BusinessJustification(
      whyThisActionExists=primary_act["reason"],
      triggeringEngine=triggering_engine,
      contributingMetrics=contributing_metrics,
      expectedBenefit=expected_benefit
    )
    
    # 9. Expected Outcome
    outcome_map = {
      "KYC Update Reminder": "Compliance status restored to active standing.",
      "Document Verification": "Document audit cleared without compliance flags.",
      "Dormancy Reactivation": "Dormant account reactivated for routine usage.",
      "Income Verification Follow-up": "Income records verified and risk classification certified.",
      "Business Health Check": "MSME financial health mapped and support objectives defined.",
      "Annual Financial Review": "Strategic alignment secured for next year's relationship targets.",
      "Savings Trend Discussion": "Savings levels stabilized and outflow leakage minimized.",
      "Digital Engagement Follow-up": "Online profile access activated and first digital payment executed.",
      "Portfolio Review": "Client assets rebalanced according to liquidity profiles.",
      "Relationship Review": "RM coverage introduced and interaction preferences logged.",
      "Customer Appreciation Call": "Reinforced goodwill and positive satisfaction feedback recorded.",
      "Schedule Meeting": "Structured meeting completed and relationship milestones documented.",
      "Call Customer": "Routine satisfaction check completed and notes logged.",
      "Quarterly Touchpoint": "Routine check completed and registry details confirmed.",
      "No Immediate Action": "Nominal profile status verified."
    }
    expected_outcome = outcome_map.get(primary_type, "Standard relationship touchpoint completed.")
    
    # 10. Estimated time and completion window
    estimated_time = tpl["expectedDuration"]
    completion_window = calculate_completion_window(primary_act["sla"])
    
    # 11. Customer Task Card details
    task_checklist = [
      "Review customer profile",
      "Review interaction history",
      "Verify KYC",
      "Review transaction behavior",
      "Review branch notes",
      "Prepare meeting agenda",
      "Log meeting outcome",
      "Schedule next interaction"
    ]
    card_checklist = task_checklist[:4] + tpl["checklist"] + task_checklist[4:]
    if not card_checklist:
      card_checklist = task_checklist
      
    task_card = CustomerTaskCard(
      headline=tpl["headline"],
      summary=tpl["summary"],
      checklist=tpl["checklist"] if tpl["checklist"] else ["Review customer file"],
      talkingPoints=tpl["talkingPoints"],
      preparationNotes=tpl["preparationNotes"],
      successCriteria=tpl["successCriteria"]
    )
    
    # 12. Top-level RM checklist
    checklist = card_checklist
    
    # Compile Confidence model
    conf_details = ConfidenceDetails(
      overallScore=confidence_data["overallScore"],
      trustLayerQuality=confidence_data["trustLayerQuality"],
      dataCompleteness=confidence_data["dataCompleteness"],
      priorityConfidence=confidence_data["priorityConfidence"],
      portfolioConfidence=confidence_data["portfolioConfidence"],
      interactionCoverage=confidence_data["interactionCoverage"]
    )
    
    primary_action_obj = NBAAction(
      title=primary_act["title"],
      description=primary_act["description"],
      reason=primary_act["reason"],
      expectedDuration=primary_act["expectedDuration"],
      priority=primary_act["priority"],
      owner=primary_act["owner"],
      recommendedDueDate=primary_act["recommendedDueDate"],
      sla=primary_act["sla"]
    )
    
    secondary_action_obj = None
    if secondary_act:
      secondary_action_obj = NBAAction(
        title=secondary_act["title"],
        description=secondary_act["description"],
        reason=secondary_act["reason"],
        expectedDuration=secondary_act["expectedDuration"],
        priority=secondary_act["priority"],
        owner=secondary_act["owner"],
        recommendedDueDate=secondary_act["recommendedDueDate"],
        sla=secondary_act["sla"]
      )
      
    optional_action_obj = None
    if optional_act:
      optional_action_obj = NBAAction(
        title=optional_act["title"],
        description=optional_act["description"],
        reason=optional_act["reason"],
        expectedDuration=optional_act["expectedDuration"],
        priority=optional_act["priority"],
        owner=optional_act["owner"],
        recommendedDueDate=optional_act["recommendedDueDate"],
        sla=optional_act["sla"]
      )

    return NBAIQProfile(
      overallRecommendation=f"Execute a {primary_type} to address relationship priorities.",
      recommendationCategory=recommendation_category,
      urgency=urgency_val,
      businessJustification=justification,
      expectedOutcome=expected_outcome,
      estimatedRMTime=estimated_time,
      recommendedCompletionWindow=completion_window,
      confidence=conf_details,
      primaryAction=primary_action_obj,
      secondaryAction=secondary_action_obj,
      optionalFollowUp=optional_action_obj,
      taskCard=task_card,
      schedule=schedule_list,
      checklist=checklist
    )
