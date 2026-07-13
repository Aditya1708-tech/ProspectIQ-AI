import { Router } from 'express';

const router = Router();

// Knowledge Base Routes placeholder (assumes mounted at /api/v1/knowledge)
router.get('/', (req, res) => {
  res.json({ success: true, message: "ProspectIQ Knowledge base routes active." });
});

export default router;
