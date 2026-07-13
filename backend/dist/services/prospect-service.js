import { ProspectRepository } from '../repositories/prospect-repository.js';
import { AuditRepository } from '../repositories/audit-repository.js';
import { prisma } from '../repositories/prisma.js';
import { AiClientService } from './ai-client.js';
export class ProspectService {
    repo = new ProspectRepository();
    audit = new AuditRepository();
    aiClient = new AiClientService();
    async getProspects(user, filter) {
        let list = user.role === 'RM'
            ? await this.repo.findByRm(user.id)
            : await this.repo.findAll();
        // Apply filtering
        if (filter) {
            if (filter.status) {
                list = list.filter(p => p.engagementStatus === filter.status);
            }
            if (filter.tier) {
                list = list.filter(p => p.priorityScore?.tier === filter.tier);
            }
            if (filter.search) {
                const term = filter.search.toLowerCase();
                list = list.filter(p => p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term));
            }
        }
        return list;
    }
    async getProspectDetail(id, actor) {
        const prospect = await this.repo.findById(id);
        if (!prospect) {
            throw new Error(`Prospect ${id} not found`);
        }
        // Access check: RMs can only see their own prospects, others can see all within authorization
        if (actor.role === 'RM' && prospect.rmId !== actor.id) {
            throw new Error('Access Denied: Prospect is assigned to another Relationship Manager');
        }
        // Load rawTransactions to trigger AI analysis if cached score is missing
        if (!prospect.priorityScore || !prospect.fdnaProfile) {
            console.log(`Prospect ${id} has no cached score. Running AI analysis...`);
            try {
                const rawTxs = await this.repo.getRawTransactions(id);
                const aiResult = await this.aiClient.analyzeProspect(prospect, rawTxs);
                // Save back to DB
                await this.repo.updateAIResult(id, aiResult.readinessIndicator, JSON.stringify(aiResult.priorityScore), JSON.stringify(aiResult.explanation), JSON.stringify(aiResult.fdnaProfile));
                // Update local object
                prospect.priorityScore = aiResult.priorityScore;
                prospect.fdnaProfile = aiResult.fdnaProfile;
                prospect.readinessIndicator = aiResult.readinessIndicator;
            }
            catch (err) {
                console.error(`AI Analysis failed for prospect ${id}: ${err.message}. Gracefully returning details without scores.`);
            }
        }
        // Log the read event in the audit trail (SRS FR-018)
        await this.audit.log({
            actorId: actor.id,
            actorRole: actor.role,
            action: 'READ_DNA',
            targetId: id,
            details: `Relationship profile and behavioral DNA read for prospect ${prospect.name}`
        });
        const explanation = await this.getExplanationObject(id);
        return {
            ...prospect,
            explanation
        };
    }
    async getExplanationObject(id) {
        const p = await prisma.prospect.findUnique({
            where: { id },
            select: { explanationJson: true }
        });
        return p && p.explanationJson ? JSON.parse(p.explanationJson) : null;
    }
    async overrideProspect(id, reason, actor) {
        const prospect = await this.repo.findById(id);
        if (!prospect) {
            throw new Error(`Prospect ${id} not found`);
        }
        // Access check
        if (actor.role === 'RM' && prospect.rmId !== actor.id) {
            throw new Error('Access Denied: Prospect is assigned to another Relationship Manager');
        }
        const updated = await this.repo.updateOverride(id, reason);
        // Audit log
        await this.audit.log({
            actorId: actor.id,
            actorRole: actor.role,
            action: 'LOG_OVERRIDE',
            targetId: id,
            details: `RM override logged for ${prospect.name}. Reason: ${reason || 'None provided'}`
        });
        return updated;
    }
    async logOutcome(id, status, notes, actor) {
        const prospect = await this.repo.findById(id);
        if (!prospect) {
            throw new Error(`Prospect ${id} not found`);
        }
        // Access check
        if (actor.role === 'RM' && prospect.rmId !== actor.id) {
            throw new Error('Access Denied: Prospect is assigned to another Relationship Manager');
        }
        const updated = await this.repo.updateOutcome(id, status, notes);
        // Audit log
        await this.audit.log({
            actorId: actor.id,
            actorRole: actor.role,
            action: 'LOG_OUTCOME',
            targetId: id,
            details: `Outreach outcome changed to ${status} for ${prospect.name}. Notes: ${notes || 'None provided'}`
        });
        return updated;
    }
}
//# sourceMappingURL=prospect-service.js.map