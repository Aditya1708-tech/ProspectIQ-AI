from schemas.analyze import CustomerProfileRequest, TrustLayerData

def resolve_confidence(trust: TrustLayerData, profile: CustomerProfileRequest) -> str:
  # Logic to return confidence
  if trust.confidence == "LOW" or not profile.phone:
    return "LOW"
  elif trust.confidence == "MEDIUM" or len(profile.interactions) < 2:
    return "MEDIUM"
  return "HIGH"
