import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { getBoardsByWorkspace } from "@/services/board.service";

export const dynamic = "force-dynamic";

export type WorkspaceHomePageProps = {
  params: Promise<{ workspaceSlug: string }>;
};

export default async function WorkspaceHomePage({
  params,
}: WorkspaceHomePageProps): Promise<React.JSX.Element> {
  const { workspaceSlug } = await params;
  const workspace = await getWorkspaceBySlug(workspaceSlug);

  if (!workspace || !workspace.isActive) {
    notFound();
  }

  const boards = await getBoardsByWorkspace(workspace.id);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-[#f7f8f8] mb-2">
          {workspace.name}
        </h1>
        <p className="text-sm text-[#8a8f98]">
          Chao mung ban den voi cong phan hoi y kien. Hay chon mot bang ben duoi de dong gop y kien, binh chon tinh nang hoac theo doi tien do san pham.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wider text-[#62666d] uppercase">
            Cac Bang Phan Hoi ({boards.length})
          </h2>
          <Link
            href={`/${workspaceSlug}/roadmap`}
            className="text-xs text-[#5e6ad2] hover:text-[#828fff] transition-colors"
          >
            Xem Lo Trinh Phat Trien &rarr;
          </Link>
        </div>

        {boards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#23252a] bg-[#0f1011] p-12 text-center">
            <p className="text-sm text-[#8a8f98]">
              Hien tai chua co bang phan hoi cong khai nao duoc thiet lap.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/${workspaceSlug}/boards/${board.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-[#23252a] bg-[#0f1011] p-5 hover:border-[#34343a] hover:bg-[#141516] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-[#f7f8f8] group-hover:text-[#828fff] transition-colors">
                      {board.name}
                    </h3>
                    <span className="text-xs text-[#62666d] font-mono group-hover:text-[#828fff] transition-colors">
                      &rarr;
                    </span>
                  </div>
                  <p className="text-xs text-[#8a8f98] line-clamp-2 mb-4">
                    {board.description ?? "Dong gop y kien va thao luan cung doi ngu phat trien."}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#18191a] flex flex-wrap gap-1.5">
                  {board.categories.length > 0 ? (
                    board.categories.slice(0, 3).map((category) => (
                      <span
                        key={category.id}
                        className="rounded bg-[#18191a] px-2 py-0.5 text-[10px] text-[#8a8f98] border border-[#23252a]"
                      >
                        {category.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-[#62666d]">Tat ca chu de</span>
                  )}
                  {board.categories.length > 3 && (
                    <span className="text-[10px] text-[#62666d]">
                      +{board.categories.length - 3}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
