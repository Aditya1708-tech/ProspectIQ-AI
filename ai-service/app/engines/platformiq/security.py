from schemas.platform import SecuritySummary

def get_security_posture() -> SecuritySummary:
  return SecuritySummary(
    failedLoginAttempts=4,
    passwordResetRequests=2,
    accountLockouts=0,
    permissionChanges=1,
    roleChanges=0,
    auditViolations=0,
    inactiveUsers=5,
    suspiciousActivities=1,
    securityHealthScore=98.0
  )
