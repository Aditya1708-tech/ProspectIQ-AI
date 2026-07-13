import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Generating synthetic banking demo data...');

const rmIds = ['rm_priya', 'rm_anil'];
const occupations = [
  'Software Engineer', 'Consultant', 'Retail Business Owner', 'Medical Practitioner',
  'Primary School Teacher', 'Wholesale Trader', 'Agronomist', 'Civil Engineer',
  'Chartered Accountant', 'Real Estate Agent', 'Restaurant Owner', 'Logistics Manager'
];
const incomeRanges = [
  '300,000 - 500,000',
  '500,000 - 1,000,000',
  '1,000,000 - 2,500,000',
  '2,500,000 - 5,000,000',
  '5,000,000+'
];
const riskCategories = ['LOW', 'MEDIUM', 'HIGH'];
const segments = ['RETAIL', 'MSME'];
const statuses = ['ACTIVE', 'INACTIVE', 'DORMANT', 'PROSPECT', 'BLACKLISTED'];
const preferredContacts = ['EMAIL', 'PHONE', 'SMS'];
const preferredLanguages = ['ENGLISH', 'HINDI'];
const branchCodes = ['BR001', 'BR002', 'BR003'];

const productNames = [
  'Savings Account', 'Current Account', 'Fixed Deposit', 'Personal Loan',
  'Home Loan', 'Business Loan', 'Credit Card', 'Insurance', 'Mutual Fund'
];

const transactionCategories = [
  { category: 'SALARY', type: 'CREDIT', desc: ['Salary Credit', 'Net Salary Outward'] },
  { category: 'UPI', type: 'DEBIT', desc: ['UPI Outflow', 'Payment to Merchant', 'UPI Transfer'] },
  { category: 'UPI', type: 'CREDIT', desc: ['UPI Inward', 'Received from Friend'] },
  { category: 'GST', type: 'DEBIT', desc: ['GST Tax Payment'] },
  { category: 'GST', type: 'CREDIT', desc: ['GST Input Credit Refund', 'Business Trade Inflow'] },
  { category: 'UTILITY', type: 'DEBIT', desc: ['Electricity Bill', 'Telecom Invoice', 'Water Charge'] },
  { category: 'Discretionary', type: 'DEBIT', desc: ['Restaurant Bill', 'Cinema Booking', 'Weekend Shopping'] },
  { category: 'Shopping', type: 'DEBIT', desc: ['Amazon Purchase', 'Supermarket Cart'] }
];

