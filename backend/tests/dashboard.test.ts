import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/repositories/prisma.js';
import { CustomerRepository } from '../src/repositories/customer-repository.js';
import { CustomerService } from '../src/services/analytics/customer-service.js';
import { AIClient } from '../src/services/ai/ai-client.js';

describe('ProspectIQ Core - Dashboard Command Center Tests', () => {
  const customerRepo = new CustomerRepository();
  const customerService = new CustomerService();
  const aiClient = new AIClient();
  let testRmId = '';

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
    const existing = await prisma.customer.findFirst({
      where: { rmId: testRmId }
    });

    if (!existing) {
      await prisma.customer.create({
        data: {
          name: 'Raj Patel',
          email: 'raj@patel.com',
          phone: '9988776655',
          occupation: 'Doctor',
          incomeRange: '2,500,000 - 5,000,000',
          riskCategory: 'LOW',
          segment: 'RETAIL',
          status: 'ACTIVE',
          rmId: testRmId,
          branchCode: 'BR001',
          assignedAt: new Date(),
          addresses: {
            create: {
              type: 'RESIDENTIAL',
              street: '45 Park Ave',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400002',
              country: 'India'
            }
          },
          accounts: {
            create: {
              accountNumber: 'SAV001',
              accountType: 'SAVINGS',
              balance: 120000.0,
              currency: 'INR'
            }
          }
        }
      });
    }
  });

  it('should successfully list all customer profiles for RM dashboard', async () => {
    const profiles = await customerService.listAllCustomerProfiles(testRmId, ['RM']);
    expect(profiles.length).toBeGreaterThanOrEqual(1);
    expect(profiles[0].customer.name).toBeDefined();
    expect(profiles[0].accounts.length).toBeGreaterThanOrEqual(1);
  });

  it('should compile portfolioIQ analysis through AIClient', async () => {
    const profiles = await customerService.listAllCustomerProfiles(testRmId, ['RM']);
    const result = await aiClient.analyzePortfolio(profiles);

    expect(result.summary).toBeDefined();
    expect(result.summary.totalCustomers).toBeGreaterThanOrEqual(1);
    expect(result.health).toBeDefined();
    expect(result.health.overallHealthScore).toBeGreaterThan(0);
    expect(result.executiveSummary.length).toBeGreaterThan(50);
    expect(result.priorityDistribution.nurture).toBeDefined();
    expect(result.topOpportunities.length).toBeGreaterThanOrEqual(1);
    expect(result.rmLeaderboard.length).toBeGreaterThanOrEqual(1);
    expect(result.trends.length).toBe(6);
    expect(result.distributions.segments).toBeDefined();
  });
});
