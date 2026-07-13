import * as fs from 'fs';
import * as path from 'path';

interface Transaction {
  date: string;
  description: string;
  category: 'SALARY' | 'BUSINESS' | 'UTILITIES' | 'GROCERIES' | 'RENT' | 'SHOPPING' | 'ENTERTAINMENT' | 'INVESTMENT' | 'OTHER';
  amount: number;
  type: 'INFLOW' | 'OUTFLOW';
}

interface ProspectSeed {
  id: string;
  name: string;
  rmId: string;
  segment: 'RETAIL' | 'MSME';
  traditionalSummary: {
    averageBalance: number;
    existingLoansCount: number;
    creditBureauScore?: number;
  };
  alternativeSummary: {
    upiOutflowAvg: number;
    gstTurnoverAvg?: number;
    epfoInflowAvg?: number;
    utilityBillConsistency: number; // percentage (0 to 100)
  };
  rawTransactions: Transaction[];
  engagementStatus: 'UNCONTACTED' | 'CONTACTED' | 'CONVERTED' | 'DECLINED' | 'FOLLOW_UP_NEEDED';
}

const generateTransactions = (
  salary: number,
  businessTurnover: number,
  needsRatio: number, // Groceries, utilities, rent
  luxuryRatio: number, // Shopping, entertainment
  savingRatio: number,
  billConsistency: number
): Transaction[] => {
  const transactions: Transaction[] = [];
  const startMonth = 1;
  const endMonth = 6;
  
  for (let month = startMonth; month <= endMonth; month++) {
    const year = 2026;
    const monthStr = month.toString().padStart(2, '0');
    
    // Inflows
    if (salary > 0) {
      transactions.push({
        date: `${year}-${monthStr}-01`,
        description: 'EPFO SALARY CREDIT',
        category: 'SALARY',
        amount: salary,
        type: 'INFLOW'
      });
    }
    
    if (businessTurnover > 0) {
      // 2-3 business transactions per month
      transactions.push({
        date: `${year}-${monthStr}-05`,
        description: 'GST BUSINESS INFLOW 1',
        category: 'BUSINESS',
        amount: Math.round(businessTurnover * 0.6),
        type: 'INFLOW'
      });
      transactions.push({
        date: `${year}-${monthStr}-20`,
        description: 'GST BUSINESS INFLOW 2',
        category: 'BUSINESS',
        amount: Math.round(businessTurnover * 0.4),
        type: 'INFLOW'
      });
    }

    // Outflows - Utilities
    const paidBills = Math.random() * 100 <= billConsistency;
    if (paidBills) {
      transactions.push({
        date: `${year}-${monthStr}-04`,
        description: 'STATE ELECTRICITY BOARD',
        category: 'UTILITIES',
        amount: 2500 + Math.round(Math.random() * 500),
        type: 'OUTFLOW'
      });
    }
    
    transactions.push({
      date: `${year}-${monthStr}-08`,
      description: 'TELECOM MOBILE BILL',
      category: 'UTILITIES',
      amount: 799,
      type: 'OUTFLOW'
    });

    // Rent
    const income = salary + businessTurnover;
    transactions.push({
      date: `${year}-${monthStr}-05`,
      description: 'HOUSE/OFFICE RENT TRANSFER',
      category: 'RENT',
      amount: Math.round(income * 0.2),
      type: 'OUTFLOW'
    });

    // Groceries (Needs)
    const needsAmount = income * needsRatio;
    for (let day of [10, 20, 28]) {
      transactions.push({
        date: `${year}-${monthStr}-${day}`,
        description: 'UPI GROCERY STORE',
        category: 'GROCERIES',
        amount: Math.round((needsAmount / 3) * (0.9 + Math.random() * 0.2)),
        type: 'OUTFLOW'
      });
    }

    // Luxury (Discretionary)
    if (luxuryRatio > 0) {
      const luxuryAmount = income * luxuryRatio;
      transactions.push({
        date: `${year}-${monthStr}-15`,
        description: 'MALL LUXURY SHOPPING',
        category: 'SHOPPING',
        amount: Math.round(luxuryAmount * 0.7),
        type: 'OUTFLOW'
      });
      transactions.push({
        date: `${year}-${monthStr}-22`,
        description: 'MULTIPLEX ENTERTAINMENT',
        category: 'ENTERTAINMENT',
        amount: Math.round(luxuryAmount * 0.3),
        type: 'OUTFLOW'
      });
    }

    // Investments (if saving ratio is healthy)
    if (savingRatio > 0.1) {
      transactions.push({
        date: `${year}-${monthStr}-25`,
        description: 'MUTUAL FUND SIP',
        category: 'INVESTMENT',
        amount: Math.round(income * savingRatio * 0.5),
        type: 'OUTFLOW'
      });
    }
  }

  return transactions.sort((a, b) => a.date.localeCompare(b.date));
};

