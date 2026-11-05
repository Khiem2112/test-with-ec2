import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import type {
  Workspace,
  WorkspaceMember,
  CreateWorkspaceInput,
  UpdateWorkspaceBrandingInput,
  InviteMemberInput,
  UpdateMemberRoleInput,
} from "@/types/workspace";

// Map Prisma workspace record to strict domain model
const mapWorkspaceRecord = (record: {
  id: string;
  name: string;
  slug: string;
  customDomain: string | null;
  brandingConfig: Prisma.JsonValue;
  isPublicPortal: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Workspace => {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    customDomain: record.customDomain,
    brandingConfig: (record.brandingConfig as Record<string, string>) ?? {},
    isPublicPortal: record.isPublicPortal,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

// Create a new workspace and automatically assign creator as OWNER
export const createWorkspace = async (
  input: CreateWorkspaceInput,
): Promise<Workspace> => {
  const existing = await prisma.workspace.findUnique({
    where: { slug: input.slug },
  });

  if (existing) {
    throw new Error("Duong dan dinh danh da duoc su dung, vui long chon ten khac");
  }

  const result = await prisma.$transaction(async (tx) => {
    const createdWorkspace = await tx.workspace.create({
      data: {
        name: input.name,
        slug: input.slug,
        customDomain: input.customDomain ?? null,
        brandingConfig: (input.brandingConfig as Prisma.InputJsonValue) ?? {},
        isPublicPortal: input.isPublicPortal ?? true,
      },
    });

    await tx.workspaceMember.create({
      data: {
        workspaceId: createdWorkspace.id,
        userId: input.creatorUserId,
        role: "OWNER",
      },
    });

    return createdWorkspace;
  });

  return mapWorkspaceRecord(result);
};

// Retrieve workspace by unique slug
export const getWorkspaceBySlug = async (
  slug: string,
): Promise<Workspace | null> => {
  const record = await prisma.workspace.findUnique({
    where: { slug },
  });

  if (!record) {
    return null;
  }

  return mapWorkspaceRecord(record);
};

// Update branding configuration and custom domain for a specific workspace
export const updateWorkspaceBranding = async (
  input: UpdateWorkspaceBrandingInput,
): Promise<Workspace> => {
  const updated = await prisma.workspace.update({
    where: { id: input.workspaceId },
    data: {
      brandingConfig: (input.brandingConfig as Prisma.InputJsonValue) ?? {},
      ...(input.customDomain !== undefined ? { customDomain: input.customDomain } : {}),
    },
  });

  return mapWorkspaceRecord(updated);
};

// Invite a user to a workspace with a designated role enforcing tenant isolation
export const inviteMember = async (
  input: InviteMemberInput,
): Promise<WorkspaceMember> => {
  let targetUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!targetUser) {
    targetUser = await prisma.user.create({
      data: {
        email: input.email,
        fullName: input.email.split("@")[0] ?? "Member",
      },
    });
  }

  const existingMembership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: input.workspaceId,
        userId: targetUser.id,
      },
    },
  });

  if (existingMembership) {
    throw new Error("Thanh vien da thuoc khong gian lam viec nay");
  }

  const memberRecord = await prisma.workspaceMember.create({
    data: {
      workspaceId: input.workspaceId,
      userId: targetUser.id,
      role: input.role,
    },
  });

  return {
    id: memberRecord.id,
    workspaceId: memberRecord.workspaceId,
    userId: memberRecord.userId,
    role: memberRecord.role,
    isActive: memberRecord.isActive,
    createdAt: memberRecord.createdAt,
    updatedAt: memberRecord.updatedAt,
  };
};

// Update existing member role within tenant workspace boundary
export const updateMemberRole = async (
  input: UpdateMemberRoleInput,
): Promise<WorkspaceMember> => {
  const memberRecord = await prisma.workspaceMember.findFirst({
    where: {
      id: input.memberId,
      workspaceId: input.workspaceId,
    },
  });

  if (!memberRecord) {
    throw new Error("Thanh vien khong ton tai trong khong gian lam viec");
  }

  const updated = await prisma.workspaceMember.update({
    where: { id: input.memberId },
    data: { role: input.role },
  });

  return {
    id: updated.id,
    workspaceId: updated.workspaceId,
    userId: updated.userId,
    role: updated.role,
    isActive: updated.isActive,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
};
