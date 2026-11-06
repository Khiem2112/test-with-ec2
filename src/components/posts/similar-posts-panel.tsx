"use client";

import React from "react";
import { cn } from "@/lib/cn";
import type { SimilarPostResult } from "@/types/post";

export type SimilarPostsPanelProps = {
  similarPosts: SimilarPostResult[];
  onVoteExisting: (postId: string) => void;
  onContinueNew: () => void;
  isExactMatch?: boolean;
  className?: string;
};

export const SimilarPostsPanel = ({
  similarPosts,
  onVoteExisting,
  onContinueNew,
  isExactMatch = false,
  className,
}: SimilarPostsPanelProps): React.JSX.Element | null => {
  if (similarPosts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "p-4 rounded-xl border",
        isExactMatch
          ? "bg-[#18191a] border-amber-500/40"
          : "bg-[#141516] border-[#23252a]",
        className
      )}
    >
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#23252a]">
        <div>
          <h4 className="text-xs font-bold text-[#f7f8f8] uppercase tracking-wide">
            {isExactMatch
              ? "Phat Hien Y Kien Trung Lap 100%"
              : "Y Kien Tuong Tu Da Ton Tai"}
          </h4>
          <p className="text-xs text-[#8a8f98] mt-0.5">
            {isExactMatch
              ? "Y kien voi tieu de nay da ton tai. Ban co the bo phieu de tang do uu tien thay vi tao moi."
              : "Mot so bai dang co the cung chu de. Bo phieu cho bai da co de tang trong so giai quyet."}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {similarPosts.map((post) => (
          <div
            key={post.id}
            className="p-3 bg-[#18191a] rounded-lg border border-[#23252a] flex items-center justify-between transition-colors"
          >
            <div className="flex-1 pr-3 min-w-0">
              <span className="text-xs font-medium text-[#f7f8f8] line-clamp-1">
                {post.title}
              </span>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-[#8a8f98]">
                <span>{post.totalVotesCount} luot binh chon</span>
                <span>&bull;</span>
                <span
                  className="px-1.5 py-0.2 rounded font-semibold text-[10px]"
                  style={{
                    backgroundColor: `${post.status.colorHex}22`,
                    color: post.status.colorHex,
                  }}
                >
                  {post.status.name}
                </span>
                <span>&bull;</span>
                <span className="text-[#62666d]">
                  Khop {Math.round(post.similarityScore * 100)}%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onVoteExisting(post.id)}
              className="px-3 py-1.5 bg-[#5e6ad2] hover:bg-[#828fff] text-white text-xs font-semibold rounded-md shrink-0 cursor-pointer transition-colors"
            >
              Binh Chon
            </button>
          </div>
        ))}
      </div>

      {!isExactMatch && (
        <div className="mt-3 pt-2 border-t border-[#23252a] flex justify-end">
          <button
            type="button"
            onClick={onContinueNew}
            className="text-xs text-[#8a8f98] hover:text-[#f7f8f8] underline cursor-pointer"
          >
            Van tiep tuc tao y kien moi
          </button>
        </div>
      )}
    </div>
  );
};
