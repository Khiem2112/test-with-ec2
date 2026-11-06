"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/cn";
import type { Post, Category, Tag } from "@/types/post";

export type BoardSortOption = "popular" | "newest" | "trending";

export type BoardFeedViewProps = {
  posts: Post[];
  categories?: Category[];
  tags?: Tag[];
  boardName: string;
  boardDescription?: string | null;
  onVote?: (postId: string) => void;
  onOpenCreateDialog?: () => void;
  className?: string;
};

export const BoardFeedView = ({
  posts,
  categories = [],
  tags = [],
  boardName,
  boardDescription,
  onVote,
  onOpenCreateDialog,
  className,
}: BoardFeedViewProps): React.JSX.Element => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<BoardSortOption>("popular");

  // Filter and sort posts deterministically
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (selectedCategoryId !== null) {
      result = result.filter((p) => p.categoryId === selectedCategoryId);
    }

    if (selectedTagId !== null) {
      result = result.filter((p) => p.tags?.some((t) => t.id === selectedTagId));
    }

    switch (sortOption) {
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "trending":
        result.sort((a, b) => b.totalVotesCount - a.totalVotesCount);
        break;
      case "popular":
      default:
        result.sort((a, b) => b.totalScoreWeight - a.totalScoreWeight);
        break;
    }

    return result;
  }, [posts, selectedCategoryId, selectedTagId, sortOption]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Board Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-gray-200 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{boardName}</h1>
          {boardDescription && (
            <p className="mt-1 text-sm text-gray-600">{boardDescription}</p>
          )}
        </div>
        {onOpenCreateDialog && (
          <button
            type="button"
            onClick={onOpenCreateDialog}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold cursor-pointer shadow-xs self-start md:self-auto"
          >
            Dong Gop Y Kien
          </button>
        )}
      </div>

      {/* Control Bar: Sorting and Filtering */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        {/* Sorting Tabs */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setSortOption("popular")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded cursor-pointer",
              sortOption === "popular"
                ? "bg-white text-blue-600 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            Pho Bien Nhat
          </button>
          <button
            type="button"
            onClick={() => setSortOption("trending")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded cursor-pointer",
              sortOption === "trending"
                ? "bg-white text-blue-600 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            Xu Huong
          </button>
          <button
            type="button"
            onClick={() => setSortOption("newest")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded cursor-pointer",
              sortOption === "newest"
                ? "bg-white text-blue-600 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            Moi Nhat
          </button>
        </div>

        {/* Category & Tag Dropdowns */}
        <div className="flex items-center gap-2">
          {categories.length > 0 && (
            <select
              value={selectedCategoryId ?? ""}
              onChange={(e) =>
                setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)
              }
              className="px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-700"
            >
              <option value="">Tat Ca Danh Muc</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {tags.length > 0 && (
            <select
              value={selectedTagId ?? ""}
              onChange={(e) =>
                setSelectedTagId(e.target.value ? Number(e.target.value) : null)
              }
              className="px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-700"
            >
              <option value="">Tat Ca The</option>
              {tags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center bg-white border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Chua co bai dang nao phu hop voi bo loc.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-5 bg-white border border-gray-200 rounded-lg flex items-start gap-4 hover:border-gray-300 transition-colors"
            >
              {/* Vote count button */}
              <button
                type="button"
                onClick={() => onVote?.(post.id)}
                className="flex flex-col items-center justify-center min-w-12 px-2 py-2 border border-gray-200 rounded bg-gray-50 hover:bg-blue-50 hover:border-blue-300 cursor-pointer text-center"
              >
                <span className="text-xs font-bold text-gray-800 uppercase">Vote</span>
                <span className="text-sm font-extrabold text-blue-600">{post.totalVotesCount}</span>
              </button>

              {/* Post details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {post.isPinned && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                      Ghim
                    </span>
                  )}
                  <h2 className="text-base font-semibold text-gray-900 truncate">
                    {post.title}
                  </h2>
                </div>

                <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                  {post.content}
                </p>

                {/* Tags and Status pill */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                    Trang Thai #{post.statusId}
                  </span>

                  {post.tags?.map((t) => (
                    <span
                      key={t.id}
                      className="px-2 py-0.5 rounded text-[10px] font-medium text-white"
                      style={{ backgroundColor: t.colorHex }}
                    >
                      {t.name}
                    </span>
                  ))}

                  <span className="text-gray-400 text-[11px] ml-auto">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
