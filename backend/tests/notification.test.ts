import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/repositories/prisma.js';
import { CustomerService } from '../src/services/analytics/customer-service.js';
import { AIClient } from '../src/services/ai/ai-client.js';

describe('ProspectIQ Core - NotificationIQ & Communication Center Tests', () => {
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
  });

  it('should call uvicorn FastAPI server analyzeNotifications if active (or trigger local fallback)', async () => {
    const profiles = await customerService.listAllCustomerProfiles(testRmId, ['RM']);
    
    // Create a mock task
    const mockTasks = [
      {
        id: 't-123',
        title: 'Pending Compliance Audits',
        description: 'Resolve account documentation KYC audit status.',
        priority: 'HIGH',
        status: 'Pending',
        category: 'Compliance',
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(Date.now() + 86400000),
        history: []
      }
    ];

    const result = await aiClient.analyzeNotifications(profiles, mockTasks, testRmId, 'RM');
    
    expect(result).toBeDefined();
    expect(result.notifications).toBeDefined();
    expect(result.notifications.length).toBeGreaterThan(0);
    
    // Check fields on individual notifications
    const firstNotif = result.notifications[0];
    expect(firstNotif.id).toBeDefined();
    expect(firstNotif.title).toBeDefined();
    expect(firstNotif.category).toBeDefined();
    expect(firstNotif.priority).toBeDefined();
    expect(firstNotif.channel).toBeDefined();
    expect(firstNotif.createdTime).toBeDefined();
    
    // Check briefs
    expect(result.morningBrief).toBeDefined();
    expect(result.executiveBrief).toBeDefined();
    expect(result.timeline).toBeDefined();
    expect(result.analytics).toBeDefined();
  });
});
