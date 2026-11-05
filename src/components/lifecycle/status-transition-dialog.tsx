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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={cn("w-full max-w-lg bg-white rounded-lg shadow-xl p-6", className)}>
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Chuyen Doi Trang Thai Tinh Nang</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold px-2 py-1 cursor-pointer"
          >
            Dong
          </button>
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 text-xs text-red-700 bg-red-50 border border-red-300 rounded" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="target-status" className="block text-xs font-semibold text-gray-700 uppercase">
              Chon Trang Thai Moi
            </label>
            <select
              id="target-status"
              value={selectedStatusId}
              onChange={(e) => setSelectedStatusId(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="change-note" className="block text-xs font-semibold text-gray-700 uppercase">
              Ghi Chu Ly Do Chuyen Doi (Change Note)
            </label>
            <textarea
              id="change-note"
              required
              rows={3}
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              placeholder="Giai thich ro ly do cap nhat tien do hoac ke hoach sprint..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-blue-900">
              <input
                type="checkbox"
                checked={notifySubscribers}
                onChange={(e) => setNotifySubscribers(e.target.checked)}
                className="rounded border-gray-300 text-blue-600"
              />
              Tu dong gui thong bao tien do den nguoi theo doi
            </label>
            <p className="text-[11px] text-blue-700">
              Uoc tinh co {subscriberCount} nguoi dung (voters va commenters) se nhan duoc thong bao qua in-app va email khi trang thai thay doi.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
            >
              Huy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !changeNote.trim()}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Dang luu..." : "Cap Nhat Trang Thai"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
