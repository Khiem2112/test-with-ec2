import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { getReleasesByWorkspace } from "@/services/release.service";
import { ReleasesManagementClient } from "./releases-management-client";
import type { Post } from "@/types/post";

export const dynamic = "force-dynamic";

export type ReleasesPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ReleasesPage({
  params,
}: ReleasesPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace || !workspace.isActive) {
    notFound();
  }

  const [releases, completedRecords] = await Promise.all([
    getReleasesByWorkspace(workspace.id),
    prisma.post.findMany({
      where: {
        board: { workspaceId: workspace.id },
        isActive: true,
        mergedIntoPostId: null,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const completedPosts: Post[] = completedRecords.map((p) => ({
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
  }));

  return (
    <ReleasesManagementClient
      workspaceId={workspace.id}
      initialReleases={releases}
      completedPosts={completedPosts}
    />
  );
}
