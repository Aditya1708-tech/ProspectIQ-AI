import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { CustomerService } from '../services/analytics/customer-service.js';
import { AIClient } from '../services/ai/ai-client.js';

export class DashboardController {
  private customerService = new CustomerService();
  private aiClient = new AIClient();

  private async getPortfolioData(req: AuthenticatedRequest) {
    const user = req.user!;
    const profiles = await this.customerService.listAllCustomerProfiles(user.id, user.roles);
    return this.aiClient.analyzePortfolio(profiles);
  }

  async analyze(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.getPortfolioData(req);
      return res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Dashboard compilation failed: ${err.message}` }
      });
    }
  }

  async summary(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.getPortfolioData(req);
      return res.status(200).json({
        success: true,
        data: data.summary,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Dashboard summary compilation failed: ${err.message}` }
      });
    }
  }

  async opportunities(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.getPortfolioData(req);
      return res.status(200).json({
        success: true,
        data: data.topOpportunities,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Dashboard opportunities compilation failed: ${err.message}` }
      });
    }
  }

  async alerts(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.getPortfolioData(req);
      return res.status(200).json({
        success: true,
        data: data.riskIntelligence,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Dashboard alerts compilation failed: ${err.message}` }
      });
    }
  }

  async rmPerformance(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.getPortfolioData(req);
      return res.status(200).json({
        success: true,
        data: data.rmLeaderboard,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Dashboard RM performance compilation failed: ${err.message}` }
      });
    }
  }

  async health(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.getPortfolioData(req);
      return res.status(200).json({
        success: true,
        data: data.health,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Dashboard health compilation failed: ${err.message}` }
      });
    }
  }

  async trends(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await this.getPortfolioData(req);
      return res.status(200).json({
        success: true,
        data: data.trends,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Dashboard trends compilation failed: ${err.message}` }
      });
    }
  }
}
