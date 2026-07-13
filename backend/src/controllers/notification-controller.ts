import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { CustomerService } from '../services/analytics/customer-service.js';
import { AIClient } from '../services/ai/ai-client.js';
import { prisma } from '../repositories/prisma.js';

export class NotificationController {
  private customerService = new CustomerService();
  private aiClient = new AIClient();

  // In-memory sets to track read & acknowledged notifications statelessly
  private static readNotifications = new Set<string>();
  private static acknowledgedNotifications = new Set<string>();

  private async fetchRawDataAndAnalyze(req: AuthenticatedRequest) {
    const user = req.user!;
    const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
    
    // 1. Fetch customer profiles assigned to RM/Branch
    const profiles = await this.customerService.listAllCustomerProfiles(user.id, user.roles);
    
    // 2. Fetch tasks
    const where: any = {};
    if (!user.roles.includes('ADMIN')) {
      where.assignedRM = user.id;
    }
    const tasks = await prisma.rMTask.findMany({
      where,
      include: {
        history: true
      }
    });

    // 3. Request NotificationIQ analyze from FastAPI
    const result = await this.aiClient.analyzeNotifications(
      profiles,
      tasks,
      user.id,
      user.roles.join(','),
      traceId
    );

    // 4. Overlay in-memory read & acknowledged states
    result.notifications = result.notifications.map(n => ({
      ...n,
      readStatus: NotificationController.readNotifications.has(n.id),
      acknowledgedStatus: NotificationController.acknowledgedNotifications.has(n.id)
    }));

    return result;
  }

  async list(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.fetchRawDataAndAnalyze(req);
      return res.status(200).json({
        success: true,
        data: data.notifications,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Failed to fetch notifications: ${err.message}` }
      });
    }
  }

  async unread(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.fetchRawDataAndAnalyze(req);
      const unread = data.notifications.filter(n => !n.readStatus);
      return res.status(200).json({
        success: true,
        data: unread,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Failed to fetch unread notifications: ${err.message}` }
      });
    }
  }

  async critical(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.fetchRawDataAndAnalyze(req);
      const critical = data.notifications.filter(n => n.priority === 'CRITICAL');
      return res.status(200).json({
        success: true,
        data: critical,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Failed to fetch critical notifications: ${err.message}` }
      });
    }
  }

  async timeline(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.fetchRawDataAndAnalyze(req);
      return res.status(200).json({
        success: true,
        data: data.timeline,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Failed to fetch timeline: ${err.message}` }
      });
    }
  }

  async morningBrief(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.fetchRawDataAndAnalyze(req);
      return res.status(200).json({
        success: true,
        data: { briefing: data.morningBrief },
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Failed to compile morning brief: ${err.message}` }
      });
    }
  }

  async executiveBrief(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.fetchRawDataAndAnalyze(req);
      return res.status(200).json({
        success: true,
        data: { briefing: data.executiveBrief },
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Failed to compile executive brief: ${err.message}` }
      });
    }
  }

  async analytics(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.fetchRawDataAndAnalyze(req);
      
      // Update analytics with the correct in-memory read / acknowledged counts
      const unreadCount = data.notifications.filter(n => !n.readStatus).length;
      const acknowledgedCount = data.notifications.filter(n => n.acknowledgedStatus).length;
      const totalCount = data.notifications.length;
      
      const ackRate = totalCount > 0 ? (acknowledgedCount / totalCount) * 100 : 85.0;

      const updatedAnalytics = {
        ...data.analytics,
        unreadNotifications: unreadCount,
        acknowledgementRate: parseFloat(ackRate.toFixed(1))
      };

      return res.status(200).json({
        success: true,
        data: updatedAnalytics,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Failed to fetch analytics: ${err.message}` }
      });
    }
  }

  async read(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      NotificationController.readNotifications.add(id);
      return res.status(200).json({
        success: true,
        data: { id, readStatus: true },
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Failed to mark notification as read: ${err.message}` }
      });
    }
  }

  async acknowledge(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      NotificationController.acknowledgedNotifications.add(id);
      return res.status(200).json({
        success: true,
        data: { id, acknowledgedStatus: true },
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Failed to acknowledge notification: ${err.message}` }
      });
    }
  }
}
