from fastapi import APIRouter, Request, Header
from typing import Optional
from schemas.analyze import CustomerProfileRequest, AnalyzeResponse
from schemas.portfolio import PortfolioAnalyzeRequest, PortfolioIQResponse
from schemas.simulation import SimulationScenario, SimulationIQProfile
from schemas.notification import NotificationIQRequest, NotificationIQProfile
from pydantic import BaseModel
from services.orchestrator import AIOrchestrator
from engines.portfolioiq.engine import PortfolioIQEngine
from engines.notificationiq.engine import NotificationIQEngine

router = APIRouter()
orchestrator = AIOrchestrator()
portfolio_engine = PortfolioIQEngine()
notification_engine = NotificationIQEngine()

class SimulationRunRequest(BaseModel):
  profile: CustomerProfileRequest
  scenario: SimulationScenario

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(profile: CustomerProfileRequest, request: Request, x_request_id: Optional[str] = Header(None)):
  # Use request ID from header or generate a fallback
  trace_id = x_request_id or request.headers.get("x-request-id")
  return orchestrator.run_analysis(profile, request_id=trace_id)

@router.post("/simulate", response_model=SimulationIQProfile)
async def simulate(req: SimulationRunRequest):
  trust_data = orchestrator.trust_engine.analyze(req.profile)
  behavior_data = orchestrator.behavior_engine.analyze(req.profile) if trust_data.qualityScore > 0 else None
  dna_data = orchestrator.findna_engine.analyze(req.profile, trust_data, behavior_data) if behavior_data else None
  priority_data = orchestrator.priority_engine.analyze(req.profile, trust_data, behavior_data, dna_data) if dna_data else None
  copilot_data = orchestrator.copilot_engine.analyze(req.profile, trust_data, behavior_data, dna_data, priority_data) if priority_data else None
  nbaiq_data = orchestrator.nbaiq_engine.analyze(req.profile, trust_data, behavior_data, dna_data, priority_data, copilot_data) if copilot_data else None
  relationship_data = orchestrator.relationship_engine.analyze(req.profile, trust_data, behavior_data, dna_data, priority_data, copilot_data, nbaiq_data) if nbaiq_data else None
  predict_data = orchestrator.predict_engine.analyze(req.profile, trust_data, behavior_data, dna_data, priority_data, copilot_data, nbaiq_data, relationship_data) if relationship_data else None
  
  return orchestrator.simulation_engine.analyze(
    req.profile, trust_data, behavior_data, relationship_data, predict_data, req.scenario
  )

@router.post("/portfolio/analyze", response_model=PortfolioIQResponse)
async def analyze_portfolio(req: PortfolioAnalyzeRequest):
  return portfolio_engine.analyze(req.profiles)

from schemas.platform import PlatformIQProfile
from engines.platformiq.engine import PlatformIQEngine
platform_admin_engine = PlatformIQEngine()

@router.get("/admin/dashboard", response_model=PlatformIQProfile)
async def get_admin_dashboard():
  return platform_admin_engine.analyze()

@router.post("/notificationiq/analyze", response_model=NotificationIQProfile)
async def analyze_notifications(req: NotificationIQRequest):
  return notification_engine.analyze(req.profiles, req.tasks, req.userId, req.userRole)


