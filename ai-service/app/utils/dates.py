"""
ProspectIQ AI - Date Utility Functions
"""
from datetime import datetime, date

def format_date_standard(d) -> str:
    if isinstance(d, (datetime, date)):
        return d.strftime("%Y-%m-%d")
    return str(d)

def parse_date_standard(date_str: str) -> datetime:
    return datetime.strptime(date_str, "%Y-%m-%d")
