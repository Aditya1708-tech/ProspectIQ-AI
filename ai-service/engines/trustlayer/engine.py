from typing import Dict, Tuple
from contracts import IngestionRecord, TraditionalSummary, ConfidenceLevel

class DataQualityEngine:
    def analyze(
        self, 
        traditional: TraditionalSummary, 
        alternative: IngestionRecord
    ) -> Tuple[float, ConfidenceLevel, Dict[str, bool]]:
        """
        Validates the completeness of alternative and traditional data sources.
        Returns:
            - completeness_score (0.0 to 100.0)
            - confidence_level (HIGH, MEDIUM, LOW)
            - source_presence (dict showing which fields were successfully parsed)
        """
        sources = {
            "average_balance": traditional.averageBalance >= 0,
            "upi_data": alternative.upiOutflowAvg > 0,
            "gst_data": alternative.gstTurnoverAvg is not None and alternative.gstTurnoverAvg > 0,
            "epfo_data": alternative.epfoInflowAvg is not None and alternative.epfoInflowAvg > 0,
            "utility_bill": alternative.utilityBillConsistency >= 0
        }
        
        # Calculate completeness score based on weights
        # Traditional average balance: 20%, UPI: 20%, GST: 20%, EPFO: 20%, Utility: 20%
        present_count = sum(1 for v in sources.values() if v)
        completeness_score = (present_count / len(sources)) * 100.0
        
        if completeness_score >= 80.0:
            confidence = ConfidenceLevel.HIGH
        elif completeness_score >= 50.0:
            confidence = ConfidenceLevel.MEDIUM
        else:
            confidence = ConfidenceLevel.LOW
            
        return completeness_score, confidence, sources
