from typing import Dict, List, Optional
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData, DimensionDetail
from engines.findna.constants import OCCUPATION_STABILITY_WEIGHTS, INCOME_RANGE_POTENTIAL, RISK_PENALTY_MAP

class DimensionScorer:
  def __init__(self, confidence_evaluator):
    self.evaluator = confidence_evaluator

  def compute_income_stability(
    self,
    profile: CustomerProfileRequest,
    behavior: Optional[BehaviorIQData],
    confidence: str
  ) -> DimensionDetail:
    factors = []
    
    # Factor 1: Occupation Stability (50%)
    occ = profile.occupation
    occ_weight = OCCUPATION_STABILITY_WEIGHTS.get(occ, 0.5)
    f1_score = occ_weight * 100.0
    factors.append(f"Occupation '{occ}' stability tier: {f1_score:.0f}/100 (50% weight).")

    # Factor 2: Salary Credit presence (30%)
    salary_detected = behavior.income.salaryDetected if behavior else False
    f2_score = 100.0 if salary_detected else 30.0
    factors.append(f"Salary deposits check: {'Active corporate credit' if salary_detected else 'No regular salary match'} (30% weight).")

    # Factor 3: Income range potential (20%)
    f3_score = INCOME_RANGE_POTENTIAL.get(profile.incomeRange, 50.0)
    factors.append(f"Income bracket '{profile.incomeRange}': {f3_score:.0f}/100 (20% weight).")

    score = (f1_score * 0.5) + (f2_score * 0.3) + (f3_score * 0.2)
    
    return DimensionDetail(
      score=round(score, 2),
      confidence=confidence,
      factors=factors
    )

  def compute_expense_discipline(
    self,
    profile: CustomerProfileRequest,
    behavior: Optional[BehaviorIQData],
    confidence: str
  ) -> DimensionDetail:
    factors = []
    
    # Factor 1: Savings Ratio (50%)
    savings_ratio = behavior.savings.savingsRatio if behavior else 20.0
    f1_score = savings_ratio
    factors.append(f"Behavioral savings ratio: {f1_score:.1f}% (50% weight).")

    # Factor 2: Low Discretionary Spend Ratio (30%)
    discretionary_spend = 0.0
    if behavior:
      discretionary_spend = behavior.expenses.spendingCategories.get("Discretionary", 0.0) + \
                            behavior.expenses.spendingCategories.get("Shopping", 0.0)
      total_debits = behavior.expenses.totalDebits
      disc_ratio = (discretionary_spend / total_debits) * 100.0 if total_debits > 0 else 0.0
      f2_score = max(0.0, 100.0 - disc_ratio)
      factors.append(f"Discretionary spend restraint (micro-spend ratio: {disc_ratio:.1f}%): {f2_score:.1f}/100 (30% weight).")
    else:
      f2_score = 50.0
      factors.append("No behavioral metrics. Defaulting spend restraint to 50/100.")

    # Factor 3: Low Cash Dependency (20%)
    cash_dependency = behavior.expenses.cashDependencyRatio if behavior else 20.0
    f3_score = max(0.0, 100.0 - cash_dependency)
    factors.append(f"Cash dependency restraint (cash withdrawal ratio: {cash_dependency:.1f}%): {f3_score:.1f}/100 (20% weight).")

    score = (f1_score * 0.5) + (f2_score * 0.3) + (f3_score * 0.2)

    return DimensionDetail(
      score=round(score, 2),
      confidence=confidence,
      factors=factors
    )

  def compute_savings_health(
    self,
    profile: CustomerProfileRequest,
    behavior: Optional[BehaviorIQData],
    confidence: str
  ) -> DimensionDetail:
    factors = []
    
    # Factor 1: Savings Ratio (60%)
    savings_ratio = behavior.savings.savingsRatio if behavior else 10.0
    f1_score = savings_ratio
    factors.append(f"Cash flow surplus savings ratio: {f1_score:.1f}% (60% weight).")

    # Factor 2: Absolute Savings Thresholds (40%)
    total_savings = behavior.savings.totalSavings if behavior else 0.0
    if total_savings >= 500000.0:
      f2_score = 100.0
    elif total_savings >= 150000.0:
      f2_score = 75.0
    elif total_savings >= 50000.0:
      f2_score = 50.0
    else:
      f2_score = 25.0
    factors.append(f"Liquid assets threshold (INR {total_savings:,.2f}): {f2_score:.0f}/100 (40% weight).")

    score = (f1_score * 0.6) + (f2_score * 0.4)

    return DimensionDetail(
      score=round(score, 2),
      confidence=confidence,
      factors=factors
    )

  def compute_liquidity_strength(
    self,
    profile: CustomerProfileRequest,
    behavior: Optional[BehaviorIQData],
    confidence: str
  ) -> DimensionDetail:
    factors = []
    
    # Factor 1: Reserves Coverage of expenses (60%)
    total_savings = behavior.savings.totalSavings if behavior else 0.0
    monthly_estimate = behavior.income.monthlyEstimate if behavior else 30000.0
    
    coverage = total_savings / monthly_estimate if monthly_estimate > 0 else 0.0
    if coverage >= 6.0:
      f1_score = 100.0
    elif coverage >= 3.0:
      f1_score = 80.0
    elif coverage >= 1.0:
      f1_score = 50.0
    else:
      f1_score = 20.0
    factors.append(f"Expense reserves multiplier ({coverage:.1f}x monthly income): {f1_score:.0f}/100 (60% weight).")

    # Factor 2: Account redundancy (40%)
    accounts_count = len(profile.accounts)
    f2_score = 100.0 if accounts_count >= 2 else (60.0 if accounts_count == 1 else 0.0)
    factors.append(f"Account linkage count ({accounts_count}): {f2_score:.0f}/100 (40% weight).")

    score = (f1_score * 0.6) + (f2_score * 0.4)

    return DimensionDetail(
      score=round(score, 2),
      confidence=confidence,
      factors=factors
    )

  def compute_digital_adoption(
    self,
    profile: CustomerProfileRequest,
    behavior: Optional[BehaviorIQData],
    confidence: str
  ) -> DimensionDetail:
    factors = []
    
    # Factor 1: Digital payment ratio (70%)
    digital_ratio = behavior.expenses.digitalPaymentRatio if behavior else 50.0
    f1_score = digital_ratio
    factors.append(f"Digital UPI/Card payment ratio: {f1_score:.1f}% (70% weight).")

    # Factor 2: Transaction frequency check (30%)
    tx_count = behavior.transactions.totalCount if behavior else 0
    f2_score = min(100.0, tx_count * 5.0) # 20 transactions yields 100 points
    factors.append(f"Transaction count density ({tx_count} records): {f2_score:.0f}/100 (30% weight).")

    score = (f1_score * 0.7) + (f2_score * 0.3)

    return DimensionDetail(
      score=round(score, 2),
      confidence=confidence,
      factors=factors
    )

  def compute_credit_health(
    self,
    profile: CustomerProfileRequest,
    behavior: Optional[BehaviorIQData],
    confidence: str
  ) -> DimensionDetail:
    factors = []
    
    # Factor 1: Internal database risk penalty (60%)
    risk = profile.riskCategory
    penalty = RISK_PENALTY_MAP.get(risk, 20.0)
    f1_score = max(0.0, 100.0 - penalty)
    factors.append(f"Corporate risk profile classification '{risk}': {f1_score:.0f}/100 (60% weight).")

    # Factor 2: Current Account status activity check (40%)
    status = profile.status
    if status == 'ACTIVE':
      f2_score = 100.0
    elif status in ['INACTIVE', 'PROSPECT']:
      f2_score = 70.0
    else:
      f2_score = 30.0
    factors.append(f"Account active status code '{status}': {f2_score:.0f}/100 (40% weight).")

    score = (f1_score * 0.6) + (f2_score * 0.4)

    return DimensionDetail(
      score=round(score, 2),
      confidence=confidence,
      factors=factors
    )

  def compute_investment_readiness(
    self,
    profile: CustomerProfileRequest,
    behavior: Optional[BehaviorIQData],
    confidence: str,
    savings_health: float
  ) -> DimensionDetail:
    factors = []
    
    # Factor 1: Savings score capacity (40%)
    f1_score = savings_health
    factors.append(f"Savings health baseline potential: {f1_score:.1f}/100 (40% weight).")

    # Factor 2: Risk tolerance headroom (30%)
    risk = profile.riskCategory
    f2_score = 90.0 if risk == 'LOW' else (70.0 if risk == 'MEDIUM' else 40.0)
    factors.append(f"Risk tolerance capacity classification '{risk}': {f2_score:.0f}/100 (30% weight).")

    # Factor 3: Existing holding tags (30%)
    # If customer already has product holdings, they are investment literate
    holdings_count = len(profile.accounts) # Using accounts as indicator
    f3_score = 100.0 if holdings_count >= 2 else 60.0
    factors.append(f"Existing product relationships indicator: {f3_score:.0f}/100 (30% weight).")

    score = (f1_score * 0.4) + (f2_score * 0.3) + (f3_score * 0.3)

    return DimensionDetail(
      score=round(score, 2),
      confidence=confidence,
      factors=factors
    )

  def compute_wealth_potential(
    self,
    profile: CustomerProfileRequest,
    behavior: Optional[BehaviorIQData],
    confidence: str,
    income_stability: float
  ) -> DimensionDetail:
    factors = []
    
    # Factor 1: Income Range bracket potential (60%)
    f1_score = INCOME_RANGE_POTENTIAL.get(profile.incomeRange, 50.0)
    factors.append(f"Annual income bracket capacity '{profile.incomeRange}': {f1_score:.0f}/100 (60% weight).")

    # Factor 2: Professional modifier (40%)
    f2_score = income_stability
    factors.append(f"Professional income stability modifier: {f2_score:.1f}/100 (40% weight).")

    score = (f1_score * 0.6) + (f2_score * 0.4)

    return DimensionDetail(
      score=round(score, 2),
      confidence=confidence,
      factors=factors
    )
