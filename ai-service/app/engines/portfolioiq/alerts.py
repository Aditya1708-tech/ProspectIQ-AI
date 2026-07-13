from typing import List
from schemas.analyze import CustomerProfileRequest
from schemas.portfolio import RiskAlertDetail

class PortfolioAlertsDetector:
  def detect_alerts(
    self,
    profiles: List[CustomerProfileRequest],
    individual_analyses: List[dict]
  ) -> List[RiskAlertDetail]:
    
    alerts = []
    
    for i, profile in enumerate(profiles):
      analysis = individual_analyses[i]
      
      # 1. Check TrustLayer data quality
      trust_score = analysis['trustLayer']['data']['qualityScore']
      if trust_score < 85.0:
        alerts.append(RiskAlertDetail(
          severity="HIGH",
          reason=f"Data quality score is low ({trust_score:.0f}/100) due to profile anomalies.",
          affectedCustomer=profile.name,
          affectedCustomerId=profile.id,
          recommendedRMWorkflow="Update KYC fields"
        ))
        
      # 2. Check KYC fields missing
      if not profile.email or not profile.phone:
        alerts.append(RiskAlertDetail(
          severity="MEDIUM",
          reason="Profile is missing verified contact parameters (email or phone).",
          affectedCustomer=profile.name,
          affectedCustomerId=profile.id,
          recommendedRMWorkflow="Update contact information"
        ))

      # 3. Check PriorityIQ metrics
      if analysis.get('priorityIQ'):
        piq = analysis['priorityIQ']['data']
        ret_risk = piq['retentionRisk']['score']
        opp_action = piq['opportunityMatrix']['actionType']
        
        if ret_risk >= 45.0:
          alerts.append(RiskAlertDetail(
            severity="CRITICAL",
            reason=f"Retention risk index is high ({ret_risk:.0f}%) with potential asset outflow.",
            affectedCustomer=profile.name,
            affectedCustomerId=profile.id,
            recommendedRMWorkflow="Schedule RM Meeting"
          ))
          
      # 4. Check savings health decline
      if analysis.get('financialDNA'):
        dna = analysis['financialDNA']['data']
        sav_hlth = dna['savingsHealth']['score']
        if sav_hlth < 40.0:
          alerts.append(RiskAlertDetail(
            severity="HIGH",
            reason=f"Surplus savings indicators are low ({sav_hlth:.0f}%) showing declining cash reserves.",
            affectedCustomer=profile.name,
            affectedCustomerId=profile.id,
            recommendedRMWorkflow="Call Customer"
          ))

      # 5. Check status
      if profile.status == 'DORMANT' or profile.status == 'INACTIVE':
        alerts.append(RiskAlertDetail(
          severity="MEDIUM",
          reason=f"Customer account status marked as {profile.status}.",
          affectedCustomer=profile.name,
          affectedCustomerId=profile.id,
          recommendedRMWorkflow="Personalized Follow-up"
        ))

    # Sort alerts by severity priority: CRITICAL, HIGH, MEDIUM
    sev_map = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
    alerts.sort(key=lambda a: sev_map.get(a.severity, 3))
    
    return alerts
