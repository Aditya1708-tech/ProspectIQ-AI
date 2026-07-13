import { prisma } from './prisma.js';
export class ProspectRepository {
    mapToShared(dbProspect) {
        return {
            id: dbProspect.id,
            name: dbProspect.name,
            rmId: dbProspect.rmId,
            segment: dbProspect.segment,
            traditionalSummary: {
                averageBalance: dbProspect.averageBalance,
                existingLoansCount: dbProspect.existingLoansCount,
                creditBureauScore: dbProspect.creditBureauScore ?? undefined,
            },
            alternativeSummary: {
                upiOutflowAvg: dbProspect.upiOutflowAvg,
                gstTurnoverAvg: dbProspect.gstTurnoverAvg ?? undefined,
                epfoInflowAvg: dbProspect.epfoInflowAvg ?? undefined,
                utilityBillConsistency: dbProspect.utilityBillConsistency,
            },
            fdnaProfile: dbProspect.fdnaProfileJson ? JSON.parse(dbProspect.fdnaProfileJson) : undefined,
            priorityScore: dbProspect.priorityScoreJson ? JSON.parse(dbProspect.priorityScoreJson) : undefined,
            readinessIndicator: dbProspect.readinessIndicator ?? undefined,
            engagementStatus: dbProspect.engagementStatus,
            overrideLogged: dbProspect.overrideLogged,
            overrideReason: dbProspect.overrideReason ?? undefined,
        };
    }
    async findById(id) {
        const p = await prisma.prospect.findUnique({ where: { id } });
        return p ? this.mapToShared(p) : null;
    }
    async findByRm(rmId) {
        const list = await prisma.prospect.findMany({ where: { rmId } });
        return list.map(p => this.mapToShared(p));
    }
    async findAll() {
        const list = await prisma.prospect.findMany();
        return list.map(p => this.mapToShared(p));
    }
    async updateOutcome(id, status, notes) {
        const p = await prisma.prospect.update({
            where: { id },
            data: {
                engagementStatus: status,
            },
        });
        return this.mapToShared(p);
    }
    async updateOverride(id, reason) {
        const p = await prisma.prospect.update({
            where: { id },
            data: {
                overrideLogged: true,
                overrideReason: reason,
            },
        });
        return this.mapToShared(p);
    }
    async updateAIResult(id, readiness, priorityScoreJson, explanationJson, fdnaProfileJson) {
        const p = await prisma.prospect.update({
            where: { id },
            data: {
                readinessIndicator: readiness,
                priorityScoreJson,
                explanationJson,
                fdnaProfileJson,
            },
        });
        return this.mapToShared(p);
    }
    async getRawTransactions(id) {
        const p = await prisma.prospect.findUnique({
            where: { id },
            select: { rawTransactionsJson: true }
        });
        return p && p.rawTransactionsJson ? JSON.parse(p.rawTransactionsJson) : [];
    }
}
//# sourceMappingURL=prospect-repository.js.map