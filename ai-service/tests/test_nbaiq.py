import pytest
import sys
import os
import datetime

app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../app'))
sys.path.insert(0, app_path)
sys.path = [p for p in sys.path if p not in ['', os.path.abspath('.'), os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))]]

from schemas.analyze import (
  CustomerProfileRequest, AddressSchema, BankAccountSchema, TransactionSchema,
  TrustLayerData, BehaviorIQData, FinancialDNAProfile, DimensionDetail,
  FinancialPersona, PriorityIQProfile, ScoreDetail, OpportunityMatrix
)
from engines.nbaiq.engine import NBAIQEngine
from engines.nbaiq.actions import select_actions
from engines.nbaiq.workflows import generate_workflows
from engines.nbaiq.scheduler import generate_schedule
from engines.nbaiq.confidence import calculate_confidence_details

@pytest.fixture
def sample_inputs():
  profile = CustomerProfileRequest(
    id="c_test_999",
    name="Ajay Kumar",
    email="ajay@kumar.com",
    phone="9988776655",
    occupation="Retail Merchant",
    incomeRange="500,000 - 1,000,000",
    riskCategory="MEDIUM",
    segment="RETAIL",
    status="ACTIVE",
    branchCode="BR100",
    addresses=[
      AddressSchema(
        type="RESIDENTIAL",
        street="45 Central Street",
        city="Pune",
        state="Maharashtra",
        postalCode="411001",
        country="India"
      )
    ],
    accounts=[
      BankAccountSchema(
        accountNumber="ACC_999",
        accountType="SAVINGS",
        balance=75000.0,
        transactions=[]
      )
    ]
  )
  
  trust = TrustLayerData(
    qualityScore=100.0,
    confidence="HIGH",
    warnings=[],
    errors=[]
  )
  
  behavior = BehaviorIQData(
    income={
      "totalCredits": 50000.0,
      "monthlyEstimate": 25000.0,
      "salaryDetected": True,
      "salaryDetails": "Direct deposit active."
    },
    expenses={
      "totalDebits": 40000.0,
      "spendingCategories": {"UPI": 20000.0, "CASH": 20000.0},
      "cashDependencyRatio": 50.0,
      "digitalPaymentRatio": 50.0
    },
    savings={
      "totalSavings": 75000.0,
      "savingsRatio": 20.0
    },
    transactions={
      "totalCount": 10,
      "frequencyPerMonth": 5.0
    }
  )
  
  dna = FinancialDNAProfile(
    modelVersion="v1.0.0",
    profileVersion="v1.0.0",
    persona=FinancialPersona(
      name="Growth Builder",
      description="Retail client.",
      strengths=["Stable credits"],
      watchAreas=["Cash leakage"],
      bankingFocusAreas=["sweeps"]
    ),
    incomeStability=DimensionDetail(score=80.0, confidence="HIGH", factors=[]),
    expenseDiscipline=DimensionDetail(score=70.0, confidence="HIGH", factors=[]),
    savingsHealth=DimensionDetail(score=60.0, confidence="HIGH", factors=[]),
    liquidityStrength=DimensionDetail(score=75.0, confidence="HIGH", factors=[]),
    digitalAdoption=DimensionDetail(score=50.0, confidence="HIGH", factors=[]),
    creditHealth=DimensionDetail(score=85.0, confidence="HIGH", factors=[]),
    investmentReadiness=DimensionDetail(score=65.0, confidence="HIGH", factors=[]),
    wealthPotential=DimensionDetail(score=70.0, confidence="HIGH", factors=[])
  )
  
  priority = PriorityIQProfile(
    opportunity=ScoreDetail(score=60.0, confidence="HIGH", drivers=[]),
    engagement=ScoreDetail(score=50.0, confidence="HIGH", drivers=[]),
    growthPotential=ScoreDetail(score=70.0, confidence="HIGH", drivers=[]),
    retentionRisk=ScoreDetail(score=20.0, confidence="HIGH", drivers=[]),
    urgency=ScoreDetail(score=40.0, confidence="HIGH", drivers=[]),
    finalPriority=ScoreDetail(score=55.0, confidence="HIGH", drivers=[]),
    opportunityMatrix=OpportunityMatrix(
      category="Nurture",
      priorityRank=3,
      sla="7 Days",
      color="blue",
      actionType="Personalized Follow-up"
    ),
    opportunityDrivers=[]
  )
  
  return profile, trust, behavior, dna, priority

def test_engine_deterministic_workflow(sample_inputs):
  profile, trust, behavior, dna, priority = sample_inputs
  engine = NBAIQEngine()
  result = engine.analyze(profile, trust, behavior, dna, priority)
  
  assert result.overallRecommendation is not None
  assert result.primaryAction.title in ["Call Customer", "Quarterly Touchpoint", "Digital Engagement Follow-up", "Savings Trend Discussion"]
  assert result.confidence.overallScore > 0.0
  assert result.primaryAction.sla == "3 Days"
  assert len(result.checklist) > 0

def test_kyc_rule_trigger(sample_inputs):
  profile, trust, behavior, dna, priority = sample_inputs
  trust.warnings = ["Missing verified KYC document record."]
  
  actions = select_actions(profile, trust, behavior, dna, priority)
  assert "KYC Update Reminder" in actions
  
  engine = NBAIQEngine()
  result = engine.analyze(profile, trust, behavior, dna, priority)
  assert result.primaryAction.title == "KYC Update Reminder"

def test_scheduler_windows(sample_inputs):
  profile, trust, behavior, dna, priority = sample_inputs
  priority.finalPriority.score = 90.0
  
  engine = NBAIQEngine()
  result = engine.analyze(profile, trust, behavior, dna, priority)
  assert result.primaryAction.sla == "24 Hours"
  assert "Within 24 Hours" in result.schedule
