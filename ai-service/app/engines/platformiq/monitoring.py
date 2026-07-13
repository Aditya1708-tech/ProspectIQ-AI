from typing import List
from schemas.platform import SystemHealthItem

def get_engine_monitoring_status() -> List[SystemHealthItem]:
  engines_data = [
    ("TrustLayer", "1.0.0", "HEALTHY", 0.08, 100.0, 1450, 0, 98.5),
    ("BehaviorIQ", "1.0.0", "HEALTHY", 0.12, 100.0, 1450, 0, 99.0),
    ("FinDNA", "1.0.0", "HEALTHY", 0.20, 100.0, 1450, 0, 97.5),
    ("PriorityIQ", "1.0.0", "HEALTHY", 0.10, 100.0, 1450, 0, 98.0),
    ("RMCopilot", "1.0.0", "HEALTHY", 0.14, 100.0, 1450, 0, 98.5),
    ("PortfolioIQ", "1.0.0", "HEALTHY", 1.85, 100.0, 120, 0, 99.0),
    ("ExplainIQ", "1.0.0", "HEALTHY", 0.15, 100.0, 1450, 0, 97.5),
    ("NBAIQ", "1.0.0", "HEALTHY", 0.13, 100.0, 1450, 0, 98.0),
    ("RelationshipIQ", "1.0.0", "HEALTHY", 0.25, 100.0, 1450, 0, 98.5),
    ("PredictIQ", "1.0.0", "HEALTHY", 0.75, 100.0, 1450, 0, 99.0),
    ("SimulationIQ", "1.0.0", "HEALTHY", 1.50, 100.0, 320, 0, 98.0),
    ("PlatformIQ", "1.0.0", "HEALTHY", 2.25, 100.0, 450, 0, 99.5)
  ]
  
  import datetime
  now_str = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")

  return [
    SystemHealthItem(
      engineName=name,
      version=ver,
      status=status,
      averageLatencyMs=lat,
      successRate=succ,
      requestsToday=req,
      errorsToday=err,
      lastExecutionTime=now_str,
      overallHealthScore=health
    )
    for name, ver, status, lat, succ, req, err, health in engines_data
  ]
