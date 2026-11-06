import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { getReleasesByWorkspace } from "@/services/release.service";
import { getChangelogsByWorkspace } from "@/services/changelog.service";

export const dynamic = "force-dynamic";

export type ChangelogPageProps = {
  params: Promise<{
    workspaceSlug: string;
  }>;
};

export default async function ChangelogPage({
  params,
}: ChangelogPageProps): Promise<React.JSX.Element> {
  const { workspaceSlug } = await params;

  const workspace = await getWorkspaceBySlug(workspaceSlug);
  if (!workspace || !workspace.isActive) {
    notFound();
  }

  const [releases, changelogs] = await Promise.all([
    getReleasesByWorkspace(workspace.id),
    getChangelogsByWorkspace(workspace.id, false),
  ]);

  const publishedReleases = releases.filter((r) => r.isPublished);

  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8a8f98] mb-2">
            <Link
              href={`/${workspaceSlug}`}
              className="hover:text-[#f7f8f8] transition-colors"
            >
              {workspace.name}
            </Link>
            <span>/</span>
            <span className="text-[#62666d]">Nhat Ky Thay Doi</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f7f8f8]">
            Nhat Ky Thay Doi & Phien Ban Phat Hanh
          </h1>
          <p className="text-xs text-[#8a8f98] mt-1">
            Lich su cac ban phat hanh, tinh nang moi va cai tien lien tuc cua san pham.
          </p>
        </div>

        <Link
          href={`/${workspaceSlug}/roadmap`}
          className="px-3 py-1.5 border border-[#23252a] bg-[#0f1011] text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#141516] rounded-md text-xs font-medium self-start sm:self-auto transition-colors"
        >
          Xem Lo Trinh Phat Trien &rarr;
        </Link>
      </div>

      {publishedReleases.length === 0 && changelogs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#23252a] bg-[#0f1011] p-12 text-center">
          <p className="text-sm text-[#8a8f98]">
            Chua co phien ban phat hanh cong khai nao duoc ghi nhan.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {publishedReleases.map((release) => {
            const changelog = release.changelog;
            const releaseDate = release.releasedAt ?? release.createdAt;

            return (
              <article
                key={release.id}
                className="rounded-xl border border-[#23252a] bg-[#0f1011] p-6 lg:p-8 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#18191a] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-[#5e6ad2]/15 text-[#828fff] border border-[#5e6ad2]/30 font-mono text-xs font-bold">
                      {release.versionName}
                    </span>
                    <span className="text-xs text-[#62666d]">
                      {new Date(releaseDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {changelog ? (
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-[#f7f8f8]">
                      {changelog.title}
                    </h2>
                    {changelog.summary && (
                      <p className="text-xs text-[#8a8f98] font-medium leading-relaxed">
                        {changelog.summary}
                      </p>
                    )}
                    <div className="text-sm text-[#d0d6e0] leading-relaxed whitespace-pre-wrap">
                      {changelog.bodyMarkdown}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#8a8f98] italic">
                    Phien ban da phat hanh thanh cong.
                  </p>
                )}

                {release.items && release.items.length > 0 && (
                  <div className="pt-4 border-t border-[#18191a] space-y-2">
                    <span className="text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider block">
                      Tinh Nang Trong Phien Ban ({release.items.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {release.items.map((item) => (
                        <Link
                          key={item.id}
                          href={`/${workspaceSlug}/posts/${item.postId}`}
                          className="px-2.5 py-1 rounded-lg border border-[#23252a] bg-[#141516] text-xs text-[#f7f8f8] hover:border-[#5e6ad2] hover:text-[#828fff] transition-colors"
                        >
                          {item.postTitle ?? item.postId}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
