import datetime
from typing import Optional

def calculate_completion_window(sla: str) -> str:
  if sla == "24 Hours":
    return "Within 24 Hours"
  elif sla == "48 Hours":
    return "Within 48 Hours"
  elif sla == "3 Days":
    return "Within 3 Days"
  elif sla == "7 Days":
    return "Within 7 Days"
  elif sla == "30 Days":
    return "Within 30 Days"
  elif sla == "Next Quarter":
    return "Next Quarter"
  return f"Within {sla}"

def calculate_due_date(sla: str, base_date: Optional[datetime.datetime] = None) -> str:
  if not base_date:
    base_date = datetime.datetime.now(datetime.timezone.utc)
    
  if sla == "24 Hours":
    due = base_date + datetime.timedelta(days=1)
  elif sla == "48 Hours":
    due = base_date + datetime.timedelta(days=2)
  elif sla == "3 Days":
    due = base_date + datetime.timedelta(days=3)
  elif sla == "7 Days":
    due = base_date + datetime.timedelta(days=7)
  elif sla == "30 Days":
    due = base_date + datetime.timedelta(days=30)
  elif sla == "Next Quarter":
    due = base_date + datetime.timedelta(days=90)
  else:
    due = base_date + datetime.timedelta(days=7)
    
  return due.isoformat().replace("+00:00", "Z")
