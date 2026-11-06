"use client";

import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { ChangelogEditor } from "@/components/changelog/changelog-editor";
import type { ReleaseVersion, Changelog } from "@/types/roadmap";
import type { Post } from "@/types/post";

export type ReleasesManagementClientProps = {
  workspaceId: string;
  initialReleases: ReleaseVersion[];
  completedPosts: Post[];
};

export const ReleasesManagementClient = ({
  workspaceId,
  initialReleases,
  completedPosts,
}: ReleasesManagementClientProps): React.JSX.Element => {
  const [releases, setReleases] = useState<ReleaseVersion[]>(initialReleases);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [versionName, setVersionName] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>("");
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTogglePost = (id: string): void => {
    setSelectedPostIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreateRelease = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!versionName.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/v1/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          versionName: versionName.trim(),
          targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
          completedPostIds: selectedPostIds,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: ReleaseVersion;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success || !result.data) {
        setErrorMessage(result.error?.message ?? "Khong the tao phien ban phat hanh");
        return;
      }

      setReleases((prev) => [result.data!, ...prev]);
      setNoticeMessage(`Da tao phien ban ${result.data.versionName} thanh cong`);
      setIsCreateModalOpen(false);
      setVersionName("");
      setTargetDate("");
      setSelectedPostIds([]);
    } catch {
      setErrorMessage("Loi ket noi khi tao phien ban");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangelogSaved = (saved: Changelog): void => {
    setNoticeMessage(`Da luu nhat ky phat hanh: ${saved.title}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f7f8f8]">
            Quan Ly Phien Ban & Phat Hanh
          </h1>
          <p className="text-xs text-[#8a8f98] mt-1">
            Dong goi cac tinh nang da hoan thanh thanh phien ban phat hanh va xuat ban changelog.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors self-start sm:self-auto"
        >
          Tao Phien Ban Moi
        </button>
      </div>

      {noticeMessage && (
        <div className="p-3 text-xs text-[#27a644] bg-[#27a644]/10 border border-[#27a644]/30 rounded-lg">
          {noticeMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-3 text-xs text-red-400 bg-red-950/20 border border-red-800/40 rounded-lg" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="rounded-xl border border-[#23252a] bg-[#0f1011] overflow-hidden">
        <div className="p-4 border-b border-[#23252a] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider">
            Danh Sach Phien Ban ({releases.length})
          </span>
        </div>

        {releases.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#8a8f98]">
            Chua co phien ban phat hanh nao duoc thiet lap.
          </div>
        ) : (
          <div className="divide-y divide-[#23252a]">
            {releases.map((release) => (
              <div
                key={release.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#141516] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#f7f8f8]">
                      {release.versionName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        release.isPublished
                          ? "bg-[#27a644]/15 text-[#27a644] border border-[#27a644]/30"
                          : "bg-[#18191a] text-[#8a8f98] border border-[#23252a]"
                      }`}
                    >
                      {release.isPublished ? "Da Xuat Ban" : "Ban Nhap (Draft)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#62666d]">
                    <span>
                      Ngay tao: {new Date(release.createdAt).toLocaleDateString()}
                    </span>
                    {release.targetDate && (
                      <span>
                        Muc tieu: {new Date(release.targetDate).toLocaleDateString()}
                      </span>
                    )}
                    <span>{release.items?.length ?? 0} tinh nang dinh kem</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ChangelogEditor
        workspaceId={workspaceId}
        releases={releases}
        onSaved={handleChangelogSaved}
      />

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-[#0f1011] border border-[#23252a] rounded-xl shadow-2xl p-6 text-[#f7f8f8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#23252a]">
              <h2 className="text-base font-bold text-[#f7f8f8]">Tao Phien Ban Phat Hanh Moi</h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#8a8f98] hover:text-[#f7f8f8] text-xs font-semibold px-2 py-1 cursor-pointer"
              >
                Dong
              </button>
            </div>

            <form onSubmit={handleCreateRelease} className="mt-4 space-y-4">
              <div>
                <label htmlFor="ver-name" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
                  Ten Phien Ban (vd: v1.2.0)
                </label>
                <input
                  id="ver-name"
                  type="text"
                  required
                  value={versionName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setVersionName(e.target.value)}
                  placeholder="v1.2.0"
                  className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs font-mono text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2]"
                />
              </div>

              <div>
                <label htmlFor="target-date" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
                  Ngay Phat Hanh Du Kien
                </label>
                <input
                  id="target-date"
                  type="date"
                  value={targetDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetDate(e.target.value)}
                  className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#f7f8f8] focus:outline-hidden focus:border-[#5e6ad2]"
                />
              </div>

              {completedPosts.length > 0 && (
                <div>
                  <span className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1.5">
                    Dinh Kem Tinh Nang Da Hoan Thanh ({selectedPostIds.length}/{completedPosts.length})
                  </span>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 border border-[#23252a] bg-[#141516] rounded-lg p-2.5">
                    {completedPosts.map((post) => {
                      const isSelected = selectedPostIds.includes(post.id);
                      return (
                        <label
                          key={post.id}
                          className="flex items-center gap-2 p-1.5 rounded hover:bg-[#18191a] text-xs text-[#d0d6e0] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleTogglePost(post.id)}
                            className="rounded border-[#23252a] bg-[#18191a] text-[#5e6ad2]"
                          />
                          <span className="truncate">{post.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-[#23252a]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-[#23252a] bg-[#141516] rounded-md text-xs font-medium text-[#8a8f98] hover:text-[#f7f8f8] cursor-pointer"
                >
                  Huy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !versionName.trim()}
                  className="px-5 py-2 bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-md text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Dang tao..." : "Tao Phien Ban"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
