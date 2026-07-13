import { AIClient } from '../services/ai-client.js';
export class AdminController {
    aiClient;
    constructor() {
        this.aiClient = new AIClient();
    }
    async dashboard(req, res) {
        try {
            const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']);
            const data = await this.aiClient.getAdminDashboard(traceId);
            return res.status(200).json({
                success: true,
                data,
                meta: { timestamp: new Date().toISOString() }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
            });
        }
    }
    async platform(req, res) {
        try {
            const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']);
            const data = await this.aiClient.getAdminDashboard(traceId);
            return res.status(200).json({
                success: true,
                data: {
                    summary: data.platformSummary,
                    engineHealths: data.engineHealths
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
            });
        }
    }
    async performance(req, res) {
        try {
            const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']);
            const data = await this.aiClient.getAdminDashboard(traceId);
            return res.status(200).json({
                success: true,
                data: data.performance,
                meta: { timestamp: new Date().toISOString() }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
            });
        }
    }
    async security(req, res) {
        try {
            const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']);
            const data = await this.aiClient.getAdminDashboard(traceId);
            return res.status(200).json({
                success: true,
                data: data.security,
                meta: { timestamp: new Date().toISOString() }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
            });
        }
    }
    async audit(req, res) {
        try {
            const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']);
            const data = await this.aiClient.getAdminDashboard(traceId);
            return res.status(200).json({
                success: true,
                data: data.auditLogs,
                meta: { timestamp: new Date().toISOString() }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
            });
        }
    }
    async configuration(req, res) {
        try {
            const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']);
            const data = await this.aiClient.getAdminDashboard(traceId);
            return res.status(200).json({
                success: true,
                data: data.configuration,
                meta: { timestamp: new Date().toISOString() }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
            });
        }
    }
    async branches(req, res) {
        try {
            const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']);
            const data = await this.aiClient.getAdminDashboard(traceId);
            return res.status(200).json({
                success: true,
                data: data.branches,
                meta: { timestamp: new Date().toISOString() }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
            });
        }
    }
    async users(req, res) {
        try {
            const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']);
            const data = await this.aiClient.getAdminDashboard(traceId);
            return res.status(200).json({
                success: true,
                data: data.users,
                meta: { timestamp: new Date().toISOString() }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
            });
        }
    }
    async notifications(req, res) {
        try {
            const traceId = (req.headers['x-request-id'] || req.headers['x-correlation-id']);
            const data = await this.aiClient.getAdminDashboard(traceId);
            return res.status(200).json({
                success: true,
                data: data.notifications,
                meta: { timestamp: new Date().toISOString() }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
            });
        }
    }
}
//# sourceMappingURL=admin-controller.js.map