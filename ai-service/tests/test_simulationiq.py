import pytest
import sys
import os
from fastapi.testclient import TestClient

app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../app'))
sys.path.insert(0, app_path)
sys.path = [p for p in sys.path if p not in ['', os.path.abspath('.'), os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))]]

from main import app
from schemas.analyze import CustomerProfileRequest, AddressSchema, BankAccountSchema, TransactionSchema, InteractionSchema, TaskSchema
from schemas.simulation import SimulationScenario, ScenarioAdjustment
from api.routes import SimulationRunRequest
from engines.simulationiq.engine import SimulationIQEngine
from engines.simulationiq.scenario import validate_scenario
from engines.trustlayer.engine import TrustLayerEngine
from engines.behavioriq.engine import BehaviorIQEngine
from engines.findna.engine import FinDNAEngine
from engines.priorityiq.engine import PriorityIQEngine
from engines.copilot.engine import RMCopilotEngine
from engines.nbaiq.engine import NBAIQEngine
from engines.relationshipiq.engine import RelationshipIQEngine
from engines.predictiq.engine import PredictIQEngine

client = TestClient(app)

@pytest.fixture
def mock_profile():
  return CustomerProfileRequest(
    id="c_simulation_test",
    name="Rohan Joshi",
    email="rohan@joshi.com",
    phone="9876543211",
    occupation="Business Executive",
    incomeRange="2,500,000 - 5,000,000",
    riskCategory="MEDIUM",
    segment="MSME",
    status="ACTIVE",
    branchCode="BR001",
    lastInteractionAt="2026-07-02T10:00:00Z",
    addresses=[
      AddressSchema(
        type="HOME",
        street="44 Marina Bay",
        city="Mumbai",
        state="Maharashtra",
        postalCode="400001",
        country="India"
      )
    ],
    accounts=[
      BankAccountSchema(
        accountNumber="ACC999",
        accountType="SAVINGS",
        balance=850000.0,
        transactions=[
          TransactionSchema(
            amount=300000.0,
            type="CREDIT",
            category="SALARY",
            description="Consultancy invoice credit",
            valueDate="2026-06-30T10:00:00Z"
          ),
          TransactionSchema(
            amount=20000.0,
            type="DEBIT",
            category="UPI",
            description="UPI Supplier payout",
            valueDate="2026-07-01T12:00:00Z"
          )
        ]
      )
    ],
    interactions=[
      InteractionSchema(
        id="int_999",
        type="MEETING",
        summary="Service follow-up checkin",
        notes="Customer confirmed transaction settings.",
        interactionDate="2026-07-02T10:00:00Z",
        createdAt="2026-07-02T10:10:00Z"
      )
    ],
    tasks=[
      TaskSchema(
        id="tsk_999",
        title="Check-in review",
        description="Verify service limits",
        priority="HIGH",
        status="Completed",
        category="Routine",
        createdAt="2026-07-01T09:00:00Z",
        updatedAt="2026-07-02T10:00:00Z",
        dueDate="2026-07-05T17:00:00Z",
        completedAt="2026-07-02T10:00:00Z"
      )
    ]
  )

@pytest.fixture
def mock_scenario():
  return SimulationScenario(
    scenarioName="Outreach Boost Test",
    description="Simulate RM checkin interactions boost.",
    adjustments=ScenarioAdjustment(
      rmInteractionsChange=50.0,
      kycEvent=True,
      savingsRatioChange=10.0,
      digitalPaymentsChange=20.0,
      salaryStabilityChange=0.0,
      meetingCompletionChange=10.0,
      followUpQualityChange=15.0,
      engagementChange=25.0,
      closePendingTasks=True
    )
  )

def test_scenario_validation():
  # Valid adjustments
  valid = SimulationScenario(
    scenarioName="Valid adjustments",
    description="Valid limits",
    adjustments=ScenarioAdjustment(rmInteractionsChange=120.0)
  )
  assert validate_scenario(valid) is True

  # Invalid adjustments
  invalid = SimulationScenario(
    scenarioName="Invalid adjustments",
    description="Too high interactions",
    adjustments=ScenarioAdjustment(rmInteractionsChange=350.0)
  )
  assert validate_scenario(invalid) is False

