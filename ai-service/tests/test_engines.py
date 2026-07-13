import pytest
from fastapi.testclient import TestClient
import sys
import os

app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../app'))
sys.path.insert(0, app_path)
sys.path = [p for p in sys.path if p not in ['', os.path.abspath('.'), os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))]]

from main import app
from schemas.analyze import CustomerProfileRequest, AddressSchema, BankAccountSchema, TransactionSchema
from engines.trustlayer.engine import TrustLayerEngine
from engines.behavioriq.engine import BehaviorIQEngine
from engines.findna.engine import FinDNAEngine
from engines.priorityiq.engine import PriorityIQEngine
from engines.copilot.engine import RMCopilotEngine
from services.orchestrator import AIOrchestrator

client = TestClient(app)

@pytest.fixture
def clean_profile():
  return CustomerProfileRequest(
    id="c_123",
    name="Ravi Sen",
    email="ravi@sen.com",
    phone="9876543210",
    occupation="Architect",
    incomeRange="1,000,000 - 2,500,000",
    riskCategory="LOW",
    segment="RETAIL",
    status="ACTIVE",
    branchCode="BR001",
    addresses=[
      AddressSchema(
        type="RESIDENTIAL",
        street="12 MG Road",
        city="Mumbai",
        state="Maharashtra",
        postalCode="400001",
        country="India"
      )
    ],
    accounts=[
      BankAccountSchema(
        accountNumber="SAV123",
        accountType="SAVINGS",
        balance=45000.0,
        transactions=[
          TransactionSchema(
            amount=50000.0,
            type="CREDIT",
            category="SALARY",
            description="Salary Credit June",
            valueDate="2026-06-30T10:00:00Z"
          ),
          TransactionSchema(
            amount=4000.0,
            type="DEBIT",
            category="UPI",
            description="Merchant UPI spend",
            valueDate="2026-07-01T15:30:00Z"
          ),
          TransactionSchema(
            amount=1500.0,
            type="DEBIT",
            category="CASH",
            description="Cash Withdrawal ATM",
            valueDate="2026-07-02T18:00:00Z"
          )
        ]
      )
    ]
  )

def test_trust_layer_clean_data(clean_profile):
  engine = TrustLayerEngine()
  result = engine.analyze(clean_profile)
  expect_score = 100.0
  assert result.qualityScore == expect_score
  assert result.confidence == "HIGH"
  assert len(result.warnings) == 0
  assert len(result.errors) == 0

def test_trust_layer_warnings_and_errors(clean_profile):
  # Modify profile to trigger warnings/errors
  clean_profile.phone = "" # Warning: Missing phone
  clean_profile.accounts[0].balance = -500.0 # Warning: Negative balance
  clean_profile.segment = "INVALID" # Error: Invalid segment
  
  engine = TrustLayerEngine()
  result = engine.analyze(clean_profile)
  
  assert result.qualityScore < 80.0
  assert "unverified" in "".join(result.warnings).lower()
  assert "negative balance" in "".join(result.warnings).lower()
  assert "invalid business segment" in "".join(result.errors).lower()

def test_behavior_iq_metrics(clean_profile):
  engine = BehaviorIQEngine()
  result = engine.analyze(clean_profile)
  
  # Credits: 50,000, Debits: 4,000 (UPI) + 1,500 (CASH) = 5,500
  assert result.income.totalCredits == 50000.0
  assert result.income.salaryDetected is True
  assert result.expenses.totalDebits == 5500.0
  
  # UPI debits: 4000 / 5500 * 100 = 72.73%
  assert result.expenses.digitalPaymentRatio == 72.73
  # Cash debits: 1500 / 5500 * 100 = 27.27%
  assert result.expenses.cashDependencyRatio == 27.27
  
  # Net: 50,000 - 5,500 = 44,500. Ratio: 44,500 / 50,000 * 100 = 89.00%
  assert result.savings.savingsRatio == 89.00
  assert result.savings.totalSavings == 45000.0

def test_financial_dna_calculations(clean_profile):
  trust_engine = TrustLayerEngine()
  behavior_engine = BehaviorIQEngine()
  findna_engine = FinDNAEngine()

  trust = trust_engine.analyze(clean_profile)
  behavior = behavior_engine.analyze(clean_profile)
  dna = findna_engine.analyze(clean_profile, trust, behavior)

  assert dna.modelVersion == "v1.0.0"
  assert dna.profileVersion == "v1.0.0"
  assert dna.persona.name == "Conservative Saver" # Expense discipline score 89.05 >= 75
  assert len(dna.persona.strengths) > 0
  assert len(dna.persona.watchAreas) > 0
  assert len(dna.persona.bankingFocusAreas) > 0
  
  # Income Stability: (occ_weight 0.5 * 100 * 0.5) + (salary 100 * 0.3) + (bracket 75 * 0.2) = 25 + 30 + 15 = 70.0
  assert dna.incomeStability.score == 70.0
  assert dna.incomeStability.confidence == "HIGH"
  assert len(dna.incomeStability.factors) > 0

  # Test MSME segment classification
  clean_profile.segment = "MSME"
  dna_msme = findna_engine.analyze(clean_profile, trust, behavior)
  assert dna_msme.persona.name == "High Potential MSME"

