from typing import Dict
from schemas.analyze import CustomerProfileRequest, FinancialPersona
from engines.findna.constants import PERSONAS

class PersonaClassifier:
  def classify(
    self,
    profile: CustomerProfileRequest,
    scores: Dict[str, float]
  ) -> FinancialPersona:
    segment = profile.segment.upper()

    if segment == 'MSME':
      if scores['incomeStability'] >= 70.0:
        persona_name = 'High Potential MSME'
      else:
        persona_name = 'Emerging Entrepreneur'
    else:
      # Retail Segment Heuristics
      if scores['wealthPotential'] >= 80.0 and scores['investmentReadiness'] >= 70.0:
        persona_name = 'Premium Investor'
      elif scores['savingsHealth'] >= 75.0:
        persona_name = 'Wealth Accumulator'
      elif scores['expenseDiscipline'] >= 75.0:
        persona_name = 'Conservative Saver'
      elif scores['digitalAdoption'] >= 80.0:
        persona_name = 'Digital Native'
      elif scores['incomeStability'] >= 70.0:
        persona_name = 'Growth Builder'
      elif scores['expenseDiscipline'] < 40.0:
        persona_name = 'Credit Dependent'
      else:
        persona_name = 'Growth Builder'

    meta = PERSONAS.get(persona_name, PERSONAS['Growth Builder'])

    return FinancialPersona(
      name=persona_name,
      description=meta['description'],
      strengths=meta['strengths'],
      watchAreas=meta['watchAreas'],
      bankingFocusAreas=meta['bankingFocusAreas']
    )
