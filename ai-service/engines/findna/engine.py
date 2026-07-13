import datetime
from typing import Dict, Any
from contracts import (
    FDNAProfile, 
    FDNAIndicator, 
    FDNAIndicatorsMap, 
    ConfidenceLevel, 
    TraditionalSummary, 
    IngestionRecord
)
from engines.behavioriq.income import IncomeAnalysisEngine
from engines.behavioriq.expense import ExpenseAnalysisEngine
from engines.behavioriq.engine import BehaviorAnalysisEngine

class FinancialDNAEngine:
    def __init__(self):
        self.income_engine = IncomeAnalysisEngine()
        self.expense_engine = ExpenseAnalysisEngine()
        self.behavior_engine = BehaviorAnalysisEngine()

    def generate(
        self, 
        customer_id: str, 
        segment: str,
        traditional: TraditionalSummary, 
        alternative: IngestionRecord,
        data_quality_confidence: ConfidenceLevel
    ) -> FDNAProfile:
        """
        Synthesizes all 8 dimensions of the Financial DNA profile.
        """
        # 1. Income Stability
        inc_score, inc_conf, inc_desc, inc_ev = self.income_engine.analyze(traditional, alternative, segment)
        income_indicator = FDNAIndicator(
            dimension="Income Stability", score=inc_score, confidence=inc_conf, description=inc_desc, evidence=inc_ev
        )
        
        # 2. Expense Discipline
        exp_score, exp_conf, exp_desc, exp_ev = self.expense_engine.analyze(traditional, alternative, inc_score)
        expense_indicator = FDNAIndicator(
            dimension="Expense Discipline", score=exp_score, confidence=exp_conf, description=exp_desc, evidence=exp_ev
        )
        
        # 3. Savings Behaviour
        sav_score, sav_conf, sav_desc, sav_ev = self.behavior_engine.analyze_savings(traditional, alternative)
        savings_indicator = FDNAIndicator(
            dimension="Savings Behaviour", score=sav_score, confidence=sav_conf, description=sav_desc, evidence=sav_ev
        )
        
        # 4. Payment Reliability
        pay_score, pay_conf, pay_desc, pay_ev = self.behavior_engine.analyze_payment(alternative)
        payment_indicator = FDNAIndicator(
            dimension="Payment Reliability", score=pay_score, confidence=pay_conf, description=pay_desc, evidence=pay_ev
        )
        
        # 5. Borrowing Intent
        # Rule-based inference of borrowing intent for demonstration
        bi_score = 65.0 if traditional.existingLoansCount == 0 else 45.0
        bi_conf = ConfidenceLevel.MEDIUM
        bi_ev = [f"Existing credit facility count: {traditional.existingLoansCount}"]
        if traditional.creditBureauScore and traditional.creditBureauScore > 700:
            bi_score += 15.0
            bi_ev.append("Strong credit history profile signals low barriers to new credit absorption")
        bi_desc = "Favourable intent signal; customer exhibits credit capacity with clean repayment indicators." if bi_score > 60 else "Moderate intent signal; prior credit leverage suggests conservative engagement recommended."
        borrowing_intent_indicator = FDNAIndicator(
            dimension="Borrowing Intent", score=bi_score, confidence=bi_conf, description=bi_desc, evidence=bi_ev
        )
        
        # 6. Financial Resilience
        res_score, res_conf, res_desc, res_ev = self.behavior_engine.analyze_resilience(traditional)
        resilience_indicator = FDNAIndicator(
            dimension="Financial Resilience", score=res_score, confidence=res_conf, description=res_desc, evidence=res_ev
        )
        
        # 7. Customer Engagement
        # Engagement score based on account balance level
        ce_score = min(traditional.averageBalance / 2500 + 40, 100.0)
        ce_conf = ConfidenceLevel.HIGH
        ce_ev = [f"Average balance reserves: INR {traditional.averageBalance:,.2f}"]
        ce_desc = "Highly engaged IDBI customer with stable primary account relationship." if ce_score > 70 else "Moderately engaged customer relationship with room for product cross-sell."
        customer_engagement_indicator = FDNAIndicator(
            dimension="Customer Engagement", score=ce_score, confidence=ce_conf, description=ce_desc, evidence=ce_ev
        )
        
        # 8. Digital Activity
        dig_score, dig_conf, dig_desc, dig_ev = self.behavior_engine.analyze_digital(alternative)
        digital_activity_indicator = FDNAIndicator(
            dimension="Digital Activity", score=dig_score, confidence=dig_conf, description=dig_desc, evidence=dig_ev
        )
        
        # Compile Indicators Map
        indicators_map = FDNAIndicatorsMap(
            incomeStability=income_indicator,
            expenseDiscipline=expense_indicator,
            savingsBehaviour=savings_indicator,
            paymentReliability=payment_indicator,
            borrowingIntent=borrowing_intent_indicator,
            financialResilience=resilience_indicator,
            customerEngagement=customer_engagement_indicator,
            digitalActivity=digital_activity_indicator
        )
        
        # Calculate overall confidence score and rating
        all_indicators = [
            inc_conf, exp_conf, sav_conf, pay_conf, bi_conf, res_conf, ce_conf, dig_conf
        ]
        high_count = sum(1 for c in all_indicators if c == ConfidenceLevel.HIGH)
        medium_count = sum(1 for c in all_indicators if c == ConfidenceLevel.MEDIUM)
        
        # Weighted average for overall confidence score
        overall_score = ((high_count * 100) + (medium_count * 50)) / len(all_indicators)
        
        if overall_score >= 75.0:
            overall_conf = ConfidenceLevel.HIGH
        elif overall_score >= 40.0:
            overall_conf = ConfidenceLevel.MEDIUM
        else:
            overall_conf = ConfidenceLevel.LOW
            
        return FDNAProfile(
            customerId=customer_id,
            generatedAt=datetime.datetime.utcnow().isoformat() + "Z",
            confidenceScore=round(overall_score, 2),
            overallConfidence=overall_conf,
            indicators=indicators_map
        )
