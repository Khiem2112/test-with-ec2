"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/cn";
import { useVoter } from "@/context/voter-context";
import type { VoteResult } from "@/types/discussion";

export type VoteButtonProps = {
  postId: string;
  initialCount: number;
  initialHasVoted?: boolean;
  voterProfileId?: string;
  weight?: number;
  isLocked?: boolean;
  onVoteChanged?: (result: VoteResult) => void;
  className?: string;
};

export const VoteButton = ({
  postId,
  initialCount,
  initialHasVoted = false,
  voterProfileId,
  isLocked = false,
  onVoteChanged,
  className,
}: VoteButtonProps): React.JSX.Element => {
  const { voter, setIsModalOpen } = useVoter();
  const [hasVoted, setHasVoted] = useState<boolean>(initialHasVoted);
  const [votesCount, setVotesCount] = useState<number>(initialCount);
  const [isPending, setIsPending] = useState<boolean>(false);
  const lastClickRef = useRef<number>(0);

  const activeVoterId = voterProfileId ?? voter?.id;

  const handleToggle = async (): Promise<void> => {
    if (isLocked || isPending) {
      return;
    }

    if (!activeVoterId) {
      setIsModalOpen(true);
      return;
    }

    const now = Date.now();
    if (now - lastClickRef.current < 400) {
      return;
    }
    lastClickRef.current = now;

    const nextHasVoted = !hasVoted;
    const nextCount = nextHasVoted ? votesCount + 1 : Math.max(0, votesCount - 1);
    setHasVoted(nextHasVoted);
    setVotesCount(nextCount);
    setIsPending(true);

    try {
      const response = await fetch(`/api/v1/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterProfileId: activeVoterId }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: VoteResult;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success || !result.data) {
        setHasVoted(!nextHasVoted);
        setVotesCount(votesCount);
        return;
      }

      setHasVoted(result.data.userHasVoted);
      setVotesCount(result.data.totalVotesCount);
      onVoteChanged?.(result.data);
    } catch {
      setHasVoted(!nextHasVoted);
      setVotesCount(votesCount);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isLocked || isPending}
      onClick={handleToggle}
      className={cn(
        "inline-flex flex-col items-center justify-center min-w-14 px-3 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer",
        hasVoted
          ? "bg-[#5e6ad2] text-white border-[#5e6ad2] hover:bg-[#828fff]"
          : "bg-[#141516] text-[#8a8f98] border-[#23252a] hover:bg-[#18191a] hover:border-[#5e6ad2] hover:text-[#f7f8f8]",
        isLocked && "opacity-50 cursor-not-allowed bg-[#18191a]",
        className
      )}
    >
      <span className="text-[10px] tracking-wider uppercase">
        {hasVoted ? "DA CHON" : "BINH CHON"}
      </span>
      <span className="text-base font-extrabold leading-tight">
        {votesCount}
      </span>
    </button>
  );
};
