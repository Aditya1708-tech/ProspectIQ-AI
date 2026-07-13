from schemas.predict import ForecastMetric, PredictionWindow

def project_value(current: float, rate_per_day: float, days: int, min_val: float = 0.0, max_val: float = 100.0) -> float:
  projected = current + (rate_per_day * days)
  return max(min_val, min(max_val, projected))

def compute_forecast_metric(
  current_value: float,
  rate_per_day: float,
  confidence: str,
  reason_30: str,
  reason_90: str,
  reason_180: str,
  min_val: float = 0.0,
  max_val: float = 100.0
) -> ForecastMetric:
  val_30 = project_value(current_value, rate_per_day, 30, min_val, max_val)
  val_90 = project_value(current_value, rate_per_day, 90, min_val, max_val)
  val_180 = project_value(current_value, rate_per_day, 180, min_val, max_val)

  change_30 = val_30 - current_value
  change_90 = val_90 - current_value
  change_180 = val_180 - current_value

  pct_30 = (change_30 / current_value * 100.0) if current_value > 0 else 0.0
  pct_90 = (change_90 / current_value * 100.0) if current_value > 0 else 0.0
  pct_180 = (change_180 / current_value * 100.0) if current_value > 0 else 0.0

  return ForecastMetric(
    currentValue=current_value,
    d30=PredictionWindow(
      predictedValue=val_30,
      expectedChange=change_30,
      percentageChange=pct_30,
      confidence=confidence,
      reason=reason_30
    ),
    d90=PredictionWindow(
      predictedValue=val_90,
      expectedChange=change_90,
      percentageChange=pct_90,
      confidence=confidence,
      reason=reason_90
    ),
    d180=PredictionWindow(
      predictedValue=val_180,
      expectedChange=change_180,
      percentageChange=pct_180,
      confidence=confidence,
      reason=reason_180
    )
  )
