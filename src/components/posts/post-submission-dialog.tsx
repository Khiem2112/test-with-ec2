"use client";

import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { SimilarPostsPanel } from "./similar-posts-panel";
import type { Post, Category, Tag, SimilarPostResult, CreatePostAttachmentInput } from "@/types/post";

export type PostSubmissionDialogProps = {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (post: Post) => void;
  categories?: Category[];
  tags?: Tag[];
  voterProfileId?: string;
  className?: string;
};

export const PostSubmissionDialog = ({
  boardId,
  isOpen,
  onClose,
  onCreated,
  categories = [],
  tags = [],
  voterProfileId,
  className,
}: PostSubmissionDialogProps): React.JSX.Element | null => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [attachments, setAttachments] = useState<CreatePostAttachmentInput[]>([]);
  const [attachmentName, setAttachmentName] = useState<string>("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");
  const [attachmentSize] = useState<number>(1024 * 500);
  const [attachmentMime, setAttachmentMime] = useState<"image/png" | "image/jpeg" | "image/webp" | "application/pdf">("image/png");

  const [similarPosts, setSimilarPosts] = useState<SimilarPostResult[]>([]);
  const [isExactMatch, setIsExactMatch] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!title || title.trim().length < 3) {
      setSimilarPosts([]);
      setIsExactMatch(false);
      setShowSuggestions(false);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/v1/posts/search-similar?boardId=${boardId}&q=${encodeURIComponent(title.trim())}`
        );
        const result = (await response.json()) as {
          success: boolean;
          data?: SimilarPostResult[];
        };

        if (response.ok && result.success && result.data && result.data.length > 0) {
          setSimilarPosts(result.data);
          const exact = result.data.some(
            (p) => p.title.toLowerCase().trim() === title.toLowerCase().trim()
          );
          setIsExactMatch(exact);
          setShowSuggestions(true);
        } else {
          setSimilarPosts([]);
          setIsExactMatch(false);
          setShowSuggestions(false);
        }
      } catch {
        // Silent degradation on similarity search error
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [boardId, title]);

  if (!isOpen) {
    return null;
  }

  const handleVoteExisting = async (postId: string): Promise<void> => {
    try {
      await fetch(`/api/v1/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterProfileId }),
      });
      setConfirmationNotice("Da ghi nhan luot bo phieu thanh cong!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch {
      setErrorMessage("Khong the bo phieu cho bai dang da co");
    }
  };

  const handleToggleTag = (tagId: number): void => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleAddAttachment = (): void => {
    if (!attachmentName.trim() || !attachmentUrl.trim()) {
      return;
    }
    setAttachments((prev) => [
      ...prev,
      {
        fileName: attachmentName.trim(),
        fileUrl: attachmentUrl.trim(),
        fileSize: attachmentSize,
        mimeType: attachmentMime,
      },
    ]);
    setAttachmentName("");
    setAttachmentUrl("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/v1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId,
          categoryId: categoryId ?? undefined,
          voterProfileId: voterProfileId ?? undefined,
          title,
          content,
          tagIds: selectedTagIds,
          attachments,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: Post;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success || !result.data) {
        setErrorMessage(result.error?.message ?? "Khong the tao bai viet");
        return;
      }

      onCreated(result.data);
      onClose();
    } catch {
      setErrorMessage("Loi ket noi khi gui bai viet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className={cn("w-full max-w-2xl bg-[#0f1011] border border-[#23252a] rounded-xl shadow-2xl p-6 my-8 text-[#f7f8f8]", className)}>
        <div className="flex items-center justify-between pb-3 border-b border-[#23252a]">
          <h2 className="text-base font-bold text-[#f7f8f8]">Dong Gop Y Kien Moi</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8a8f98] hover:text-[#f7f8f8] text-xs font-semibold px-2 py-1 cursor-pointer transition-colors"
          >
            Dong
          </button>
        </div>

        {confirmationNotice && (
          <div className="mt-3 p-3 text-xs text-[#27a644] bg-[#27a644]/10 border border-[#27a644]/30 rounded-lg">
            {confirmationNotice}
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 p-3 text-xs text-red-400 bg-red-950/20 border border-red-800/40 rounded-lg" role="alert">
            {errorMessage}
          </div>
        )}

        {showSuggestions && similarPosts.length > 0 && (
          <div className="mt-4">
            <SimilarPostsPanel
              similarPosts={similarPosts}
              onVoteExisting={handleVoteExisting}
              onContinueNew={() => setShowSuggestions(false)}
              isExactMatch={isExactMatch}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="post-title" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
              Tieu De Gop Y
            </label>
            <input
              id="post-title"
              type="text"
              required
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Tom tat ngan gon y tuong hoac van de can cai thien..."
              className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.length > 0 && (
              <div>
                <label htmlFor="post-category" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
                  Danh Muc
                </label>
                <select
                  id="post-category"
                  value={categoryId ?? ""}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setCategoryId(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#d0d6e0] focus:outline-hidden focus:border-[#5e6ad2]"
                >
                  <option value="">Chon danh muc (tuy chon)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {tags.length > 0 && (
              <div>
                <span className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
                  Gan The (Tags)
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {tags.map((t) => {
                    const isSelected = selectedTagIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleTag(t.id)}
                        className={cn(
                          "px-2 py-1 text-xs rounded-md border transition-colors cursor-pointer",
                          isSelected
                            ? "bg-[#5e6ad2] text-white border-[#5e6ad2] font-semibold"
                            : "bg-[#141516] text-[#8a8f98] border-[#23252a] hover:bg-[#18191a]"
                        )}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="post-content" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
              Mo Ta Chi Tiet (Ho tro Markdown)
            </label>
            <textarea
              id="post-content"
              required
              rows={4}
              value={content}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              placeholder="Trinh bay chi tiet van de, boi canh su dung va giai phap de xuat..."
              className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2] font-sans"
            />
          </div>

          <div className="p-3 bg-[#141516] border border-[#23252a] rounded-lg text-xs space-y-2">
            <span className="font-semibold text-[#8a8f98] uppercase block text-[10px] tracking-wider">
              Tep Dinh Kem
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Ten tep (vd: screenshot.png)"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                className="px-2.5 py-1.5 bg-[#18191a] border border-[#23252a] rounded-md text-xs text-[#f7f8f8] placeholder-[#62666d]"
              />
              <input
                type="url"
                placeholder="URL anh/tep"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                className="px-2.5 py-1.5 bg-[#18191a] border border-[#23252a] rounded-md text-xs text-[#f7f8f8] placeholder-[#62666d]"
              />
              <div className="flex gap-1.5">
                <select
                  value={attachmentMime}
                  onChange={(e) => setAttachmentMime(e.target.value as typeof attachmentMime)}
                  className="px-2 py-1.5 bg-[#18191a] border border-[#23252a] rounded-md text-xs text-[#d0d6e0]"
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/webp">WEBP</option>
                  <option value="application/pdf">PDF</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="px-3 py-1.5 bg-[#23252a] hover:bg-[#34343a] text-[#f7f8f8] rounded-md text-xs cursor-pointer transition-colors"
                >
                  Them
                </button>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] text-[#8a8f98] bg-[#18191a] p-1.5 border border-[#23252a] rounded-md">
                    <span>{att.fileName} ({Math.round(att.fileSize / 1024)} KB) - {att.mimeType}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-red-400 hover:text-red-300"
                    >
                      Xoa
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              disabled={isLoading || !title || !content}
              className="px-5 py-2 bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-md text-xs font-semibold disabled:opacity-50 cursor-pointer transition-colors"
            >
              {isLoading ? "Dang gui..." : "Gui Gop Y"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
