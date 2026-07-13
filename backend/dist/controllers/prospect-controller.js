import { ProspectService } from '../services/prospect-service.js';
import { overrideSchema, outcomeSchema } from 'shared';
export class ProspectController {
    service = new ProspectService();
    async list(req, res) {
        const user = req.user;
        const { status, tier, search } = req.query;
        try {
            const list = await this.service.getProspects(user, {
                status: status,
                tier: tier,
                search: search
            });
            return res.json({
                success: true,
                data: list
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: { message: `Failed to retrieve prospects: ${err.message}` }
            });
        }
    }
    async detail(req, res) {
        const user = req.user;
        const { id } = req.params;
        try {
            const detail = await this.service.getProspectDetail(id, user);
            return res.json({
                success: true,
                data: detail
            });
        }
        catch (err) {
            const status = err.message.includes('Access Denied') ? 403 : 404;
            return res.status(status).json({
                success: false,
                error: { message: err.message }
            });
        }
    }
    async override(req, res) {
        const user = req.user;
        const { id } = req.params;
        const parsed = overrideSchema.safeParse({
            prospectId: id,
            reason: req.body.reason
        });
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Invalid override details',
                    details: parsed.error.format()
                }
            });
        }
        try {
            const updated = await this.service.overrideProspect(id, parsed.data.reason || '', user);
            return res.json({
                success: true,
                data: updated
            });
        }
        catch (err) {
            const status = err.message.includes('Access Denied') ? 403 : 404;
            return res.status(status).json({
                success: false,
                error: { message: err.message }
            });
        }
    }
    async outcome(req, res) {
        const user = req.user;
        const { id } = req.params;
        const parsed = outcomeSchema.safeParse({
            prospectId: id,
            status: req.body.status,
            notes: req.body.notes
        });
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Invalid outcome details',
                    details: parsed.error.format()
                }
            });
        }
        try {
            const updated = await this.service.logOutcome(id, parsed.data.status, parsed.data.notes || '', user);
            return res.json({
                success: true,
                data: updated
            });
        }
        catch (err) {
            const status = err.message.includes('Access Denied') ? 403 : 404;
            return res.status(status).json({
                success: false,
                error: { message: err.message }
            });
        }
    }
}
//# sourceMappingURL=prospect-controller.js.map