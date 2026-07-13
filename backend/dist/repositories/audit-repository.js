import { prisma } from './prisma.js';
export class AuditRepository {
    async log(event) {
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
//# sourceMappingURL=audit-repository.js.map