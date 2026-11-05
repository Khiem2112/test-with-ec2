export type WorkspaceRole =
  | "OWNER"
  | "ADMIN"
  | "PRODUCT_MANAGER"
  | "DEVELOPER"
  | "MODERATOR";

export type VoterAuthType =
  | "REGISTERED"
  | "SSO_IDENTIFIED"
  | "ANONYMOUS_FINGERPRINT";

export type BrandingConfig = {
  primaryColor?: string;
  logoUrl?: string;
  accentColor?: string;
};

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  customDomain: string | null;
  brandingConfig: BrandingConfig;
  isPublicPortal: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type WorkspaceMember = {
  id: number;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserSession = {
  id: string;
  userId: string;
  tokenHash: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  createdAt: Date;
};

export type VoterProfile = {
  id: string;
  workspaceId: string;
  authType: VoterAuthType;
  externalUserId: string | null;
  displayName: string;
  email: string | null;
  fingerprintHash: string | null;
  customerTier: string;
  voteWeight: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateWorkspaceInput = {
  name: string;
  slug: string;
  customDomain?: string | null;
  brandingConfig?: BrandingConfig;
  isPublicPortal?: boolean;
  creatorUserId: string;
};

export type UpdateWorkspaceBrandingInput = {
  workspaceId: string;
  brandingConfig: BrandingConfig;
  customDomain?: string | null;
};

export type InviteMemberInput = {
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
};

export type UpdateMemberRoleInput = {
  workspaceId: string;
  memberId: number;
  role: WorkspaceRole;
};

export type ResolveVoterProfileInput = {
  workspaceId: string;
  authType: VoterAuthType;
  displayName: string;
  externalUserId?: string | null;
  email?: string | null;
  fingerprintHash?: string | null;
  customerTier?: string;
  voteWeight?: number;
};
