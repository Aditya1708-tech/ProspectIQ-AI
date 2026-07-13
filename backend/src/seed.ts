import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { CustomerRepository } from './repositories/customer-repository.js';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Seeding database with roles and users...');

  // 1. Seed Roles
  const roles = [
    { name: 'Relationship Manager', code: 'RM' },
    { name: 'Branch Manager', code: 'BRANCH_MANAGER' },
    { name: 'Regional Manager', code: 'REGIONAL_MANAGER' },
    { name: 'Administrator', code: 'ADMIN' }
  ];

  const dbRoles: Record<string, any> = {};

  for (const r of roles) {
    dbRoles[r.code] = await prisma.role.upsert({
      where: { code: r.code },
      update: { name: r.name },
      create: r
    });
  }
  console.log(`Seeded ${Object.keys(dbRoles).length} security roles.`);

  // 2. Seed Users with hashed passwords
  const defaultPassword = 'password123';
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

  const users = [
    { username: 'priya', name: 'Priya Sharma', roleCodes: ['RM'] },
    { username: 'anil', name: 'Anil Verma', roleCodes: ['RM'] },
    { username: 'sunita', name: 'Sunita Iyer', roleCodes: ['RM'] },
    { username: 'sunil', name: 'Sunil Mehta', roleCodes: ['BRANCH_MANAGER'] },
    { username: 'amit', name: 'Amit Shah', roleCodes: ['REGIONAL_MANAGER'] },
    { username: 'admin', name: 'Bank Administrator', roleCodes: ['ADMIN'] }
  ];

  for (const u of users) {
    const existingUser = await prisma.user.findUnique({
      where: { username: u.username }
    });

    if (existingUser) {
      // Delete existing roles links to prevent conflict on re-runs
      await prisma.userRole.deleteMany({
        where: { userId: existingUser.id }
      });

      // Update user password and name
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: u.name,
          passwordHash,
          roles: {
            create: u.roleCodes.map(code => ({
              roleId: dbRoles[code].id
            }))
          }
        }
      });
      console.log(`Updated user: ${u.username}`);
    } else {
      await prisma.user.create({
        data: {
          username: u.username,
          name: u.name,
          passwordHash,
          roles: {
            create: u.roleCodes.map(code => ({
              roleId: dbRoles[code].id
            }))
          }
        }
      });
      console.log(`Created user: ${u.username}`);
    }
  }

  const rmUsers = await prisma.user.findMany({
    where: { username: { in: ['priya', 'anil', 'sunita'] } }
  });

  // 3. Seed Customers from customers_demo.json
  const customersPath = path.join(__dirname, '../../demo-data/customers_demo.json');
  if (fs.existsSync(customersPath)) {
    const rawData = fs.readFileSync(customersPath, 'utf-8');
    const demoCustomers = JSON.parse(rawData);
    
    console.log(`Ingesting ${demoCustomers.length} demo customers to PostgreSQL database...`);
    const customerRepo = new CustomerRepository();
    
    for (const c of demoCustomers) {
      // Re-map the RM username to DB user ID
      const targetRmUsername = c.rmId === 'rm_priya' ? 'priya' : (c.rmId === 'rm_sunita' ? 'sunita' : 'anil');
      const dbUser = await prisma.user.findUnique({ where: { username: targetRmUsername } });
      const targetRmId = dbUser ? dbUser.id : c.rmId;

      await customerRepo.upsertImportRecord({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        occupation: c.occupation,
        incomeRange: c.incomeRange,
        riskCategory: c.riskCategory,
        segment: c.segment,
        status: c.status,
        rmId: targetRmId,
        branchCode: c.branchCode,
        preferredContact: c.preferredContact,
        preferredLanguage: c.preferredLanguage,
        addresses: c.addresses,
        accounts: c.accounts,
        productHoldings: c.productHoldings,
        interactions: c.interactions
      });
    }
    console.log(`Ingested ${demoCustomers.length} customers successfully.`);

    // Ingest additional synthetic customers if count is less than 150
    const extraCount = 150 - demoCustomers.length;
    if (extraCount > 0) {
      console.log(`Generating and ingesting ${extraCount} additional synthetic demo customers to reach 150...`);
      const occupations = ['Software Architect', 'Physician', 'Senior consultant', 'Corporate Director', 'Chartered Accountant', 'Retail Merchant', 'Civil Contractor'];
      const incomeRanges = ['10L - 25L', '25L - 50L', '50L+'];
      const riskCategories = ['LOW', 'MEDIUM', 'HIGH'];
      const segments = ['RETAIL', 'MSME'];
      const languages = ['ENGLISH', 'HINDI', 'MARATHI'];
      const interactionTypes = ['CALL', 'EMAIL', 'MEETING'];
      
      const firstNames = ['Rajesh', 'Suresh', 'Amit', 'Vikram', 'Anjali', 'Karan', 'Pooja', 'Rohan', 'Neeta', 'Deepak', 'Manish', 'Rita', 'Sunil', 'Neha', 'Girish', 'Meera', 'Kiran', 'Arun', 'Sneha', 'Abhishek'];
      const lastNames = ['Kumar', 'Sharma', 'Patel', 'Joshi', 'Mehta', 'Nair', 'Rao', 'Singh', 'Gupta', 'Verma', 'Mishra', 'Deshmukh', 'Kulkarni', 'Reddy', 'Choudhury', 'Iyer', 'Sen', 'Pillai', 'Shetty', 'Shah'];

      for (let i = 0; i < extraCount; i++) {
        const targetRm = rmUsers[i % rmUsers.length];
        const targetRmId = targetRm ? targetRm.id : 'rm_priya';
        const custId = `cust_extra_${100 + i}`;
        const name = `${firstNames[i % firstNames.length]} ${lastNames[(i + 7) % lastNames.length]}`;
        const email = `${name.toLowerCase().replace(/\s+/g, '.')}@idbimail.in`;
        const phone = `+91 9820${String(i).padStart(6, '0')}`;
        
        await customerRepo.upsertImportRecord({
          id: custId,
          name,
          email,
          phone,
          occupation: occupations[i % occupations.length],
          incomeRange: incomeRanges[i % incomeRanges.length],
          riskCategory: riskCategories[i % riskCategories.length],
          segment: segments[i % segments.length],
          status: 'ACTIVE',
          rmId: targetRmId,
          branchCode: 'MUM01',
          preferredContact: 'PHONE',
          preferredLanguage: languages[i % languages.length],
          addresses: [
            {
              type: 'RESIDENTIAL',
              street: `${100 + i} IDBI Tower, Nariman Point`,
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400021',
              country: 'India'
            }
          ],
          accounts: [
            {
              accountNumber: `IDBI1000${100000 + i}`,
              accountType: i % 2 === 0 ? 'SAVINGS' : 'CURRENT',
              balance: 150000 + (i * 25000),
              currency: 'INR'
            }
          ],
          productHoldings: [
            { name: i % 2 === 0 ? 'Savings Account' : 'Current Account' },
            { name: 'Fixed Deposit' }
          ],
          interactions: [
            {
              type: interactionTypes[i % interactionTypes.length],
              summary: 'Initial customer briefing and KYC collection.',
              notes: 'Discussed alternative financial investments and portfolio growth strategies.',
              interactionDate: new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000)).toISOString()
            }
          ]
        });
      }
      console.log(`Generated and ingested ${extraCount} extra customers successfully.`);
    }

    // Ingest RM Tasks
    console.log('Seeding RM Tasks in the database...');
    await prisma.rMTask.deleteMany({});
    
    const dbCustomers = await prisma.customer.findMany({ take: 35 });
    const taskTitles = [
      { title: 'KYC Renewal Audit', cat: 'KYC', priority: 'HIGH', desc: 'Verify PAN validity and regional address proof records.' },
      { title: 'Portfolio Review consultation', cat: 'Portfolio Review', priority: 'MEDIUM', desc: 'Analyze credit line utilization rates and investment holdings.' },
      { title: 'Dormancy Follow-up call', cat: 'Dormancy', priority: 'MEDIUM', desc: 'Contact client regarding savings account inactivity.' },
      { title: 'Meeting Scheduled: Wealth Advisory', cat: 'Meeting', priority: 'HIGH', desc: 'Direct briefing on customized mutual fund returns at Mumbai HQ.' },
      { title: 'High Net Worth Visit', cat: 'Relationship', priority: 'HIGH', desc: 'Executive visit to Nariman Point office for credit options discussion.' },
      { title: 'Documentation Pending for MSME credit', cat: 'Documentation', priority: 'LOW', desc: 'Collect tax statements and GSTIN certificates.' }
    ];
    
    const statuses = ['Pending', 'In Progress', 'Waiting Customer', 'Completed'];
    
    for (let i = 0; i < dbCustomers.length; i++) {
      const c = dbCustomers[i];
      const taskMeta = taskTitles[i % taskTitles.length];
      const taskStatus = statuses[i % statuses.length];
      
      await prisma.rMTask.create({
        data: {
          id: `task_seed_${i}`,
          customerId: c.id,
          assignedRM: c.rmId,
          title: taskMeta.title,
          description: taskMeta.desc,
          priority: taskMeta.priority,
          status: taskStatus,
          category: taskMeta.cat,
          dueDate: new Date(Date.now() + ((i % 5 - 2) * 24 * 60 * 60 * 1000)),
          estimatedDuration: 15 + (i % 3) * 15
        }
      });
    }
    console.log(`Seeded ${dbCustomers.length} tasks successfully.`);
  } else {
    console.log('customers_demo.json not found, skipping customer ingestion.');
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
