from typing import Dict, Any, List, Tuple
from contracts import IngestionRecord, TraditionalSummary, ConfidenceLevel

class BehaviorAnalysisEngine:
    def analyze_savings(
        self, 
        traditional: TraditionalSummary, 
        alternative: IngestionRecord
    ) -> Tuple[float, ConfidenceLevel, str, List[str]]:
        evidence = []
        bal = traditional.averageBalance
        upi = alternative.upiOutflowAvg
        
        evidence.append(f"Maintains an average monthly balance buffer of INR {bal:,.2f}")
        
        # Calculate score: higher balance relative to UPI outflows suggests a stable buffer
        if upi > 0:
            ratio = bal / upi
            score = min(ratio * 30 + 40, 100.0)
        else:
            score = min(bal / 1000 + 50, 100.0)
            
        score = max(score, 20.0)
        
        if score >= 75.0:
            description = "Maintains a healthy liquid balance buffer relative to regular transaction outflows."
            confidence = ConfidenceLevel.HIGH
        elif score >= 50.0:
            description = "Moderate savings buffer; cash inflows are closely matched by monthly transaction demands."
            confidence = ConfidenceLevel.MEDIUM
        else:
            description = "Thin savings buffer; frequent outflows leave minimal liquid reserves."
            confidence = ConfidenceLevel.LOW
            
        return round(score, 2), confidence, description, evidence

    def analyze_payment(
        self, 
        alternative: IngestionRecord
    ) -> Tuple[float, ConfidenceLevel, str, List[str]]:
        evidence = []
        consistency = alternative.utilityBillConsistency
        evidence.append(f"Utility bill payment consistency rate of {consistency}%")
        
        score = consistency
        confidence = ConfidenceLevel.HIGH if consistency >= 80 else ConfidenceLevel.MEDIUM
        
        if consistency >= 90:
            description = "Outstanding utility and electricity bill payment discipline with zero recent lapses."
        elif consistency >= 70:
            description = "Satisfactory utility bill payment consistency; occasional payment delays observed."
        else:
            description = "Poor payment discipline; recurrent lapses in timely utility or bill settlements."
            
        return round(score, 2), confidence, description, evidence

    def analyze_resilience(
        self, 
        traditional: TraditionalSummary
    ) -> Tuple[float, ConfidenceLevel, str, List[str]]:
        evidence = []
        loans = traditional.existingLoansCount
        score = 100.0 - (loans * 20.0)
        score = max(score, 20.0)
        
        evidence.append(f"Active loan accounts under management: {loans}")
        
        if traditional.creditBureauScore:
            evidence.append(f"Bureau credit rating score: {traditional.creditBureauScore}")
            score = (score + (traditional.creditBureauScore - 300) / 6) / 2
            confidence = ConfidenceLevel.HIGH
        else:
            evidence.append("No active credit bureau history available (thin-file context)")
            confidence = ConfidenceLevel.MEDIUM
            
        if score >= 75:
            description = "Strong financial resilience; low debt obligations and robust buffer to absorb shocks."
        elif score >= 50:
            description = "Moderate resilience; carrying some leverage with adequate capacity to service debt."
        else:
            description = "Vulnerable financial resilience; high leverage or low credit quality limits safety buffer."
            
        return round(score, 2), confidence, description, evidence

    def analyze_digital(
        self, 
        alternative: IngestionRecord
    ) -> Tuple[float, ConfidenceLevel, str, List[str]]:
        evidence = []
        upi = alternative.upiOutflowAvg
        evidence.append(f"Consistent digital footprint with average monthly UPI outflows of INR {upi:,.2f}")
        
        # Digital score based on active digital transactions
        score = min(upi / 500 + 40, 100.0)
        score = max(score, 30.0)
        confidence = ConfidenceLevel.HIGH
        
        if upi >= 20000:
            description = "Highly active digital transaction history, providing rich alternative data signals."
        else:
            description = "Moderate digital activity; primary transactional signals are partially offline."
            
        return round(score, 2), confidence, description, evidence
