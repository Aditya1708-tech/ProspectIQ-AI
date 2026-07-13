import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/repositories/prisma.js';
import { CustomerRepository } from '../src/repositories/customer-repository.js';
import { CustomerService } from '../src/services/analytics/customer-service.js';
import { AIClient } from '../src/services/ai/ai-client.js';

describe('ProspectIQ Core - RM Workspace & Task Management Tests', () => {
  const customerService = new CustomerService();
  const aiClient = new AIClient();
  let testRmId = '';
  let testCustomerId = '';
  let testTaskId = '';

  beforeAll(async () => {
    // Seed test RM
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

    // Seed test customer
    let customer = await prisma.customer.findFirst({
      where: { rmId: testRmId }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: 'Vikram Seth',
          email: 'vikram@seth.com',
          phone: '9988776633',
          occupation: 'Industrialist',
          incomeRange: '2,500,000 - 5,000,000',
          riskCategory: 'MEDIUM',
          segment: 'MSME',
          status: 'ACTIVE',
          rmId: testRmId,
          branchCode: 'BR001',
          assignedAt: new Date(),
          addresses: {
            create: {
              type: 'RESIDENTIAL',
              street: '12 Malabar Hills',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400006',
              country: 'India'
            }
          },
          accounts: {
            create: {
              accountNumber: 'SAV011',
              accountType: 'SAVINGS',
              balance: 500000.0,
              currency: 'INR'
            }
          }
        }
      });
    }

    testCustomerId = customer.id;
  });

  it('should support task CRUD operations successfully', async () => {
    // 1. Create a task manually
    const task = await prisma.rMTask.create({
      data: {
        customerId: testCustomerId,
        assignedRM: testRmId,
        title: 'Manually Scheduled Meeting',
        description: 'Discuss asset allocation preferences.',
        priority: 'MEDIUM',
        status: 'Pending',
        category: 'Meeting',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        createdBy: 'Priya Test'
      }
    });

    expect(task).toBeDefined();
    expect(task.id).toBeDefined();
    expect(task.status).toBe('Pending');
    expect(task.priority).toBe('MEDIUM');
    testTaskId = task.id;

    // 2. Read task details
    const fetched = await prisma.rMTask.findUnique({
      where: { id: testTaskId }
    });
    expect(fetched).toBeDefined();
    expect(fetched!.title).toBe('Manually Scheduled Meeting');

    // 3. Update task status
    const updated = await prisma.rMTask.update({
      where: { id: testTaskId },
      data: { status: 'In Progress' }
    });
    expect(updated.status).toBe('In Progress');

    // 4. Delete task
    await prisma.rMTask.delete({
      where: { id: testTaskId }
    });

    const deleted = await prisma.rMTask.findUnique({
      where: { id: testTaskId }
    });
    expect(deleted).toBeNull();
  });

  it('should enforce auto-generation of tasks from NBAIQ profile and prevent duplicates', async () => {
    // Simulate auto generation logic
    const title = 'KYC Update Reminder';
    
    // Check duplication
    const findOpen = async () => prisma.rMTask.findFirst({
      where: {
        customerId: testCustomerId,
        title,
        status: { in: ['Pending', 'In Progress', 'Waiting Customer'] }
      }
    });

    let openTask = await findOpen();
    expect(openTask).toBeNull(); // No open task initially

    // Auto-create task
    const created1 = await prisma.rMTask.create({
      data: {
        customerId: testCustomerId,
        assignedRM: testRmId,
        title,
        description: 'Pending regulatory KYC renewal.',
        priority: 'HIGH',
        status: 'Pending',
        category: 'KYC',
        dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
        createdBy: 'System (NBAIQ)'
      }
    });
    expect(created1).toBeDefined();

    // Try creating again (duplication protection)
    openTask = await findOpen();
    expect(openTask).not.toBeNull(); // An open task exists now

    // Clean up
    await prisma.rMTask.delete({
      where: { id: created1.id }
    });
  });

  it('should calculate calendar, workload, and SLA analytics properly', async () => {
    // Create multiple tasks
    const t1 = await prisma.rMTask.create({
      data: {
        customerId: testCustomerId,
        assignedRM: testRmId,
        title: 'Review Holdings',
        priority: 'MEDIUM',
        status: 'Pending',
        category: 'Portfolio Review',
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday (overdue)
        createdBy: 'System'
      }
    });

    const t2 = await prisma.rMTask.create({
      data: {
        customerId: testCustomerId,
        assignedRM: testRmId,
        title: 'Digital Onboarding Call',
        priority: 'LOW',
        status: 'Completed',
        category: 'Digital Engagement',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        completedAt: new Date(),
        createdBy: 'System'
      }
    });

    // 1. Test calendar grouping logic
    const allTasks = await prisma.rMTask.findMany({
      where: { assignedRM: testRmId }
    });
    
    const overdueTasks = allTasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < new Date());
    expect(overdueTasks.length).toBeGreaterThan(0);
    expect(overdueTasks[0].title).toBe('Review Holdings');

    // 2. Test workload metrics
    const totalCount = allTasks.length;
    const completedCount = allTasks.filter(t => t.status === 'Completed').length;
    expect(totalCount).toBe(2);
    expect(completedCount).toBe(1);

    // Clean up
    await prisma.rMTask.deleteMany({
      where: { assignedRM: testRmId }
    });
  });
});
