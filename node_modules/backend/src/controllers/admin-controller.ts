import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AIClient } from '../services/ai/ai-client.js';

export class AdminController {
  private aiClient: AIClient;

  constructor() {
    this.aiClient = new AIClient();
  }

  async dashboard(req: AuthenticatedRequest, res: Response) {
    try {
      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const data = await this.aiClient.getAdminDashboard(traceId);
      return res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async platform(req: AuthenticatedRequest, res: Response) {
    try {
      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const data = await this.aiClient.getAdminDashboard(traceId);
      return res.status(200).json({
        success: true,
        data: {
          summary: data.platformSummary,
          engineHealths: data.engineHealths
        },
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async performance(req: AuthenticatedRequest, res: Response) {
    try {
      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const data = await this.aiClient.getAdminDashboard(traceId);
      return res.status(200).json({
        success: true,
        data: data.performance,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async security(req: AuthenticatedRequest, res: Response) {
    try {
      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const data = await this.aiClient.getAdminDashboard(traceId);
      return res.status(200).json({
        success: true,
        data: data.security,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async audit(req: AuthenticatedRequest, res: Response) {
    try {
      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const data = await this.aiClient.getAdminDashboard(traceId);
      return res.status(200).json({
        success: true,
        data: data.auditLogs,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async configuration(req: AuthenticatedRequest, res: Response) {
    try {
      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const data = await this.aiClient.getAdminDashboard(traceId);
      return res.status(200).json({
        success: true,
        data: data.configuration,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async branches(req: AuthenticatedRequest, res: Response) {
    try {
      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const data = await this.aiClient.getAdminDashboard(traceId);
      return res.status(200).json({
        success: true,
        data: data.branches,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async users(req: AuthenticatedRequest, res: Response) {
    try {
      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const data = await this.aiClient.getAdminDashboard(traceId);
      return res.status(200).json({
        success: true,
        data: data.users,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }

  async notifications(req: AuthenticatedRequest, res: Response) {
    try {
      const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
      const data = await this.aiClient.getAdminDashboard(traceId);
      return res.status(200).json({
        success: true,
        data: data.notifications,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
      });
    }
  }
}
