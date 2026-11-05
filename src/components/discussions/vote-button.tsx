"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/cn";
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
  weight = 1.0,
  isLocked = false,
  onVoteChanged,
  className,
}: VoteButtonProps): React.JSX.Element => {
  const [hasVoted, setHasVoted] = useState<boolean>(initialHasVoted);
  const [votesCount, setVotesCount] = useState<number>(initialCount);
  const [isPending, setIsPending] = useState<boolean>(false);
  const lastClickRef = useRef<number>(0);

  const handleToggle = async (): Promise<void> => {
    if (isLocked || isPending || !voterProfileId) {
      return;
    }

    const now = Date.now();
    if (now - lastClickRef.current < 400) {
      return;
    }
    lastClickRef.current = now;

    // Optimistic UI state mutation
    const nextHasVoted = !hasVoted;
    const nextCount = nextHasVoted ? votesCount + 1 : Math.max(0, votesCount - 1);
    setHasVoted(nextHasVoted);
    setVotesCount(nextCount);
    setIsPending(true);

    try {
      const response = await fetch(`/api/v1/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterProfileId }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: VoteResult;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success || !result.data) {
        // Rollback optimistic state on failure
        setHasVoted(!nextHasVoted);
        setVotesCount(votesCount);
        return;
      }

      setHasVoted(result.data.userHasVoted);
      setVotesCount(result.data.totalVotesCount);
      onVoteChanged?.(result.data);
    } catch {
      // Rollback optimistic state on network exception
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
        "inline-flex flex-col items-center justify-center min-w-14 px-3 py-2 rounded border text-xs font-bold transition-all cursor-pointer shadow-xs",
        hasVoted
          ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-400",
        isLocked && "opacity-50 cursor-not-allowed bg-gray-100",
        className,
      )}
    >
      <span className="text-[10px] tracking-wider uppercase">
        {hasVoted ? "VOTED" : "VOTE"}
      </span>
      <span className="text-base font-extrabold leading-tight">
        {votesCount}
      </span>
      {weight > 1.0 && (
        <span className="text-[9px] opacity-80 font-mono">
          x{weight}
        </span>
      )}
    </button>
  );
};
