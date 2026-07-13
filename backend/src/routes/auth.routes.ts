import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { loginRateLimiter } from '../middleware/rate-limiter.js';
import { loginSchema, refreshTokenSchema } from 'shared';

const router = Router();
const auth = new AuthController();

router.post('/login', loginRateLimiter, validateRequest(loginSchema), (req, res) => auth.login(req, res));
router.post('/logout', validateRequest(refreshTokenSchema), (req, res) => auth.logout(req, res));
router.post('/refresh', validateRequest(refreshTokenSchema), (req, res) => auth.refresh(req, res));
router.get('/me', authMiddleware, (req, res) => auth.me(req, res));

export default router;
