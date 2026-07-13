"""
ProspectIQ AI - General Reusable Helper Functions
"""
import uuid

def generate_trace_id() -> str:
    return str(uuid.uuid4())

def safe_divide(numerator: float, denominator: float, fallback: float = 0.0) -> float:
    if denominator == 0:
        return fallback
    return numerator / denominator
