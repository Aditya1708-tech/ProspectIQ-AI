from typing import List, Dict

def get_daily_requests_trend() -> List[Dict[str, int]]:
  return [
    {"day": "Mon", "requests": 1200},
    {"day": "Tue", "requests": 1450},
    {"day": "Wed", "requests": 1300},
    {"day": "Thu", "requests": 1600},
    {"day": "Fri", "requests": 1750},
    {"day": "Sat", "requests": 800},
    {"day": "Sun", "requests": 650}
  ]

def get_dashboard_visits_trend() -> List[Dict[str, int]]:
  return [
    {"day": "Mon", "visits": 240},
    {"day": "Tue", "visits": 290},
    {"day": "Wed", "visits": 270},
    {"day": "Thu", "visits": 310},
    {"day": "Fri", "visits": 330},
    {"day": "Sat", "visits": 120},
    {"day": "Sun", "visits": 90}
  ]
