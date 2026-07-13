import { AuditRepository } from '../repositories/audit-repository.js';
import { prisma } from '../repositories/prisma.js';
export class ComplianceController {
    auditRepo = new AuditRepository();
    async getAuditLogs(req, res) {
        try {
            const logs = await this.auditRepo.queryAll();
            return res.json({
                success: true,
                data: logs
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { message: `Failed to query audit logs: ${err.message}` }
            });
        }
    }
    async getComplianceReport(req, res) {
        try {
            const prospects = await prisma.prospect.findMany();
            let scoredCount = 0;
            let completeExplanationCount = 0;
            let flaggedAnomaliesCount = 0;
            const flaggedProspects = [];
            for (const p of prospects) {
                if (p.priorityScoreJson) {
                    scoredCount++;
                    let hasExplanation = false;
                    if (p.explanationJson) {
                        try {
                            const exp = JSON.parse(p.explanationJson);
                            if (exp && exp.evidence && exp.evidence.length > 0) {
                                hasExplanation = true;
                            }
                        }
                        catch (e) {
                            // json parse failure
                        }
                    }
                    if (hasExplanation) {
                        completeExplanationCount++;
                    }
                    else {
                        // Flagged anomaly: has score but lacks a complete, grounded explanation
                        flaggedAnomaliesCount++;
                        flaggedProspects.push({
                            id: p.id,
                            name: p.name,
                            rmId: p.rmId,
                            segment: p.segment,
                            updatedAt: p.updatedAt
                        });
                    }
                }
            }
            const totalProspects = prospects.length;
            const coverageRate = scoredCount > 0 ? (completeExplanationCount / scoredCount) * 100.0 : 100.0;
            return res.json({
                success: true,
                data: {
                    metrics: {
                        totalProspects,
                        scoredProspectsCount: scoredCount,
                        completeExplanationCount,
                        flaggedAnomaliesCount,
                        explanationCoverageRate: roundToTwo(coverageRate)
                    },
                    flaggedAnomalies: flaggedProspects
                }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { message: `Failed to compile compliance report: ${err.message}` }
            });
        }
    }
}
function roundToTwo(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}
//# sourceMappingURL=compliance-controller.js.map