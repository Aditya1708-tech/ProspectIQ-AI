from typing import List, Optional
from schemas.analyze import CustomerProfileRequest, FinancialDNAProfile
from engines.copilot.templates import STARTERS_RETAIL, STARTERS_MSME

class CoPilotConversationGenerator:
  def generate_starters(
    self,
    profile: CustomerProfileRequest,
    dna: Optional[FinancialDNAProfile]
  ) -> List[str]:
    
    starters = []
    
    # 1. Base starters by segment
    if profile.segment == 'MSME':
      starters.extend(STARTERS_MSME)
    else:
      starters.extend(STARTERS_RETAIL)

    # 2. Add occupation specific starter
    occ = profile.occupation
    if occ:
      starters.append(f"How have industry shifts impacted your work as a {occ} recently?")
    
    # 3. Add persona specific starter
    if dna:
      p_name = dna.persona.name
      if p_name == 'Digital Native':
        starters.append("What digital convenience features would make your daily transaction management even easier?")
      elif p_name == 'Premium Investor':
        starters.append("How are you navigating the current capital market changes in your strategic portfolios?")
      elif p_name == 'Conservative Saver':
        starters.append("Are safety and immediate yield options aligned with your short-term reserves planning?")
    
    # Strictly clamp starters list to between 5 and 8 items
    return starters[:8] if len(starters) >= 5 else starters + [
      "How satisfied are you with your banking experience?",
      "Are there any specific service areas where we can support you better?"
    ][:8 - len(starters)]
