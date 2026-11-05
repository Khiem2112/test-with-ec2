import { prisma } from "@/lib/prisma";
import type { MergePreviewResult, ExecuteMergeResult } from "@/types/lifecycle";

// Detect circular reference chains or self-merging attempts
export const assertNoCircularMerge = async (
  sourcePostId: string,
  targetPostId: string,
): Promise<void> => {
  if (sourcePostId === targetPostId) {
    throw new Error(
      "CIRCULAR_MERGE_DETECTED: Khong the gop bai viet vao chinh no hoac tao chu trinh gop bai vong tron",
    );
  }

  const targetPost = await prisma.post.findUnique({
    where: { id: targetPostId },
  });

  if (!targetPost) {
    throw new Error("TARGET_NOT_FOUND: Bai viet dich khong ton tai");
  }

  if (targetPost.mergedIntoPostId) {
    throw new Error(
      "CIRCULAR_MERGE_DETECTED: Khong the gop vao mot bai viet da duoc hop nhat truoc do",
    );
  }

  let currentTargetId: string | null = targetPostId;
  const visited = new Set<string>([sourcePostId]);

  while (currentTargetId) {
    if (visited.has(currentTargetId)) {
      throw new Error(
        "CIRCULAR_MERGE_DETECTED: Khong the gop bai viet vao chinh no hoac tao chu trinh gop bai vong tron",
      );
    }
    visited.add(currentTargetId);

    const currentPostRecord: { mergedIntoPostId: string | null } | null =
      await prisma.post.findUnique({
        where: { id: currentTargetId },
        select: { mergedIntoPostId: true },
      });

    currentTargetId = currentPostRecord?.mergedIntoPostId ?? null;
  }
};

// Calculate transferable votes, duplicate vote discards, and subscriber migrations
export const previewMerge = async (
  sourcePostId: string,
  targetPostId: string,
): Promise<MergePreviewResult> => {
  await assertNoCircularMerge(sourcePostId, targetPostId);

  const [sourceVotes, targetVotes, sourceSubs, targetSubs] = await Promise.all([
    prisma.vote.findMany({ where: { postId: sourcePostId } }),
    prisma.vote.findMany({ where: { postId: targetPostId } }),
    prisma.postSubscription.findMany({ where: { postId: sourcePostId } }),
    prisma.postSubscription.findMany({ where: { postId: targetPostId } }),
  ]);

  const targetVoterIds = new Set(targetVotes.map((v) => v.voterProfileId));
  const targetSubVoterIds = new Set(targetSubs.map((s) => s.voterProfileId));

  let transferableVotesCount = 0;
  let duplicateVotesCount = 0;
  let additionalScoreWeight = 0;

  for (const vote of sourceVotes) {
    if (targetVoterIds.has(vote.voterProfileId)) {
      duplicateVotesCount += 1;
    } else {
      transferableVotesCount += 1;
      additionalScoreWeight += Number(vote.appliedWeight);
    }
  }

  let transferableSubscribersCount = 0;
  for (const sub of sourceSubs) {
    if (!targetSubVoterIds.has(sub.voterProfileId)) {
      transferableSubscribersCount += 1;
    }
  }

  return {
    sourcePostId,
    targetPostId,
    transferableVotesCount,
    duplicateVotesCount,
    additionalScoreWeight: Number(additionalScoreWeight.toFixed(2)),
    transferableSubscribersCount,
  };
};

// Execute atomic post merge transaction preserving source record and migrating subscribers
export const executeMerge = async (
  sourcePostId: string,
  targetPostId: string,
  performedById?: string | null,
): Promise<ExecuteMergeResult> => {
  await assertNoCircularMerge(sourcePostId, targetPostId);

  return await prisma.$transaction(async (tx) => {
    const sourcePost = await tx.post.findUnique({
      where: { id: sourcePostId },
      include: { board: true },
    });
    const targetPost = await tx.post.findUnique({
      where: { id: targetPostId },
    });

    if (!sourcePost || !targetPost) {
      throw new Error("POST_NOT_FOUND: Bai viet nguon hoac bai viet dich khong ton tai");
    }

    if (sourcePost.mergedIntoPostId) {
      throw new Error("ALREADY_MERGED: Bai viet nguon da duoc gop truoc do");
    }

    const [sourceVotes, targetVotes, sourceSubs, targetSubs] = await Promise.all([
      tx.vote.findMany({ where: { postId: sourcePostId } }),
      tx.vote.findMany({ where: { postId: targetPostId } }),
      tx.postSubscription.findMany({ where: { postId: sourcePostId } }),
      tx.postSubscription.findMany({ where: { postId: targetPostId } }),
    ]);

    const targetVoterIds = new Set(targetVotes.map((v) => v.voterProfileId));
    const targetSubVoterIds = new Set(targetSubs.map((s) => s.voterProfileId));

    let transferableVotesCount = 0;
    let additionalScoreWeight = 0;

    for (const vote of sourceVotes) {
      if (targetVoterIds.has(vote.voterProfileId)) {
        await tx.vote.delete({ where: { id: vote.id } });
      } else {
        await tx.vote.update({
          where: { id: vote.id },
          data: { postId: targetPostId },
        });
        transferableVotesCount += 1;
        additionalScoreWeight += Number(vote.appliedWeight);
      }
    }

    let subscribersTransferred = 0;
    for (const sub of sourceSubs) {
      if (targetSubVoterIds.has(sub.voterProfileId)) {
        await tx.postSubscription.delete({ where: { id: sub.id } });
      } else {
        await tx.postSubscription.update({
          where: { id: sub.id },
          data: { postId: targetPostId },
        });
        subscribersTransferred += 1;
      }
    }

    const nextTargetVotes = targetPost.totalVotesCount + transferableVotesCount;
    const nextTargetScore = Number(targetPost.totalScoreWeight) + additionalScoreWeight;

    await tx.post.update({
      where: { id: targetPostId },
      data: {
        totalVotesCount: nextTargetVotes,
        totalScoreWeight: nextTargetScore,
      },
    });

    const now = new Date();
    await tx.post.update({
      where: { id: sourcePostId },
      data: {
        mergedIntoPostId: targetPostId,
        isLocked: true,
        totalVotesCount: 0,
        totalScoreWeight: 0,
      },
    });

    await tx.postMergeHistory.create({
      data: {
        sourcePostId,
        targetPostId,
        performedById: performedById ?? null,
        votesTransferred: transferableVotesCount,
      },
    });

    await tx.auditLog.create({
      data: {
        workspaceId: sourcePost.board.workspaceId,
        userId: performedById ?? null,
        action: "POST_MERGED",
        entityType: "POST",
        entityId: sourcePostId,
        details: {
          targetPostId,
          votesTransferred: transferableVotesCount,
          subscribersTransferred,
        },
      },
    });

    return {
      sourcePostId,
      targetPostId,
      votesTransferred: transferableVotesCount,
      subscribersTransferred,
      targetNewTotalVotes: nextTargetVotes,
      targetNewScoreWeight: Number(nextTargetScore.toFixed(2)),
      mergedAt: now,
    };
  });
};
