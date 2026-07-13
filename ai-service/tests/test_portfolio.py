import pytest
import sys
import os

app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../app'))
sys.path.insert(0, app_path)
sys.path = [p for p in sys.path if p not in ['', os.path.abspath('.'), os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))]]

from schemas.analyze import CustomerProfileRequest, AddressSchema, BankAccountSchema, TransactionSchema
from schemas.portfolio import PortfolioAnalyzeRequest
from engines.portfolioiq.engine import PortfolioIQEngine

@pytest.fixture
def mock_profiles():
  # Create a collection of diverse mock profiles to test aggregations
  p1 = CustomerProfileRequest(
    id="cust_1",
    name="Aarav Mehta",
    email="aarav@mehta.com",
    phone="9876543211",
    occupation="Consultant",
    incomeRange="1,000,000 - 2,500,000",
    riskCategory="LOW",
    segment="MSME",
    status="ACTIVE",
    branchCode="BR001",
    addresses=[],
    accounts=[
      BankAccountSchema(
        accountNumber="ACC1",
        accountType="CURRENT",
        balance=150000.0,
        transactions=[
          TransactionSchema(
            amount=60000.0,
            type="CREDIT",
            category="REVENUE",
            description="Invoice credit",
            valueDate="2026-06-30T10:00:00Z"
          )
        ]
      )
    ]
  )
  
  p2 = CustomerProfileRequest(
    id="cust_2",
    name="Meera Sen",
    email="", # Missing KYC parameter to trigger risk alerts
    phone="9876543212",
    occupation="Architect",
    incomeRange="2,500,000 - 5,000,000",
    riskCategory="MEDIUM",
    segment="RETAIL",
    status="DORMANT", # Dormant to trigger status alert
    branchCode="BR001",
    addresses=[],
    accounts=[
      BankAccountSchema(
        accountNumber="ACC2",
        accountType="SAVINGS",
        balance=5000.0, # Low balance to trigger savings alert
        transactions=[
          TransactionSchema(
            amount=2000.0,
            type="DEBIT",
            category="UPI",
            description="spend",
            valueDate="2026-07-01T15:30:00Z"
          )
        ]
      )
    ]
  )
  
  return [p1, p2]

def test_portfolio_engine_aggregations(mock_profiles):
  engine = PortfolioIQEngine()
  result = engine.analyze(mock_profiles)
  
  # Summary Assertions
  assert result.summary.totalCustomers == 2
  assert result.summary.retailCustomers == 1
  assert result.summary.msmeCustomers == 1
  assert result.summary.prospectsCount == 0
  assert result.summary.dormantCount == 1
  assert result.summary.activeCount == 1
  
  # Averages
  assert result.summary.averageTrustScore > 0
  assert result.summary.averagePortfolioHealth > 0
  
  # Health assertions
  assert result.health.overallHealthScore > 0
  assert result.health.healthCategory in ["Healthy", "Stable", "Needs Attention", "Critical"]
  assert len(result.health.topPositiveDrivers) >= 2
  assert len(result.health.topNegativeDrivers) >= 2
  
  # Executive briefing assertions
  word_count = len(result.executiveSummary.split())
  assert 150 <= word_count <= 200
  assert "branch" in result.executiveSummary.lower()

  # Opportunities ranking assertions
  assert len(result.topOpportunities) == 2
  assert result.topOpportunities[0].customerId in ["cust_1", "cust_2"]

  # Risk alerts assertions
  assert len(result.riskIntelligence) > 0
  # Cust_2 should have a missing contact parameter (email) alert
  missing_email_alerts = [a for a in result.riskIntelligence if "contact parameters" in a.reason]
  assert len(missing_email_alerts) > 0
  assert missing_email_alerts[0].affectedCustomer == "Meera Sen"
  assert missing_email_alerts[0].severity == "MEDIUM"

  # Leaderboard assertions
  assert len(result.rmLeaderboard) > 0
  
  # Trends assertions
  assert len(result.trends) == 6
  assert result.trends[0].month == "Jan"
  assert result.trends[5].month == "Jun"

  # Distributions assertions
  assert result.distributions.segments["MSME"] == 1
  assert result.distributions.segments["RETAIL"] == 1

  # Morning Brief assertions
  mb_words = len(result.morningBrief.split())
  assert 120 <= mb_words <= 150
  assert "good morning" in result.morningBrief.lower()

  # Action Center assertions
  assert len(result.actionCenter) > 0
  assert result.actionCenter[0].priority in ["Immediate Action", "High Potential", "Nurture"]
  assert result.actionCenter[0].recommendedAction is not None

  # Early Warning assertions
  assert len(result.earlyWarnings) > 0
  assert result.earlyWarnings[0].warningLevel in ["Red", "Orange", "Yellow"]
  assert result.earlyWarnings[0].expectedBusinessImpact is not None

  # Workload Balancer assertions
  assert len(result.workloadBalancer) > 0
  assert result.workloadBalancer[0].rmName in ["RM Priya", "RM Anil", "RM Sunita"]
  assert result.workloadBalancer[0].utilizationPercentage > 0

