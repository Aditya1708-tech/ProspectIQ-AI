import { Request, Response } from 'express';
import { AuthService } from '../services/auth/auth-service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
      const authResult = await this.authService.login(username, password);

      return res.status(200).json({
        success: true,
        data: authResult,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      if (err.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid username or password'
          }
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `Login processing failed: ${err.message}`
        }
      });
    }
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;

    try {
      await this.authService.logout(refreshToken);
      return res.status(200).json({
        success: true,
        data: { message: 'Logged out successfully' },
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `Logout failed: ${err.message}`
        }
      });
    }
  }

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    try {
      const authResult = await this.authService.refresh(refreshToken);
      return res.status(200).json({
        success: true,
        data: authResult,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      if (err.message === 'INVALID_REFRESH_TOKEN') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_REFRESH_TOKEN',
            message: 'Provided refresh token is invalid'
          }
        });
      }

      if (err.message === 'REFRESH_TOKEN_REUSED_ALARM') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'REFRESH_TOKEN_REUSE',
            message: 'Security warning: Refresh token has already been used and is revoked'
          }
        });
      }

      if (err.message === 'EXPIRED_REFRESH_TOKEN') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'REFRESH_TOKEN_EXPIRED',
            message: 'Session expired: Refresh token has expired'
          }
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `Refresh processing failed: ${err.message}`
        }
      });
    }
  }

  async me(req: Request, res: Response) {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access denied: Authentication required'
        }
      });
    }

    try {
      const currentUser = await this.authService.getCurrentUser(user.id);
      return res.status(200).json({
        success: true,
        data: {
          user: currentUser
        },
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: `Profile retrieval failed: ${err.message}`
        }
      });
    }
  }
}
