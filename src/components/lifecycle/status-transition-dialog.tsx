"use client";

import React, { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import type { PostStatus, UpdatePostStatusResult } from "@/types/lifecycle";

export type StatusTransitionDialogProps = {
  postId: string;
  currentStatusId: number;
  statuses: PostStatus[];
  subscriberCount?: number;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: (result: UpdatePostStatusResult) => void;
  className?: string;
};

export const StatusTransitionDialog = ({
  postId,
  currentStatusId,
  statuses,
  subscriberCount = 0,
  isOpen,
  onClose,
  onStatusUpdated,
  className,
}: StatusTransitionDialogProps): React.JSX.Element | null => {
  const [selectedStatusId, setSelectedStatusId] = useState<number>(currentStatusId);
  const [changeNote, setChangeNote] = useState<string>("");
  const [notifySubscribers, setNotifySubscribers] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!changeNote.trim()) {
      setErrorMessage("Bat buoc nhap ghi chu ly do thay doi trang thai");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/v1/posts/${postId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newStatusId: selectedStatusId,
          changeNote: changeNote.trim(),
          notifySubscribers,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: UpdatePostStatusResult;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success || !result.data) {
        setErrorMessage(result.error?.message ?? "Cap nhat trang thai that bai");
        return;
      }

      onStatusUpdated(result.data);
      onClose();
    } catch {
      setErrorMessage("Loi ket noi khi cap nhat trang thai");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className={cn("w-full max-w-lg bg-[#0f1011] border border-[#23252a] rounded-xl shadow-2xl p-6 text-[#f7f8f8]", className)}>
        <div className="flex items-center justify-between pb-3 border-b border-[#23252a]">
          <h2 className="text-base font-bold text-[#f7f8f8]">Chuyen Doi Trang Thai Tinh Nang</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8a8f98] hover:text-[#f7f8f8] text-xs font-semibold px-2 py-1 cursor-pointer transition-colors"
          >
            Dong
          </button>
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 text-xs text-red-400 bg-red-950/20 border border-red-800/40 rounded-lg" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="new-status" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
              Trang Thai Dich
            </label>
            <select
              id="new-status"
              value={selectedStatusId}
              onChange={(e) => setSelectedStatusId(Number(e.target.value))}
              className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#f7f8f8] focus:outline-hidden focus:border-[#5e6ad2]"
            >
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name} ({status.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="change-note" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
              Ghi Chu Chuyen Trang Thai (Gui toi nguoi theo doi)
            </label>
            <textarea
              id="change-note"
              required
              rows={3}
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              placeholder="Giai thich ly do chuyen trang thai, lo trinh du kien..."
              className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2] font-sans"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-[#141516] border border-[#23252a] rounded-lg">
            <input
              id="notify-subscribers"
              type="checkbox"
              checked={notifySubscribers}
              onChange={(e) => setNotifySubscribers(e.target.checked)}
              className="rounded border-[#23252a] bg-[#18191a] text-[#5e6ad2]"
            />
            <label htmlFor="notify-subscribers" className="text-xs text-[#d0d6e0] cursor-pointer">
              Thong bao cho {subscriberCount} nguoi dung dang theo doi chu de nay
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#23252a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#23252a] bg-[#141516] rounded-md text-xs font-medium text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a] cursor-pointer transition-colors"
            >
              Huy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !changeNote.trim()}
              className="px-5 py-2 bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-md text-xs font-semibold disabled:opacity-50 cursor-pointer transition-colors"
            >
              {isSubmitting ? "Dang cap nhat..." : "Xac Nhan Chuyen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
