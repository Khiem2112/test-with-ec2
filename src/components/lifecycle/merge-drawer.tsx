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
        `/api/v1/posts/${sourcePost.id}/merge?targetPostId=${encodeURIComponent(targetPostId.trim())}`
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
      <div className={cn("w-full max-w-lg bg-[#0f1011] border-l border-[#23252a] h-full shadow-2xl flex flex-col p-6 overflow-y-auto text-[#f7f8f8]", className)}>
        <div className="flex items-center justify-between pb-4 border-b border-[#23252a]">
          <div>
            <h2 className="text-base font-bold text-[#f7f8f8]">Gop Bai Viet Trung Lap</h2>
            <p className="text-xs text-[#8a8f98] mt-0.5">Dong co hop nhat phieu bau va nguoi theo doi</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8a8f98] hover:text-[#f7f8f8] text-xs font-semibold px-2 py-1 border border-[#23252a] rounded-md cursor-pointer transition-colors"
          >
            Dong
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 text-xs text-red-400 bg-red-950/20 border border-red-800/40 rounded-lg" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="mt-4 p-3.5 bg-[#141516] border border-[#23252a] rounded-xl text-xs space-y-1.5">
          <span className="font-semibold text-[#8a8f98] uppercase tracking-wider block text-[10px]">
            Bai Viet Nguon (Bi Gop)
          </span>
          <p className="font-bold text-[#f7f8f8]">{sourcePost.title}</p>
          <div className="flex items-center gap-3 text-[#62666d] font-mono text-[11px]">
            <span>ID: {sourcePost.id.substring(0, 8)}...</span>
            <span>Votes: {sourcePost.totalVotesCount}</span>
            <span>Diem: {sourcePost.totalScoreWeight}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label htmlFor="target-id" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider">
            ID Bai Viet Dich (Giu Lai)
          </label>
          <div className="flex gap-2">
            <input
              id="target-id"
              type="text"
              value={targetPostId}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetPostId(e.target.value)}
              placeholder="Nhap UUID bai viet dich..."
              className="flex-1 px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs font-mono text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2]"
            />
            <button
              type="button"
              disabled={isLoadingPreview || !targetPostId.trim()}
              onClick={handleFetchPreview}
              className="px-3.5 py-2 bg-[#18191a] hover:bg-[#23252a] text-[#f7f8f8] border border-[#23252a] rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors"
            >
              {isLoadingPreview ? "Kiem tra..." : "Kiem Tra"}
            </button>
          </div>
        </div>

        {preview && (
          <div className="mt-4 p-4 bg-[#141516] border border-[#23252a] rounded-xl text-xs space-y-3">
            <h3 className="font-bold text-[#828fff] uppercase text-[11px] tracking-wider">
              Ket Qua Tinh Toan Truoc (Merge Preview)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 bg-[#18191a] rounded-lg border border-[#23252a]">
                <span className="text-[10px] text-[#8a8f98] block">Vote Chuyen Duoc</span>
                <span className="text-base font-extrabold text-[#5e6ad2]">+{preview.transferableVotesCount}</span>
              </div>
              <div className="p-2.5 bg-[#18191a] rounded-lg border border-[#23252a]">
                <span className="text-[10px] text-[#8a8f98] block">Vote Trung Lap (Huy)</span>
                <span className="text-base font-extrabold text-[#62666d]">{preview.duplicateVotesCount}</span>
              </div>
              <div className="p-2.5 bg-[#18191a] rounded-lg border border-[#23252a]">
                <span className="text-[10px] text-[#8a8f98] block">Trong So Tang Them</span>
                <span className="text-base font-extrabold text-[#27a644]">+{preview.additionalScoreWeight}</span>
              </div>
              <div className="p-2.5 bg-[#18191a] rounded-lg border border-[#23252a]">
                <span className="text-[10px] text-[#8a8f98] block">Subscriber Di Doi</span>
                <span className="text-base font-extrabold text-[#828fff]">+{preview.transferableSubscribersCount}</span>
              </div>
            </div>

            <form onSubmit={handleExecuteMerge} className="mt-4 pt-3 border-t border-[#23252a] space-y-3">
              <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 text-amber-300 rounded-lg text-[11px] leading-relaxed">
                Canh bao: Thao tac nay se khoa vinh vien bai viet nguon va chuyen toan bo du lieu hop le sang bai viet dich. Khong the hoan tac.
              </div>

              <div>
                <label htmlFor="confirm-merge" className="block text-xs font-semibold text-[#8a8f98] mb-1">
                  Nhap chu &quot;MERGE&quot; de xac nhan:
                </label>
                <input
                  id="confirm-merge"
                  type="text"
                  required
                  value={confirmationInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmationInput(e.target.value)}
                  placeholder="MERGE"
                  className="block w-full px-3 py-1.5 bg-[#18191a] border border-[#23252a] rounded-lg text-xs font-mono text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isMerging || confirmationInput.trim() !== "MERGE"}
                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors"
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
