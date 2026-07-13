import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/repositories/prisma.js';
import { CustomerRepository } from '../src/repositories/customer-repository.js';
import { CustomerService } from '../src/services/analytics/customer-service.js';
import { ImportService } from '../src/services/analytics/import-service.js';
import { AIClient } from '../src/services/ai/ai-client.js';
import { customerQuerySchema } from 'shared';

describe('ProspectIQ Core - Customer Intelligence Foundation Tests', () => {
  const customerRepo = new CustomerRepository();
  const customerService = new CustomerService();
  const importService = new ImportService();
  let testRmId = '';

  beforeAll(async () => {
    // Clean tables related to customers
    await prisma.transaction.deleteMany();
    await prisma.bankAccount.deleteMany();
    await prisma.customerAddress.deleteMany();
    await prisma.productHolding.deleteMany();
    await prisma.interaction.deleteMany();
    await prisma.document.deleteMany();
    await prisma.customer.deleteMany();

    // Get or create an RM to assign customers to
    let user = await prisma.user.findFirst({
      where: { username: 'priya_test' }
    });

    if (!user) {
      const bcrypt = await import('bcrypt');
      const passHash = await bcrypt.default.hash('password123', 10);
      let rmRole = await prisma.role.findUnique({ where: { code: 'RM' } });
      if (!rmRole) {
        rmRole = await prisma.role.create({ data: { name: 'Relationship Manager', code: 'RM' } });
      }

      user = await prisma.user.create({
        data: {
          username: 'priya_test',
          name: 'Priya Test',
          passwordHash: passHash,
          roles: {
            create: [
              { roleId: rmRole.id }
            ]
          }
        }
      });
    }

    testRmId = user.id;
  });

  describe('ImportService & Mapping Layer', () => {
    it('should successfully parse a CSV buffer and import records using column mapping', async () => {
      const csvData = `Full Name,Email Addr,Phone,Occup,Income,Risk,Segment,Branch,AccNum,Bal
Ramesh Kumar,ramesh@mail.com,9876543210,Software Engineer,1200000,LOW,RETAIL,BR002,ACC987,75000`;
      
      const buffer = Buffer.from(csvData, 'utf-8');
      
      // Define a custom column mapping matching the headers above
      const mapping = {
        'Full Name': 'name',
        'Email Addr': 'email',
        'Phone': 'phone',
        'Occup': 'occupation',
        'Income': 'incomeRange',
        'Risk': 'riskCategory',
        'Segment': 'segment',
        'Branch': 'branchCode',
        'AccNum': 'accountNumber',
        'Bal': 'balance'
      };

      const summary = await importService.importFromBuffer(
        buffer,
        'text/csv',
        mapping,
        testRmId
      );

      expect(summary.total).toBe(1);
      expect(summary.imported).toBe(1);
      expect(summary.failed).toBe(0);
      expect(summary.errors.length).toBe(0);

      // Verify customer exists in database
      const customer = await prisma.customer.findFirst({
        where: { name: 'Ramesh Kumar' },
        include: { accounts: true }
      });
      
      expect(customer).not.toBeNull();
      expect(customer?.rmId).toBe(testRmId);
      expect(customer?.accounts[0].accountNumber).toBe('ACC987');
      expect(customer?.accounts[0].balance).toBe(75000);
    });

    it('should fail records missing required fields', async () => {
      const csvData = `Full Name,Phone,Occup
,9876543210,Engineer`; // Missing Name
      
      const buffer = Buffer.from(csvData, 'utf-8');
      const mapping = { 'Full Name': 'name', 'Phone': 'phone', 'Occup': 'occupation' };

      const summary = await importService.importFromBuffer(
        buffer,
        'text/csv',
        mapping,
        testRmId
      );

      expect(summary.total).toBe(1);
      expect(summary.imported).toBe(0);
      expect(summary.failed).toBe(1);
      expect(summary.errors[0].column).toBe('name');
    });
  });

  describe('CustomerRepository & CustomerService API Layers', () => {
    it('should find paginated listings, filtering, and search keyword', async () => {
      // Find all as RM
      const listParams = {
        page: 1,
        limit: 10,
        sort: 'name',
        order: 'asc' as const,
        search: 'Ramesh'
      };

      const result = await customerService.listCustomers(listParams, testRmId, ['RM']);
      expect(result.data.length).toBe(1);
      expect(result.data[0].name).toBe('Ramesh Kumar');
      expect(result.pagination.total).toBe(1);

      // Verify searching for something non-existent returns empty
      const emptyResult = await customerService.listCustomers({ ...listParams, search: 'NonExistent' }, testRmId, ['RM']);
      expect(emptyResult.data.length).toBe(0);
    });

    it('should enforce RM portfolio security boundaries', async () => {
      // Find a customer of this RM
      const customer = await prisma.customer.findFirst({
        where: { rmId: testRmId }
      });
      expect(customer).not.toBeNull();

      // Query as this RM -> should succeed
      const matched = await customerService.getCustomerById(customer!.id, testRmId, ['RM']);
      expect(matched).not.toBeNull();
      expect(matched?.id).toBe(customer!.id);

      // Query as a different RM -> should reject (returns null)
      const otherRmId = 'u_other_rm_user';
      const rejected = await customerService.getCustomerById(customer!.id, otherRmId, ['RM']);
      expect(rejected).toBeNull();

      // Query as ADMIN with different RM ID -> should succeed (Admin has global bypass)
      const adminSuccess = await customerService.getCustomerById(customer!.id, otherRmId, ['ADMIN']);
      expect(adminSuccess).not.toBeNull();
    });

    it('should aggregate customer profile data correctly', async () => {
      const customer = await prisma.customer.findFirst({
        where: { rmId: testRmId }
      });
      expect(customer).not.toBeNull();

      // Build mock interaction and holding linked to this customer
      await prisma.interaction.create({
        data: {
          customerId: customer!.id,
          rmId: testRmId,
          type: 'MEETING',
          summary: 'Regular MSME review checkup.',
          notes: 'Customer looking for credit line increase next quarter.',
          interactionDate: new Date()
        }
      });

      await prisma.productHolding.create({
        data: {
          customerId: customer!.id,
          name: 'Home Loan',
          status: 'ACTIVE'
        }
      });

      const profile = await customerService.getCustomerProfile(customer!.id, testRmId, ['RM']);
      expect(profile).not.toBeNull();
      expect(profile?.accounts.length).toBeGreaterThan(0);
      expect(profile?.interactions.length).toBe(1);
      expect(profile?.productHoldings.length).toBe(1);
      expect(profile?.summary.totalBalance).toBe(75000);
      expect(profile?.summary.lastInteraction?.type).toBe('MEETING');
    });
  });

  describe('Zod Validation Schemas', () => {
    it('should validate query inputs and defaults', () => {
      const parsed = customerQuerySchema.parse({
        page: '2',
        limit: '15',
        sort: 'createdAt',
        order: 'desc'
      });

      expect(parsed.page).toBe(2);
      expect(parsed.limit).toBe(15);
      expect(parsed.sort).toBe('createdAt');
      expect(parsed.order).toBe('desc');
    });
  });

  describe('AI Client & Graceful Fallback Logic', () => {
    const aiClient = new AIClient();

    it('should fall back gracefully to local analysis when AI service URL is unreachable', async () => {
      // Temporarily change environment URL to an invalid port
      const originalUrl = process.env.AI_SERVICE_URL;
      process.env.AI_SERVICE_URL = 'http://localhost:9999';

      // Find a customer profile
      const customer = await prisma.customer.findFirst({
        where: { rmId: testRmId }
      });
      expect(customer).not.toBeNull();

      const profile = await customerService.getCustomerProfile(customer!.id, testRmId, ['RM']);
      expect(profile).not.toBeNull();

      const result = await aiClient.analyzeProfile(profile!);
      
      // Restore URL
      if (originalUrl) {
        process.env.AI_SERVICE_URL = originalUrl;
      } else {
        delete process.env.AI_SERVICE_URL;
      }

      expect(result.fallback).toBe(true);
      expect(result.trustLayer.data.qualityScore).toBe(90);
      expect(result.behaviorIQ).not.toBeNull();
      expect(result.behaviorIQ?.data.income.totalCredits).toBe(0);
      expect(result.behaviorIQ?.data.savings.totalSavings).toBe(75000);
      expect(result.priorityIQ?.data.opportunityMatrix.category).toBe('Nurture');
      expect(result.copilot?.data.executiveSummary).toContain("Ramesh Kumar");
    });

    it('should call uvicorn FastAPI server analyze if active', async () => {
      // Retrieve customer profile
      const customer = await prisma.customer.findFirst({
        where: { rmId: testRmId }
      });
      expect(customer).not.toBeNull();

      const profile = await customerService.getCustomerProfile(customer!.id, testRmId, ['RM']);
      expect(profile).not.toBeNull();

      const result = await aiClient.analyzeProfile(profile!);
      
      expect(result.trustLayer).toBeDefined();
      expect(result.trustLayer.data).toBeDefined();
      expect(result.trustLayer.data.qualityScore).toBeGreaterThanOrEqual(0);
      expect(result.behaviorIQ).toBeDefined();
      expect(result.priorityIQ).toBeDefined();
      expect(result.copilot).toBeDefined();
    });
  });
});