def test_priority_iq_calculations(clean_profile):
  trust_engine = TrustLayerEngine()
  behavior_engine = BehaviorIQEngine()
  findna_engine = FinDNAEngine()
  priority_engine = PriorityIQEngine()

  trust = trust_engine.analyze(clean_profile)
  behavior = behavior_engine.analyze(clean_profile)
  dna = findna_engine.analyze(clean_profile, trust, behavior)
  priority = priority_engine.analyze(clean_profile, trust, behavior, dna)

  assert priority.opportunity.score > 0
  assert priority.engagement.score > 0
  assert priority.growthPotential.score > 0
  assert priority.retentionRisk.score == 10.0 # clean profile starts stable (10.0)
  assert priority.urgency.score > 0
  assert priority.finalPriority.score > 0

  # Opportunity Matrix category assertions
  assert priority.opportunityMatrix.category in ["Immediate Action", "High Potential", "Nurture", "Monitor", "Low Priority"]
  assert priority.opportunityMatrix.priorityRank in [1, 2, 3, 4, 5]
  assert priority.opportunityMatrix.sla in ["24 Hours", "48 Hours", "7 Days", "30 Days", "Quarterly"]
  assert priority.opportunityMatrix.actionType in [
    "Schedule RM Meeting", "Call Customer", "Personalized Follow-up", "Quarterly Review", "Passive Monitoring"
  ]
  assert len(priority.opportunityDrivers) > 0

def test_copilot_calculations(clean_profile):
  trust_engine = TrustLayerEngine()
  behavior_engine = BehaviorIQEngine()
  findna_engine = FinDNAEngine()
  priority_engine = PriorityIQEngine()
  copilot_engine = RMCopilotEngine()

  trust = trust_engine.analyze(clean_profile)
  behavior = behavior_engine.analyze(clean_profile)
  dna = findna_engine.analyze(clean_profile, trust, behavior)
  priority = priority_engine.analyze(clean_profile, trust, behavior, dna)
  copilot = copilot_engine.analyze(clean_profile, trust, behavior, dna, priority)

  # Check executive summary word count bounds [120, 180]
  word_count = len(copilot["executiveSummary"].split())
  assert 120 <= word_count <= 180

  # Check snapshot
  assert copilot["snapshot"]["persona"] == "Conservative Saver"
  assert copilot["snapshot"]["priorityCategory"] == "Nurture"
  assert copilot["snapshot"]["confidence"] == "HIGH"

  # Check strengths, watches, opportunities
  assert len(copilot["strengths"]) >= 2
  assert len(copilot["watchAreas"]) >= 2
  assert len(copilot["growthOpportunities"]) >= 2

  # Check conversation starters count [5, 8]
  assert 5 <= len(copilot["conversationStarters"]) <= 8

  # Check timeline structure
  assert len(copilot["timeline"]) > 0
  assert copilot["timeline"][0]["time"] == "Today"

  # Check next best action
  assert copilot["nextBestAction"]["title"] == "Personalized Follow-up"
  assert copilot["nextBestAction"]["timeline"] == "7 Days"

def test_analyze_endpoint(clean_profile):
  payload = clean_profile.dict()
  response = client.post("/analyze", json=payload)
  
  assert response.status_code == 200
  json_data = response.json()
  
  assert "trustLayer" in json_data
  assert "behaviorIQ" in json_data
  assert "financialDNA" in json_data
  assert "priorityIQ" in json_data
  assert "copilot" in json_data
  
  assert json_data["trustLayer"]["engine"] == "TrustLayer"
  assert json_data["trustLayer"]["data"]["qualityScore"] == 100.0
  assert json_data["behaviorIQ"]["data"]["income"]["salaryDetected"] is True
  assert json_data["financialDNA"]["data"]["persona"]["name"] == "Conservative Saver"
  assert json_data["priorityIQ"]["data"]["opportunityMatrix"]["category"] == "Nurture"
  assert json_data["copilot"]["data"]["snapshot"]["persona"] == "Conservative Saver"
