from schemas.platform import ConfigSettings

def get_platform_configuration() -> ConfigSettings:
  return ConfigSettings(
    aiConfidenceThreshold=80.0,
    priorityThreshold=70.0,
    relationshipThreshold=75.0,
    portfolioThreshold=60.0,
    taskReminderIntervalMinutes=30,
    sessionTimeoutMinutes=15,
    theme="DARK_GLASSMORPHISM",
    featureFlags={
      "enablePredictIQ": True,
      "enableSimulationIQ": True,
      "maintenanceMode": False,
      "mfaRequired": True,
      "realtimeAlerts": True
    },
    environment="production-in-memory"
  )
