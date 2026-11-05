"use server";

import type { ApiResponse } from "@/types";
import type { Comment, CommentTreeNode } from "@/types/discussion";
import { createCommentSchema, type CreateCommentSchemaInput } from "@/schemas/comment.schema";
import { createComment, getCommentsByPost } from "@/services/comment.service";

// Server action retrieving threaded comments with internal note protection
export const getCommentsAction = async (
  postId: string,
  requesterUserId?: string | null,
): Promise<ApiResponse<CommentTreeNode[]>> => {
  try {
    const comments = await getCommentsByPost(postId, requesterUserId);
    return {
      success: true,
      data: comments,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the tai binh luan";
    return {
      success: false,
      error: {
        code: "GET_COMMENTS_FAILED",
        message,
      },
    };
  }
};

// Server action creating public comment or staff internal note
export const createCommentAction = async (
  input: CreateCommentSchemaInput,
): Promise<ApiResponse<Comment>> => {
  try {
    const validated = createCommentSchema.parse(input);
    const comment = await createComment({
      postId: validated.postId,
      authorName: validated.authorName,
      content: validated.content,
      parentId: validated.parentId,
      isInternalNote: validated.isInternalNote,
      authorUserId: validated.authorUserId,
    });

    return {
      success: true,
      data: comment,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the tao binh luan";
    return {
      success: false,
      error: {
        code: message.includes("POST_LOCKED")
          ? "POST_LOCKED"
          : message.includes("FORBIDDEN")
            ? "FORBIDDEN"
            : "COMMENT_CREATION_FAILED",
        message,
      },
    };
  }
};
