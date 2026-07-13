from schemas.platform import PlatformHealthSummary

def evaluate_system_health() -> PlatformHealthSummary:
  return PlatformHealthSummary(
    totalUsers=145,
    relationshipManagers=120,
    branchManagers=15,
    administrators=10,
    branches=8,
    customers=12500,
    tasks=840,
    interactions=3200,
    todayLogins=92,
    todayAnalyses=1450,
    totalAIRequests=428000,
    averageResponseTimeMs=42.5,
    platformUptimeDays=14.85,
    backendStatus="HEALTHY",
    frontendStatus="HEALTHY",
    databaseStatus="HEALTHY",
    aiStatus="HEALTHY"
  )
