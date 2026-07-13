from typing import List
from schemas.platform import AuditLogItem

def get_platform_audit_logs() -> List[AuditLogItem]:
  return [
    AuditLogItem(
      timestamp="2026-07-11T12:00:00Z",
      user="admin_sharma",
      role="ADMIN",
      action="UPDATE_CONFIG",
      module="ConfigurationCenter",
      entity="AIConfidenceThreshold",
      status="SUCCESS",
      traceId="tr-729482937402"
    ),
    AuditLogItem(
      timestamp="2026-07-11T12:15:30Z",
      user="rm_patel",
      role="RM",
      action="RUN_SIMULATION",
      module="SimulationIQ",
      entity="Customer:cust_101",
      status="SUCCESS",
      traceId="tr-983049182374"
    ),
    AuditLogItem(
      timestamp="2026-07-11T12:45:00Z",
      user="bm_deshmukh",
      role="BM",
      action="VIEW_PORTFOLIO",
      module="PortfolioIQ",
      entity="Branch:BR001",
      status="SUCCESS",
      traceId="tr-102948192847"
    ),
    AuditLogItem(
      timestamp="2026-07-11T13:00:10Z",
      user="admin_sharma",
      role="ADMIN",
      action="FORCE_LOGOUT",
      module="SecurityCenter",
      entity="User:rm_unresponsive",
      status="SUCCESS",
      traceId="tr-293840192847"
    ),
    AuditLogItem(
      timestamp="2026-07-11T13:10:45Z",
      user="intruder_user",
      role="UNKNOWN",
      action="LOGIN_ATTEMPT",
      module="Authentication",
      entity="User:intruder_user",
      status="FAILURE",
      traceId="tr-829482019384"
    )
  ]
