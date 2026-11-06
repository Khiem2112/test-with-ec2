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
            className="p-3 my-2 bg-gray-900 text-gray-100 rounded text-xs font-mono overflow-x-auto"
          >
            <code>{codeBuffer.join("\n")}</code>
          </pre>,
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
        <h4 key={keyIndex} className="text-sm font-bold text-gray-900 mt-3 mb-1">
          {line.replace("### ", "")}
        </h4>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h3 key={keyIndex} className="text-base font-bold text-gray-900 mt-4 mb-1">
          {line.replace("## ", "")}
        </h3>,
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h2 key={keyIndex} className="text-lg font-extrabold text-gray-900 mt-5 mb-2">
          {line.replace("# ", "")}
        </h2>,
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={keyIndex} className="ml-4 list-disc text-xs text-gray-700 my-0.5">
          {line.replace(/^[-*]\s+/, "")}
        </li>,
      );
    } else if (line.trim().length === 0) {
      elements.push(<div key={keyIndex} className="h-2" />);
    } else {
      elements.push(
        <p key={keyIndex} className="text-xs text-gray-700 leading-relaxed my-1">
          {line}
        </p>,
      );
    }
  }

  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <pre
        key="unclosed-code"
        className="p-3 my-2 bg-gray-900 text-gray-100 rounded text-xs font-mono overflow-x-auto"
      >
        <code>{codeBuffer.join("\n")}</code>
      </pre>,
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
    initialChangelog?.releaseVersionId ?? "",
  );
  const [summary, setSummary] = useState<string>(initialChangelog?.summary ?? "");
  const [bodyMarkdown, setBodyMarkdown] = useState<string>(
    initialChangelog?.bodyMarkdown ?? "### Cac Tinh Nang Moi\n- Cap nhat hieu nang he thong\n- Nang cap giao dien",
  );
  const [isPublished, setIsPublished] = useState<boolean>(
    initialChangelog?.isPublished ?? false,
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
    <div className={cn("bg-white border border-gray-200 rounded-lg p-6 space-y-6", className)}>
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bien Tap Nhat Ky Phat Hanh (Changelog)</h2>
          <p className="text-xs text-gray-500">Soan thao va xem truoc song song thong bao phat hanh</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-300 rounded" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4">
          <div>
            <label htmlFor="cl-title" className="block text-xs font-semibold text-gray-700 uppercase">
              Tieu De Ban Phat Hanh
            </label>
            <input
              id="cl-title"
              type="text"
              required
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Vi du: RoadmapHub 2.0: Tich hop SSO va Dark Mode"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {releases.length > 0 && (
            <div>
              <label htmlFor="cl-version" className="block text-xs font-semibold text-gray-700 uppercase">
                Gan Vao Phien Ban (Release Version)
              </label>
              <select
                id="cl-version"
                value={releaseVersionId}
                onChange={(e) => setReleaseVersionId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white"
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
            <label htmlFor="cl-summary" className="block text-xs font-semibold text-gray-700 uppercase">
              Tom Tat Ngan (Summary)
            </label>
            <textarea
              id="cl-summary"
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tom tat 1-2 cau ve nhung thay doi chinh trong ban cap nhat..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="cl-body" className="block text-xs font-semibold text-gray-700 uppercase">
              Noi Dung Markdown (Body Markdown)
            </label>
            <textarea
              id="cl-body"
              required
              rows={12}
              value={bodyMarkdown}
              onChange={(e) => setBodyMarkdown(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs font-mono focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="cl-published"
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 cursor-pointer"
            />
            <label htmlFor="cl-published" className="text-xs font-medium text-gray-700 cursor-pointer">
              Xuat ban ngay (Public Changelog & Notify Subscribers)
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !title || !summary || !bodyMarkdown}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Dang luu..." : isPublished ? "Luu Va Xuat Ban" : "Luu Ban Nhap (Draft)"}
          </button>
        </div>

        {/* Right Column: Live Synchronized Preview */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 overflow-y-auto max-h-[600px] space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Xem Truoc Thoi Gian Thuc
            </span>
            <h1 className="text-lg font-extrabold text-gray-900 mt-1">
              {title || "Tieu de ban phat hanh se hien thi o day"}
            </h1>
            {summary && (
              <p className="text-xs text-gray-600 mt-1 italic">
                {summary}
              </p>
            )}
          </div>

          <div className="prose prose-sm max-w-none text-xs">
            {renderSimpleMarkdown(bodyMarkdown)}
          </div>
        </div>
      </form>
    </div>
  );
};
