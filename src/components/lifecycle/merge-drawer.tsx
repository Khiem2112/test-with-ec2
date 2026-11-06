"use client";

import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { cn } from "@/lib/cn";
import type { Post } from "@/types/post";
import type { MergePreviewResult, ExecuteMergeResult } from "@/types/lifecycle";

export type MergeDrawerProps = {
  sourcePost: Post;
  isOpen: boolean;
  onClose: () => void;
  onMergeSuccess: (result: ExecuteMergeResult) => void;
  className?: string;
};

export const MergeDrawer = ({
  sourcePost,
  isOpen,
  onClose,
  onMergeSuccess,
  className,
}: MergeDrawerProps): React.JSX.Element | null => {
  const [targetPostId, setTargetPostId] = useState<string>("");
  const [preview, setPreview] = useState<MergePreviewResult | null>(null);
  const [confirmationInput, setConfirmationInput] = useState<string>("");
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleFetchPreview = async (): Promise<void> => {
    if (!targetPostId.trim()) {
      return;
    }
    setIsLoadingPreview(true);
    setErrorMessage(null);
    setPreview(null);

    try {
      const response = await fetch(
        `/api/v1/posts/${sourcePost.id}/merge?targetPostId=${encodeURIComponent(targetPostId.trim())}`,
      );
      const result = (await response.json()) as {
        success: boolean;
        data?: MergePreviewResult;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success || !result.data) {
        setErrorMessage(result.error?.message ?? "Khong the tinh toan merge preview");
        return;
      }

      setPreview(result.data);
    } catch {
      setErrorMessage("Loi ket noi khi tinh toan merge preview");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleExecuteMerge = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (confirmationInput.trim() !== "MERGE") {
      setErrorMessage("Vui long nhap dung chu 'MERGE' de xac nhan thao tac");
      return;
    }

    setIsMerging(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/v1/posts/${sourcePost.id}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetPostId: targetPostId.trim() }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: ExecuteMergeResult;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success || !result.data) {
        setErrorMessage(result.error?.message ?? "Gop bai viet that bai");
        return;
      }

      onMergeSuccess(result.data);
      onClose();
    } catch {
      setErrorMessage("Loi he thong khi thuc thi gop bai");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className={cn("w-full max-w-lg bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto", className)}>
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Gop Bai Viet Trung Lap</h2>
            <p className="text-xs text-gray-500">Dong co hop nhat phieu bau va nguoi theo doi</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xs font-semibold px-2 py-1 border rounded cursor-pointer"
          >
            Dong
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 text-xs text-red-700 bg-red-50 border border-red-300 rounded" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Source Post Card */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-1">
          <span className="font-semibold text-gray-700 uppercase block">Bai Viet Nguon (Bi Gop)</span>
          <p className="font-bold text-gray-900">{sourcePost.title}</p>
          <div className="flex items-center gap-3 text-gray-500 font-mono text-[11px]">
            <span>ID: {sourcePost.id.substring(0, 8)}...</span>
            <span>Votes: {sourcePost.totalVotesCount}</span>
            <span>Diem: {sourcePost.totalScoreWeight}</span>
          </div>
        </div>

        {/* Target Post Input */}
        <div className="mt-4 space-y-2">
          <label htmlFor="target-id" className="block text-xs font-semibold text-gray-700 uppercase">
            ID Bai Viet Dich (Giu Lai)
          </label>
          <div className="flex gap-2">
            <input
              id="target-id"
              type="text"
              value={targetPostId}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetPostId(e.target.value)}
              placeholder="Nhap UUID bai viet dich..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs font-mono"
            />
            <button
              type="button"
              disabled={isLoadingPreview || !targetPostId.trim()}
              onClick={handleFetchPreview}
              className="px-3 py-2 bg-gray-800 text-white rounded text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {isLoadingPreview ? "Kiem tra..." : "Kiem Tra"}
            </button>
          </div>
        </div>

        {/* Preview Diff Card */}
        {preview && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-xs space-y-3">
            <h3 className="font-bold text-blue-900 uppercase">Ket Qua Tinh Toan Truoc (Merge Preview)</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-white rounded border border-blue-100">
                <span className="text-[10px] text-gray-500 block">Vote Chuyen Duoc</span>
                <span className="text-base font-extrabold text-blue-600">+{preview.transferableVotesCount}</span>
              </div>
              <div className="p-2 bg-white rounded border border-blue-100">
                <span className="text-[10px] text-gray-500 block">Vote Trung Lap (Huy)</span>
                <span className="text-base font-extrabold text-gray-600">{preview.duplicateVotesCount}</span>
              </div>
              <div className="p-2 bg-white rounded border border-blue-100">
                <span className="text-[10px] text-gray-500 block">Trong So Tang Them</span>
                <span className="text-base font-extrabold text-green-600">+{preview.additionalScoreWeight}</span>
              </div>
              <div className="p-2 bg-white rounded border border-blue-100">
                <span className="text-[10px] text-gray-500 block">Subscriber Di Doi</span>
                <span className="text-base font-extrabold text-purple-600">+{preview.transferableSubscribersCount}</span>
              </div>
            </div>

            <form onSubmit={handleExecuteMerge} className="mt-4 pt-3 border-t border-blue-200 space-y-3">
              <div className="p-2 bg-amber-100 border border-amber-300 text-amber-900 rounded text-[11px]">
                Canh bao: Thao tac nay se khoa vinh vien bai viet nguon va chuyen toan bo du lieu hop le sang bai viet dich. Khong the hoan tac.
              </div>

              <div>
                <label htmlFor="confirm-merge" className="block text-xs font-semibold text-gray-700">
                  Nhap chu &quot;MERGE&quot; de xac nhan:
                </label>
                <input
                  id="confirm-merge"
                  type="text"
                  required
                  value={confirmationInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmationInput(e.target.value)}
                  placeholder="MERGE"
                  className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isMerging || confirmationInput.trim() !== "MERGE"}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isMerging ? "Dang thuc thi giao dich..." : "Xac Nhan Gop Bai"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
