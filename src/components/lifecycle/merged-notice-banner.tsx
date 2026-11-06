"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type MergedNoticeBannerProps = {
  targetPostTitle: string;
  targetPostSlug: string;
  workspaceSlug?: string;
  className?: string;
};

export const MergedNoticeBanner = ({
  targetPostTitle,
  targetPostSlug,
  workspaceSlug,
  className,
}: MergedNoticeBannerProps): React.JSX.Element => {
  const targetUrl = workspaceSlug
    ? `/${workspaceSlug}/posts/${targetPostSlug}`
    : `/posts/${targetPostSlug}`;

  return (
    <div
      className={cn(
        "p-4 bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl border border-[#23252a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#f7f8f8]",
        className
      )}
      role="alert"
    >
      <div>
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
          THONG BAO GOP BAI VIET
        </span>
        <p className="mt-0.5 text-sm font-semibold text-[#f7f8f8]">
          Bai viet nay da duoc gop vao &quot;{targetPostTitle}&quot;
        </p>
        <p className="text-xs text-[#8a8f98]">
          Toan bo phieu bau va thao luan da duoc chuyen sang bai viet chinh de tap trung theo doi tien do.
        </p>
      </div>

      <Link
        href={targetUrl}
        className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-md text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
      >
        Chuyen Toi Bai Chinh
      </Link>
    </div>
  );
};
