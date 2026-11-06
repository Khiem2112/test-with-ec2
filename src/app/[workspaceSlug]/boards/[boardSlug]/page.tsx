import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { getBoardBySlug, getCategoriesByBoard, getAllTags } from "@/services/board.service";
import { getPostsByBoard } from "@/services/post.service";
import { BoardFeedView } from "@/components/posts/board-feed-view";

export const dynamic = "force-dynamic";

export type BoardPageProps = {
  params: Promise<{
    workspaceSlug: string;
    boardSlug: string;
  }>;
};

export default async function BoardPage({
  params,
}: BoardPageProps): Promise<React.JSX.Element> {
  const { workspaceSlug, boardSlug } = await params;

  const workspace = await getWorkspaceBySlug(workspaceSlug);
  if (!workspace || !workspace.isActive) {
    notFound();
  }

  const board = await getBoardBySlug(workspace.id, boardSlug);
  if (!board || !board.isActive) {
    notFound();
  }

  const [categories, tags, posts] = await Promise.all([
    getCategoriesByBoard(board.id),
    getAllTags(),
    getPostsByBoard(board.id),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href={`/${workspaceSlug}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
        >
          <span>&larr;</span>
          <span>Tat ca cac bang</span>
        </Link>
      </div>

      <BoardFeedView
        posts={posts}
        categories={categories}
        tags={tags}
        boardId={board.id}
        boardName={board.name}
        boardDescription={board.description}
        workspaceSlug={workspaceSlug}
      />
    </div>
  );
}
