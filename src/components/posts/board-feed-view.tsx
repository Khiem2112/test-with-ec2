"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useVoter } from "@/context/voter-context";
import { PostSubmissionDialog } from "./post-submission-dialog";
import type { Post, Category, Tag } from "@/types/post";

export type BoardSortOption = "popular" | "newest" | "trending";

export type BoardFeedViewProps = {
  posts: Post[];
  categories?: Category[];
  tags?: Tag[];
  boardId: string;
  boardName: string;
  boardDescription?: string | null;
  workspaceSlug?: string;
  onVote?: (postId: string) => void;
  onOpenCreateDialog?: () => void;
  className?: string;
};

export const BoardFeedView = ({
  posts: initialPosts,
  categories = [],
  tags = [],
  boardId,
  boardName,
  boardDescription,
  workspaceSlug,
  onVote,
  onOpenCreateDialog,
  className,
}: BoardFeedViewProps): React.JSX.Element => {
  const { voter, setIsModalOpen } = useVoter();
  const [postsList, setPostsList] = useState<Post[]>(initialPosts);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<BoardSortOption>("popular");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleOpenDialog = (): void => {
    if (onOpenCreateDialog) {
      onOpenCreateDialog();
    } else {
      setIsDialogOpen(true);
    }
  };

  const handlePostCreated = (newPost: Post): void => {
    setPostsList((prev) => [newPost, ...prev]);
  };

  const handleVoteInternal = async (postId: string): Promise<void> => {
    if (!voter) {
      setIsModalOpen(true);
      return;
    }

    if (onVote) {
      onVote(postId);
      return;
    }

    setPostsList((prev) =>
      prev.map((item) =>
        item.id === postId
          ? {
              ...item,
              totalVotesCount: item.totalVotesCount + 1,
              totalScoreWeight: item.totalScoreWeight + (voter.voteWeight ?? 1),
            }
          : item
      )
    );

    try {
      await fetch(`/api/v1/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterProfileId: voter.id }),
      });
    } catch {
      // Revert optimistic update on network failure
      setPostsList((prev) =>
        prev.map((item) =>
          item.id === postId
            ? {
                ...item,
                totalVotesCount: Math.max(0, item.totalVotesCount - 1),
                totalScoreWeight: Math.max(0, item.totalScoreWeight - (voter.voteWeight ?? 1)),
              }
            : item
        )
      );
    }
  };

  const filteredPosts = useMemo(() => {
    let result = [...postsList];

    if (selectedCategoryId !== null) {
      result = result.filter((p) => p.categoryId === selectedCategoryId);
    }

    if (selectedTagId !== null) {
      result = result.filter((p) => p.tags?.some((t) => t.id === selectedTagId));
    }

    switch (sortOption) {
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
  }, [postsList, selectedCategoryId, selectedTagId, sortOption]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#0f1011] border border-[#23252a] rounded-xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f7f8f8]">{boardName}</h1>
          {boardDescription && (
            <p className="mt-1 text-sm text-[#8a8f98]">{boardDescription}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleOpenDialog}
          className="px-4 py-2 bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-md text-xs font-semibold cursor-pointer transition-colors self-start md:self-auto"
        >
          Dong Gop Y Kien
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0f1011] border border-[#23252a] rounded-lg">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setSortOption("popular")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
              sortOption === "popular"
                ? "bg-[#18191a] text-[#f7f8f8] border border-[#23252a]"
                : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#141516]"
            )}
          >
            Pho Bien Nhat
          </button>
          <button
            type="button"
            onClick={() => setSortOption("trending")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
              sortOption === "trending"
                ? "bg-[#18191a] text-[#f7f8f8] border border-[#23252a]"
                : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#141516]"
            )}
          >
            Xu Huong
          </button>
          <button
            type="button"
            onClick={() => setSortOption("newest")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
              sortOption === "newest"
                ? "bg-[#18191a] text-[#f7f8f8] border border-[#23252a]"
                : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#141516]"
            )}
          >
            Moi Nhat
          </button>
        </div>

        <div className="flex items-center gap-2">
          {categories.length > 0 && (
            <select
              value={selectedCategoryId ?? ""}
              onChange={(e) =>
                setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)
              }
              className="px-2.5 py-1.5 text-xs border border-[#23252a] rounded-md bg-[#141516] text-[#d0d6e0] focus:outline-hidden focus:border-[#5e6ad2]"
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
              className="px-2.5 py-1.5 text-xs border border-[#23252a] rounded-md bg-[#141516] text-[#d0d6e0] focus:outline-hidden focus:border-[#5e6ad2]"
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

      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-[#0f1011] border border-[#23252a] rounded-xl">
            <p className="text-sm text-[#8a8f98]">Chua co bai dang nao phu hop voi bo loc.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-5 bg-[#0f1011] border border-[#23252a] rounded-xl flex items-start gap-4 hover:border-[#34343a] transition-colors"
            >
              <button
                type="button"
                onClick={() => handleVoteInternal(post.id)}
                className="flex flex-col items-center justify-center min-w-12 px-2.5 py-2 border border-[#23252a] rounded-lg bg-[#141516] hover:bg-[#18191a] hover:border-[#5e6ad2] cursor-pointer text-center transition-colors"
              >
                <span className="text-[10px] font-bold text-[#8a8f98] uppercase">Binh Chon</span>
                <span className="text-sm font-bold text-[#5e6ad2]">{post.totalVotesCount}</span>
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {post.isPinned && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#5e6ad2]/20 text-[#828fff] border border-[#5e6ad2]/30 rounded">
                      Ghim
                    </span>
                  )}
                  {workspaceSlug ? (
                    <Link
                      href={`/${workspaceSlug}/posts/${post.id}`}
                      className="text-base font-semibold text-[#f7f8f8] hover:text-[#828fff] transition-colors truncate"
                    >
                      {post.title}
                    </Link>
                  ) : (
                    <h2 className="text-base font-semibold text-[#f7f8f8] truncate">
                      {post.title}
                    </h2>
                  )}
                </div>

                <p className="mt-1 text-xs text-[#8a8f98] line-clamp-2">
                  {post.content}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#141516] text-[#8a8f98] border border-[#23252a]">
                    Thao Luan ({post.commentsCount})
                  </span>

                  {post.tags?.map((t) => (
                    <span
                      key={t.id}
                      className="px-2 py-0.5 rounded text-[10px] font-medium"
                      style={{
                        backgroundColor: `${t.colorHex}22`,
                        color: t.colorHex,
                        border: `1px solid ${t.colorHex}44`,
                      }}
                    >
                      {t.name}
                    </span>
                  ))}

                  <span className="text-[#62666d] text-[11px] ml-auto">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <PostSubmissionDialog
        boardId={boardId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreated={handlePostCreated}
        categories={categories}
        tags={tags}
        voterProfileId={voter?.id}
      />
    </div>
  );
};
