"use server";

import type { ApiResponse } from "@/types";
import type {
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from "@/types/workspace";
import {
  createWorkspaceSchema,
  updateWorkspaceBrandingSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
  type CreateWorkspaceSchemaInput,
  type UpdateWorkspaceBrandingSchemaInput,
  type InviteMemberSchemaInput,
  type UpdateMemberRoleSchemaInput,
} from "@/schemas/workspace.schema";
import {
  createWorkspace,
  updateWorkspaceBranding,
  inviteMember,
  updateMemberRole,
} from "@/services/workspace.service";

// Verify RBAC administrative access for modifying workspace configurations
const assertAdminAccess = (role: WorkspaceRole): void => {
  if (role !== "OWNER" && role !== "ADMIN") {
    throw new Error("Khong co quyen thuc hien thao tac nay. Yeu cau vai tro OWNER hoac ADMIN.");
  }
};

// Create a new workspace and assign creator as OWNER
export const createWorkspaceAction = async (
  input: CreateWorkspaceSchemaInput,
  creatorUserId: string,
): Promise<ApiResponse<Workspace>> => {
  try {
    const validated = createWorkspaceSchema.parse(input);
    const workspace = await createWorkspace({
      ...validated,
      creatorUserId,
    });
    return {
      success: true,
      data: workspace,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the tao khong gian lam viec";
    return {
      success: false,
      error: {
        code: message.includes("Duong dan dinh danh da duoc su dung")
          ? "SLUG_ALREADY_EXISTS"
          : "WORKSPACE_CREATION_FAILED",
        message,
      },
    };
  }
};

// Update branding settings under RBAC governance
export const updateWorkspaceBrandingAction = async (
  input: UpdateWorkspaceBrandingSchemaInput,
  actorRole: WorkspaceRole,
): Promise<ApiResponse<Workspace>> => {
  try {
    assertAdminAccess(actorRole);
    const validated = updateWorkspaceBrandingSchema.parse(input);
    const workspace = await updateWorkspaceBranding(validated);
    return {
      success: true,
      data: workspace,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Cap nhat nhan dien thuong hieu that bai";
    return {
      success: false,
      error: {
        code: message.includes("Khong co quyen") ? "FORBIDDEN" : "BRANDING_UPDATE_FAILED",
        message,
      },
    };
  }
};

// Invite team member to workspace under RBAC governance
export const inviteMemberAction = async (
  input: InviteMemberSchemaInput,
  actorRole: WorkspaceRole,
): Promise<ApiResponse<WorkspaceMember>> => {
  try {
    assertAdminAccess(actorRole);
    const validated = inviteMemberSchema.parse(input);
    const member = await inviteMember(validated);
    return {
      success: true,
      data: member,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Moi thanh vien that bai";
    return {
      success: false,
      error: {
        code: message.includes("Khong co quyen") ? "FORBIDDEN" : "INVITE_MEMBER_FAILED",
        message,
      },
    };
  }
};

// Mutate existing staff role under RBAC governance
export const updateMemberRoleAction = async (
  input: UpdateMemberRoleSchemaInput,
  actorRole: WorkspaceRole,
): Promise<ApiResponse<WorkspaceMember>> => {
  try {
    assertAdminAccess(actorRole);
    const validated = updateMemberRoleSchema.parse(input);
    const member = await updateMemberRole(validated);
    return {
      success: true,
      data: member,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Cap nhat vai tro that bai";
    return {
      success: false,
      error: {
        code: message.includes("Khong co quyen") ? "FORBIDDEN" : "UPDATE_ROLE_FAILED",
        message,
      },
    };
  }
};