const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Krishna', 'Ishaan', 'Shaurya', 'Ananya', 'Diya', 'Pari', 'Priya', 'Riya', 'Ira', 'Pranav', 'Kabir', 'Rahul', 'Neha', 'Amit', 'Vikram'];
const lastNames = ['Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Das', 'Sen', 'Joshi', 'Nair', 'Mehta', 'Gupta', 'Roy', 'Rao', 'Bose', 'Chatterjee', 'Reddy', 'Pillai', 'Deshmukh'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

const customers = [];
let totalTransactions = 0;

for (let i = 1; i <= 100; i++) {
  const customerId = crypto.randomUUID();
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  const name = `${firstName} ${lastName}`;
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}`;
  const email = `${username}@idbi-mail.co.in`;
  const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
  const rmId = getRandomItem(rmIds);
  const occupation = getRandomItem(occupations);
  const incomeRange = getRandomItem(incomeRanges);
  const riskCategory = getRandomItem(riskCategories);
  const segment = getRandomItem(segments);
  const status = i <= 80 ? 'ACTIVE' : getRandomItem(statuses); // 80% active to keep test sets realistic
  const branchCode = getRandomItem(branchCodes);

  // Address
  const addresses = [
    {
      type: 'RESIDENTIAL',
      street: `${Math.floor(10 + Math.random() * 900)}, MG Road`,
      city: getRandomItem(['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Kolkata']),
      state: 'Maharashtra',
      postalCode: `${Math.floor(400000 + Math.random() * 90000)}`,
      country: 'India'
    }
  ];

  if (Math.random() > 0.5) {
    addresses.push({
      type: 'OFFICE',
      street: `Office Suite ${Math.floor(100 + Math.random() * 900)}, Tech Park`,
      city: addresses[0].city,
      state: addresses[0].state,
      postalCode: addresses[0].postalCode,
      country: 'India'
    });
  }

  // Bank Accounts & Transactions
  const accounts = [];
  const accountCount = Math.random() > 0.4 ? 2 : 1;
  
  for (let a = 1; a <= accountCount; a++) {
    const accountId = crypto.randomUUID();
    const isSavings = a === 1;
    const accountNumber = `${isSavings ? 'SAV' : 'CUR'}${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const balance = isSavings ? getRandomNumber(10000, 500000) : getRandomNumber(50000, 2000000);
    
    // Transactions
    const transactions = [];
    const txCount = 20; // Exact 20 transactions per account to get 20 * 120 = 2400 transactions
    
    for (let t = 1; t <= txCount; t++) {
      const txId = crypto.randomUUID();
      const txCategory = getRandomItem(transactionCategories);
      const amount = Math.floor(getRandomNumber(100, txCategory.category === 'SALARY' || txCategory.category === 'GST' ? 80000 : 8000));
      const description = `${getRandomItem(txCategory.desc)} ${t}`;
      
      const date = new Date();
      date.setDate(date.getDate() - t); // value dates scaling back
      
      transactions.push({
        id: txId,
        amount,
        type: txCategory.type,
        category: txCategory.category,
        description,
        reference: `TXN${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        valueDate: date.toISOString()
      });
      totalTransactions++;
    }

    accounts.push({
      id: accountId,
      accountNumber,
      accountType: isSavings ? 'SAVINGS' : 'CURRENT',
      balance: Math.floor(balance),
      transactions
    });
  }

  // Product holdings
  const holdings = [];
  const holdingCount = Math.floor(getRandomNumber(1, 5));
  const usedProducts = new Set();
  while (usedProducts.size < holdingCount) {
    usedProducts.add(getRandomItem(productNames));
  }
  for (const name of usedProducts) {
    holdings.push({
      name,
      status: 'ACTIVE'
    });
  }

  // Interactions
  const interactions = [];
  const interCount = Math.floor(getRandomNumber(1, 3));
  const interactionTypes = ['CALL', 'EMAIL', 'MEETING'];
  const interactionSummaries = [
    'Portfolio check-in discussion',
    'Follow up on current account balance drop',
    'Meeting to discuss credit limit extension requirements',
    'Email regarding fixed deposit maturity options'
  ];

  for (let j = 1; j <= interCount; j++) {
    const interDate = new Date();
    interDate.setDate(interDate.getDate() - j * 5);
    interactions.push({
      type: getRandomItem(interactionTypes),
      summary: getRandomItem(interactionSummaries),
      notes: `Recorded summary checkpoint notes for touchpoint ${j}.`,
      interactionDate: interDate.toISOString()
    });
  }

  // Documents
  const documents = [
    { name: 'PAN Card copy', type: 'PAN', url: `/docs/${customerId}_pan.pdf` }
  ];
  if (segment === 'MSME') {
    documents.push({ name: 'GST Registration Return', type: 'GSTIN', url: `/docs/${customerId}_gst.pdf` });
  }

  customers.push({
    id: customerId,
    name,
    email,
    phone,
    occupation,
    incomeRange,
    riskCategory,
    segment,
    status,
    rmId,
    branchCode,
    preferredContact: getRandomItem(preferredContacts),
    preferredLanguage: getRandomItem(preferredLanguages),
    addresses,
    accounts,
    productHoldings: holdings,
    interactions,
    documents
  });
}

const outputPath = path.join(__dirname, '../demo-data/customers_demo.json');
fs.writeFileSync(outputPath, JSON.stringify(customers, null, 2), 'utf-8');

console.log(`Generated ${customers.length} customers.`);
console.log(`Generated ${totalTransactions} transactions.`);
console.log(`Seeded dataset saved to ${outputPath}`);
