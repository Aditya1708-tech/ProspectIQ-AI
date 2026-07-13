import { prisma } from './prisma.js';

export class RefreshTokenRepository {
  async create(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });
  }

  async findByToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token }
    });
  }

  async revoke(token: string) {
    await prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() }
    });
  }

  async revokeAllForUser(userId: string) {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null
      },
      data: { revokedAt: new Date() }
    });
  }
}
