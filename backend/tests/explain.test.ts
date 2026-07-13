import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/repositories/prisma.js';
import { CustomerRepository } from '../src/repositories/customer-repository.js';
import { CustomerService } from '../src/services/analytics/customer-service.js';
import { AIClient } from '../src/services/ai/ai-client.js';

describe('ProspectIQ Core - ExplainIQ Decision Explainability Tests', () => {
  const customerRepo = new CustomerRepository();
  const customerService = new CustomerService();
  const aiClient = new AIClient();
  let testRmId = '';
  let testCustomerId = '';

  beforeAll(async () => {
    // Ensure test user exists
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

    // Seed at least one customer if none exists
    let customer = await prisma.customer.findFirst({
      where: { rmId: testRmId }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: 'Arjun Sen',
          email: 'arjun@sen.com',
          phone: '9988776611',
          occupation: 'Consultant',
          incomeRange: '1,000,000 - 2,500,000',
          riskCategory: 'LOW',
          segment: 'RETAIL',
          status: 'ACTIVE',
          rmId: testRmId,
          branchCode: 'BR001',
          assignedAt: new Date(),
          addresses: {
            create: {
              type: 'RESIDENTIAL',
              street: '88 Malabar Hill',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400006',
              country: 'India'
            }
          },
          accounts: {
            create: {
              accountNumber: 'SAV009',
              accountType: 'SAVINGS',
              balance: 210000.0,
              currency: 'INR'
            }
          }
        }
      });
    }

    testCustomerId = customer.id;
  });

  it('should compile ExplainIQ analysis along with profile analysis', async () => {
    const profile = await customerService.getCustomerProfile(testCustomerId, testRmId, ['RM']);
    expect(profile).toBeDefined();

    const analysis = await aiClient.analyzeProfile(profile!);
    expect(analysis.explainIQ).toBeDefined();
    
    const explain = analysis.explainIQ!.data;
    expect(explain.executiveExplanation.length).toBeGreaterThan(100);
    expect(explain.decisionTree.length).toBe(7);
    expect(explain.evidenceMatrix.length).toBeGreaterThan(0);
    expect(explain.confidenceModel.overallConfidence).toBeGreaterThan(0);
    expect(explain.reasoningTimeline.length).toBeGreaterThan(0);
    expect(explain.comparisonAnalysis.priorityScore).toBeDefined();
    expect(explain.auditRecord.sha256Digest.length).toBe(64);
    expect(explain.explainabilityRating.transparencyRating).toBe('Excellent');
  });
});
