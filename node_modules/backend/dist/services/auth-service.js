import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserRepository } from '../repositories/user-repository.js';
import { RefreshTokenRepository } from '../repositories/refresh-token-repository.js';
import { AuditRepository } from '../repositories/audit-repository.js';
export class AuthService {
    userRepo = new UserRepository();
    tokenRepo = new RefreshTokenRepository();
    auditRepo = new AuditRepository();
    getJwtSecret() {
        return process.env.JWT_SECRET || 'fallback-secret-key';
    }
    generateAccessToken(user) {
        const roles = user.roles.map(ur => ur.role.code);
        const payload = {
            id: user.id,
            username: user.username,
            name: user.name,
            roles
        };
        return jwt.sign(payload, this.getJwtSecret(), { expiresIn: '15m' });
    }
    async login(username, passwordPlain) {
        const user = await this.userRepo.findByUsername(username);
        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }
        const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
        if (!isMatch) {
            throw new Error('INVALID_CREDENTIALS');
        }
        const accessToken = this.generateAccessToken(user);
        // Generate refresh token
        const refreshTokenString = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
        await this.tokenRepo.create(user.id, refreshTokenString, expiresAt);
        // Log audit event
        const rolesList = user.roles.map(ur => ur.role.code);
        await this.auditRepo.log({
            actorId: user.id,
            actorRole: rolesList.join(','),
            action: 'LOGIN',
            targetId: user.id,
            details: `User ${username} logged in successfully.`
        });
        return {
            accessToken,
            refreshToken: refreshTokenString,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                roles: rolesList
            }
        };
    }
    async logout(refreshToken) {
        const tokenRecord = await this.tokenRepo.findByToken(refreshToken);
        if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
            return; // Token is already invalid or non-existent, return silently
        }
        await this.tokenRepo.revoke(refreshToken);
        // Log audit event
        await this.auditRepo.log({
            actorId: tokenRecord.userId,
            actorRole: 'USER',
            action: 'LOGOUT',
            targetId: tokenRecord.userId,
            details: 'User logged out and refresh token revoked.'
        });
    }
    async refresh(refreshToken) {
        const tokenRecord = await this.tokenRepo.findByToken(refreshToken);
        if (!tokenRecord) {
            throw new Error('INVALID_REFRESH_TOKEN');
        }
        if (tokenRecord.revokedAt) {
            // Security alarm: reuse of a revoked token indicates potential token theft.
            // Invalidate all tokens for this user for security.
            await this.tokenRepo.revokeAllForUser(tokenRecord.userId);
            throw new Error('REFRESH_TOKEN_REUSED_ALARM');
        }
        if (tokenRecord.expiresAt < new Date()) {
            throw new Error('EXPIRED_REFRESH_TOKEN');
        }
        const user = await this.userRepo.findById(tokenRecord.userId);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        // Revoke current token (rotation strategy)
        await this.tokenRepo.revoke(refreshToken);
        // Generate new pair
        const accessToken = this.generateAccessToken(user);
        const newRefreshToken = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.tokenRepo.create(user.id, newRefreshToken, expiresAt);
        const rolesList = user.roles.map(ur => ur.role.code);
        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                roles: rolesList
            }
        };
    }
    async getCurrentUser(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        return {
            id: user.id,
            username: user.username,
            name: user.name,
            roles: user.roles.map(ur => ur.role.code)
        };
    }
}
//# sourceMappingURL=auth-service.js.map