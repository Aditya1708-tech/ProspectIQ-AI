from schemas.simulation import ScenarioAdjustment

class ScenarioMultipliers:
  def __init__(self, adj: ScenarioAdjustment):
    self.interactions = 1.0 + (adj.rmInteractionsChange / 100.0)
    self.savings = 1.0 + (adj.savingsRatioChange / 100.0)
    self.digital = 1.0 + (adj.digitalPaymentsChange / 100.0)
    self.stability = 1.0 + (adj.salaryStabilityChange / 100.0)
    self.meetings = 1.0 + (adj.meetingCompletionChange / 100.0)
    self.followups = 1.0 + (adj.followUpQualityChange / 100.0)
    self.engagement = 1.0 + (adj.engagementChange / 100.0)
    
    self.kyc_event = adj.kycEvent # Optional[bool]
    self.close_tasks = adj.closePendingTasks # Optional[bool]

def evaluate_multipliers(adj: ScenarioAdjustment) -> ScenarioMultipliers:
  return ScenarioMultipliers(adj)
