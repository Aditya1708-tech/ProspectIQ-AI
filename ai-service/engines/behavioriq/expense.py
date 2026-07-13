from typing import List, Tuple
from contracts import IngestionRecord, TraditionalSummary, ConfidenceLevel

class ExpenseAnalysisEngine:
    def analyze(
        self, 
        traditional: TraditionalSummary, 
        alternative: IngestionRecord,
        income_score: float
    ) -> Tuple[float, ConfidenceLevel, str, List[str]]:
        """
        Classifies spending into needs-based/essential vs luxury/discretionary categories.
        Returns:
            - score (0 to 100, where higher is more disciplined)
            - confidence (ConfidenceLevel)
            - description (plain-language summary)
            - evidence (list of concrete data points)
        """
        evidence = []
        score = 50.0
        confidence = ConfidenceLevel.LOW
        
        txs = alternative.rawTransactions
        if txs and len(txs) > 0:
            needs_sum = 0.0
            luxury_sum = 0.0
            invest_sum = 0.0
            total_outflow = 0.0
            
            for tx in txs:
                if tx.get("type") == "OUTFLOW":
                    amount = float(tx.get("amount", 0))
                    total_outflow += amount
                    cat = tx.get("category")
                    if cat in ["UTILITIES", "GROCERIES", "RENT"]:
                        needs_sum += amount
                    elif cat in ["SHOPPING", "ENTERTAINMENT"]:
                        luxury_sum += amount
                    elif cat in ["INVESTMENT"]:
                        invest_sum += amount
            
            if total_outflow > 0:
                needs_ratio = needs_sum / total_outflow
                luxury_ratio = luxury_sum / total_outflow
                invest_ratio = invest_sum / total_outflow
                
                evidence.append(f"Essential spending (groceries, rent, bills) comprises {needs_ratio*100:.1f}% of outflows")
                evidence.append(f"Discretionary/luxury spending comprises {luxury_ratio*100:.1f}% of outflows")
                if invest_sum > 0:
                    evidence.append(f"Regular investment outflow (Mutual Fund SIP/savings) comprises {invest_ratio*100:.1f}%")
                
                # High score if luxury is low and needs/investment are consistent
                # 100 - (luxury_ratio * 100) + bonus for investments
                score = 100.0 - (luxury_ratio * 100.0)
                if invest_ratio > 0.05:
                    score += 10.0 # Bonus for active savings discipline
                score = min(max(score, 10.0), 100.0)
                
                confidence = ConfidenceLevel.HIGH
                if luxury_ratio > 0.4:
                    description = "Erratic discretionary spending patterns detected, with elevated luxury outflows relative to capacity."
                else:
                    description = "Disciplined, needs-based spending pattern with controlled luxury/discretionary outlays."
            else:
                evidence.append("No outflows recorded in alternative transaction logs")
                description = "Unable to classify spending composition; zero transaction outflows recorded."
        else:
            # Fallback when raw transaction lines are unavailable (infer from UPI outflow average vs average balance)
            upi = alternative.upiOutflowAvg
            bal = traditional.averageBalance
            evidence.append(f"Average UPI outflow is INR {upi:,.2f} monthly")
            
            if upi > bal * 2:
                score = 30.0
                description = "High volume of UPI outflows relative to average balance suggests elevated discretionary spending."
            else:
                score = 65.0
                description = "UPI outflow levels are moderate and well within average balance reserves."
            confidence = ConfidenceLevel.MEDIUM
            
        return round(score, 2), confidence, description, evidence
