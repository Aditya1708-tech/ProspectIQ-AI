import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.js';

// Import routers
import authRouter from './routes/auth.routes.js';
import customerRouter from './routes/customer.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import taskRouter from './routes/task.routes.js';
import notificationRouter from './routes/notification.routes.js';
import workspaceRouter from './routes/workspace.routes.js';
import knowledgeRouter from './routes/knowledge.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint (public)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'ProspectIQ Core API' });
});

// Auth endpoints (router handles public login/refresh and private /me internally)
app.use('/api/v1/auth', authRouter);

// Global Authentication Middleware for remaining protected api endpoints
app.use('/api/v1', authMiddleware);

// Mount Protected Routers
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/admin', workspaceRouter);
app.use('/api/v1/knowledge', knowledgeRouter);

// Fallback error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
