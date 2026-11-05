import { prisma } from "@/lib/prisma";
import type {
  PostStatus,
  PostStatusHistory,
  UpdatePostStatusInput,
  UpdatePostStatusResult,
} from "@/types/lifecycle";

// Map Prisma status record to strict domain model
const mapStatusRecord = (record: {
  id: number;
  workspaceId: string;
  name: string;
  key: string;
  category: "BACKLOG" | "UNSCHEDULED" | "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CLOSED" | "DECLINED";
  colorHex: string;
  showOnRoadmap: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): PostStatus => {
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    name: record.name,
    key: record.key,
    category: record.category,
    colorHex: record.colorHex,
    showOnRoadmap: record.showOnRoadmap,
    displayOrder: record.displayOrder,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

// Retrieve all active post statuses within workspace boundary
export const getPostStatusesByWorkspace = async (
  workspaceId: string,
): Promise<PostStatus[]> => {
  const records = await prisma.postStatus.findMany({
    where: {
      workspaceId,
      isActive: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  return records.map(mapStatusRecord);
};

// Retrieve single post status by ID
export const getPostStatusById = async (
  id: number,
): Promise<PostStatus | null> => {
  const record = await prisma.postStatus.findUnique({
    where: { id },
  });

  if (!record) {
    return null;
  }

  return mapStatusRecord(record);
};

// Update post status atomically recording history and audit log
export const updatePostStatus = async (
  input: UpdatePostStatusInput,
): Promise<UpdatePostStatusResult> => {
  return await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: { id: input.postId },
      include: { board: true },
    });

    if (!post) {
      throw new Error("POST_NOT_FOUND: Bai viet khong ton tai");
    }

    const newStatus = await tx.postStatus.findUnique({
      where: { id: input.newStatusId },
    });

    if (!newStatus) {
      throw new Error("STATUS_NOT_FOUND: Trang thai khong ton tai");
    }

    if (newStatus.workspaceId !== post.board.workspaceId) {
      throw new Error("TENANT_MISMATCH: Trang thai khong thuoc khong gian lam viec nay");
    }

    const oldStatusId = post.statusId;

    const updatedPost = await tx.post.update({
      where: { id: input.postId },
      data: { statusId: input.newStatusId },
    });

    const historyRecord = await tx.postStatusHistory.create({
      data: {
        postId: input.postId,
        oldStatusId,
        newStatusId: input.newStatusId,
        changedById: input.changedById ?? null,
        changeNote: input.changeNote ?? null,
      },
    });

    await tx.auditLog.create({
      data: {
        workspaceId: post.board.workspaceId,
        userId: input.changedById ?? null,
        action: "POST_STATUS_CHANGED",
        entityType: "POST",
        entityId: input.postId,
        details: {
          oldStatusId,
          newStatusId: input.newStatusId,
          changeNote: input.changeNote ?? null,
          notifySubscribers: input.notifySubscribers ?? true,
        },
      },
    });

    return {
      postId: input.postId,
      oldStatusId,
      newStatusId: input.newStatusId,
      updatedAt: updatedPost.updatedAt,
      historyId: historyRecord.id,
    };
  });
};

// Retrieve complete status mutation history for a specific post
export const getStatusHistoryByPost = async (
  postId: string,
): Promise<PostStatusHistory[]> => {
  const records = await prisma.postStatusHistory.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
  });

  return records.map((r) => ({
    id: r.id,
    postId: r.postId,
    oldStatusId: r.oldStatusId,
    newStatusId: r.newStatusId,
    changedById: r.changedById,
    changeNote: r.changeNote,
    createdAt: r.createdAt,
  }));
};
