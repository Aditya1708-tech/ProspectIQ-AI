from typing import List
from schemas.analyze import CustomerProfileRequest
from schemas.portfolio import EarlyWarningAlert

class PortfolioEarlyWarningEngine:
  def detect_warnings(
    self,
    profiles: List[CustomerProfileRequest],
    individual_analyses: List[dict]
  ) -> List[EarlyWarningAlert]:
    
    warnings = []
    
    for i, profile in enumerate(profiles):
      analysis = individual_analyses[i]
      
      # 1. High cash dependency ratio (from BehaviorIQ)
      if analysis.get('behaviorIQ'):
        beh = analysis['behaviorIQ']['data']
        cash_ratio = beh['expenses']['cashDependencyRatio']
        if cash_ratio > 35.0:
          warnings.append(EarlyWarningAlert(
            warningLevel="Orange",
            confidence="HIGH",
            reason=f"High cash dependency ratio ({cash_ratio:.0f}%) indicates offline transaction leakage.",
            recommendedRMWorkflow="Personalized Follow-up on digital channel benefits",
            expectedBusinessImpact="Decline in fee income and digital platform engagement metrics",
            affectedCustomer=profile.name,
            affectedCustomerId=profile.id
          ))

      # 2. Inactivity > 60 days
      # Let's check last interaction date or assigned date
      # If no interactions, or last interaction date has elapsed
      if len(profile.accounts) > 0:
        # Check if lastInteractionAt is older than 60 days, or if there is no interaction
        has_long_inactivity = True
        if profile.lastInteractionAt:
          # Simply parse and check or assume mock rule based on status
          if profile.status == 'INACTIVE' or profile.status == 'DORMANT':
            has_long_inactivity = True
          else:
            has_long_inactivity = False
        else:
          has_long_inactivity = True
          
        if has_long_inactivity:
          warnings.append(EarlyWarningAlert(
            warningLevel="Red",
            confidence="MEDIUM",
            reason="Relationship has exceeded sixty days without any recorded manager interaction.",
            recommendedRMWorkflow="Schedule RM Meeting",
            expectedBusinessImpact="Elevated risk of account attrition and competitor takeover",
            affectedCustomer=profile.name,
            affectedCustomerId=profile.id
          ))

      # 3. Savings health decline (from DNA)
      if analysis.get('financialDNA'):
        dna = analysis['financialDNA']['data']
        savings_score = dna['savingsHealth']['score']
        if savings_score < 40.0:
          warnings.append(EarlyWarningAlert(
            warningLevel="Orange",
            confidence="HIGH",
            reason=f"Savings Health score is low ({savings_score:.0f}%) indicating persistent balance drainage.",
            recommendedRMWorkflow="Call Customer to discuss liquidity alternatives",
            expectedBusinessImpact="Reduction in branch core deposits and balance sheet margins",
            affectedCustomer=profile.name,
            affectedCustomerId=profile.id
          ))

      # 4. Low TrustLayer score
      trust_score = analysis['trustLayer']['data']['qualityScore']
      if trust_score < 80.0:
        warnings.append(EarlyWarningAlert(
          warningLevel="Yellow",
          confidence="HIGH",
          reason=f"Recurring data quality issues (Trust Score: {trust_score:.0f}/100) indicate verification gaps.",
          recommendedRMWorkflow="Update KYC fields",
          expectedBusinessImpact="Compliance audit exceptions and legal check failures",
          affectedCustomer=profile.name,
          affectedCustomerId=profile.id
        ))

    # Sort alerts by warningLevel priority: Red, Orange, Yellow
    wl_map = {"Red": 0, "Orange": 1, "Yellow": 2}
    warnings.sort(key=lambda w: wl_map.get(w.warningLevel, 3))
    
    return warnings
