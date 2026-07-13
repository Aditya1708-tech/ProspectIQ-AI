import datetime
from schemas.analyze import CustomerProfileRequest, BehaviorIQData, IncomeMetrics, ExpenseMetrics, SavingsMetrics, TransactionMetrics

class BehaviorIQEngine:
  def name(self) -> str:
    return "BehaviorIQ"

  def analyze(self, profile: CustomerProfileRequest) -> BehaviorIQData:
    all_transactions = []
    total_savings = 0.0

    for acc in profile.accounts:
      total_savings += acc.balance
      for t in acc.transactions:
        all_transactions.append(t)

    # 1. Base Variables
    total_credits = 0.0
    total_debits = 0.0
    salary_credits = []
    spending_categories = {}
    cash_debits = 0.0
    digital_debits = 0.0
    
    dates = []

    for t in all_transactions:
      amount = abs(t.amount)
      is_credit = t.type.upper() == "CREDIT"
      
      try:
        dt = datetime.datetime.fromisoformat(t.valueDate.replace("Z", "+00:00"))
        dates.append(dt)
      except ValueError:
        pass

      if is_credit:
        total_credits += amount
        # Detect Salary
        desc_lower = t.description.lower()
        if t.category.upper() == "SALARY" or "salary" in desc_lower or "paycheck" in desc_lower:
          salary_credits.append(amount)
      else:
        total_debits += amount
        # Categorized spend
        cat = t.category or "Other"
        spending_categories[cat] = spending_categories.get(cat, 0.0) + amount

        desc_lower = t.description.lower()
        # Cash vs Digital
        if "cash" in desc_lower or "atm" in desc_lower or "withdrawal" in desc_lower or cat.upper() == "CASH":
          cash_debits += amount
        elif t.category.upper() in ["UPI", "GST", "DIGITAL", "CARD"] or "upi" in desc_lower or "transfer" in desc_lower:
          digital_debits += amount

    # Calculate Months Spanned
    months_spanned = 1.0
    if dates:
      min_date = min(dates)
      max_date = max(dates)
      days = (max_date - min_date).days
      months_spanned = max(1.0, days / 30.44)

    # 2. Income Metrics
    salary_detected = len(salary_credits) > 0
    if salary_detected:
      monthly_estimate = sum(salary_credits) / len(salary_credits)
      salary_details = f"Regular corporate salary credits detected. Avg: INR {monthly_estimate:,.2f}"
    else:
      # Inflow average
      monthly_estimate = total_credits / months_spanned
      salary_details = "No direct corporate salary deposits detected. Inflows estimated from cash flow turnover."

    # 3. Expense Metrics
    cash_ratio = (cash_debits / total_debits) * 100.0 if total_debits > 0 else 0.0
    digital_ratio = (digital_debits / total_debits) * 100.0 if total_debits > 0 else 0.0
    
    # Clean up floats in spending categories to 2 decimal places
    clean_categories = {k: round(v, 2) for k, v in spending_categories.items()}

    # 4. Savings Metrics
    net_savings = total_credits - total_debits
    savings_ratio = (net_savings / total_credits) * 100.0 if total_credits > 0 else 0.0
    savings_ratio = max(0.0, min(100.0, savings_ratio)) # Clamp between 0% and 100%

    # 5. Transaction Metrics
    tx_count = len(all_transactions)
    frequency = tx_count / months_spanned

    return BehaviorIQData(
      income=IncomeMetrics(
        totalCredits=round(total_credits, 2),
        monthlyEstimate=round(monthly_estimate, 2),
        salaryDetected=salary_detected,
        salaryDetails=salary_details
      ),
      expenses=ExpenseMetrics(
        totalDebits=round(total_debits, 2),
        spendingCategories=clean_categories,
        cashDependencyRatio=round(cash_ratio, 2),
        digitalPaymentRatio=round(digital_ratio, 2)
      ),
      savings=SavingsMetrics(
        totalSavings=round(total_savings, 2),
        savingsRatio=round(savings_ratio, 2)
      ),
      transactions=TransactionMetrics(
        totalCount=tx_count,
        frequencyPerMonth=round(frequency, 2)
      )
    )
