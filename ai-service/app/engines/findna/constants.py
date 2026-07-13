OCCUPATION_STABILITY_WEIGHTS = {
  'Medical Practitioner': 1.0,
  'Chartered Accountant': 1.0,
  'Software Engineer': 0.9,
  'Primary School Teacher': 0.9,
  'Civil Engineer': 0.85,
  'Logistics Manager': 0.8,
  'Consultant': 0.7,
  'Retail Business Owner': 0.65,
  'Restaurant Owner': 0.6,
  'Real Estate Agent': 0.5,
  'Wholesale Trader': 0.5,
  'Agronomist': 0.45
}

INCOME_RANGE_POTENTIAL = {
  '300,000 - 500,000': 35.0,
  '500,000 - 1,000,000': 55.0,
  '1,000,000 - 2,500,000': 75.0,
  '2,500,000 - 5,000,000': 90.0,
  '5,000,000+': 100.0
}

RISK_PENALTY_MAP = {
  'LOW': 0.0,
  'MEDIUM': 15.0,
  'HIGH': 40.0
}

PERSONAS = {
  'Growth Builder': {
    'description': 'Active accumulator of wealth focusing on steady income deposits and regular investments.',
    'strengths': ['Consistent income flow', 'Stable career path'],
    'watchAreas': ['High reliance on single salary credit stream', 'Undiversified assets'],
    'bankingFocusAreas': ['Systematic Investment Plans (SIP)', 'Recurring deposits', 'Short-term savings accounts']
  },
  'Wealth Accumulator': {
    'description': 'High savings profile with stable cash flow lines and disciplined savings habits.',
    'strengths': ['Exceptional savings ratio', 'Low dependency on cash withdrawals'],
    'watchAreas': ['Conservative yield generation', 'High liquidity surplus'],
    'bankingFocusAreas': ['High-yield fixed deposits', 'Automated sweeps', 'Mutual fund distribution accounts']
  },
  'Conservative Saver': {
    'description': 'Risk-averse profile prioritizing security and liquidity strength over high equity yields.',
    'strengths': ['Excellent expense discipline', 'Zero active debt holdings'],
    'watchAreas': ['Inflation risk exposure', 'Low investment adoption'],
    'bankingFocusAreas': ['Term deposits', 'Sovereign gold bond linkages', 'Safe savings plans']
  },
  'Credit Dependent': {
    'description': 'Relies on credit buffers with low savings ratios and high transaction frequencies.',
    'strengths': ['Active transaction volumes', 'High digital adoption'],
    'watchAreas': ['Vulnerability to income shock', 'Anomalous credit balances'],
    'bankingFocusAreas': ['Overdraft buffers', 'Debt consolidation facilities', 'Financial wellness tools']
  },
  'Digital Native': {
    'description': 'High digital banking participant utilizing UPI transactions for most of their cash outflows.',
    'strengths': ['Zero paper dependency', 'High UPI payment consistency'],
    'watchAreas': ['High micro-transaction dispersion', 'Impulsive digital shopping spend'],
    'bankingFocusAreas': ['Mobile banking sweeps', 'Digital cashbacks programs', 'UPI-enabled credit lines']
  },
  'Premium Investor': {
    'description': 'High wealth potential client ready for active capital market allocations and premium services.',
    'strengths': ['Significant liquid assets', 'High investment readiness score'],
    'watchAreas': ['Tax planning complexity', 'Market volatility exposure'],
    'bankingFocusAreas': ['Portfolio management services', 'Tax-saver term deposits', 'Premium banking desk access']
  },
  'Emerging Entrepreneur': {
    'description': 'Self-employed MSME owner driving initial business growth with moderate risk tolerances.',
    'strengths': ['High business flow activity', 'Active current account turnover'],
    'watchAreas': ['Volatile monthly cash flows', 'Working capital dependency'],
    'bankingFocusAreas': ['Working capital overdrafts', 'Merchant payment gateways', 'Business credit cards']
  },
  'High Potential MSME': {
    'description': 'Established business segment customer showing high cash flow turnover and low credit risk.',
    'strengths': ['Strong trade credit turnover', 'Excellent liquidity strength'],
    'watchAreas': ['Accounts receivable cycles', 'Seasonal demand variations'],
    'bankingFocusAreas': ['Trade finance limits', 'Letter of Credit services', 'Enterprise salary packages']
  }
}
