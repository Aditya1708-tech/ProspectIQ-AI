import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/repositories/prisma.js';
import { CustomerRepository } from '../src/repositories/customer-repository.js';
import { CustomerService } from '../src/services/analytics/customer-service.js';
import { AIClient } from '../src/services/ai/ai-client.js';

describe('ProspectIQ Core - RelationshipIQ Customer 360 Tests', () => {
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
          name: 'Vikram Patel',
          email: 'vikram@patel.com',
          phone: '9988776655',
          occupation: 'Merchant Exporter',
          incomeRange: '2,500,000 - 5,000,000',
          riskCategory: 'LOW',
          segment: 'MSME',
          status: 'ACTIVE',
          rmId: testRmId,
          branchCode: 'BR002',
          assignedAt: new Date(),
          addresses: {
            create: {
              type: 'OFFICE',
              street: 'Linking Road',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400050',
              country: 'India'
            }
          },
          accounts: {
            create: {
              accountNumber: 'CURR012',
              accountType: 'CURRENT',
              balance: 1500000.0,
              currency: 'INR'
            }
          }
        }
      });
    }

    testCustomerId = customer.id;

    // Create a completed task to test timeline extraction
    await prisma.rMTask.create({
      data: {
        customerId: testCustomerId,
        assignedRM: testRmId,
        title: 'Initial KYC Checklist',
        description: 'Complete registration identification documents review.',
        priority: 'MEDIUM',
        status: 'Completed',
        category: 'KYC',
        dueDate: new Date(Date.now() + 86400000),
        completedAt: new Date(),
        estimatedDuration: 15,
        actualDuration: 12,
        createdBy: 'System (NBAIQ)'
      }
    });
  });

  it('should include tasks when fetching customer profile via CustomerRepository', async () => {
    const profile = await customerService.getCustomerProfile(testCustomerId, testRmId, ['RM']);
    expect(profile).toBeDefined();
    expect((profile as any).tasks).toBeDefined();
    expect((profile as any).tasks.length).toBeGreaterThan(0);
    expect((profile as any).tasks[0].title).toBe('Initial KYC Checklist');
  });

  it('should compile RelationshipIQ analysis telemetry on analyzeProfile request', async () => {
    const profile = await customerService.getCustomerProfile(testCustomerId, testRmId, ['RM']);
    const analysis = await aiClient.analyzeProfile(profile!);
    
    expect(analysis.relationshipIQ).toBeDefined();
    const rel = analysis.relationshipIQ!.data;
    
    expect(rel.health).toBeDefined();
    expect(rel.health.score).toBeGreaterThan(0);
    expect(rel.health.category).toBeDefined();
    expect(rel.journey.length).toBeGreaterThan(0);
    expect(rel.interactions.meetings).toBeDefined();
    expect(rel.engagement.interactionScore).toBeGreaterThan(0);
    expect(rel.milestones.length).toBeGreaterThan(0);
    expect(rel.touchpoints.calls).toBeDefined();
    expect(rel.risks).toBeDefined();
    expect(rel.summary.briefing).toBeDefined();
  });
});
