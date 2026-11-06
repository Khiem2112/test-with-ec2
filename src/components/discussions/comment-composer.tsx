"use client";

import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { cn } from "@/lib/cn";
import type { Comment } from "@/types/discussion";

export type CommentComposerProps = {
  postId: string;
  parentId?: string | null;
  authorName?: string;
  authorUserId?: string | null;
  isTeamMember?: boolean;
  onCommentCreated?: (comment: Comment) => void;
  onCancel?: () => void;
  className?: string;
};

export const CommentComposer = ({
  postId,
  parentId = null,
  authorName = "Khach",
  authorUserId = null,
  isTeamMember = false,
  onCommentCreated,
  onCancel,
  className,
}: CommentComposerProps): React.JSX.Element => {
  const [content, setContent] = useState<string>("");
  const [name, setName] = useState<string>(authorName);
  const [isInternalNote, setIsInternalNote] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!content.trim() || content.trim().length < 3) {
      setErrorMessage("Noi dung phai chua toi thieu 3 ky tu");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/v1/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authorUserId ? { "x-user-id": authorUserId } : {}),
        },
        body: JSON.stringify({
          postId,
          authorName: name,
          content: content.trim(),
          parentId: parentId ?? undefined,
          isInternalNote,
          authorUserId: authorUserId ?? undefined,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: Comment;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success || !result.data) {
        setErrorMessage(result.error?.message ?? "Khong the gui binh luan");
        return;
      }

      setContent("");
      onCommentCreated?.(result.data);
    } catch {
      setErrorMessage("Loi ket noi khi gui binh luan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "p-4 rounded-lg border bg-white shadow-xs space-y-3",
        isInternalNote ? "border-amber-400 bg-amber-50/50" : "border-gray-200",
        className,
      )}
    >
      {/* Staff Tab Switcher */}
      {isTeamMember && (
        <div className="flex border-b border-gray-200 pb-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setIsInternalNote(false)}
            className={cn(
              "px-3 py-1 cursor-pointer rounded-t border-b-2",
              !isInternalNote
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            Binh Luan Cong Khai
          </button>
          <button
            type="button"
            onClick={() => setIsInternalNote(true)}
            className={cn(
              "px-3 py-1 cursor-pointer rounded-t border-b-2",
              isInternalNote
                ? "border-amber-600 text-amber-800 font-bold bg-amber-100/60"
                : "border-transparent text-amber-700 hover:text-amber-900",
            )}
          >
            Ghi Chu Noi Bo (Team Only)
          </button>
        </div>
      )}

      {isInternalNote && (
        <div className="p-2 text-xs bg-amber-100 border border-amber-300 text-amber-900 rounded font-medium">
          Chu y: Ghi chu noi bo chi hien thi voi thanh vien doi ngu phat trien (Admin, PM, Dev). Khach hang se khong thay noi dung nay.
        </div>
      )}

      {errorMessage && (
        <div className="p-2 text-xs bg-red-50 border border-red-300 text-red-700 rounded" role="alert">
          {errorMessage}
        </div>
      )}

      <div>
        <input
          type="text"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="Ten cua ban"
          required
          className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white"
        />
      </div>

      <div>
        <textarea
          rows={parentId ? 2 : 3}
          value={content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          placeholder={
            isInternalNote
              ? "Nhap ghi chu ky thuat, danh gia kien truc, hoac uoc tinh cong viec..."
              : "Viet binh luan hoac dat cau hoi cho doi ngu san pham..."
          }
          required
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-gray-400">
          Ho tro dinh dang van ban Markdown
        </span>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
            >
              Huy
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded text-white cursor-pointer disabled:opacity-50",
              isInternalNote
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-blue-600 hover:bg-blue-700",
            )}
          >
            {isSubmitting
              ? "Dang gui..."
              : isInternalNote
                ? "Luu Ghi Chu Noi Bo"
                : "Gui Binh Luan"}
          </button>
        </div>
      </div>
    </form>
  );
};
