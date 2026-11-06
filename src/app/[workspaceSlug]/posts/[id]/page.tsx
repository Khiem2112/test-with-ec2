import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { getBoardById } from "@/services/board.service";
import { getPostById } from "@/services/post.service";
import { getPostStatusesByWorkspace } from "@/services/status.service";
import { getCommentsByPost } from "@/services/comment.service";
import { VoteButton } from "@/components/discussions/vote-button";
import { SubscriptionToggle } from "@/components/notifications/subscription-toggle";
import { PostDiscussionClient } from "@/components/discussions/post-discussion-client";
import { MergedNoticeBanner } from "@/components/lifecycle/merged-notice-banner";

export const dynamic = "force-dynamic";

export type PostDetailPageProps = {
  params: Promise<{
    workspaceSlug: string;
    id: string;
  }>;
};

export default async function PostDetailPage({
  params,
}: PostDetailPageProps): Promise<React.JSX.Element> {
  const { workspaceSlug, id } = await params;

  const workspace = await getWorkspaceBySlug(workspaceSlug);
  if (!workspace || !workspace.isActive) {
    notFound();
  }

  const post = await getPostById(id);
  if (!post || !post.isActive) {
    notFound();
  }

  const board = await getBoardById(post.boardId);
  const statuses = await getPostStatusesByWorkspace(workspace.id);
  const comments = await getCommentsByPost(post.id);

  const currentStatus = statuses.find((s) => s.id === post.statusId);

  let mergedTargetPost = null;
  if (post.mergedIntoPostId) {
    mergedTargetPost = await getPostById(post.mergedIntoPostId);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-2 text-xs text-[#8a8f98]">
        <Link
          href={`/${workspaceSlug}`}
          className="hover:text-[#f7f8f8] transition-colors"
        >
          {workspace.name}
        </Link>
        <span>/</span>
        {board && (
          <Link
            href={`/${workspaceSlug}/boards/${board.slug}`}
            className="hover:text-[#f7f8f8] transition-colors"
          >
            {board.name}
          </Link>
        )}
        <span>/</span>
        <span className="text-[#62666d] truncate max-w-xs">{post.title}</span>
      </div>

      {mergedTargetPost && (
        <MergedNoticeBanner
          targetPostTitle={mergedTargetPost.title}
          targetPostSlug={mergedTargetPost.id}
          workspaceSlug={workspaceSlug}
        />
      )}

      <div className="rounded-xl border border-[#23252a] bg-[#0f1011] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <VoteButton
              postId={post.id}
              initialCount={post.totalVotesCount}
              isLocked={post.isLocked}
            />

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                {currentStatus && (
                  <span
                    className="px-2.5 py-0.5 rounded text-[11px] font-semibold"
                    style={{
                      backgroundColor: `${currentStatus.colorHex}22`,
                      color: currentStatus.colorHex,
                      border: `1px solid ${currentStatus.colorHex}44`,
                    }}
                  >
                    {currentStatus.name}
                  </span>
                )}
                {post.isPinned && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#5e6ad2]/20 text-[#828fff] border border-[#5e6ad2]/30">
                    Ghim
                  </span>
                )}
                {post.isLocked && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#23252a] text-[#8a8f98]">
                    Da Khoa
                  </span>
                )}
              </div>

              <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[#f7f8f8]">
                {post.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <SubscriptionToggle postId={post.id} />
          </div>
        </div>

        <div className="text-xs text-[#8a8f98] flex items-center gap-3 border-t border-b border-[#18191a] py-2.5">
          <span>Ngay tao: {new Date(post.createdAt).toLocaleDateString()}</span>
          <span>&bull;</span>
          <span>{post.commentsCount} binh luan</span>
        </div>

        <div className="text-sm text-[#d0d6e0] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2.5 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${tag.colorHex}22`,
                  color: tag.colorHex,
                  border: `1px solid ${tag.colorHex}44`,
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {post.attachments && post.attachments.length > 0 && (
          <div className="pt-4 border-t border-[#18191a] space-y-2">
            <span className="text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider block">
              Tep Dinh Kem ({post.attachments.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {post.attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#23252a] bg-[#141516] text-xs text-[#f7f8f8] hover:border-[#34343a] transition-colors"
                >
                  <span className="truncate">{att.fileName}</span>
                  <span className="text-[10px] text-[#62666d] ml-2 shrink-0">
                    {Math.round(att.fileSize / 1024)} KB
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#f7f8f8]">
          Thao Luan & Y Kien ({comments.length})
        </h2>
        <PostDiscussionClient
          postId={post.id}
          initialComments={comments}
        />
      </div>
    </div>
  );
}
