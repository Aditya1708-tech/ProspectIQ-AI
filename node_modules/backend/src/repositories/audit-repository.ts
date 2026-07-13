import { prisma } from './prisma.js';
import { AuditLogEvent } from 'shared';

export class AuditRepository {
  async log(event: Omit<AuditLogEvent, 'id' | 'timestamp'>) {
    return prisma.auditLog.create({
      data: {
        actorId: event.actorId,
        actorRole: event.actorRole,
        action: event.action,
        targetId: event.targetId,
        details: event.details,
      },
    });
  }

  async queryAll() {
    return prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
    });
  }
}
