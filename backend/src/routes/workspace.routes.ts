import { Router } from 'express';
import { AdminController } from '../controllers/admin-controller.js';
import { roleGuard } from '../middleware/auth.js';

const router = Router();
const admin = new AdminController();

// Admin Workspace Console Routes (assumes mounted at /api/v1/admin)
router.get('/dashboard', roleGuard(['ADMIN']), (req, res) => admin.dashboard(req as any, res));
router.get('/platform', roleGuard(['ADMIN']), (req, res) => admin.platform(req as any, res));
router.get('/performance', roleGuard(['ADMIN']), (req, res) => admin.performance(req as any, res));
router.get('/security', roleGuard(['ADMIN']), (req, res) => admin.security(req as any, res));
router.get('/audit', roleGuard(['ADMIN']), (req, res) => admin.audit(req as any, res));
router.get('/configuration', roleGuard(['ADMIN']), (req, res) => admin.configuration(req as any, res));
router.get('/branches', roleGuard(['ADMIN']), (req, res) => admin.branches(req as any, res));
router.get('/users', roleGuard(['ADMIN']), (req, res) => admin.users(req as any, res));
router.get('/notifications', roleGuard(['ADMIN']), (req, res) => admin.notifications(req as any, res));

export default router;
