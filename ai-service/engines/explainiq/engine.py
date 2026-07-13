from typing import Optional
from contracts import FDNAProfile, PriorityScore, ExplanationObject, ConfidenceLevel, PriorityTier

class ExplainabilityEngine:
    def explain(
        self, 
        fdna: FDNAProfile, 
        score: PriorityScore, 
        recommendation: str
    ) -> Optional[ExplanationObject]:
        """
        Compiles the detailed explanation object from FDNA indicators.
        Returns None if explanation completeness check fails (BR-010).
        """
        evidence = []
        positive_indicators = []
        negative_indicators = []
        watch_items = []
        
        inds = fdna.indicators
        indicators_list = [
            inds.incomeStability,
            inds.expenseDiscipline,
            inds.savingsBehaviour,
            inds.paymentReliability,
            inds.borrowingIntent,
            inds.financialResilience,
            inds.customerEngagement,
            inds.digitalActivity
        ]
        
        # 1. Extract positive/negative indicators and gather evidence
        for ind in indicators_list:
            if ind.score >= 70.0:
                positive_indicators.append(f"{ind.dimension}: Score {ind.score:.0f}/100 - {ind.description}")
            elif ind.score < 50.0:
                negative_indicators.append(f"{ind.dimension}: Score {ind.score:.0f}/100 - {ind.description}")
                
            # Add concrete evidence
            if ind.evidence:
                evidence.extend(ind.evidence)
                
            # Log watch items for low confidence dimensions
            if ind.confidence == ConfidenceLevel.LOW:
                watch_items.append(f"Verify details for {ind.dimension} directly (data signals are thin)")

        # 2. Formulate recommended action
        if score.tier == PriorityTier.PRIORITY_ENGAGE:
            recommended_action = "Initiate contact to discuss primary home or business lending requirements."
        elif score.tier == PriorityTier.ENGAGE_WITH_CONTEXT:
            recommended_action = "Contact customer; highlight active transaction history and request latest billing records."
        elif score.tier == PriorityTier.LOWER_PRIORITY:
            recommended_action = "Monitor account activity; outbound contact is not recommended at this time."
        else: # INSUFFICIENT_DATA
            recommended_action = "Request additional transaction or utility billing consents to enable behavioral scoring."

        # Watch items for weak areas
        if inds.paymentReliability.score < 60.0:
            watch_items.append("Discuss utility bill payment delays with the customer.")
        if inds.expenseDiscipline.score < 50.0:
            watch_items.append("Address elevated levels of discretionary shopping outflows.")

        # Explanation completeness check (BR-010 / BR-003)
        # We must have at least some alternative data evidence present
        alt_keywords = ["upi", "gst", "epfo", "electricity", "bill", "payment"]
        has_alt_evidence = False
        for ev in evidence:
            ev_lower = ev.lower()
            if any(kw in ev_lower for kw in alt_keywords):
                # Ignore items that indicate absent or proxy data
                if not any(neg in ev_lower for neg in ["thin-file", "proxy", "0.00", "0%", "zero", "no outflows"]):
                    has_alt_evidence = True
                    break
        
        # If we have zero alternative evidence, or if evidence list is completely empty,
        # we treat the explanation as incomplete and return None
        if len(evidence) == 0 or not has_alt_evidence:
            return None
            
        return ExplanationObject(
            evidence=evidence[:6], # Cap to 6 most relevant items
            positiveIndicators=positive_indicators,
            negativeIndicators=negative_indicators,
            confidence=score.confidence,
            recommendedAction=recommended_action,
            watchItems=watch_items,
            alternativeInterpretation=None,
            humanReviewNotes=None
        )
