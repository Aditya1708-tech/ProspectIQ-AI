"""
ProspectIQ AI - Currency Utility Functions (INR format rules)
"""

def format_inr(amount: float) -> str:
    """
    Format a number to Indian Rupee (INR) representation: e.g. 1,00,000.00
    """
    try:
        s = f"{amount:.2f}"
        parts = s.split('.')
        num = parts[0]
        dec = parts[1]
        
        if len(num) <= 3:
            return f"₹{num}.{dec}"
            
        last_three = num[-3:]
        remaining = num[:-3]
        
        # Indian numbering grouping format (e.g. 12,34,567)
        groups = []
        while len(remaining) > 0:
            groups.insert(0, remaining[-2:])
            remaining = remaining[:-2]
            
        return f"₹{','.join(groups)},{last_three}.{dec}"
    except Exception:
        return f"₹{amount}"