const prospects: ProspectSeed[] = [
  {
    id: 'p_rm_kumar',
    name: 'Ramesh Kumar',
    rmId: 'rm_priya',
    segment: 'RETAIL',
    traditionalSummary: {
      averageBalance: 45000,
      existingLoansCount: 0,
      creditBureauScore: 720
    },
    alternativeSummary: {
      upiOutflowAvg: 18000,
      epfoInflowAvg: 60000,
      utilityBillConsistency: 100
    },
    rawTransactions: generateTransactions(60000, 0, 0.25, 0.10, 0.15, 100),
    engagementStatus: 'UNCONTACTED'
  },
  {
    id: 'p_sunita_sharma',
    name: 'Sunita Sharma',
    rmId: 'rm_priya',
    segment: 'RETAIL', // Thin-file customer (no credit score but good behavior)
    traditionalSummary: {
      averageBalance: 12000,
      existingLoansCount: 0,
      creditBureauScore: undefined // No traditional credit history
    },
    alternativeSummary: {
      upiOutflowAvg: 12000,
      epfoInflowAvg: 35000,
      utilityBillConsistency: 95
    },
    rawTransactions: generateTransactions(35000, 0, 0.30, 0.05, 0.12, 95),
    engagementStatus: 'UNCONTACTED'
  },
  {
    id: 'p_amit_patel',
    name: 'Amit Patel',
    rmId: 'rm_priya',
    segment: 'MSME', // Business profile
    traditionalSummary: {
      averageBalance: 180000,
      existingLoansCount: 1,
      creditBureauScore: 680
    },
    alternativeSummary: {
      upiOutflowAvg: 85000,
      gstTurnoverAvg: 250000,
      utilityBillConsistency: 90
    },
    rawTransactions: generateTransactions(0, 250000, 0.20, 0.15, 0.25, 90),
    engagementStatus: 'UNCONTACTED'
  },
  {
    id: 'p_priya_das',
    name: 'Priya Das',
    rmId: 'rm_priya',
    segment: 'RETAIL', // High earner but highly erratic spender
    traditionalSummary: {
      averageBalance: 8000,
      existingLoansCount: 2,
      creditBureauScore: 610
    },
    alternativeSummary: {
      upiOutflowAvg: 90000,
      epfoInflowAvg: 120000,
      utilityBillConsistency: 40 // Bad bill consistency
    },
    rawTransactions: generateTransactions(120000, 0, 0.15, 0.65, 0.02, 40),
    engagementStatus: 'UNCONTACTED'
  },
  {
    id: 'p_anil_verma',
    name: 'Anil Verma',
    rmId: 'rm_anil',
    segment: 'RETAIL',
    traditionalSummary: {
      averageBalance: 35000,
      existingLoansCount: 0,
      creditBureauScore: 750
    },
    alternativeSummary: {
      upiOutflowAvg: 15000,
      epfoInflowAvg: 50000,
      utilityBillConsistency: 100
    },
    rawTransactions: generateTransactions(50000, 0, 0.25, 0.08, 0.18, 100),
    engagementStatus: 'UNCONTACTED'
  },
  {
    id: 'p_rajesh_gupta',
    name: 'Rajesh Gupta',
    rmId: 'rm_anil',
    segment: 'MSME', // Weak business stability
    traditionalSummary: {
      averageBalance: 15000,
      existingLoansCount: 2,
      creditBureauScore: 590
    },
    alternativeSummary: {
      upiOutflowAvg: 70000,
      gstTurnoverAvg: 90000,
      utilityBillConsistency: 60
    },
    rawTransactions: generateTransactions(0, 90000, 0.35, 0.40, 0.02, 60),
    engagementStatus: 'UNCONTACTED'
  }
];

const outputPath = path.join(__dirname, '../datasets/prospects.json');
fs.writeFileSync(outputPath, JSON.stringify(prospects, null, 2), 'utf-8');
console.log(`Successfully generated and seeded synthetic prospects to ${outputPath}`);
