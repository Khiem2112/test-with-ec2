"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/cn";
import { KanbanCard } from "./kanban-card";
import type { RoadmapColumn, RoadmapCard as CardType } from "@/types/roadmap";

export type KanbanBoardProps = {
  columns: RoadmapColumn[];
  onCardMoved?: (postId: string, newStatusId: number) => Promise<void> | void;
  isEditable?: boolean;
  className?: string;
};

export const KanbanBoard = ({
  columns: initialColumns,
  onCardMoved,
  isEditable = true,
  className,
}: KanbanBoardProps): React.JSX.Element => {
  const [columnsState, setColumnsState] = useState<RoadmapColumn[]>(initialColumns);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  // Filter columns and cards by search query
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
          p.tagNames?.some((t) => t.toLowerCase().includes(q)),
      ),
    }));
  }, [columnsState, searchQuery]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    card: CardType,
  ): void => {
    setDraggedCardId(card.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    targetStatusId: number,
  ): Promise<void> => {
    e.preventDefault();
    const postId = draggedCardId || e.dataTransfer.getData("text/plain");
    if (!postId || !isEditable) {
      return;
    }

    let sourceCard: CardType | null = null;
    let sourceColIndex = -1;

    for (let i = 0; i < columnsState.length; i++) {
      const found = columnsState[i]!.posts.find((p) => p.id === postId);
      if (found) {
        sourceCard = found;
        sourceColIndex = i;
        break;
      }
    }

    if (!sourceCard || columnsState[sourceColIndex]?.statusId === targetStatusId) {
      return;
    }

    // Optimistic UI mutation
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
      }),
    );

    setDraggedCardId(null);

    try {
      await onCardMoved?.(postId, targetStatusId);
    } catch {
      // Revert columns state on failure
      setColumnsState(initialColumns);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Board Controls */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tim kiem tinh nang tren lo trinh..."
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          {columnsState.reduce((acc, c) => acc + c.posts.length, 0)} tinh nang tren lo trinh
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
        {filteredColumns.map((col) => (
          <div
            key={col.statusId}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.statusId)}
            className="bg-gray-50/80 border border-gray-200 rounded-lg flex flex-col max-h-[80vh] min-h-[300px]"
          >
            {/* Column Header */}
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: col.colorHex }}
                />
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                  {col.name}
                </h4>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] font-bold text-gray-600 bg-gray-100 rounded">
                {col.posts.length}
              </span>
            </div>

            {/* Column Cards Container */}
            <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
              {col.posts.length === 0 ? (
                <div className="p-6 text-center text-[11px] text-gray-400 border border-dashed border-gray-200 rounded">
                  Chua co the nao
                </div>
              ) : (
                col.posts.map((card) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
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
