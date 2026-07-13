import { Router } from 'express';
import { TaskController } from '../controllers/task-controller.js';

const router = Router();
const tasks = new TaskController();

// Task Management Routes (assumes mounted at /api/v1/tasks)
router.get('/', (req, res) => tasks.list(req, res));
router.get('/calendar', (req, res) => tasks.calendar(req, res));
router.get('/workload', (req, res) => tasks.workload(req, res));
router.get('/analytics', (req, res) => tasks.analytics(req, res));
router.get('/:id', (req, res) => tasks.get(req, res));
router.post('/', (req, res) => tasks.create(req, res));
router.patch('/:id', (req, res) => tasks.update(req, res));
router.delete('/:id', (req, res) => tasks.delete(req, res));
router.post('/:id/comment', (req, res) => tasks.addComment(req, res));
router.post('/:id/complete', (req, res) => tasks.complete(req, res));

export default router;
