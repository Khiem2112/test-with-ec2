"use server";

import type { ApiResponse } from "@/types";
import type {
  MergePreviewResult,
  ExecuteMergeResult,
} from "@/types/lifecycle";
import {
  mergePostsSchema,
  previewMergeSchema,
  type MergePostsSchemaInput,
  type PreviewMergeSchemaInput,
} from "@/schemas/lifecycle.schema";
import { previewMerge, executeMerge } from "@/services/merge-engine.service";

// Server action generating merge impact preview
export const previewMergeAction = async (
  sourcePostId: string,
  input: PreviewMergeSchemaInput,
): Promise<ApiResponse<MergePreviewResult>> => {
  try {
    const validated = previewMergeSchema.parse(input);
    const result = await previewMerge(sourcePostId, validated.targetPostId);
    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the tinh toan merge preview";
    return {
      success: false,
      error: {
        code: message.includes("CIRCULAR_MERGE_DETECTED")
          ? "CIRCULAR_MERGE_DETECTED"
          : "PREVIEW_MERGE_FAILED",
        message,
      },
    };
  }
};

// Server action executing atomic post merge
export const executeMergeAction = async (
  sourcePostId: string,
  input: MergePostsSchemaInput,
  actorUserId?: string | null,
): Promise<ApiResponse<ExecuteMergeResult>> => {
  try {
    const validated = mergePostsSchema.parse(input);
    const result = await executeMerge(
      sourcePostId,
      validated.targetPostId,
      actorUserId,
    );
    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gop bai that bai";
    return {
      success: false,
      error: {
        code: message.includes("CIRCULAR_MERGE_DETECTED")
          ? "CIRCULAR_MERGE_DETECTED"
          : "EXECUTE_MERGE_FAILED",
        message,
      },
    };
  }
};
