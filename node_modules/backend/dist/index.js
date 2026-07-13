import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { authMiddleware, roleGuard } from './middleware/auth.js';
import { validateRequest } from './middleware/validate.js';
import { loginRateLimiter } from './middleware/rate-limiter.js';
import { loginSchema, refreshTokenSchema } from 'shared';
import { AuthController } from './controllers/auth-controller.js';
import { CustomerController } from './controllers/customer-controller.js';
import { DashboardController } from './controllers/dashboard-controller.js';
import { TaskController } from './controllers/task-controller.js';
import { AdminController } from './controllers/admin-controller.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Initialize controllers
const auth = new AuthController();
const customers = new CustomerController();
const dashboard = new DashboardController();
const tasks = new TaskController();
// Multer setup for memory storage uploads
const upload = multer({ storage: multer.memoryStorage() });
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'ProspectIQ Core API' });
});
// Authentication routes
app.post('/api/v1/auth/login', loginRateLimiter, validateRequest(loginSchema), (req, res) => auth.login(req, res));
app.post('/api/v1/auth/logout', validateRequest(refreshTokenSchema), (req, res) => auth.logout(req, res));
app.post('/api/v1/auth/refresh', validateRequest(refreshTokenSchema), (req, res) => auth.refresh(req, res));
// Protected routes (require valid JWT Bearer token)
app.use('/api/v1', authMiddleware);
app.get('/api/v1/auth/me', (req, res) => auth.me(req, res));
// Customer Domain Routes
app.get('/api/v1/customers', (req, res) => customers.list(req, res));
app.get('/api/v1/customers/:id', (req, res) => customers.detail(req, res));
app.get('/api/v1/customers/:id/profile', (req, res) => customers.profile(req, res));
app.get('/api/v1/customers/:id/transactions', (req, res) => customers.transactions(req, res));
app.get('/api/v1/customers/:id/interactions', (req, res) => customers.interactions(req, res));
app.get('/api/v1/customers/:id/analyze', (req, res) => customers.analyze(req, res));
app.get('/api/v1/customers/:id/findna', (req, res) => customers.findna(req, res));
app.get('/api/v1/customers/:id/priority', (req, res) => customers.priority(req, res));
app.get('/api/v1/customers/:id/copilot', (req, res) => customers.copilot(req, res));
app.get('/api/v1/customers/:id/relationship', (req, res) => customers.relationship(req, res));
app.get('/api/v1/customers/:id/journey', (req, res) => customers.journey(req, res));
app.get('/api/v1/customers/:id/milestones', (req, res) => customers.milestones(req, res));
app.get('/api/v1/customers/:id/engagement', (req, res) => customers.engagement(req, res));
app.get('/api/v1/customers/:id/relationship-health', (req, res) => customers.relationshipHealth(req, res));
app.get('/api/v1/customers/:id/predict', (req, res) => customers.predict(req, res));
app.get('/api/v1/customers/:id/churn', (req, res) => customers.churn(req, res));
app.get('/api/v1/customers/:id/forecast', (req, res) => customers.forecast(req, res));
app.get('/api/v1/customers/:id/growth', (req, res) => customers.growth(req, res));
app.get('/api/v1/customers/:id/early-warnings', (req, res) => customers.earlyWarnings(req, res));
app.get('/api/v1/customers/:id/prediction-timeline', (req, res) => customers.predictionTimeline(req, res));
// Sprint 14 SimulationIQ Routes
app.post('/api/v1/customers/:id/simulate', (req, res) => customers.simulate(req, res));
app.get('/api/v1/customers/:id/simulation/history', (req, res) => customers.getSimulationHistory(req, res));
app.get('/api/v1/customers/:id/simulation/templates', (req, res) => customers.getSimulationTemplates(req, res));
// Sprint 9 ExplainIQ Routes
app.get('/api/v1/customers/:id/explain', (req, res) => customers.explain(req, res));
app.get('/api/v1/customers/:id/audit', (req, res) => customers.audit(req, res));
app.get('/api/v1/customers/:id/timeline', (req, res) => customers.timeline(req, res));
app.get('/api/v1/customers/:id/evidence', (req, res) => customers.evidence(req, res));
app.get('/api/v1/customers/:id/confidence', (req, res) => customers.confidence(req, res));
// Sprint 10 NBAIQ Routes
app.get('/api/v1/customers/:id/next-action', (req, res) => customers.nextAction(req, res));
app.get('/api/v1/customers/:id/workflow', (req, res) => customers.workflow(req, res));
app.get('/api/v1/customers/:id/checklist', (req, res) => customers.checklist(req, res));
app.get('/api/v1/customers/:id/schedule', (req, res) => customers.schedule(req, res));
// Dashboard Command Center Routes (Sprint 8)
app.get('/api/v1/dashboard', (req, res) => dashboard.analyze(req, res));
app.get('/api/v1/dashboard/summary', (req, res) => dashboard.summary(req, res));
app.get('/api/v1/dashboard/opportunities', (req, res) => dashboard.opportunities(req, res));
app.get('/api/v1/dashboard/alerts', (req, res) => dashboard.alerts(req, res));
app.get('/api/v1/dashboard/rm-performance', (req, res) => dashboard.rmPerformance(req, res));
app.get('/api/v1/dashboard/health', (req, res) => dashboard.health(req, res));
app.get('/api/v1/dashboard/trends', (req, res) => dashboard.trends(req, res));
// Sprint 11 Task Management routes
app.get('/api/v1/tasks', (req, res) => tasks.list(req, res));
app.get('/api/v1/tasks/calendar', (req, res) => tasks.calendar(req, res));
app.get('/api/v1/tasks/workload', (req, res) => tasks.workload(req, res));
app.get('/api/v1/tasks/analytics', (req, res) => tasks.analytics(req, res));
app.get('/api/v1/tasks/:id', (req, res) => tasks.get(req, res));
app.post('/api/v1/tasks', (req, res) => tasks.create(req, res));
app.patch('/api/v1/tasks/:id', (req, res) => tasks.update(req, res));
app.delete('/api/v1/tasks/:id', (req, res) => tasks.delete(req, res));
app.post('/api/v1/tasks/:id/comment', (req, res) => tasks.addComment(req, res));
app.post('/api/v1/tasks/:id/complete', (req, res) => tasks.complete(req, res));
// Sprint 15 Enterprise Admin Console Routes
const admin = new AdminController();
app.get('/api/v1/admin/dashboard', roleGuard(['ADMIN']), (req, res) => admin.dashboard(req, res));
app.get('/api/v1/admin/platform', roleGuard(['ADMIN']), (req, res) => admin.platform(req, res));
app.get('/api/v1/admin/performance', roleGuard(['ADMIN']), (req, res) => admin.performance(req, res));
app.get('/api/v1/admin/security', roleGuard(['ADMIN']), (req, res) => admin.security(req, res));
app.get('/api/v1/admin/audit', roleGuard(['ADMIN']), (req, res) => admin.audit(req, res));
app.get('/api/v1/admin/configuration', roleGuard(['ADMIN']), (req, res) => admin.configuration(req, res));
app.get('/api/v1/admin/branches', roleGuard(['ADMIN']), (req, res) => admin.branches(req, res));
app.get('/api/v1/admin/users', roleGuard(['ADMIN']), (req, res) => admin.users(req, res));
app.get('/api/v1/admin/notifications', roleGuard(['ADMIN']), (req, res) => admin.notifications(req, res));
// Batch import (Admin only)
app.post('/api/v1/customers/import', roleGuard(['ADMIN']), upload.single('file'), (req, res) => customers.import(req, res));
// Fallback error handler
app.use((err, req, res, next) => {
    console.error('Core API Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: err.message || 'An unexpected error occurred.'
        }
    });
});
app.listen(PORT, () => {
    console.log(`ProspectIQ Core API listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map