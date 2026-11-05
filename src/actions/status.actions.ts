"use server";

import type { ApiResponse } from "@/types";
import type {
  UpdatePostStatusResult,
  PostStatusHistory,
} from "@/types/lifecycle";
import {
  updatePostStatusSchema,
  type UpdatePostStatusSchemaInput,
} from "@/schemas/lifecycle.schema";
import { updatePostStatus, getStatusHistoryByPost } from "@/services/status.service";

// Server action updating post status
export const updatePostStatusAction = async (
  postId: string,
  input: UpdatePostStatusSchemaInput,
  actorUserId?: string | null,
): Promise<ApiResponse<UpdatePostStatusResult>> => {
  try {
    const validated = updatePostStatusSchema.parse(input);
    const result = await updatePostStatus({
      postId,
      newStatusId: validated.newStatusId,
      changeNote: validated.changeNote,
      notifySubscribers: validated.notifySubscribers,
      changedById: actorUserId,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Cap nhat trang thai that bai";
    return {
      success: false,
      error: {
        code: "STATUS_UPDATE_FAILED",
        message,
      },
    };
  }
};

// Server action retrieving complete status mutation history for a post
export const getStatusHistoryAction = async (
  postId: string,
): Promise<ApiResponse<PostStatusHistory[]>> => {
  try {
    const history = await getStatusHistoryByPost(postId);
    return {
      success: true,
      data: history,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the tai lich su trang thai";
    return {
      success: false,
      error: {
        code: "GET_HISTORY_FAILED",
        message,
      },
    };
  }
};
