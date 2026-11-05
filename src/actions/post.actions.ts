"use server";

import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";
import type { Post } from "@/types/post";
import { createPostSchema, type CreatePostSchemaInput } from "@/schemas/post.schema";
import { createPost, getPostById } from "@/services/post.service";

// Submit a new post with validation and atomic auto-subscription
export const createPostAction = async (
  input: CreatePostSchemaInput,
): Promise<ApiResponse<Post>> => {
  try {
    const validated = createPostSchema.parse(input);
    const post = await createPost({
      boardId: validated.boardId,
      categoryId: validated.categoryId,
      authorUserId: validated.authorUserId,
      voterProfileId: validated.voterProfileId,
      title: validated.title,
      content: validated.content,
      tagIds: validated.tagIds,
      attachments: validated.attachments,
    });

    return {
      success: true,
      data: post,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the tao bai viet";
    return {
      success: false,
      error: {
        code: "POST_CREATION_FAILED",
        message,
      },
    };
  }
};

// Approve a pending post from a moderated board
export const approveModeratedPostAction = async (
  postId: string,
  moderatorUserId: string,
): Promise<ApiResponse<Post>> => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { board: true },
    });

    if (!post) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Bai viet khong ton tai",
        },
      };
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: post.board.workspaceId,
        userId: moderatorUserId,
        role: { in: ["OWNER", "ADMIN", "PRODUCT_MANAGER", "MODERATOR"] },
      },
    });

    if (!membership) {
      return {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Khong co quyen kiem duyet bai viet nay",
        },
      };
    }

    await prisma.post.update({
      where: { id: postId },
      data: { isActive: true },
    });

    const updatedPost = await getPostById(postId);
    return {
      success: true,
      data: updatedPost!,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Kiem duyet that bai";
    return {
      success: false,
      error: {
        code: "MODERATION_FAILED",
        message,
      },
    };
  }
};

// Reject and delete or deactivate a pending post
export const rejectModeratedPostAction = async (
  postId: string,
  moderatorUserId: string,
): Promise<ApiResponse<{ id: string; success: boolean }>> => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { board: true },
    });

    if (!post) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Bai viet khong ton tai",
        },
      };
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: post.board.workspaceId,
        userId: moderatorUserId,
        role: { in: ["OWNER", "ADMIN", "PRODUCT_MANAGER", "MODERATOR"] },
      },
    });

    if (!membership) {
      return {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Khong co quyen kiem duyet bai viet nay",
        },
      };
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return {
      success: true,
      data: { id: postId, success: true },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Tu choi that bai";
    return {
      success: false,
      error: {
        code: "REJECTION_FAILED",
        message,
      },
    };
  }
};

// Update tags attached to a post
export const updatePostTagsAction = async (
  postId: string,
  tagIds: number[],
): Promise<ApiResponse<Post>> => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.postTag.deleteMany({
        where: { postId },
      });

      for (const tagId of tagIds) {
        await tx.postTag.create({
          data: {
            postId,
            tagId,
          },
        });
      }
    });

    const updated = await getPostById(postId);
    return {
      success: true,
      data: updated!,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Cap nhat the that bai";
    return {
      success: false,
      error: {
        code: "TAG_UPDATE_FAILED",
        message,
      },
    };
  }
};
