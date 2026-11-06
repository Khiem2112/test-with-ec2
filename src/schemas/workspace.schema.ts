import { z } from "zod";

export const brandingConfigSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format")
    .optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  accentColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format")
    .optional(),
});

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(2, "Workspace name must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Workspace slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  customDomain: z.string().trim().min(3).max(255).optional().nullable(),
  brandingConfig: brandingConfigSchema.optional().default({}),
  isPublicPortal: z.boolean().optional().default(true),
});

export const updateWorkspaceBrandingSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  brandingConfig: brandingConfigSchema,
  customDomain: z.string().trim().min(3).max(255).optional().nullable(),
});

export const inviteMemberSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  email: z.string().trim().email("Invalid member email address"),
  role: z.enum(["OWNER", "ADMIN", "PRODUCT_MANAGER", "DEVELOPER", "MODERATOR"]).default("DEVELOPER"),
});

export const updateMemberRoleSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  memberId: z.number().int().positive("Invalid member ID"),
  role: z.enum(["OWNER", "ADMIN", "PRODUCT_MANAGER", "DEVELOPER", "MODERATOR"]),
});

export const resolveVoterProfileSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  authType: z.enum(["REGISTERED", "SSO_IDENTIFIED", "ANONYMOUS_FINGERPRINT"]),
  displayName: z.string().trim().min(1, "Display name is required").max(100),
  externalUserId: z.string().trim().optional().nullable(),
  email: z.string().trim().email("Invalid email address").optional().nullable(),
  fingerprintHash: z.string().trim().optional().nullable(),
  customerTier: z.string().trim().optional().default("standard"),
  voteWeight: z.number().positive().max(100).optional().default(1.0),
});

export type CreateWorkspaceSchemaInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceBrandingSchemaInput = z.infer<typeof updateWorkspaceBrandingSchema>;
export type InviteMemberSchemaInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleSchemaInput = z.infer<typeof updateMemberRoleSchema>;
export type ResolveVoterProfileSchemaInput = z.infer<typeof resolveVoterProfileSchema>;
