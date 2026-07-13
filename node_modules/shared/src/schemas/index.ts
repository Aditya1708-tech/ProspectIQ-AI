import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type LoginInput = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export const overrideSchema = z.object({
  prospectId: z.string().min(1, 'Prospect ID is required'),
  reason: z.string().max(500, 'Reason must not exceed 500 characters').optional()
});

export type OverrideInput = z.infer<typeof overrideSchema>;

export const outcomeSchema = z.object({
  prospectId: z.string().min(1, 'Prospect ID is required'),
  status: z.enum(['CONTACTED', 'CONVERTED', 'DECLINED', 'FOLLOW_UP_NEEDED']),
  notes: z.string().max(1000, 'Notes must not exceed 1000 characters').optional()
});

export type OutcomeInput = z.infer<typeof outcomeSchema>;

// Sprint 3 Zod Schemas
export const customerQuerySchema = z.object({
  page: z.preprocess((val) => (val ? parseInt(val as string, 10) : 1), z.number().min(1).default(1)),
  limit: z.preprocess((val) => (val ? parseInt(val as string, 10) : 10), z.number().min(1).max(100).default(10)),
  sort: z.string().optional().default('name'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DORMANT', 'PROSPECT', 'BLACKLISTED']).optional(),
  segment: z.string().optional(),
  riskCategory: z.string().optional()
});

export type CustomerQueryInput = z.infer<typeof customerQuerySchema>;

export const importMappingSchema = z.object({
  columnMapping: z.record(z.string()).optional()
});

export type ImportMappingInput = z.infer<typeof importMappingSchema>;
