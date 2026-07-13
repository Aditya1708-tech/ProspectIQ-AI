import datetime
from typing import Optional
from schemas.analyze import CustomerProfileRequest, TrustLayerData, PriorityIQProfile

def calculate_confidence_details(
  profile: CustomerProfileRequest,
  trust: TrustLayerData,
  priority: Optional[PriorityIQProfile]
) -> dict:
  trust_quality = trust.qualityScore / 100.0 if trust else 0.5
  
  complete_count = 0
  total_fields = 5
  if profile.name and profile.name.strip(): complete_count += 1
  if profile.phone and profile.phone.strip(): complete_count += 1
  if profile.email and profile.email.strip(): complete_count += 1
  if profile.occupation and profile.occupation.strip(): complete_count += 1
  if profile.addresses and len(profile.addresses) > 0: complete_count += 1
  data_completeness = complete_count / total_fields
  
  priority_conf_val = 0.8
  if priority and priority.finalPriority and priority.finalPriority.confidence:
    conf_map = {"HIGH": 1.0, "MEDIUM": 0.6, "LOW": 0.2}
    priority_conf_val = conf_map.get(priority.finalPriority.confidence.upper(), 0.6)
    
  portfolio_conf = 0.8
  if profile.riskCategory == "LOW":
    portfolio_conf = 0.95
  elif profile.riskCategory == "MEDIUM":
    portfolio_conf = 0.75
  elif profile.riskCategory == "HIGH":
    portfolio_conf = 0.55
    
  interaction_cov = 0.2
  if profile.lastInteractionAt:
    try:
      last_date = datetime.datetime.fromisoformat(profile.lastInteractionAt.replace("Z", "+00:00"))
      now = datetime.datetime.now(datetime.timezone.utc)
      days_diff = (now - last_date).days
      if days_diff <= 90:
        interaction_cov = 1.0
      elif days_diff <= 180:
        interaction_cov = 0.6
      else:
        interaction_cov = 0.3
    except Exception:
      interaction_cov = 0.4
  
  overall = (trust_quality * 0.3) + (data_completeness * 0.2) + (priority_conf_val * 0.2) + (portfolio_conf * 0.15) + (interaction_cov * 0.15)
  overall_score = round(overall * 100.0, 2)
  
  return {
    "overallScore": overall_score,
    "trustLayerQuality": round(trust_quality * 100.0, 2),
    "dataCompleteness": round(data_completeness * 100.0, 2),
    "priorityConfidence": round(priority_conf_val * 100.0, 2),
    "portfolioConfidence": round(portfolio_conf * 100.0, 2),
    "interactionCoverage": round(interaction_cov * 100.0, 2)
  }
