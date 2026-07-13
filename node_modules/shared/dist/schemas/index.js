"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importMappingSchema = exports.customerQuerySchema = exports.outcomeSchema = exports.overrideSchema = exports.refreshTokenSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, 'Username is required'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters')
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required')
});
exports.overrideSchema = zod_1.z.object({
    prospectId: zod_1.z.string().min(1, 'Prospect ID is required'),
    reason: zod_1.z.string().max(500, 'Reason must not exceed 500 characters').optional()
});
exports.outcomeSchema = zod_1.z.object({
    prospectId: zod_1.z.string().min(1, 'Prospect ID is required'),
    status: zod_1.z.enum(['CONTACTED', 'CONVERTED', 'DECLINED', 'FOLLOW_UP_NEEDED']),
    notes: zod_1.z.string().max(1000, 'Notes must not exceed 1000 characters').optional()
});
// Sprint 3 Zod Schemas
exports.customerQuerySchema = zod_1.z.object({
    page: zod_1.z.preprocess((val) => (val ? parseInt(val, 10) : 1), zod_1.z.number().min(1).default(1)),
    limit: zod_1.z.preprocess((val) => (val ? parseInt(val, 10) : 10), zod_1.z.number().min(1).max(100).default(10)),
    sort: zod_1.z.string().optional().default('name'),
    order: zod_1.z.enum(['asc', 'desc']).optional().default('asc'),
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'DORMANT', 'PROSPECT', 'BLACKLISTED']).optional(),
    segment: zod_1.z.string().optional(),
    riskCategory: zod_1.z.string().optional()
});
exports.importMappingSchema = zod_1.z.object({
    columnMapping: zod_1.z.record(zod_1.z.string()).optional()
});
//# sourceMappingURL=index.js.map