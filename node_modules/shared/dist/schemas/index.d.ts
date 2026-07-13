import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export declare const overrideSchema: z.ZodObject<{
    prospectId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prospectId: string;
    reason?: string | undefined;
}, {
    prospectId: string;
    reason?: string | undefined;
}>;
export type OverrideInput = z.infer<typeof overrideSchema>;
export declare const outcomeSchema: z.ZodObject<{
    prospectId: z.ZodString;
    status: z.ZodEnum<["CONTACTED", "CONVERTED", "DECLINED", "FOLLOW_UP_NEEDED"]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "CONTACTED" | "CONVERTED" | "DECLINED" | "FOLLOW_UP_NEEDED";
    prospectId: string;
    notes?: string | undefined;
}, {
    status: "CONTACTED" | "CONVERTED" | "DECLINED" | "FOLLOW_UP_NEEDED";
    prospectId: string;
    notes?: string | undefined;
}>;
export type OutcomeInput = z.infer<typeof outcomeSchema>;
export declare const customerQuerySchema: z.ZodObject<{
    page: z.ZodEffects<z.ZodDefault<z.ZodNumber>, number, unknown>;
    limit: z.ZodEffects<z.ZodDefault<z.ZodNumber>, number, unknown>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    order: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "INACTIVE", "DORMANT", "PROSPECT", "BLACKLISTED"]>>;
    segment: z.ZodOptional<z.ZodString>;
    riskCategory: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sort: string;
    page: number;
    limit: number;
    order: "asc" | "desc";
    status?: "ACTIVE" | "INACTIVE" | "DORMANT" | "PROSPECT" | "BLACKLISTED" | undefined;
    search?: string | undefined;
    segment?: string | undefined;
    riskCategory?: string | undefined;
}, {
    sort?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | "DORMANT" | "PROSPECT" | "BLACKLISTED" | undefined;
    page?: unknown;
    limit?: unknown;
    order?: "asc" | "desc" | undefined;
    search?: string | undefined;
    segment?: string | undefined;
    riskCategory?: string | undefined;
}>;
export type CustomerQueryInput = z.infer<typeof customerQuerySchema>;
export declare const importMappingSchema: z.ZodObject<{
    columnMapping: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    columnMapping?: Record<string, string> | undefined;
}, {
    columnMapping?: Record<string, string> | undefined;
}>;
export type ImportMappingInput = z.infer<typeof importMappingSchema>;
//# sourceMappingURL=index.d.ts.map