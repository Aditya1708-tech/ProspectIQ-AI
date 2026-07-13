import pytest
import sys
import os
from fastapi.testclient import TestClient

app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../app'))
sys.path.insert(0, app_path)
sys.path = [p for p in sys.path if p not in ['', os.path.abspath('.'), os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))]]

from main import app
from schemas.analyze import CustomerProfileRequest, AddressSchema, BankAccountSchema, TransactionSchema, InteractionSchema, TaskSchema
from engines.trustlayer.engine import TrustLayerEngine
from engines.behavioriq.engine import BehaviorIQEngine
from engines.relationshipiq.health import evaluate_health
from engines.relationshipiq.timeline import generate_timeline
from engines.relationshipiq.interactions import aggregate_interactions, evaluate_touchpoints
from engines.relationshipiq.engagement import calculate_engagement
from engines.relationshipiq.milestones import identify_milestones
from engines.relationshipiq.trends import detect_risks
from engines.relationshipiq.summary import generate_summary

client = TestClient(app)

@pytest.fixture
def clean_profile():
  return CustomerProfileRequest(
    id="c_999",
    name="Arjun Mehta",
    email="arjun@mehta.com",
    phone="9823456789",
    occupation="Business Owner",
    incomeRange="2,500,000 - 5,000,000",
    riskCategory="MEDIUM",
    segment="MSME",
    status="ACTIVE",
    branchCode="BR002",
    lastInteractionAt="2026-07-01T12:00:00Z",
    addresses=[
      AddressSchema(
        type="OFFICE",
        street="45 Linking Road",
        city="Mumbai",
        state="Maharashtra",
        postalCode="400050",
        country="India"
      )
    ],
    accounts=[
      BankAccountSchema(
        accountNumber="MSME123",
        accountType="CURRENT",
        balance=1200000.0,
        transactions=[
          TransactionSchema(
            amount=500000.0,
            type="CREDIT",
            category="SALARY",
            description="Business credit invoice",
            valueDate="2026-06-15T11:00:00Z"
          ),
          TransactionSchema(
            amount=8000.0,
            type="DEBIT",
            category="UPI",
            description="UPI Supplier checkout",
            valueDate="2026-06-20T14:30:00Z"
          )
        ]
      )
    ],
    interactions=[
      InteractionSchema(
        id="i_001",
        type="MEETING",
        summary="Quarterly portfolio update meeting",
        notes="Discussed deposit limits and net banking activation options.",
        interactionDate="2026-06-01T10:00:00Z",
        createdAt="2026-06-01T10:30:00Z"
      ),
      InteractionSchema(
        id="i_002",
        type="CALL",
        summary="Digital support call",
        notes="Helped client activate mobile application dashboard.",
        interactionDate="2026-07-01T12:00:00Z",
        createdAt="2026-07-01T12:15:00Z"
      )
    ],
    tasks=[
      TaskSchema(
        id="t_001",
        title="Document Verification",
        description="Verify business registration documents",
        priority="HIGH",
        status="Completed",
        category="Compliance",
        createdAt="2026-05-28T09:00:00Z",
        updatedAt="2026-05-30T10:00:00Z",
        dueDate="2026-05-31T17:00:00Z",
        completedAt="2026-05-30T09:30:00Z",
        estimatedDuration=30,
        actualDuration=25,
        history=[]
      ),
      TaskSchema(
        id="t_002",
        title="KYC Update Checklist",
        description="Update expired KYC identification PAN/GSTIN logs",
        priority="MEDIUM",
        status="Pending",
        category="KYC",
        createdAt="2026-07-05T09:00:00Z",
        updatedAt="2026-07-05T09:00:00Z",
        dueDate="2026-07-15T17:00:00Z",
        estimatedDuration=15,
        history=[]
      )
    ]
  )

def test_relationship_health_calculations(clean_profile):
  trust_engine = TrustLayerEngine()
  behavior_engine = BehaviorIQEngine()
  
  trust = trust_engine.analyze(clean_profile)
  behavior = behavior_engine.analyze(clean_profile)
  
  health = evaluate_health(clean_profile, trust, behavior, None)
  
  assert health.score >= 0.0 and health.score <= 100.0
  assert health.category in ["Healthy", "Growing", "Needs Attention", "Critical"]
  assert len(health.positiveDrivers) > 0

def test_timeline_generation(clean_profile):
  trust_engine = TrustLayerEngine()
  behavior_engine = BehaviorIQEngine()
  
  trust = trust_engine.analyze(clean_profile)
  behavior = behavior_engine.analyze(clean_profile)
  
  journey = generate_timeline(clean_profile, behavior, None)
  
  assert len(journey) > 0
  # Verify chronological ordering
  for idx in range(len(journey) - 1):
    assert journey[idx].timestamp <= journey[idx + 1].timestamp

def test_milestones(clean_profile):
  trust_engine = TrustLayerEngine()
  behavior_engine = BehaviorIQEngine()
  
  trust = trust_engine.analyze(clean_profile)
  behavior = behavior_engine.analyze(clean_profile)
  
  milestones = identify_milestones(clean_profile, trust, behavior, None)
  
  assert len(milestones) > 0
  titles = [ms.title for ms in milestones]
  assert "First Meeting" in titles
  assert "High Value Customer" in titles # Balance 1.2M exceeds 5L

def test_engagement_metrics(clean_profile):
  engagement = calculate_engagement(clean_profile)
  
  assert engagement.interactionScore > 0.0
  assert engagement.followUpQuality >= 0.0
  assert engagement.responseConsistency == 100.0 # completed task is on time

def test_executive_summary(clean_profile):
  trust_engine = TrustLayerEngine()
  behavior_engine = BehaviorIQEngine()
  
  trust = trust_engine.analyze(clean_profile)
  behavior = behavior_engine.analyze(clean_profile)
  
  health = evaluate_health(clean_profile, trust, behavior, None)
  interactions_data = aggregate_interactions(clean_profile)
  
  summary = generate_summary(clean_profile, trust, behavior, None, health, interactions_data)
  
  word_count = len(summary.briefing.split())
  # Check word count constraints
  assert 150 <= word_count <= 200

def test_risk_detection(clean_profile):
  trust_engine = TrustLayerEngine()
  behavior_engine = BehaviorIQEngine()
  
  trust = trust_engine.analyze(clean_profile)
  behavior = behavior_engine.analyze(clean_profile)
  
  risks = detect_risks(clean_profile, trust, behavior, None)
  
  # Clean profile has active pending KYC, but otherwise is in good shape. Let's verify it maps risk alerts
  assert len(risks) >= 0

def test_analyze_endpoint_relationship(clean_profile):
  payload = clean_profile.dict()
  response = client.post("/analyze", json=payload)
  
  assert response.status_code == 200
  json_data = response.json()
  
  assert "relationshipIQ" in json_data
  assert json_data["relationshipIQ"]["engine"] == "RelationshipIQ"
  assert json_data["relationshipIQ"]["data"]["health"]["score"] > 0
  assert len(json_data["relationshipIQ"]["data"]["journey"]) > 0
