from schemas.platform import OperationalAnalytics

def get_operational_analytics() -> OperationalAnalytics:
  return OperationalAnalytics(
    dailyAIRequests=[
      {"date": "2026-07-05", "count": 1100},
      {"date": "2026-07-06", "count": 1250},
      {"date": "2026-07-07", "count": 1400},
      {"date": "2026-07-08", "count": 1350},
      {"date": "2026-07-09", "count": 1500},
      {"date": "2026-07-10", "count": 1650},
      {"date": "2026-07-11", "count": 1450}
    ],
    monthlyCustomerGrowth=[
      {"month": "Jan", "count": 10500},
      {"month": "Feb", "count": 10800},
      {"month": "Mar", "count": 11100},
      {"month": "Apr", "count": 11400},
      {"month": "May", "count": 11800},
      {"month": "Jun", "count": 12200},
      {"month": "Jul", "count": 12500}
    ],
    engineUsage={
      "TrustLayer": 42800,
      "BehaviorIQ": 42800,
      "FinDNA": 41200,
      "PriorityIQ": 40500,
      "RMCopilot": 38200,
      "PortfolioIQ": 4500,
      "ExplainIQ": 32800,
      "NBAIQ": 34500,
      "RelationshipIQ": 28400,
      "PredictIQ": 12500,
      "SimulationIQ": 4800,
      "PlatformIQ": 1800
    },
    dashboardVisits=[
      {"date": "2026-07-05", "count": 180},
      {"date": "2026-07-06", "count": 220},
      {"date": "2026-07-07", "count": 240},
      {"date": "2026-07-08", "count": 210},
      {"date": "2026-07-09", "count": 260},
      {"date": "2026-07-10", "count": 285},
      {"date": "2026-07-11", "count": 220}
    ],
    taskCompletionRates={
      "MSME": 88.5,
      "RETAIL": 92.0,
      "HNI": 95.5,
      "Standard": 85.0
    },
    relationshipMeetingsTrend=[
      {"date": "2026-07-05", "count": 45},
      {"date": "2026-07-06", "count": 62},
      {"date": "2026-07-07", "count": 58},
      {"date": "2026-07-08", "count": 70},
      {"date": "2026-07-09", "count": 65},
      {"date": "2026-07-10", "count": 80},
      {"date": "2026-07-11", "count": 55}
    ],
    priorityTrends=[
      {"date": "2026-07-05", "score": 68.5},
      {"date": "2026-07-06", "score": 70.2},
      {"date": "2026-07-07", "score": 71.5},
      {"date": "2026-07-08", "score": 69.8},
      {"date": "2026-07-09", "score": 72.4},
      {"date": "2026-07-10", "score": 73.0},
      {"date": "2026-07-11", "score": 72.1}
    ]
  )
