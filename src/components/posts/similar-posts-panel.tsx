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
        "p-4 rounded-lg border",
        isExactMatch ? "bg-amber-50 border-amber-300" : "bg-blue-50 border-blue-200",
        className,
      )}
    >
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
        <div>
          <h4 className="text-sm font-bold text-gray-900">
            {isExactMatch
              ? "Phat Hien Y Kien Trung Lap 100%"
              : "Y Kien Tuong Tu Da Ton Tai"}
          </h4>
          <p className="text-xs text-gray-600">
            {isExactMatch
              ? "Y kien voi tieu de nay da duoc dong gop. Ban co the bo phieu de tang do uu tien thay vi tao bai moi."
              : "Mot so bai dang co the cung chu de voi ban. Bo phieu cho bai da co de tang trong so giai quyet."}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {similarPosts.map((post) => (
          <div
            key={post.id}
            className="p-3 bg-white rounded border border-gray-200 flex items-center justify-between shadow-xs"
          >
            <div className="flex-1 pr-3">
              <span className="text-sm font-medium text-gray-900 line-clamp-1">
                {post.title}
              </span>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span className="font-semibold text-gray-700">
                  {post.totalVotesCount} votes
                </span>
                <span>•</span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                  style={{ backgroundColor: post.status.colorHex }}
                >
                  {post.status.name}
                </span>
                <span>•</span>
                <span className="text-gray-400 font-mono">
                  {Math.round(post.similarityScore * 100)}% giong
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onVoteExisting(post.id)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded cursor-pointer whitespace-nowrap"
            >
              Bo Phieu Cho Bai Nay
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
        <button
          type="button"
          onClick={onContinueNew}
          className="text-xs font-medium text-gray-600 hover:text-gray-900 underline cursor-pointer"
        >
          Tiep Tuc Dang Y Kien Moi
        </button>
      </div>
    </div>
  );
};
