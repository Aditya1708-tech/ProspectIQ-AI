import pytest
import sys
import os
from fastapi.testclient import TestClient

app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../app'))
sys.path.insert(0, app_path)
sys.path = [p for p in sys.path if p not in ['', os.path.abspath('.'), os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))]]

from main import app
from schemas.platform import PlatformIQProfile
from engines.platformiq.engine import PlatformIQEngine

client = TestClient(app)

def test_platformiq_engine_aggregation():
  engine = PlatformIQEngine()
  profile = engine.analyze()

  assert profile is not None
  assert profile.confidence == "HIGH"

  # System health summary totals
  summary = profile.platformSummary
  assert summary.totalUsers == 145
  assert summary.branches == 8
  assert summary.customers == 12500
  assert summary.backendStatus == "HEALTHY"
  assert summary.aiStatus == "HEALTHY"

  # 12 AI Engine Monitors
  healths = profile.engineHealths
  assert len(healths) == 12
  engine_names = [e.engineName for e in healths]
  assert "TrustLayer" in engine_names
  assert "BehaviorIQ" in engine_names
  assert "FinDNA" in engine_names
  assert "PriorityIQ" in engine_names
  assert "RMCopilot" in engine_names
  assert "PortfolioIQ" in engine_names
  assert "ExplainIQ" in engine_names
  assert "NBAIQ" in engine_names
  assert "RelationshipIQ" in engine_names
  assert "PredictIQ" in engine_names
  assert "SimulationIQ" in engine_names
  assert "PlatformIQ" in engine_names

  for h in healths:
    assert h.status == "HEALTHY"
    assert h.successRate == 100.0

  # Performance dashboard
  perf = profile.performance
  assert perf.averageApiLatencyMs == 42.5
  assert perf.p95LatencyMs == 85.0
  assert perf.cpuUsagePct == 14.2
  assert len(perf.hourlyRequestTrend) == 12

  # Security center
  sec = profile.security
  assert sec.failedLoginAttempts == 4
  assert sec.accountLockouts == 0
  assert sec.securityHealthScore == 98.0

  # Audit center
  audit = profile.auditLogs
  assert len(audit) == 5
  assert audit[0].user == "admin_sharma"
  assert audit[1].action == "RUN_SIMULATION"

  # Configuration panel
  config = profile.configuration
  assert config.aiConfidenceThreshold == 80.0
  assert config.theme == "DARK_GLASSMORPHISM"
  assert config.featureFlags["enablePredictIQ"] is True

  # Branch overview
  branches = profile.branches
  assert len(branches) == 4
  assert branches[0].branchName == "BR001 - Main Corporate Branch"
  assert branches[2].performanceRating == "Needs Attention"

  # User management
  users = profile.users
  assert len(users) == 5
  assert users[0].username == "rm_sharma"
  assert users[3].role == "ADMIN"

  # Notifications
  notifications = profile.notifications
  assert len(notifications) == 6
  assert notifications[0].id == "not-1"

  # Word count verification: strictly 200 to 250 words
  briefing = profile.summary
  word_count = len(briefing.briefing.split())
  assert 200 <= word_count <= 250, f"Summary briefing is {word_count} words; must be strictly 200-250."

  # Compliance: Never recommend banking products
  product_keywords = ["loan", "credit card", "mortgage", "savings account", "current account", "fixed deposit", "mutual fund"]
  for kw in product_keywords:
    assert kw not in briefing.briefing.lower(), f"Summary briefing mentions banking product: {kw}"

def test_api_admin_dashboard_endpoint():
  response = client.get("/admin/dashboard")
  assert response.status_code == 200
  data = response.json()
  assert "platformSummary" in data
  assert data["platformSummary"]["totalUsers"] == 145
  assert "engineHealths" in data
  assert len(data["engineHealths"]) == 12
  assert "summary" in data
  assert data["summary"]["platformStatus"] == "HEALTHY"
