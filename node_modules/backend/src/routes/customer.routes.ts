import { Router } from 'express';
import { CustomerController } from '../controllers/customer-controller.js';
import { roleGuard } from '../middleware/auth.js';
import multer from 'multer';

const router = Router();
const customers = new CustomerController();
const upload = multer({ storage: multer.memoryStorage() });

// Base customer routes (assumes mounted at /api/v1/customers)
router.get('/', (req, res) => customers.list(req, res));
router.post('/import', roleGuard(['ADMIN']), upload.single('file'), (req, res) => customers.import(req, res));

router.get('/:id', (req, res) => customers.detail(req, res));
router.get('/:id/profile', (req, res) => customers.profile(req, res));
router.get('/:id/transactions', (req, res) => customers.transactions(req, res));
router.get('/:id/interactions', (req, res) => customers.interactions(req, res));
router.get('/:id/analyze', (req, res) => customers.analyze(req, res));
router.get('/:id/findna', (req, res) => customers.findna(req, res));
router.get('/:id/priority', (req, res) => customers.priority(req, res));
router.get('/:id/copilot', (req, res) => customers.copilot(req, res));
router.get('/:id/relationship', (req, res) => customers.relationship(req, res));
router.get('/:id/journey', (req, res) => customers.journey(req, res));
router.get('/:id/milestones', (req, res) => customers.milestones(req, res));
router.get('/:id/engagement', (req, res) => customers.engagement(req, res));
router.get('/:id/relationship-health', (req, res) => customers.relationshipHealth(req, res));
router.get('/:id/predict', (req, res) => customers.predict(req, res));
router.get('/:id/churn', (req, res) => customers.churn(req, res));
router.get('/:id/forecast', (req, res) => customers.forecast(req, res));
router.get('/:id/growth', (req, res) => customers.growth(req, res));
router.get('/:id/early-warnings', (req, res) => customers.earlyWarnings(req, res));
router.get('/:id/prediction-timeline', (req, res) => customers.predictionTimeline(req, res));

// SimulationIQ Routes
router.post('/:id/simulate', (req, res) => customers.simulate(req as any, res));
router.get('/:id/simulation/history', (req, res) => customers.getSimulationHistory(req as any, res));
router.get('/:id/simulation/templates', (req, res) => customers.getSimulationTemplates(req as any, res));

// ExplainIQ Routes
router.get('/:id/explain', (req, res) => customers.explain(req, res));
router.get('/:id/audit', (req, res) => customers.audit(req, res));
router.get('/:id/timeline', (req, res) => customers.timeline(req, res));
router.get('/:id/evidence', (req, res) => customers.evidence(req, res));
router.get('/:id/confidence', (req, res) => customers.confidence(req, res));

// NBAIQ Routes
router.get('/:id/next-action', (req, res) => customers.nextAction(req, res));
router.get('/:id/workflow', (req, res) => customers.workflow(req, res));
router.get('/:id/checklist', (req, res) => customers.checklist(req, res));
router.get('/:id/schedule', (req, res) => customers.schedule(req, res));

export default router;
