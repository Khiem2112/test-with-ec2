import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import type { VoteResult } from "@/types/discussion";

// Hash IP address with salt for anonymous audit tracking
const hashIpAddress = (ip?: string | null): string | null => {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex");
};

// Check if a voter profile has voted on a post
export const hasUserVoted = async (
  postId: string,
  voterProfileId: string,
): Promise<boolean> => {
  const existing = await prisma.vote.findUnique({
    where: {
      postId_voterProfileId: {
        postId,
        voterProfileId,
      },
    },
  });

  return existing !== null;
};

// Atomic vote toggling with lock check, weight adjustment, audit logging, and auto-subscription
export const toggleVote = async (
  postId: string,
  voterProfileId: string,
  ipAddress?: string | null,
  userAgent?: string | null,
): Promise<VoteResult> => {
  const ipAddressHash = hashIpAddress(ipAddress);

  return await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error("POST_NOT_FOUND: Bai viet khong ton tai");
    }

    if (post.isLocked) {
      throw new Error("POST_LOCKED: Bai viet nay da bi dong bang thao luan va binh chon boi ban quan tri");
    }

    const voter = await tx.voterProfile.findUnique({
      where: { id: voterProfileId },
    });

    if (!voter) {
      throw new Error("VOTER_NOT_FOUND: Ho so nguoi bo phieu khong ton tai");
    }

    const appliedWeight = Number(voter.voteWeight) || 1.0;

    const existingVote = await tx.vote.findUnique({
      where: {
        postId_voterProfileId: {
          postId,
          voterProfileId,
        },
      },
    });

    if (existingVote) {
      // UNVOTE action
      await tx.vote.delete({
        where: { id: existingVote.id },
      });

      const nextVotesCount = Math.max(0, post.totalVotesCount - 1);
      const nextScoreWeight = Math.max(0, Number(post.totalScoreWeight) - appliedWeight);

      await tx.post.update({
        where: { id: postId },
        data: {
          totalVotesCount: nextVotesCount,
          totalScoreWeight: nextScoreWeight,
        },
      });

      await tx.voteActivityLog.create({
        data: {
          postId,
          voterProfileId,
          actionType: "UNVOTE",
          ipAddressHash,
          userAgent: userAgent ?? null,
        },
      });

      return {
        action: "UNVOTED",
        postId,
        totalVotesCount: nextVotesCount,
        totalScoreWeight: nextScoreWeight,
        userHasVoted: false,
      };
    }

    // UPVOTE action
    await tx.vote.create({
      data: {
        postId,
        voterProfileId,
        appliedWeight,
        ipAddressHash,
      },
    });

    const nextVotesCount = post.totalVotesCount + 1;
    const nextScoreWeight = Number(post.totalScoreWeight) + appliedWeight;

    await tx.post.update({
      where: { id: postId },
      data: {
        totalVotesCount: nextVotesCount,
        totalScoreWeight: nextScoreWeight,
      },
    });

    await tx.voteActivityLog.create({
      data: {
        postId,
        voterProfileId,
        actionType: "UPVOTE",
        ipAddressHash,
        userAgent: userAgent ?? null,
      },
    });

    // Auto-subscribe voter to future updates
    const existingSub = await tx.postSubscription.findUnique({
      where: {
        postId_voterProfileId: {
          postId,
          voterProfileId,
        },
      },
    });

    if (!existingSub) {
      await tx.postSubscription.create({
        data: {
          postId,
          voterProfileId,
          notifyEmail: true,
          notifyInApp: true,
        },
      });
    }

    return {
      action: "UPVOTED",
      postId,
      totalVotesCount: nextVotesCount,
      totalScoreWeight: nextScoreWeight,
      userHasVoted: true,
    };
  });
};
