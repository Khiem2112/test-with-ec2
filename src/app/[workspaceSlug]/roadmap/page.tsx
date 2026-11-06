import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { getRoadmapColumns } from "@/services/roadmap.service";
import { KanbanBoard } from "@/components/roadmap/kanban-board";

export const dynamic = "force-dynamic";

export type RoadmapPageProps = {
  params: Promise<{
    workspaceSlug: string;
  }>;
};

export default async function RoadmapPage({
  params,
}: RoadmapPageProps): Promise<React.JSX.Element> {
  const { workspaceSlug } = await params;

  const workspace = await getWorkspaceBySlug(workspaceSlug);
  if (!workspace || !workspace.isActive) {
    notFound();
  }

  const roadmapData = await getRoadmapColumns(workspace.id);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 space-y-6">
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
            <span className="text-[#62666d]">Lo Trinh Phat Trien</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f7f8f8]">
            Lo Trinh Phat Trien San Pham
          </h1>
          <p className="text-xs text-[#8a8f98] mt-1">
            Theo doi cac tinh nang dang duoc len ke hoach, dang trien khai va da hoan thanh.
          </p>
        </div>

        <Link
          href={`/${workspaceSlug}/changelog`}
          className="px-3 py-1.5 border border-[#23252a] bg-[#0f1011] text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#141516] rounded-md text-xs font-medium self-start sm:self-auto transition-colors"
        >
          Xem Nhat Ky Phat Hanh &rarr;
        </Link>
      </div>

      <KanbanBoard
        columns={roadmapData.columns}
        workspaceSlug={workspaceSlug}
        isEditable={false}
      />
    </div>
  );
}
