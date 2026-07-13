import time
import datetime
from typing import List
from schemas.analyze import CustomerProfileRequest
from schemas.portfolio import PortfolioIQResponse
from engines.trustlayer.engine import TrustLayerEngine
from engines.behavioriq.engine import BehaviorIQEngine
from engines.findna.engine import FinDNAEngine
from engines.priorityiq.engine import PriorityIQEngine
from engines.portfolioiq.metrics import PortfolioMetricsCalculator
from engines.portfolioiq.health import PortfolioHealthEvaluator
from engines.portfolioiq.executive import PortfolioExecutiveGenerator
from engines.portfolioiq.ranking import PortfolioOpportunityRanker
from engines.portfolioiq.alerts import PortfolioAlertsDetector
from engines.portfolioiq.aggregation import PortfolioAggregator
from engines.portfolioiq.morning_brief import PortfolioMorningBriefGenerator
from engines.portfolioiq.action_center import PortfolioActionCenterEngine
from engines.portfolioiq.early_warning import PortfolioEarlyWarningEngine
from engines.portfolioiq.workload import PortfolioWorkloadBalancer

class PortfolioIQEngine:
  def __init__(self):
    self.trust_engine = TrustLayerEngine()
    self.behavior_engine = BehaviorIQEngine()
    self.findna_engine = FinDNAEngine()
    self.priority_engine = PriorityIQEngine()
    
    self.metrics_calc = PortfolioMetricsCalculator()
    self.health_eval = PortfolioHealthEvaluator()
    self.exec_gen = PortfolioExecutiveGenerator()
    self.ranker = PortfolioOpportunityRanker()
    self.alerts_det = PortfolioAlertsDetector()
    self.aggregator = PortfolioAggregator()
    
    self.morning_brief_gen = PortfolioMorningBriefGenerator()
    self.action_center_eng = PortfolioActionCenterEngine()
    self.early_warning_eng = PortfolioEarlyWarningEngine()
    self.workload_bal = PortfolioWorkloadBalancer()

  def name(self) -> str:
    return "PortfolioIQ"

  def analyze(self, profiles: List[CustomerProfileRequest]) -> PortfolioIQResponse:
    start_time = time.perf_counter()
    now_str = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")

    # 1. Run single customer analyses sequentially on the list in memory
    individual_analyses = []
    for p in profiles:
      # Run sequential uvicorn engines
      trust = self.trust_engine.analyze(p)
      behavior = self.behavior_engine.analyze(p)
      dna = self.findna_engine.analyze(p, trust, behavior)
      priority = self.priority_engine.analyze(p, trust, behavior, dna)
      
      # Package into raw dict matching Express API client expectations
      individual_analyses.append({
        "trustLayer": {
          "data": {
            "qualityScore": trust.qualityScore,
            "confidence": trust.confidence,
            "warnings": trust.warnings,
            "errors": trust.errors
          }
        },
        "behaviorIQ": {
          "data": {
            "income": {
              "totalCredits": behavior.income.totalCredits,
              "monthlyEstimate": behavior.income.monthlyEstimate,
              "salaryDetected": behavior.income.salaryDetected,
              "salaryDetails": behavior.income.salaryDetails
            },
            "expenses": {
              "totalDebits": behavior.expenses.totalDebits,
              "spendingCategories": behavior.expenses.spendingCategories,
              "cashDependencyRatio": behavior.expenses.cashDependencyRatio,
              "digitalPaymentRatio": behavior.expenses.digitalPaymentRatio
            },
            "savings": {
              "totalSavings": behavior.savings.totalSavings,
              "savingsRatio": behavior.savings.savingsRatio
            },
            "transactions": {
              "totalCount": behavior.transactions.totalCount,
              "frequencyPerMonth": behavior.transactions.frequencyPerMonth
            }
          }
        } if behavior else None,
        "financialDNA": {
          "data": {
            "persona": {
              "name": dna.persona.name,
              "description": dna.persona.description,
              "strengths": dna.persona.strengths,
              "watchAreas": dna.persona.watchAreas,
              "bankingFocusAreas": dna.persona.bankingFocusAreas
            },
            "incomeStability": {"score": dna.incomeStability.score},
            "expenseDiscipline": {"score": dna.expenseDiscipline.score},
            "savingsHealth": {"score": dna.savingsHealth.score},
            "liquidityStrength": {"score": dna.liquidityStrength.score},
            "digitalAdoption": {"score": dna.digitalAdoption.score},
            "creditHealth": {"score": dna.creditHealth.score},
            "investmentReadiness": {"score": dna.investmentReadiness.score},
            "wealthPotential": {"score": dna.wealthPotential.score}
          }
        } if dna else None,
        "priorityIQ": {
          "data": {
            "opportunity": {"score": priority.opportunity.score},
            "engagement": {"score": priority.engagement.score},
            "growthPotential": {"score": priority.growthPotential.score},
            "retentionRisk": {"score": priority.retentionRisk.score},
            "urgency": {"score": priority.urgency.score},
            "finalPriority": {"score": priority.finalPriority.score},
            "opportunityMatrix": {
              "category": priority.opportunityMatrix.category,
              "priorityRank": priority.opportunityMatrix.priorityRank,
              "sla": priority.opportunityMatrix.sla,
              "color": priority.opportunityMatrix.color,
              "actionType": priority.opportunityMatrix.actionType
            },
            "opportunityDrivers": priority.opportunityDrivers
          }
        } if priority else None
      })

    # 2. Run Portfolio Metrics calculations
    summary = self.metrics_calc.calculate_summary(profiles, individual_analyses)

    # 3. Health evaluation
    health = self.health_eval.evaluate_health(summary)

    # 4. Executive Briefing
    exec_summary = self.exec_gen.generate_briefing(summary, health)

    # 5. Distributions & Ranks
    priority_dist = self.aggregator.aggregate_priority_distribution(individual_analyses)
    top_opps = self.ranker.rank_opportunities(profiles, individual_analyses)
    risk_intel = self.alerts_det.detect_alerts(profiles, individual_analyses)
    leaderboard = self.aggregator.aggregate_rm_leaderboard(profiles, individual_analyses)
    trends = self.aggregator.generate_trends()
    distributions = self.aggregator.generate_distributions(profiles, individual_analyses)
    
    # 6. Morning Brief & Action Center & Warnings Extensions
    immediate_count = priority_dist.immediateAction.count
    morning_brief = self.morning_brief_gen.generate_brief(summary, health, immediate_count)
    action_center = self.action_center_eng.generate_actions(profiles, individual_analyses)
    early_warnings = self.early_warning_eng.detect_warnings(profiles, individual_analyses)
    workload_balancer = self.workload_bal.calculate_workload(profiles, individual_analyses)

    elapsed = (time.perf_counter() - start_time) * 1000.0

    return PortfolioIQResponse(
      generatedAt=now_str,
      executionTimeMs=round(elapsed, 2),
      summary=summary,
      health=health,
      executiveSummary=exec_summary,
      morningBrief=morning_brief,
      priorityDistribution=priority_dist,
      topOpportunities=top_opps,
      riskIntelligence=risk_intel,
      rmLeaderboard=leaderboard,
      trends=trends,
      distributions=distributions,
      actionCenter=action_center,
      earlyWarnings=early_warnings,
      workloadBalancer=workload_balancer
    )
