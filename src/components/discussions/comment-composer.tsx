"use client";

import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { cn } from "@/lib/cn";
import { useVoter } from "@/context/voter-context";
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
  const { voter } = useVoter();
  const [content, setContent] = useState<string>("");
  const [name, setName] = useState<string>(voter?.displayName ?? authorName);
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
          authorName: name || (voter?.displayName ?? "Khach"),
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
        "p-4 rounded-xl border bg-[#0f1011] space-y-3 transition-colors",
        isInternalNote ? "border-amber-500/40 bg-amber-950/15" : "border-[#23252a]",
        className
      )}
    >
      {isTeamMember && (
        <div className="flex border-b border-[#23252a] pb-2 text-xs font-semibold gap-3">
          <button
            type="button"
            onClick={() => setIsInternalNote(false)}
            className={cn(
              "pb-1 cursor-pointer transition-colors",
              !isInternalNote
                ? "border-b-2 border-[#5e6ad2] text-[#828fff] font-bold"
                : "text-[#8a8f98] hover:text-[#f7f8f8]"
            )}
          >
            Binh Luan Cong Khai
          </button>
          <button
            type="button"
            onClick={() => setIsInternalNote(true)}
            className={cn(
              "pb-1 cursor-pointer transition-colors",
              isInternalNote
                ? "border-b-2 border-amber-400 text-amber-300 font-bold"
                : "text-[#8a8f98] hover:text-[#f7f8f8]"
            )}
          >
            Ghi Chu Noi Bo (Chi Doi Ngu)
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-2 text-xs text-red-400 bg-red-950/20 border border-red-800/40 rounded-md" role="alert">
          {errorMessage}
        </div>
      )}

      <div>
        <textarea
          required
          rows={3}
          value={content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          placeholder={
            isInternalNote
              ? "Nhap ghi chu noi bo chi danh cho thanh vien phat trien..."
              : "Dong gop y kien, thac mac hoac phan hoi ve bai dang nay..."
          }
          className="w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2] font-sans"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {!authorUserId && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#8a8f98]">Ten hien thi:</span>
            <input
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Ten cua ban"
              className="px-2 py-1 bg-[#141516] border border-[#23252a] rounded-md text-xs text-[#f7f8f8] placeholder-[#62666d]"
            />
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 border border-[#23252a] bg-[#141516] text-[#8a8f98] hover:text-[#f7f8f8] rounded-md text-xs cursor-pointer transition-colors"
            >
              Huy
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className={cn(
              "px-4 py-1.5 text-white rounded-md text-xs font-semibold disabled:opacity-50 cursor-pointer transition-colors",
              isInternalNote
                ? "bg-amber-600 hover:bg-amber-500"
                : "bg-[#5e6ad2] hover:bg-[#828fff]"
            )}
          >
            {isSubmitting
              ? "Dang gui..."
              : isInternalNote
              ? "Luu Ghi Chu"
              : parentId
              ? "Tra Loi"
              : "Gui Binh Luan"}
          </button>
        </div>
      </div>
    </form>
  );
};
