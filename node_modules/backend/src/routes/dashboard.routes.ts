import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard-controller.js';

const router = Router();
const dashboard = new DashboardController();

// Dashboard Command Center Routes (assumes mounted at /api/v1/dashboard)
router.get('/', (req, res) => dashboard.analyze(req, res));
router.get('/summary', (req, res) => dashboard.summary(req, res));
router.get('/opportunities', (req, res) => dashboard.opportunities(req, res));
router.get('/alerts', (req, res) => dashboard.alerts(req, res));
router.get('/rm-performance', (req, res) => dashboard.rmPerformance(req, res));
router.get('/health', (req, res) => dashboard.health(req, res));
router.get('/trends', (req, res) => dashboard.trends(req, res));

export default router;
