"use server";

import type { ApiResponse } from "@/types";
import type { RoadmapData } from "@/types/roadmap";
import type { UpdatePostStatusResult } from "@/types/lifecycle";
import { getRoadmapColumns } from "@/services/roadmap.service";
import { updatePostStatus } from "@/services/status.service";

// Server action retrieving roadmap Kanban structure
export const getRoadmapAction = async (
  workspaceId: string,
): Promise<ApiResponse<RoadmapData>> => {
  try {
    const data = await getRoadmapColumns(workspaceId);
    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the tai du lieu lo trinh";
    return {
      success: false,
      error: {
        code: "GET_ROADMAP_FAILED",
        message,
      },
    };
  }
};

// Server action synchronizing card movement between Kanban columns
export const moveKanbanCardAction = async (
  postId: string,
  newStatusId: number,
  changeNote?: string,
  actorUserId?: string | null,
): Promise<ApiResponse<UpdatePostStatusResult>> => {
  try {
    const result = await updatePostStatus({
      postId,
      newStatusId,
      changeNote: changeNote ?? "Chuyen trang thai tren bang Kanban",
      changedById: actorUserId,
      notifySubscribers: true,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the cap nhat trang thai the";
    return {
      success: false,
      error: {
        code: "MOVE_CARD_FAILED",
        message,
      },
    };
  }
};
