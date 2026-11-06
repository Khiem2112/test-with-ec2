"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import type { Changelog, ReleaseVersion } from "@/types/roadmap";

export type ChangelogEditorProps = {
  workspaceId: string;
  releases?: ReleaseVersion[];
  initialChangelog?: Partial<Changelog>;
  onSaved?: (changelog: Changelog) => void;
  className?: string;
};

// Render simplified Markdown syntax safely without external parser packages
const renderSimpleMarkdown = (text: string): React.JSX.Element[] => {
  const lines = text.split("\n");
  const elements: React.JSX.Element[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let keyIndex = 0;

  for (const line of lines) {
    keyIndex += 1;

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={keyIndex}
            className="p-3 my-2 bg-[#010102] text-[#27a644] border border-[#23252a] rounded text-xs font-mono overflow-x-auto"
          >
            <code>{codeBuffer.join("\n")}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h4 key={keyIndex} className="text-sm font-bold text-[#f7f8f8] mt-3 mb-1">
          {line.replace("### ", "")}
        </h4>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h3 key={keyIndex} className="text-base font-bold text-[#f7f8f8] mt-4 mb-1">
          {line.replace("## ", "")}
        </h3>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h2 key={keyIndex} className="text-lg font-extrabold text-[#f7f8f8] mt-5 mb-2">
          {line.replace("# ", "")}
        </h2>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={keyIndex} className="ml-4 list-disc text-xs text-[#d0d6e0] my-0.5">
          {line.replace(/^[-*]\s+/, "")}
        </li>
      );
    } else if (line.trim().length === 0) {
      elements.push(<div key={keyIndex} className="h-2" />);
    } else {
      elements.push(
        <p key={keyIndex} className="text-xs text-[#d0d6e0] leading-relaxed my-1">
          {line}
        </p>
      );
    }
  }

  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <pre
        key="unclosed-code"
        className="p-3 my-2 bg-[#010102] text-[#27a644] border border-[#23252a] rounded text-xs font-mono overflow-x-auto"
      >
        <code>{codeBuffer.join("\n")}</code>
      </pre>
    );
  }

  return elements;
};

export const ChangelogEditor = ({
  workspaceId,
  releases = [],
  initialChangelog,
  onSaved,
  className,
}: ChangelogEditorProps): React.JSX.Element => {
  const [title, setTitle] = useState<string>(initialChangelog?.title ?? "");
  const [releaseVersionId, setReleaseVersionId] = useState<string>(
    initialChangelog?.releaseVersionId ?? ""
  );
  const [summary, setSummary] = useState<string>(initialChangelog?.summary ?? "");
  const [bodyMarkdown, setBodyMarkdown] = useState<string>(
    initialChangelog?.bodyMarkdown ?? "### Cac Tinh Nang Moi\n- Cap nhat hieu nang he thong\n- Nang cap giao dien"
  );
  const [isPublished, setIsPublished] = useState<boolean>(
    initialChangelog?.isPublished ?? false
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/v1/changelogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          releaseVersionId: releaseVersionId || null,
          title,
          summary,
          bodyMarkdown,
          isPublished,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: Changelog;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success || !result.data) {
        setErrorMessage(result.error?.message ?? "Khong the luu changelog");
        return;
      }

      onSaved?.(result.data);
    } catch {
      setErrorMessage("Loi ket noi khi luu changelog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("bg-[#0f1011] border border-[#23252a] rounded-xl p-6 space-y-6 text-[#f7f8f8]", className)}>
      <div className="flex items-center justify-between pb-4 border-b border-[#23252a]">
        <div>
          <h2 className="text-base font-bold text-[#f7f8f8]">Bien Tap Nhat Ky Phat Hanh (Changelog)</h2>
          <p className="text-xs text-[#8a8f98] mt-0.5">Soan thao va xem truoc song song thong bao phat hanh</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 text-xs text-red-400 bg-red-950/20 border border-red-800/40 rounded-lg" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="cl-title" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
              Tieu De Ban Phat Hanh
            </label>
            <input
              id="cl-title"
              type="text"
              required
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Vi du: RoadmapHub 2.0: Tich hop SSO va Dark Mode"
              className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2]"
            />
          </div>

          {releases.length > 0 && (
            <div>
              <label htmlFor="cl-version" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
                Gan Vao Phien Ban (Release Version)
              </label>
              <select
                id="cl-version"
                value={releaseVersionId}
                onChange={(e) => setReleaseVersionId(e.target.value)}
                className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#f7f8f8] focus:outline-hidden focus:border-[#5e6ad2]"
              >
                <option value="">Khong gan phien ban</option>
                {releases.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.versionName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="cl-summary" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
              Tom Tat Ngan (Summary)
            </label>
            <textarea
              id="cl-summary"
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tom tat 1-2 cau ve nhung thay doi chinh trong ban cap nhat..."
              className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2]"
            />
          </div>

          <div>
            <label htmlFor="cl-body" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
              Noi Dung Markdown (Body Markdown)
            </label>
            <textarea
              id="cl-body"
              required
              rows={12}
              value={bodyMarkdown}
              onChange={(e) => setBodyMarkdown(e.target.value)}
              className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs font-mono text-[#f7f8f8] focus:outline-hidden focus:border-[#5e6ad2]"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-[#141516] border border-[#23252a] rounded-lg">
            <input
              id="cl-published"
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded border-[#23252a] bg-[#18191a] text-[#5e6ad2] cursor-pointer"
            />
            <label htmlFor="cl-published" className="text-xs text-[#d0d6e0] cursor-pointer">
              Xuat ban ngay (Public Changelog & Notify Subscribers)
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !title || !summary || !bodyMarkdown}
            className="w-full py-2 bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-lg text-xs font-bold disabled:opacity-50 cursor-pointer transition-colors"
          >
            {isSubmitting ? "Dang luu..." : isPublished ? "Luu Va Xuat Ban" : "Luu Ban Nhap (Draft)"}
          </button>
        </div>

        <div className="bg-[#141516] border border-[#23252a] rounded-xl p-5 overflow-y-auto max-h-[600px] space-y-4">
          <div className="border-b border-[#23252a] pb-3">
            <span className="text-[10px] font-bold text-[#62666d] uppercase tracking-widest block">
              Xem Truoc Thoi Gian Thuc
            </span>
            <h1 className="text-base font-bold text-[#f7f8f8] mt-1">
              {title || "Tieu de ban phat hanh se hien thi o day"}
            </h1>
            {summary && (
              <p className="text-xs text-[#8a8f98] mt-1 italic">
                {summary}
              </p>
            )}
          </div>

          <div className="text-xs text-[#d0d6e0] leading-relaxed">
            {renderSimpleMarkdown(bodyMarkdown)}
          </div>
        </div>
      </form>
    </div>
  );
};
