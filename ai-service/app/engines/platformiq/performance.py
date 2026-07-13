from schemas.platform import PerformanceMetrics

def get_performance_metrics() -> PerformanceMetrics:
  return PerformanceMetrics(
    averageApiLatencyMs=42.5,
    p95LatencyMs=85.0,
    maxLatencyMs=250.0,
    engineProcessingTimes={
      "TrustLayer": 0.08,
      "BehaviorIQ": 0.12,
      "FinDNA": 0.20,
      "PriorityIQ": 0.10,
      "RMCopilot": 0.14,
      "PortfolioIQ": 1.85,
      "ExplainIQ": 0.15,
      "NBAIQ": 0.13,
      "RelationshipIQ": 0.25,
      "PredictIQ": 0.75,
      "SimulationIQ": 1.50,
      "PlatformIQ": 2.25
    },
    memoryUsageMb=248.5,
    cpuUsagePct=14.2,
    databaseQueryTimeMs=3.85,
    dailyRequestVolume=1450,
    hourlyRequestTrend=[45, 52, 60, 48, 72, 92, 110, 85, 95, 102, 80, 65]
  )
