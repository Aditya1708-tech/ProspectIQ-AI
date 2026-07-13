from typing import Dict, Optional
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData, FinancialDNAProfile
from engines.findna.confidence import ConfidenceEvaluator
from engines.findna.dimensions import DimensionScorer
from engines.findna.personas import PersonaClassifier

class FinDNAScorer:
  def __init__(self):
    self.confidence_evaluator = ConfidenceEvaluator()
    self.dim_scorer = DimensionScorer(self.confidence_evaluator)
    self.persona_classifier = PersonaClassifier()

  def calculate_dna(
    self,
    profile: CustomerProfileRequest,
    trust: TrustLayerData,
    behavior: Optional[BehaviorIQData]
  ) -> FinancialDNAProfile:
    # 1. Run Confidence Evaluator
    confidence, confidence_factors = self.confidence_evaluator.evaluate_confidence(profile, trust, behavior)

    # 2. Run Dimensions Scorer
    income_stability = self.dim_scorer.compute_income_stability(profile, behavior, confidence)
    expense_discipline = self.dim_scorer.compute_expense_discipline(profile, behavior, confidence)
    savings_health = self.dim_scorer.compute_savings_health(profile, behavior, confidence)
    liquidity_strength = self.dim_scorer.compute_liquidity_strength(profile, behavior, confidence)
    digital_adoption = self.dim_scorer.compute_digital_adoption(profile, behavior, confidence)
    credit_health = self.dim_scorer.compute_credit_health(profile, behavior, confidence)
    
    # Needs savings health baseline
    investment_readiness = self.dim_scorer.compute_investment_readiness(
      profile, behavior, confidence, savings_health.score
    )
    
    # Needs income stability baseline
    wealth_potential = self.dim_scorer.compute_wealth_potential(
      profile, behavior, confidence, income_stability.score
    )

    # Compile scores map for persona matching
    scores = {
      'incomeStability': income_stability.score,
      'expenseDiscipline': expense_discipline.score,
      'savingsHealth': savings_health.score,
      'liquidityStrength': liquidity_strength.score,
      'digitalAdoption': digital_adoption.score,
      'creditHealth': credit_health.score,
      'investmentReadiness': investment_readiness.score,
      'wealthPotential': wealth_potential.score
    }

    # 3. Persona Classification
    persona = self.persona_classifier.classify(profile, scores)

    # Append confidence factors to dimension factors to provide extra explainability context
    income_stability.factors.extend(confidence_factors)
    expense_discipline.factors.extend(confidence_factors)
    savings_health.factors.extend(confidence_factors)
    liquidity_strength.factors.extend(confidence_factors)
    digital_adoption.factors.extend(confidence_factors)
    credit_health.factors.extend(confidence_factors)
    investment_readiness.factors.extend(confidence_factors)
    wealth_potential.factors.extend(confidence_factors)

    return FinancialDNAProfile(
      modelVersion="v1.0.0",
      profileVersion="v1.0.0",
      persona=persona,
      incomeStability=income_stability,
      expenseDiscipline=expense_discipline,
      savingsHealth=savings_health,
      liquidityStrength=liquidity_strength,
      digitalAdoption=digital_adoption,
      creditHealth=credit_health,
      investmentReadiness=investment_readiness,
      wealthPotential=wealth_potential
    )
