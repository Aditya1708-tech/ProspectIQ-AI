from contracts import PriorityScore, FDNAProfile, PriorityTier

class RecommendationEngine:
    def generate(self, score: PriorityScore, fdna: FDNAProfile) -> str:
        """
        Translates priority score and profile details into a qualitative engagement recommendation.
        Enforces BR-001: strictly avoids credit eligibility or approval terminology.
        """
        tier = score.tier
        inds = fdna.indicators
        
        if tier == PriorityTier.PRIORITY_ENGAGE:
            if inds.paymentReliability.score >= 90.0:
                return "Highly recommended relationship candidate due to outstanding utility payment discipline."
            elif inds.incomeStability.score >= 80.0:
                return "Strong candidate for relationship outreach based on highly stable income inflows."
            else:
                return "Favourable candidate for relationship building; behavioral indicators suggest high repayment capability."
                
        elif tier == PriorityTier.ENGAGE_WITH_CONTEXT:
            if inds.paymentReliability.score >= 80.0:
                return "Favourable alternative data signals observed; review payment reliability evidence during conversation."
            elif inds.digitalActivity.score >= 80.0:
                return "Highly active digital UPI footprint detected; contact with focus on active business turnover."
            else:
                return "Moderate behavioral alignment; review detailed expense discipline logs before initiating contact."
                
        elif tier == PriorityTier.LOWER_PRIORITY:
            if inds.paymentReliability.score < 50.0:
                return "Lower outreach priority; irregular payment discipline noted in recent utility bills."
            else:
                return "Lower outreach priority; review general balance and transaction trends prior to contact."
                
        else: # INSUFFICIENT_DATA
            return "Insufficient profile history available to support automated relationship prioritization."
