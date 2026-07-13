import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/repositories/prisma.js';
import { CustomerRepository } from '../src/repositories/customer-repository.js';
import { CustomerService } from '../src/services/analytics/customer-service.js';
import { AIClient } from '../src/services/ai/ai-client.js';

describe('ProspectIQ Core - NBAIQ Next Best Action Engine Tests', () => {
  const customerRepo = new CustomerRepository();
  const customerService = new CustomerService();
  const aiClient = new AIClient();
  let testRmId = '';
  let testCustomerId = '';

  beforeAll(async () => {
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

    let customer = await prisma.customer.findFirst({
      where: { rmId: testRmId }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: 'Rohan Sharma',
          email: 'rohan@sharma.com',
          phone: '9988776622',
          occupation: 'Merchant Retailer',
          incomeRange: '1,000,000 - 2,500,000',
          riskCategory: 'LOW',
          segment: 'MSME',
          status: 'ACTIVE',
          rmId: testRmId,
          branchCode: 'BR001',
          assignedAt: new Date(),
          addresses: {
            create: {
              type: 'RESIDENTIAL',
              street: '45 MG Road',
              city: 'Pune',
              state: 'Maharashtra',
              postalCode: '411001',
              country: 'India'
            }
          },
          accounts: {
            create: {
              accountNumber: 'SAV010',
              accountType: 'SAVINGS',
              balance: 150000.0,
              currency: 'INR'
            }
          }
        }
      });
    }

    testCustomerId = customer.id;
  });

  it('should compile NBAIQ next best action analysis payload along with profile analysis', async () => {
    const profile = await customerService.getCustomerProfile(testCustomerId, testRmId, ['RM']);
    expect(profile).toBeDefined();

    const analysis = await aiClient.analyzeProfile(profile!);
    expect(analysis.nextBestActionIQ).toBeDefined();
    
    const nbaiq = analysis.nextBestActionIQ!.data;
    expect(nbaiq.overallRecommendation).toBeDefined();
    expect(nbaiq.recommendationCategory).toBeDefined();
    expect(nbaiq.primaryAction).toBeDefined();
    expect(nbaiq.primaryAction.title).toBeDefined();
    expect(nbaiq.primaryAction.sla).toBeDefined();
    expect(nbaiq.confidence.overallScore).toBeGreaterThan(0);
    expect(nbaiq.taskCard.headline).toBeDefined();
    expect(nbaiq.checklist.length).toBeGreaterThan(0);
    expect(nbaiq.schedule.length).toBeGreaterThan(0);
  });
});
