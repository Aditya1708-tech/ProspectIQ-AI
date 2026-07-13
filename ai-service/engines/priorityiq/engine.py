import datetime
from typing import Tuple
from contracts import FDNAProfile, PriorityScore, PriorityTier, ConfidenceLevel

class LeadQualityEngine:
    def score(self, fdna: FDNAProfile) -> PriorityScore:
        """
        Calculates the prioritization score from the FDNA profile.
        Behavioral consistency (Payment Reliability, Expense Discipline) is weighted more heavily.
        """
        inds = fdna.indicators
        
        # Define weights
        weights = {
            "paymentReliability": 0.20,
            "expenseDiscipline": 0.20,
            "incomeStability": 0.15,
            "savingsBehaviour": 0.15,
            "borrowingIntent": 0.10,
            "financialResilience": 0.10,
            "customerEngagement": 0.05,
            "digitalActivity": 0.05
        }
        
        # Compute weighted raw score
        raw_score = (
            inds.paymentReliability.score * weights["paymentReliability"] +
            inds.expenseDiscipline.score * weights["expenseDiscipline"] +
            inds.incomeStability.score * weights["incomeStability"] +
            inds.savingsBehaviour.score * weights["savingsBehaviour"] +
            inds.borrowingIntent.score * weights["borrowingIntent"] +
            inds.financialResilience.score * weights["financialResilience"] +
            inds.customerEngagement.score * weights["customerEngagement"] +
            inds.digitalActivity.score * weights["digitalActivity"]
        )
        
        normalized_score = raw_score # In MVP, normalized is equal to raw
        
        # Determine priority tier based on score and confidence
        conf = fdna.overallConfidence
        
        # Rule check for Insufficient Data
        if fdna.confidenceScore < 30.0:
            tier = PriorityTier.INSUFFICIENT_DATA
        elif normalized_score >= 75.0:
            if conf == ConfidenceLevel.LOW:
                # High score but thin data -> proceed with context
                tier = PriorityTier.ENGAGE_WITH_CONTEXT
            else:
                tier = PriorityTier.PRIORITY_ENGAGE
        elif normalized_score >= 50.0:
            tier = PriorityTier.ENGAGE_WITH_CONTEXT
        else:
            tier = PriorityTier.LOWER_PRIORITY
            
        return PriorityScore(
            rawScore=round(raw_score, 2),
            normalizedScore=round(normalized_score, 2),
            tier=tier,
            confidence=conf,
            updatedAt=datetime.datetime.utcnow().isoformat() + "Z"
        )
