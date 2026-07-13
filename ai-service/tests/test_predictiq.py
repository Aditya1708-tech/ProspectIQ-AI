import pytest
import sys
import os
from fastapi.testclient import TestClient

app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../app'))
sys.path.insert(0, app_path)
sys.path = [p for p in sys.path if p not in ['', os.path.abspath('.'), os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))]]

from main import app
from schemas.analyze import CustomerProfileRequest, AddressSchema, BankAccountSchema, TransactionSchema, InteractionSchema, TaskSchema
from engines.predictiq.engine import PredictIQEngine
from engines.trustlayer.engine import TrustLayerEngine
from engines.behavioriq.engine import BehaviorIQEngine
from engines.findna.engine import FinDNAEngine
from engines.priorityiq.engine import PriorityIQEngine
from engines.copilot.engine import RMCopilotEngine
from engines.nbaiq.engine import NBAIQEngine
from engines.relationshipiq.engine import RelationshipIQEngine

client = TestClient(app)

@pytest.fixture
def test_profile():
  return CustomerProfileRequest(
    id="c_test_predict",
    name="Dev Sharma",
    email="dev@sharma.com",
    phone="9876543210",
    occupation="Corporate Executive",
    incomeRange="2,500,000 - 5,000,000",
    riskCategory="LOW",
    segment="RETAIL",
    status="ACTIVE",
    branchCode="BR001",
    lastInteractionAt="2026-07-02T10:00:00Z",
    addresses=[
      AddressSchema(
        type="HOME",
        street="12 Marine Drive",
        city="Mumbai",
        state="Maharashtra",
        postalCode="400020",
        country="India"
      )
    ],
    accounts=[
      BankAccountSchema(
        accountNumber="ACC123",
        accountType="SAVINGS",
        balance=450000.0,
        transactions=[
          TransactionSchema(
            amount=200000.0,
            type="CREDIT",
            category="SALARY",
            description="Monthly salary deposit",
            valueDate="2026-06-30T10:00:00Z"
          ),
          TransactionSchema(
            amount=15000.0,
            type="DEBIT",
            category="UPI",
            description="UPI merchant transaction",
            valueDate="2026-07-01T12:00:00Z"
          )
        ]
      )
    ],
    interactions=[
      InteractionSchema(
        id="int_1",
        type="CALL",
        summary="Service follow-up call",
        notes="Customer confirmed receipt of new credentials.",
        interactionDate="2026-07-02T10:00:00Z",
        createdAt="2026-07-02T10:10:00Z"
      )
    ],
    tasks=[
      TaskSchema(
        id="tsk_1",
        title="Check-in Call",
        description="Verify service satisfaction",
        priority="LOW",
        status="Completed",
        category="Routine",
        createdAt="2026-07-01T09:00:00Z",
        updatedAt="2026-07-02T10:00:00Z",
        dueDate="2026-07-05T17:00:00Z",
        completedAt="2026-07-02T10:00:00Z"
      )
    ]
  )

def test_predictiq_engine_logic(test_profile):
  trust_engine = TrustLayerEngine()
  behavior_engine = BehaviorIQEngine()
  findna_engine = FinDNAEngine()
  priority_engine = PriorityIQEngine()
  copilot_engine = RMCopilotEngine()
  nbaiq_engine = NBAIQEngine()
  relationship_engine = RelationshipIQEngine()
  predict_engine = PredictIQEngine()

  trust = trust_engine.analyze(test_profile)
  behavior = behavior_engine.analyze(test_profile)
  dna = findna_engine.analyze(test_profile, trust, behavior)
  priority = priority_engine.analyze(test_profile, trust, behavior, dna)
  copilot = copilot_engine.analyze(test_profile, trust, behavior, dna, priority)
  nbaiq = nbaiq_engine.analyze(test_profile, trust, behavior, dna, priority, copilot)
  relationship = relationship_engine.analyze(test_profile, trust, behavior, dna, priority, copilot, nbaiq)
  
  predict_profile = predict_engine.analyze(
    test_profile, trust, behavior, dna, priority, copilot, nbaiq, relationship
  )

  # Check structure
  assert predict_profile is not None
  assert predict_profile.confidence in ["HIGH", "MEDIUM", "LOW"]
  
  # Forecasts
  assert "relationshipHealth" in predict_profile.forecasts
  assert "churnProbability" in predict_profile.forecasts
  assert "growthProbability" in predict_profile.forecasts
  
  health_metric = predict_profile.forecasts["relationshipHealth"]
  assert health_metric.currentValue == relationship.health.score
  assert health_metric.d30.predictedValue >= 0.0 and health_metric.d30.predictedValue <= 100.0

  # Churn
  assert predict_profile.churn.probability >= 0.0 and predict_profile.churn.probability <= 100.0
  assert predict_profile.churn.riskCategory in ["Low", "Medium", "High", "Critical"]
  assert len(predict_profile.churn.primaryDrivers) > 0
  
  # Growth
  assert predict_profile.growth.growthScore >= 0.0 and predict_profile.growth.growthScore <= 100.0
  assert predict_profile.growth.growthCategory in ["Declining", "Stable", "Growing", "Accelerating"]

  # Relationship & Opportunity Projections
  assert predict_profile.relationship.predictedStage is not None
  assert predict_profile.opportunity.expectedRMAttentionLevel in ["High", "Medium", "Low"]

  # Timeline
  assert len(predict_profile.timeline) == 4
  timeframes = [node.timeframe for node in predict_profile.timeline]
  assert "Today" in timeframes
  assert "30 Days" in timeframes

  # Executive Forecast Summary
  summary = predict_profile.summary
  assert summary.overallConfidence == predict_profile.confidence
  
  # Compliance word count verify (150 to 200 words)
  word_count = len(summary.briefing.split())
  assert 150 <= word_count <= 200, f"Executive Forecast Summary is {word_count} words; must be 150-200."
  
  # Compliance: Never recommend banking products
  product_keywords = ["loan", "credit card", "mortgage", "savings account", "current account", "fixed deposit", "mutual fund"]
  for kw in product_keywords:
    assert kw not in summary.briefing.lower(), f"Summary breaches compliance by mentioning banking product: {kw}"

def test_analyze_endpoint_predictiq(test_profile):
  payload = test_profile.model_dump() if hasattr(test_profile, 'model_dump') else test_profile.dict()
  response = client.post("/analyze", json=payload)
  
  assert response.status_code == 200
  data = response.json()
  assert "predictIQ" in data
  assert data["predictIQ"] is not None
  assert data["predictIQ"]["engine"] == "PredictIQ"
  assert "forecasts" in data["predictIQ"]["data"]
  assert "churn" in data["predictIQ"]["data"]
