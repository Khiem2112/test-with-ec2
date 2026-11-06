import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { getPostStatusesByWorkspace } from "@/services/status.service";
import { ModerationClient } from "./moderation-client";
import type { Post } from "@/types/post";

export const dynamic = "force-dynamic";

export type ModerationPageProps = {
  params: Promise<{ slug: string }>;
};

const mapPrismaPostToDomain = (p: {
  id: string;
  boardId: string;
  categoryId: number | null;
  statusId: number;
  authorUserId: string | null;
  voterProfileId: string | null;
  title: string;
  slug: string;
  content: string;
  totalVotesCount: number;
  totalScoreWeight: unknown;
  commentsCount: number;
  isPinned: boolean;
  isLocked: boolean;
  mergedIntoPostId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Post => ({
  id: p.id,
  boardId: p.boardId,
  categoryId: p.categoryId,
  statusId: p.statusId,
  authorUserId: p.authorUserId,
  voterProfileId: p.voterProfileId,
  title: p.title,
  slug: p.slug,
  content: p.content,
  totalVotesCount: p.totalVotesCount,
  totalScoreWeight: Number(p.totalScoreWeight),
  commentsCount: p.commentsCount,
  isPinned: p.isPinned,
  isLocked: p.isLocked,
  mergedIntoPostId: p.mergedIntoPostId,
  isActive: p.isActive,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});

export default async function ModerationPage({
  params,
}: ModerationPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace || !workspace.isActive) {
    notFound();
  }

  const [pendingRecords, allRecords, statuses] = await Promise.all([
    prisma.post.findMany({
      where: {
        board: { workspaceId: workspace.id },
        isActive: false,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.findMany({
      where: {
        board: { workspaceId: workspace.id },
        isActive: true,
        mergedIntoPostId: null,
      },
      orderBy: { createdAt: "desc" },
    }),
    getPostStatusesByWorkspace(workspace.id),
  ]);

  const pendingPosts: Post[] = pendingRecords.map(mapPrismaPostToDomain);
  const allPosts: Post[] = allRecords.map(mapPrismaPostToDomain);

  return (
    <ModerationClient
      workspaceSlug={workspace.slug}
      initialPendingPosts={pendingPosts}
      initialAllPosts={allPosts}
      statuses={statuses}
    />
  );
}
