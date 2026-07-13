import pytest
from fastapi.testclient import TestClient
import sys
import os

app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../app'))
sys.path.insert(0, app_path)

from main import app
from schemas.analyze import CustomerProfileRequest, AddressSchema, BankAccountSchema, TransactionSchema, TaskSchema
from engines.notificationiq.engine import NotificationIQEngine

client = TestClient(app)

@pytest.fixture
def test_profile():
  return CustomerProfileRequest(
    id="c_test_notif",
    name="Arjun Sharma",
    email="arjun@sharma.com",
    phone="9876543211",
    occupation="Business Analyst",
    incomeRange="1,000,000 - 2,500,000",
    riskCategory="HIGH",
    segment="MSME",
    status="ACTIVE",
    branchCode="BR001",
    addresses=[
      AddressSchema(
        type="RESIDENTIAL",
        street="Flat 101, Main Road",
        city="Pune",
        state="Maharashtra",
        postalCode="411001",
        country="India"
      )
    ],
    accounts=[
      BankAccountSchema(
        accountNumber="MSME987",
        accountType="SAVINGS",
        balance=25000.0,
        transactions=[]
      )
    ]
  )

@pytest.fixture
def test_tasks():
  return [
    TaskSchema(
      id="task_due_today",
      title="Verify Business Registration",
      description="Validate MSME registration document upload status.",
      priority="HIGH",
      status="Pending",
      category="Compliance",
      createdAt="2026-07-11T09:00:00Z",
      updatedAt="2026-07-11T09:00:00Z",
      dueDate="2026-07-11T18:00:00Z"
    ),
    TaskSchema(
      id="task_overdue",
      title="Quarterly Relationship Call",
      description="Connect with client to verify profile data integrity.",
      priority="MEDIUM",
      status="In Progress",
      category="Relationship",
      createdAt="2026-07-01T09:00:00Z",
      updatedAt="2026-07-01T09:00:00Z",
      dueDate="2026-07-05T18:00:00Z"
    )
  ]

def test_notificationiq_engine_analysis(test_profile, test_tasks):
  engine = NotificationIQEngine()
  result = engine.analyze([test_profile], test_tasks, "rm_patel", "RM")
  
  assert result is not None
  assert len(result.notifications) > 0
  
  # Check briefs
  assert len(result.morningBrief) >= 100
  assert len(result.executiveBrief) >= 100
  
  # Check analytics
  assert result.analytics.unreadNotifications > 0
  assert result.analytics.averageResponseTime == 2.4
  
  # Check timeline
  assert len(result.timeline) > 0
  assert any(t.type == "TASK" for t in result.timeline)

def test_api_endpoint(test_profile, test_tasks):
  payload = {
    "profiles": [test_profile.model_dump() if hasattr(test_profile, "model_dump") else test_profile.dict()],
    "tasks": [t.model_dump() if hasattr(t, "model_dump") else t.dict() for t in test_tasks],
    "userId": "rm_patel",
    "userRole": "RM"
  }
  
  response = client.post("/notificationiq/analyze", json=payload)
  assert response.status_code == 200
  data = response.json()
  
  assert "notifications" in data
  assert "morningBrief" in data
  assert "executiveBrief" in data
  assert "timeline" in data
  assert "analytics" in data
