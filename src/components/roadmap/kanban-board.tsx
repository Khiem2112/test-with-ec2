"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/cn";
import { KanbanCard } from "./kanban-card";
import type { RoadmapColumn, RoadmapCard as CardType } from "@/types/roadmap";

export type KanbanBoardProps = {
  columns: RoadmapColumn[];
  workspaceSlug?: string;
  onCardMoved?: (postId: string, newStatusId: number) => Promise<void> | void;
  isEditable?: boolean;
  className?: string;
};

export const KanbanBoard = ({
  columns: initialColumns,
  workspaceSlug,
  onCardMoved,
  isEditable = true,
  className,
}: KanbanBoardProps): React.JSX.Element => {
  const [columnsState, setColumnsState] = useState<RoadmapColumn[]>(initialColumns);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  const filteredColumns = useMemo(() => {
    if (!searchQuery.trim()) {
      return columnsState;
    }
    const q = searchQuery.toLowerCase().trim();
    return columnsState.map((col) => ({
      ...col,
      posts: col.posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q) ||
          p.tagNames?.some((t) => t.toLowerCase().includes(q))
      ),
    }));
  }, [columnsState, searchQuery]);

  const handleDragStart = (
    _e: React.DragEvent<HTMLDivElement>,
    card: CardType
  ): void => {
    setDraggedCardId(card.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    targetStatusId: number
  ): Promise<void> => {
    e.preventDefault();
    const postId = draggedCardId ?? e.dataTransfer.getData("text/plain");
    if (!postId || !isEditable) {
      return;
    }

    let sourceCard: CardType | null = null;
    let sourceColIndex = -1;

    for (let i = 0; i < columnsState.length; i++) {
      const col = columnsState[i];
      if (col) {
        const found = col.posts.find((p) => p.id === postId);
        if (found) {
          sourceCard = found;
          sourceColIndex = i;
          break;
        }
      }
    }

    if (!sourceCard || columnsState[sourceColIndex]?.statusId === targetStatusId) {
      return;
    }

    setColumnsState((prev) =>
      prev.map((col) => {
        if (col.posts.some((p) => p.id === postId)) {
          return {
            ...col,
            posts: col.posts.filter((p) => p.id !== postId),
          };
        }
        if (col.statusId === targetStatusId && sourceCard) {
          return {
            ...col,
            posts: [sourceCard, ...col.posts],
          };
        }
        return col;
      })
    );

    setDraggedCardId(null);

    try {
      await onCardMoved?.(postId, targetStatusId);
    } catch {
      setColumnsState(initialColumns);
    }
  };

  const totalFeatures = columnsState.reduce((acc, c) => acc + c.posts.length, 0);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#0f1011] border border-[#23252a] rounded-xl">
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tim kiem tinh nang tren lo trinh..."
            className="w-full px-3 py-1.5 text-xs bg-[#141516] border border-[#23252a] rounded-lg text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2]"
          />
        </div>
        <div className="text-xs text-[#8a8f98] font-medium">
          {totalFeatures} tinh nang tren lo trinh
        </div>
      </div>

      <div className="flex gap-4 items-start overflow-x-auto pb-4">
        {filteredColumns.map((col) => (
          <div
            key={col.statusId}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.statusId)}
            className="min-w-[280px] w-80 shrink-0 bg-[#0f1011] border border-[#23252a] rounded-xl flex flex-col max-h-[80vh] min-h-[350px]"
          >
            <div className="p-3.5 border-b border-[#23252a] flex items-center justify-between bg-[#141516] rounded-t-xl">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: col.colorHex }}
                />
                <h4 className="text-xs font-bold text-[#f7f8f8] uppercase tracking-wide">
                  {col.name}
                </h4>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold text-[#8a8f98] bg-[#18191a] border border-[#23252a] rounded-full">
                {col.posts.length}
              </span>
            </div>

            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {col.posts.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#62666d] border border-dashed border-[#23252a] rounded-lg">
                  Chua co the nao
                </div>
              ) : (
                col.posts.map((card) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    workspaceSlug={workspaceSlug}
                    isDraggable={isEditable}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
