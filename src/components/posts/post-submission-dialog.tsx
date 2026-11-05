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

  // Debounced search for similar posts
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
          `/api/v1/posts/search-similar?boardId=${boardId}&q=${encodeURIComponent(title.trim())}`,
        );
        const result = (await response.json()) as {
          success: boolean;
          data?: SimilarPostResult[];
        };

        if (response.ok && result.success && result.data && result.data.length > 0) {
          setSimilarPosts(result.data);
          const exact = result.data.some(
            (p) => p.title.toLowerCase().trim() === title.toLowerCase().trim(),
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
      setErrorMessage("Khong the bo phieu luc nay");
    }
  };

  const handleAddAttachment = (): void => {
    if (!attachmentName || !attachmentUrl) {
      return;
    }
    if (attachmentSize > 10 * 1024 * 1024) {
      setErrorMessage("Dung luong tep dinh kem vuot qua gioi han 10MB");
      return;
    }
    setAttachments((prev) => [
      ...prev,
      {
        fileName: attachmentName,
        fileUrl: attachmentUrl,
        fileSize: attachmentSize,
        mimeType: attachmentMime,
      },
    ]);
    setAttachmentName("");
    setAttachmentUrl("");
    setErrorMessage(null);
  };

  const handleToggleTag = (tagId: number): void => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className={cn("w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 my-8", className)}>
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Dong Gop Y Kien Moi</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold px-2 py-1 cursor-pointer"
          >
            Dong
          </button>
        </div>

        {confirmationNotice && (
          <div className="mt-3 p-3 text-sm text-green-700 bg-green-50 border border-green-300 rounded">
            {confirmationNotice}
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 p-3 text-sm text-red-700 bg-red-50 border border-red-300 rounded" role="alert">
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
            <label htmlFor="post-title" className="block text-xs font-semibold text-gray-700 uppercase">
              Tieu De Gop Y
            </label>
            <input
              id="post-title"
              type="text"
              required
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Tom tat ngan gon y tuong hoac loi can bao..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.length > 0 && (
              <div>
                <label htmlFor="post-category" className="block text-xs font-semibold text-gray-700 uppercase">
                  Danh Muc
                </label>
                <select
                  id="post-category"
                  value={categoryId ?? ""}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setCategoryId(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
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
                <span className="block text-xs font-semibold text-gray-700 uppercase mb-1">
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
                          "px-2 py-1 text-xs rounded border transition-colors cursor-pointer",
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 font-semibold"
                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
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
            <label htmlFor="post-content" className="block text-xs font-semibold text-gray-700 uppercase">
              Mo Ta Chi Tiet (Ho tro Markdown)
            </label>
            <textarea
              id="post-content"
              required
              rows={4}
              value={content}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              placeholder="Trinh bay chi tiet van de, boi canh su dung va giai phap de xuat..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
            />
          </div>

          {/* Attachments Section */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-2">
            <span className="font-semibold text-gray-700 uppercase block">
              Tep Dinh Kem (Toi da 10MB moi tep)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Ten tep (vd: screenshot.png)"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded bg-white text-xs"
              />
              <input
                type="url"
                placeholder="URL anh/tep"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded bg-white text-xs"
              />
              <div className="flex gap-1">
                <select
                  value={attachmentMime}
                  onChange={(e) => setAttachmentMime(e.target.value as typeof attachmentMime)}
                  className="px-2 py-1 border border-gray-300 rounded bg-white text-xs"
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/webp">WEBP</option>
                  <option value="application/pdf">PDF</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="px-2 py-1 bg-gray-800 text-white rounded text-xs cursor-pointer"
                >
                  Them
                </button>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] text-gray-600 bg-white p-1.5 border rounded">
                    <span>{att.fileName} ({Math.round(att.fileSize / 1024)} KB) - {att.mimeType}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xoa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Huy
            </button>
            <button
              type="submit"
              disabled={isLoading || !title || !content}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Dang gui..." : "Gui Gop Y"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
