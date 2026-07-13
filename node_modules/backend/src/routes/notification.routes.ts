import { Router } from 'express';
import { NotificationController } from '../controllers/notification-controller.js';

const router = Router();
const notifications = new NotificationController();

// NotificationIQ Routes (assumes mounted at /api/v1/notifications)
router.get('/', (req, res) => notifications.list(req, res));
router.get('/unread', (req, res) => notifications.unread(req, res));
router.get('/critical', (req, res) => notifications.critical(req, res));
router.get('/timeline', (req, res) => notifications.timeline(req, res));
router.get('/morning-brief', (req, res) => notifications.morningBrief(req, res));
router.get('/executive-brief', (req, res) => notifications.executiveBrief(req, res));
router.get('/analytics', (req, res) => notifications.analytics(req, res));
router.patch('/:id/read', (req, res) => notifications.read(req, res));
router.patch('/:id/acknowledge', (req, res) => notifications.acknowledge(req, res));

export default router;
