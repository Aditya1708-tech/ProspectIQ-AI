from typing import List, Tuple
from contracts import IngestionRecord, TraditionalSummary, ConfidenceLevel

class IncomeAnalysisEngine:
    def analyze(
        self, 
        traditional: TraditionalSummary, 
        alternative: IngestionRecord,
        segment: str
    ) -> Tuple[float, ConfidenceLevel, str, List[str]]:
        """
        Analyzes income stability based on salary credits (EPFO) or business turnover (GST).
        Returns:
            - score (0 to 100)
            - confidence (ConfidenceLevel)
            - description (plain-language summary)
            - evidence (list of concrete data points)
        """
        evidence = []
        score = 50.0
        confidence = ConfidenceLevel.LOW
        
        # Analyze based on EPFO for Retail
        if segment == "RETAIL" and alternative.epfoInflowAvg and alternative.epfoInflowAvg > 0:
            epfo = alternative.epfoInflowAvg
            evidence.append(f"Consistent EPFO salary credit detected, averaging INR {epfo:,.2f} monthly")
            score = min(epfo / 1500, 100.0) # Scale score based on salary level
            score = max(score, 60.0) # Base score of 60 for verified salary
            confidence = ConfidenceLevel.HIGH
            description = "Highly stable verified EPFO salary inflows observed over the audit window."
            
        # Analyze based on GST for MSME
        elif segment == "MSME" and alternative.gstTurnoverAvg and alternative.gstTurnoverAvg > 0:
            gst = alternative.gstTurnoverAvg
            evidence.append(f"Monthly GST-declared business turnover averaging INR {gst:,.2f}")
            score = min(gst / 5000, 100.0)
            score = max(score, 55.0)
            confidence = ConfidenceLevel.HIGH
            description = "Active and stable monthly GST business turnover filings verified."
            
        else:
            # Fallback to average bank balance if primary alternative income signal is missing
            bal = traditional.averageBalance
            evidence.append(f"Average bank balance of INR {bal:,.2f} used as proxy for stability due to thin-file alternative records")
            score = min(bal / 1000, 55.0)
            score = max(score, 30.0)
            confidence = ConfidenceLevel.LOW
            description = "Traditional account balance profile analyzed; alternative income records are currently thin or unavailable."
            
        return round(score, 2), confidence, description, evidence
