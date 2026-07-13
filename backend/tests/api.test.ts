import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/repositories/prisma.js';
import { AuthService } from '../src/services/auth/auth-service.js';
import { authMiddleware, roleGuard, AuthenticatedRequest } from '../src/middleware/auth.js';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

describe('ProspectIQ Core - Authentication & Authorization Tests', () => {
  const authService = new AuthService();

  beforeAll(async () => {
    // Ensure default roles exist
    let rmRole = await prisma.role.findUnique({ where: { code: 'RM' } });
    if (!rmRole) {
      rmRole = await prisma.role.create({ data: { name: 'Relationship Manager', code: 'RM' } });
    }

    let bmRole = await prisma.role.findUnique({ where: { code: 'BRANCH_MANAGER' } });
    if (!bmRole) {
      bmRole = await prisma.role.create({ data: { name: 'Branch Manager', code: 'BRANCH_MANAGER' } });
    }

    const bcrypt = await import('bcrypt');
    const passHash = await bcrypt.default.hash('password123', 10);

    const testUser = await prisma.user.findUnique({ where: { username: 'priya_test' } });
    if (!testUser) {
      await prisma.user.create({
        data: {
          username: 'priya_test',
          name: 'Priya Test',
          passwordHash: passHash,
          roles: {
            create: [
              { roleId: rmRole.id }
            ]
          }
        }
      });
    }
  });

  describe('AuthService', () => {
    it('should successfully log in seeded user and issue tokens', async () => {
      const result = await authService.login('priya_test', 'password123');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.username).toBe('priya_test');
      expect(result.user.roles).toContain('RM');
    });

    it('should reject login with wrong password', async () => {
      await expect(authService.login('priya_test', 'wrongpassword')).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('should successfully rotate refresh tokens on refresh', async () => {
      const loginResult = await authService.login('priya_test', 'password123');
      const refreshResult = await authService.refresh(loginResult.refreshToken);
      
      expect(refreshResult.accessToken).toBeDefined();
      expect(refreshResult.refreshToken).not.toBe(loginResult.refreshToken);

      // Old refresh token should be revoked
      const oldToken = await prisma.refreshToken.findUnique({
        where: { token: loginResult.refreshToken }
      });
      expect(oldToken?.revokedAt).not.toBeNull();
    });
  });

  describe('authMiddleware', () => {
    it('should authenticate valid bearer tokens', () => {
      const secret = process.env.JWT_SECRET || 'fallback-secret-key';
      const token = jwt.sign({ id: 'u_123', username: 'testuser', name: 'Test User', roles: ['RM'] }, secret);
      
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      } as any;
      
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      const res = {} as Response;

      authMiddleware(req, res, next);
      expect(nextCalled).toBe(true);
      expect(req.user).toBeDefined();
      expect(req.user?.username).toBe('testuser');
    });

    it('should return 401 for missing authorization header', () => {
      const req = { headers: {} } as any;
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      
      let responseStatus = 0;
      let responseBody: any = null;
      const res = {
        status: (code: number) => {
          responseStatus = code;
          return {
            json: (body: any) => {
              responseBody = body;
            }
          };
        }
      } as any;

      authMiddleware(req, res, next);
      expect(nextCalled).toBe(false);
      expect(responseStatus).toBe(401);
      expect(responseBody.success).toBe(false);
    });
  });

  describe('roleGuard', () => {
    it('should allow access if user has required role', () => {
      const req = {
        user: {
          id: 'u_123',
          username: 'testuser',
          name: 'Test User',
          roles: ['RM']
        }
      } as any;
      
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      const res = {} as Response;

      const guard = roleGuard(['RM', 'BRANCH_MANAGER']);
      guard(req, res, next);
      expect(nextCalled).toBe(true);
    });

    it('should return 403 if user lacks required role', () => {
      const req = {
        user: {
          id: 'u_123',
          username: 'testuser',
          name: 'Test User',
          roles: ['RM']
        }
      } as any;
      
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      
      let responseStatus = 0;
      const res = {
        status: (code: number) => {
          responseStatus = code;
          return {
            json: () => {}
          };
        }
      } as any;

      const guard = roleGuard(['BRANCH_MANAGER']);
      guard(req, res, next);
      expect(nextCalled).toBe(false);
      expect(responseStatus).toBe(403);
    });
  });
});
