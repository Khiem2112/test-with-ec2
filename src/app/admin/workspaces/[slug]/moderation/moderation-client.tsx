"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { StatusTransitionDialog } from "@/components/lifecycle/status-transition-dialog";
import { MergeDrawer } from "@/components/lifecycle/merge-drawer";
import {
  approveModeratedPostAction,
  rejectModeratedPostAction,
} from "@/actions/post.actions";
import type { Post } from "@/types/post";
import type { PostStatus, UpdatePostStatusResult, ExecuteMergeResult } from "@/types/lifecycle";

export type ModerationClientProps = {
  workspaceSlug: string;
  initialPendingPosts: Post[];
  initialAllPosts: Post[];
  statuses: PostStatus[];
  moderatorUserId?: string;
};

export const ModerationClient = ({
  workspaceSlug,
  initialPendingPosts,
  initialAllPosts,
  statuses,
  moderatorUserId = "admin-user",
}: ModerationClientProps): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [pendingPosts, setPendingPosts] = useState<Post[]>(initialPendingPosts);
  const [allPosts, setAllPosts] = useState<Post[]>(initialAllPosts);
  const [activeStatusPost, setActiveStatusPost] = useState<Post | null>(null);
  const [activeMergePost, setActiveMergePost] = useState<Post | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApprove = async (postId: string): Promise<void> => {
    setActionNotice(null);
    setErrorMessage(null);

    const result = await approveModeratedPostAction(postId, moderatorUserId);
    if (!result.success) {
      setErrorMessage(result.error?.message ?? "Phe duyet bai viet that bai");
      return;
    }

    setPendingPosts((prev) => prev.filter((p) => p.id !== postId));
    setAllPosts((prev) => [result.data, ...prev]);
    setActionNotice("Da phe duyet bai viet thanh cong");
  };

  const handleReject = async (postId: string): Promise<void> => {
    setActionNotice(null);
    setErrorMessage(null);

    const result = await rejectModeratedPostAction(postId, moderatorUserId);
    if (!result.success) {
      setErrorMessage(result.error?.message ?? "Tu choi bai viet that bai");
      return;
    }

    setPendingPosts((prev) => prev.filter((p) => p.id !== postId));
    setActionNotice("Da tu choi va xoa bai viet khoi hang doi");
  };

  const handleStatusUpdated = (result: UpdatePostStatusResult): void => {
    setAllPosts((prev) =>
      prev.map((p) => (p.id === result.postId ? { ...p, statusId: result.newStatusId } : p))
    );
    setActionNotice("Cap nhat trang thai tinh nang thanh cong");
  };

  const handleMergeSuccess = (result: ExecuteMergeResult): void => {
    setAllPosts((prev) =>
      prev.map((p) => (p.id === result.sourcePostId ? { ...p, isLocked: true } : p))
    );
    setActionNotice("Gop bai viet thanh cong");
  };

  const displayedPosts = activeTab === "pending" ? pendingPosts : allPosts;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f7f8f8]">
            Kiem Duyet & Quan Tri Vong Doi
          </h1>
          <p className="text-xs text-[#8a8f98] mt-1">
            Duyet phan hoi cho kiem duyet, chuyen doi trang thai lo trinh va gop bai viet trung lap.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#141516] border border-[#23252a] rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
              activeTab === "pending"
                ? "bg-[#18191a] text-[#f7f8f8] border border-[#23252a]"
                : "text-[#8a8f98] hover:text-[#f7f8f8]"
            )}
          >
            Hang Doi Cho Duyet ({pendingPosts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
              activeTab === "all"
                ? "bg-[#18191a] text-[#f7f8f8] border border-[#23252a]"
                : "text-[#8a8f98] hover:text-[#f7f8f8]"
            )}
          >
            Tat Ca Bai Dang ({allPosts.length})
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 text-xs text-[#27a644] bg-[#27a644]/10 border border-[#27a644]/30 rounded-lg">
          {actionNotice}
        </div>
      )}

      {errorMessage && (
        <div className="p-3 text-xs text-red-400 bg-red-950/20 border border-red-800/40 rounded-lg" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="space-y-3">
        {displayedPosts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#23252a] bg-[#0f1011] p-12 text-center">
            <p className="text-sm text-[#8a8f98]">
              {activeTab === "pending"
                ? "Khong co bai dang nao dang cho kiem duyet."
                : "Chua co bai dang nao trong khong gian nay."}
            </p>
          </div>
        ) : (
          displayedPosts.map((post) => {
            const currentStatus = statuses.find((s) => s.id === post.statusId);
            return (
              <div
                key={post.id}
                className="p-5 rounded-xl border border-[#23252a] bg-[#0f1011] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#34343a] transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {currentStatus && (
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${currentStatus.colorHex}22`,
                          color: currentStatus.colorHex,
                          border: `1px solid ${currentStatus.colorHex}44`,
                        }}
                      >
                        {currentStatus.name}
                      </span>
                    )}
                    <span className="text-[11px] text-[#62666d]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[11px] text-[#8a8f98] font-mono">
                      {post.totalVotesCount} votes
                    </span>
                  </div>

                  <Link
                    href={`/${workspaceSlug}/posts/${post.id}`}
                    className="text-sm font-semibold text-[#f7f8f8] hover:text-[#828fff] transition-colors block truncate"
                  >
                    {post.title}
                  </Link>

                  <p className="text-xs text-[#8a8f98] line-clamp-1">
                    {post.content}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {activeTab === "pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApprove(post.id)}
                        className="px-3 py-1.5 bg-[#27a644] hover:bg-[#27a644]/80 text-white rounded-md text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Phe Duyet
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(post.id)}
                        className="px-3 py-1.5 border border-red-800/40 bg-red-950/20 text-red-400 hover:bg-red-950/40 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Tu Choi
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveStatusPost(post)}
                        className="px-3 py-1.5 border border-[#23252a] bg-[#141516] text-[#d0d6e0] hover:text-white hover:bg-[#18191a] rounded-md text-xs font-medium cursor-pointer transition-colors"
                      >
                        Doi Trang Thai
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMergePost(post)}
                        className="px-3 py-1.5 border border-[#23252a] bg-[#141516] text-[#8a8f98] hover:text-white hover:bg-[#18191a] rounded-md text-xs font-medium cursor-pointer transition-colors"
                      >
                        Gop Bai
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {activeStatusPost && (
        <StatusTransitionDialog
          postId={activeStatusPost.id}
          currentStatusId={activeStatusPost.statusId}
          statuses={statuses}
          isOpen={true}
          onClose={() => setActiveStatusPost(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}

      {activeMergePost && (
        <MergeDrawer
          sourcePost={activeMergePost}
          isOpen={true}
          onClose={() => setActiveMergePost(null)}
          onMergeSuccess={handleMergeSuccess}
        />
      )}
    </div>
  );
};
