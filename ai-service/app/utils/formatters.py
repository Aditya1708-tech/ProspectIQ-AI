"""
ProspectIQ AI - General Output Formatting Utilities
"""

def clean_percentage(val: float) -> str:
    return f"{val:.1f}%"

def truncate_text(text: str, max_len: int = 100) -> str:
    if len(text) <= max_len:
        return text
    return text[:max_len] + "..."
