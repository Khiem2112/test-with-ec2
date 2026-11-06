"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { RoadmapCard } from "@/types/roadmap";

export type KanbanCardProps = {
  card: RoadmapCard;
  workspaceSlug?: string;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, card: RoadmapCard) => void;
  onClick?: (card: RoadmapCard) => void;
  className?: string;
};

export const KanbanCard = ({
  card,
  workspaceSlug,
  isDraggable = true,
  onDragStart,
  onClick,
  className,
}: KanbanCardProps): React.JSX.Element => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    e.dataTransfer.setData("text/plain", card.id);
    onDragStart?.(e, card);
  };

  const cardContent = (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onClick={() => onClick?.(card)}
      className={cn(
        "p-3.5 bg-[#0f1011] border border-[#23252a] rounded-xl hover:border-[#34343a] transition-all space-y-2.5",
        isDraggable && "cursor-grab active:cursor-grabbing",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xs font-semibold text-[#f7f8f8] hover:text-[#828fff] line-clamp-2 leading-snug transition-colors">
          {card.title}
        </h3>
        <span className="shrink-0 px-2 py-0.5 bg-[#141516] text-[#828fff] font-bold text-[10px] rounded border border-[#23252a]">
          {card.totalVotesCount} votes
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
        {card.categoryName && (
          <span className="px-1.5 py-0.5 bg-[#18191a] text-[#8a8f98] font-medium rounded border border-[#23252a]">
            {card.categoryName}
          </span>
        )}

        {card.tagNames?.map((tag, idx) => (
          <span
            key={idx}
            className="px-1.5 py-0.5 bg-[#141516] text-[#62666d] rounded"
          >
            #{tag}
          </span>
        ))}

        <span className="text-[#62666d] font-mono ml-auto">
          {card.commentsCount} tl
        </span>
      </div>
    </div>
  );

  if (workspaceSlug) {
    return (
      <Link href={`/${workspaceSlug}/posts/${card.id}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};
