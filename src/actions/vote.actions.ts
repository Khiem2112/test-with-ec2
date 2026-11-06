"use server";

import type { ApiResponse } from "@/types";
import type { VoteResult } from "@/types/discussion";
import { voteToggleSchema, type VoteToggleSchemaInput } from "@/schemas/vote.schema";
import { toggleVote } from "@/services/voting.service";

// Server action executing atomic toggle vote
export const toggleVoteAction = async (
  postId: string,
  input: VoteToggleSchemaInput,
): Promise<ApiResponse<VoteResult>> => {
  try {
    const validated = voteToggleSchema.parse(input);
    const result = await toggleVote(
      postId,
      validated.voterProfileId,
      validated.ipAddress,
      validated.userAgent,
    );

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Thao tac bo phieu that bai";
    return {
      success: false,
      error: {
        code: message.includes("POST_LOCKED") ? "POST_LOCKED" : "VOTE_FAILED",
        message,
      },
    };
  }
};
