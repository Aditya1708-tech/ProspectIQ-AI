import datetime
from schemas.analyze import CustomerProfileRequest, TrustLayerData

class TrustLayerEngine:
  def name(self) -> str:
    return "TrustLayer"

  def analyze(self, profile: CustomerProfileRequest) -> TrustLayerData:
    warnings = []
    errors = []
    
    # 1. Missing Fields Check
    if not profile.name or not profile.name.strip():
      errors.append("Customer name is missing or empty.")
    
    if not profile.phone or not profile.phone.strip():
      warnings.append("Phone number is missing or unverified.")
    elif len(profile.phone.strip()) < 10:
      warnings.append("Phone number is malformed (too short).")

    if not profile.email or not profile.email.strip():
      warnings.append("Email address is missing.")
    elif "@" not in profile.email:
      warnings.append("Email address format is invalid.")

    if not profile.occupation or not profile.occupation.strip():
      warnings.append("Occupation domain is missing.")

    # 2. Inconsistent Values Check
    if profile.riskCategory not in ["LOW", "MEDIUM", "HIGH"]:
      warnings.append(f"Anomalous risk category: '{profile.riskCategory}' is outside standard categories.")

    if profile.segment not in ["RETAIL", "MSME"]:
      errors.append(f"Invalid business segment: '{profile.segment}'.")

    if profile.status not in ["ACTIVE", "INACTIVE", "DORMANT", "PROSPECT", "BLACKLISTED"]:
      errors.append(f"Unknown customer status code: '{profile.status}'.")

    # 3. Impossible Values Check
    now = datetime.datetime.now(datetime.timezone.utc)
    
    for idx, acc in enumerate(profile.accounts):
      if acc.balance < 0:
        warnings.append(f"Anomalous negative balance observed in bank account {acc.accountNumber}.")
      
      for t_idx, t in enumerate(acc.transactions):
        if t.amount <= 0:
          errors.append(f"Invalid non-positive transaction amount ({t.amount}) on account {acc.accountNumber} at transaction {t_idx + 1}.")
        
        try:
          # Check for impossible future dates
          tx_date = datetime.datetime.fromisoformat(t.valueDate.replace("Z", "+00:00"))
          if tx_date > now + datetime.timedelta(hours=1): # Allow 1 hour slack
            warnings.append(f"Impossible future transaction date detected: {t.valueDate} on account {acc.accountNumber}.")
        except ValueError:
          errors.append(f"Malformed valueDate format: '{t.valueDate}' in account {acc.accountNumber}.")

    # Calculate Data Quality Score
    score = 100.0
    score -= len(warnings) * 10.0
    score -= len(errors) * 25.0
    score = max(0.0, min(100.0, score))

    # Derive Confidence Level
    if score >= 80.0:
      confidence = "HIGH"
    elif score >= 50.0:
      confidence = "MEDIUM"
    else:
      confidence = "LOW"

    return TrustLayerData(
      qualityScore=score,
      confidence=confidence,
      warnings=warnings,
      errors=errors
    )