def test_simulationiq_engine_pipeline(mock_profile, mock_scenario):
  trust_engine = TrustLayerEngine()
  behavior_engine = BehaviorIQEngine()
  findna_engine = FinDNAEngine()
  priority_engine = PriorityIQEngine()
  copilot_engine = RMCopilotEngine()
  nbaiq_engine = NBAIQEngine()
  relationship_engine = RelationshipIQEngine()
  predict_engine = PredictIQEngine()
  simulation_engine = SimulationIQEngine()

  trust = trust_engine.analyze(mock_profile)
  behavior = behavior_engine.analyze(mock_profile)
  dna = findna_engine.analyze(mock_profile, trust, behavior)
  priority = priority_engine.analyze(mock_profile, trust, behavior, dna)
  copilot = copilot_engine.analyze(mock_profile, trust, behavior, dna, priority)
  nbaiq = nbaiq_engine.analyze(mock_profile, trust, behavior, dna, priority, copilot)
  relationship = relationship_engine.analyze(mock_profile, trust, behavior, dna, priority, copilot, nbaiq)
  predict = predict_engine.analyze(mock_profile, trust, behavior, dna, priority, copilot, nbaiq, relationship)

  # Run stateless simulator
  sim_profile = simulation_engine.analyze(
    mock_profile, trust, behavior, relationship, predict, mock_scenario
  )

  assert sim_profile is not None
  assert sim_profile.scenarioName == "Outreach Boost Test"
  assert sim_profile.confidence in ["HIGH", "MEDIUM", "LOW"]

  # Check metrics deltas
  metrics = sim_profile.projectedMetrics
  assert "relationshipHealth" in metrics
  assert "churnProbability" in metrics
  
  health = metrics["relationshipHealth"]
  assert health.currentValue == (relationship.health.score if relationship and relationship.health else 75.0)
  assert health.difference > 0.0 # Positive check-in delta
  
  churn = metrics["churnProbability"]
  assert churn.difference < 0.0 # Positive churn decay

  # Business impacts
  impact = sim_profile.impact
  assert len(impact.customerImpact) > 0
  assert len(impact.rmImpact) > 0

  # Decision matrix
  decision = sim_profile.decision
  assert decision.category == "Highly Beneficial" # Boost + KYC completed

  # Timeline
  assert len(sim_profile.timeline) == 4
  assert sim_profile.timeline[0].timeframe == "Today"

  # Executive Summary length (150 to 200 words)
  summary = sim_profile.summary
  word_count = len(summary.briefing.split())
  assert 150 <= word_count <= 200, f"Summary briefing is {word_count} words; must be 150-200."

  # Compliance: Never recommend banking products
  product_keywords = ["loan", "credit card", "mortgage", "savings account", "current account", "fixed deposit", "mutual fund"]
  for kw in product_keywords:
    assert kw not in summary.briefing.lower(), f"Summary mentions banking product: {kw}"

def test_api_analyze_simulation_baseline(mock_profile):
  payload = mock_profile.model_dump() if hasattr(mock_profile, 'model_dump') else mock_profile.dict()
  response = client.post("/analyze", json=payload)
  
  assert response.status_code == 200
  data = response.json()
  assert "simulationIQ" in data
  assert data["simulationIQ"] is not None
  assert data["simulationIQ"]["data"]["scenarioName"] == "Baseline Simulation"

def test_api_simulate_custom_scenario(mock_profile, mock_scenario):
  run_request = {
    "profile": mock_profile.model_dump() if hasattr(mock_profile, 'model_dump') else mock_profile.dict(),
    "scenario": mock_scenario.model_dump() if hasattr(mock_scenario, 'model_dump') else mock_scenario.dict()
  }
  
  response = client.post("/simulate", json=run_request)
  assert response.status_code == 200
  data = response.json()
  assert data["scenarioName"] == "Outreach Boost Test"
  assert "projectedMetrics" in data
  assert "decision" in data
