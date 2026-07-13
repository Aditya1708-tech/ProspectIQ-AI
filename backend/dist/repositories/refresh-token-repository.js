import { prisma } from './prisma.js';
export class RefreshTokenRepository {
    async create(userId, token, expiresAt) {
        return prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt
            }
        });
    }
    async findByToken(token) {
        return prisma.refreshToken.findUnique({
            where: { token }
        });
    }
    async revoke(token) {
        await prisma.refreshToken.update({
            where: { token },
            data: { revokedAt: new Date() }
        });
    }
    async revokeAllForUser(userId) {
        await prisma.refreshToken.updateMany({
            where: {
                userId,
                revokedAt: null
            },
            data: { revokedAt: new Date() }
        });
    }
}
//# sourceMappingURL=refresh-token-repository.js.map