import pytest
import sys
import os
app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../app'))
sys.path.insert(0, app_path)
sys.path = [p for p in sys.path if p not in ['', os.path.abspath('.'), os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))]]

from schemas.analyze import CustomerProfileRequest, AddressSchema, BankAccountSchema, TransactionSchema
from engines.explainiq.engine import ExplainIQEngine
from engines.trustlayer.engine import TrustLayerEngine
from engines.behavioriq.engine import BehaviorIQEngine
from engines.findna.engine import FinDNAEngine
from engines.priorityiq.engine import PriorityIQEngine
from engines.copilot.engine import RMCopilotEngine
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture
def mock_profile():
  addr = AddressSchema(type="RESIDENTIAL", street="12 Elm St", city="Delhi", state="Delhi", postalCode="110001", country="India")
  
  tx = TransactionSchema(amount=10000.0, type="CREDIT", category="SALARY", description="Salary credits", valueDate="2026-07-01T10:00:00Z")
  acc = BankAccountSchema(accountNumber="SAV002", accountType="SAVINGS", balance=150000.0, transactions=[tx])
  
  return CustomerProfileRequest(
    id="cust_Delhi_9",
    name="Rohan Sharma",
    email="rohan@sharma.com",
    phone="9876543210",
    occupation="Software Engineer",
    incomeRange="1,000,000 - 2,500,000",
    riskCategory="LOW",
    segment="RETAIL",
    status="ACTIVE",
    branchCode="BR001",
    lastInteractionAt="2026-07-02T10:00:00Z",
    addresses=[addr],
    accounts=[acc]
  )

def test_explain_engine_coordination(mock_profile):
  trust_eng = TrustLayerEngine()
  beh_eng = BehaviorIQEngine()
  dna_eng = FinDNAEngine()
  priority_eng = PriorityIQEngine()
  copilot_eng = RMCopilotEngine()
  
  trust = trust_eng.analyze(mock_profile)
  behavior = beh_eng.analyze(mock_profile)
  dna = dna_eng.analyze(mock_profile, trust, behavior)
  priority = priority_eng.analyze(mock_profile, trust, behavior, dna)
  copilot = copilot_eng.analyze(mock_profile, trust, behavior, dna, priority)
  
  explain_engine = ExplainIQEngine()
  result = explain_engine.explain(mock_profile, trust, behavior, dna, priority, copilot)
  
  # Executive Explanation Assertions
  words = result.executiveExplanation.split()
  assert 120 <= len(words) <= 180
  
  # Explanations dict assertions
  assert "TrustLayer" in result.explanations
  assert "BehaviorIQ" in result.explanations
  assert "FinancialDNA" in result.explanations
  assert "PriorityIQ" in result.explanations
  assert "RMCopilot" in result.explanations
  
  # Decision Tree assertions
  assert len(result.decisionTree) == 7
  assert result.decisionTree[0].title == "Client Profile Loaded"
  assert result.decisionTree[1].title == "Trust Validation"
  
  # Evidence assertions
  assert len(result.evidenceMatrix) > 0
  assert result.evidenceMatrix[0].engine == "TrustLayer"
  
  # Confidence model assertions
  assert 0 <= result.confidenceModel.overallConfidence <= 100
  assert result.confidenceModel.dataCompleteness.score == 100.0
  
  # Timeline assertions
  assert len(result.reasoningTimeline) >= 5
  assert result.reasoningTimeline[0].stepName == "Client Profile Loaded"
  
  # Comparison assertions
  assert result.comparisonAnalysis.trustScore.status == "Stable"
  assert result.comparisonAnalysis.digitalAdoption.difference > 0
  
  # Audit assertions
  assert result.auditRecord.auditId.startswith("AUD-")
  assert len(result.auditRecord.sha256Digest) == 64
  
  # Rating assertions
  assert result.explainabilityRating.explainabilityScore == 98.50
  assert result.explainabilityRating.transparencyRating == "Excellent"

def test_api_explain_endpoint_integration(mock_profile):
  payload = mock_profile.model_dump()
  response = client.post("/analyze", json=payload)
  
  assert response.status_code == 200
  json_data = response.json()
  assert "explainIQ" in json_data
  assert json_data["explainIQ"]["engine"] == "ExplainIQ"
  assert "executiveExplanation" in json_data["explainIQ"]["data"]
  assert len(json_data["explainIQ"]["data"]["evidenceMatrix"]) > 0
