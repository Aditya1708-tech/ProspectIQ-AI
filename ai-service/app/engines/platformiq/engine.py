import datetime
from typing import List
from schemas.platform import PlatformIQProfile, BranchKPI, UserProductivity, PlatformNotification
from engines.platformiq.system_health import evaluate_system_health
from engines.platformiq.monitoring import get_engine_monitoring_status
from engines.platformiq.performance import get_performance_metrics
from engines.platformiq.security import get_security_posture
from engines.platformiq.audit import get_platform_audit_logs
from engines.platformiq.configuration import get_platform_configuration
from engines.platformiq.statistics import get_operational_analytics

class PlatformIQEngine:
  def analyze(self) -> PlatformIQProfile:
    # Evaluate sub-engines
    summary = evaluate_system_health()
    engines = get_engine_monitoring_status()
    perf = get_performance_metrics()
    sec = get_security_posture()
    audit_logs = get_platform_audit_logs()
    config = get_platform_configuration()
    analytics = get_operational_analytics()
    
    # Inline branch evaluation
    branches = [
      BranchKPI(
        branchName="BR001 - Main Corporate Branch",
        customerCount=4200,
        averageTrustScore=85.2,
        averagePriorityScore=72.1,
        averageRelationshipHealth=79.5,
        averagePortfolioHealth=68.2,
        averageRMWorkload=12.5,
        performanceRating="High"
      ),
      BranchKPI(
        branchName="BR002 - Retail Hub",
        customerCount=3100,
        averageTrustScore=78.4,
        averagePriorityScore=65.8,
        averageRelationshipHealth=74.2,
        averagePortfolioHealth=60.5,
        averageRMWorkload=15.2,
        performanceRating="Stable"
      ),
      BranchKPI(
        branchName="BR003 - MSME Center",
        customerCount=2400,
        averageTrustScore=72.1,
        averagePriorityScore=78.5,
        averageRelationshipHealth=68.4,
        averagePortfolioHealth=55.0,
        averageRMWorkload=18.0,
        performanceRating="Needs Attention"
      ),
      BranchKPI(
        branchName="BR004 - Rural Extension",
        customerCount=800,
        averageTrustScore=69.8,
        averagePriorityScore=60.2,
        averageRelationshipHealth=71.0,
        averagePortfolioHealth=58.5,
        averageRMWorkload=8.4,
        performanceRating="Stable"
      )
    ]
    
    # Inline user management records
    users = [
      UserProductivity(
        username="rm_sharma",
        role="RM",
        branch="BR001",
        status="ACTIVE",
        lastLogin="2026-07-11T12:00:00Z",
        assignedCustomers=45,
        assignedTasks=18,
        productivityScore=92.5
      ),
      UserProductivity(
        username="rm_patel",
        role="RM",
        branch="BR002",
        status="ACTIVE",
        lastLogin="2026-07-11T12:15:30Z",
        assignedCustomers=60,
        assignedTasks=24,
        productivityScore=88.0
      ),
      UserProductivity(
        username="bm_deshmukh",
        role="BM",
        branch="BR001",
        status="ACTIVE",
        lastLogin="2026-07-11T12:45:00Z",
        assignedCustomers=0,
        assignedTasks=0,
        productivityScore=95.0
      ),
      UserProductivity(
        username="admin_verma",
        role="ADMIN",
        branch="BR001",
        status="ACTIVE",
        lastLogin="2026-07-11T11:30:00Z",
        assignedCustomers=0,
        assignedTasks=0,
        productivityScore=99.0
      ),
      UserProductivity(
        username="rm_inactive",
        role="RM",
        branch="BR003",
        status="INACTIVE",
        lastLogin="2026-07-01T09:00:00Z",
        assignedCustomers=12,
        assignedTasks=5,
        productivityScore=45.0
      )
    ]
    
    # Inline notifications list
    now_str = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")
    notifications = [
      PlatformNotification(
        id="not-1",
        type="INFO",
        message="New Customer Onboarded: cust_12501 assigned to rm_sharma.",
        timestamp=now_str,
        severity="INFO"
      ),
      PlatformNotification(
        id="not-2",
        type="WARNING",
        message="High Priority Customer Detected: Attrition risk increased for cust_101.",
        timestamp=now_str,
        severity="WARNING"
      ),
      PlatformNotification(
        id="not-3",
        type="CRITICAL",
        message="RM Workload Imbalance: rm_patel exceeds task assignment limits at BR002.",
        timestamp=now_str,
        severity="WARNING"
      ),
      PlatformNotification(
        id="not-4",
        type="INFO",
        message="Explainability Audit Completed: Audit trace tr-729482937402 written to governance logs.",
        timestamp=now_str,
        severity="INFO"
      ),
      PlatformNotification(
        id="not-5",
        type="INFO",
        message="Platform Running Normally: Uptime tracks 14.85 days with 100% engine uptime.",
        timestamp=now_str,
        severity="INFO"
      ),
      PlatformNotification(
        id="not-6",
        type="INFO",
        message="Daily Branch Summary Ready: Compiled KPIs generated for BR001-BR008.",
        timestamp=now_str,
        severity="INFO"
      )
    ]
    
    # Exec briefing
    from engines.platformiq.executive import generate_executive_summary
    exec_summary = generate_executive_summary()
    
    return PlatformIQProfile(
      platformSummary=summary,
      engineHealths=engines,
      performance=perf,
      security=sec,
      auditLogs=audit_logs,
      configuration=config,
      branches=branches,
      users=users,
      analytics=analytics,
      notifications=notifications,
      summary=exec_summary,
      confidence="HIGH"
    )
