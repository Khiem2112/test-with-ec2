"use client";

import React from "react";
import { cn } from "@/lib/cn";
import type { RoadmapCard } from "@/types/roadmap";

export type KanbanCardProps = {
  card: RoadmapCard;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, card: RoadmapCard) => void;
  onClick?: (card: RoadmapCard) => void;
  className?: string;
};

export const KanbanCard = ({
  card,
  isDraggable = true,
  onDragStart,
  onClick,
  className,
}: KanbanCardProps): React.JSX.Element => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    e.dataTransfer.setData("text/plain", card.id);
    onDragStart?.(e, card);
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onClick={() => onClick?.(card)}
      className={cn(
        "p-3.5 bg-white border border-gray-200 rounded-lg shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all space-y-2.5",
        isDraggable && "cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">
          {card.title}
        </h3>
        <span className="shrink-0 px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded border border-blue-200">
          {card.totalVotesCount} votes
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
        {card.categoryName && (
          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 font-medium rounded">
            {card.categoryName}
          </span>
        )}

        {card.tagNames?.map((tag, idx) => (
          <span
            key={idx}
            className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded"
          >
            #{tag}
          </span>
        ))}

        <span className="text-gray-400 font-mono ml-auto">
          {card.commentsCount} tl
        </span>
      </div>
    </div>
  );
};
