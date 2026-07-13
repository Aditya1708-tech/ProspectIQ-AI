from typing import Dict, Any, List
from schemas.simulation import SimulationScenario, ScenarioAdjustment

def get_preset_templates() -> List[Dict[str, Any]]:
  return [
    {
      "templateId": "boost_outreach",
      "scenarioName": "Outreach & Engagement Boost",
      "description": "Increase RM communication frequency and improve touchpoint responsiveness.",
      "adjustments": {
        "rmInteractionsChange": 50.0,
        "kycEvent": None,
        "savingsRatioChange": 0.0,
        "digitalPaymentsChange": 15.0,
        "salaryStabilityChange": 0.0,
        "meetingCompletionChange": 20.0,
        "followUpQualityChange": 25.0,
        "engagementChange": 30.0,
        "closePendingTasks": True
      }
    },
    {
      "templateId": "kyc_recovery",
      "scenarioName": "Compliance & KYC Recovery",
      "description": "Perform pending KYC updates and resolve backlog compliance actions.",
      "adjustments": {
        "rmInteractionsChange": 20.0,
        "kycEvent": True,
        "savingsRatioChange": 0.0,
        "digitalPaymentsChange": 0.0,
        "salaryStabilityChange": 0.0,
        "meetingCompletionChange": 10.0,
        "followUpQualityChange": 10.0,
        "engagementChange": 15.0,
        "closePendingTasks": True
      }
    },
    {
      "templateId": "savings_optimization",
      "scenarioName": "Savings & Balance Growth",
      "description": "Increase customer balance growth rate and prioritize savings turnover.",
      "adjustments": {
        "rmInteractionsChange": 10.0,
        "kycEvent": None,
        "savingsRatioChange": 40.0,
        "digitalPaymentsChange": 20.0,
        "salaryStabilityChange": 10.0,
        "meetingCompletionChange": 15.0,
        "followUpQualityChange": 15.0,
        "engagementChange": 20.0,
        "closePendingTasks": None
      }
    },
    {
      "templateId": "dormancy_reversal",
      "scenarioName": "Dormancy Reversal & Support",
      "description": "Reactively engage high-risk dormant customer through priority check-ins.",
      "adjustments": {
        "rmInteractionsChange": 80.0,
        "kycEvent": True,
        "savingsRatioChange": 15.0,
        "digitalPaymentsChange": 30.0,
        "salaryStabilityChange": 0.0,
        "meetingCompletionChange": 50.0,
        "followUpQualityChange": 30.0,
        "engagementChange": 60.0,
        "closePendingTasks": True
      }
    }
  ]

def validate_scenario(scenario: SimulationScenario) -> bool:
  adj = scenario.adjustments
  # Bound checking for adjustment percentages (must be within -100 to 300)
  pct_fields = [
    adj.rmInteractionsChange, adj.savingsRatioChange, adj.digitalPaymentsChange,
    adj.salaryStabilityChange, adj.meetingCompletionChange, adj.followUpQualityChange,
    adj.engagementChange
  ]
  for field in pct_fields:
    if field < -100.0 or field > 300.0:
      return False
  return True
