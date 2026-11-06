import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { WorkspaceMembersClient } from "./workspace-members-client";
import type { WorkspaceMember } from "@/types/workspace";

export const dynamic = "force-dynamic";

export type WorkspaceMembersPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WorkspaceMembersPage({
  params,
}: WorkspaceMembersPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace || !workspace.isActive) {
    notFound();
  }

  const memberRecords = await prisma.workspaceMember.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "asc" },
  });

  const members: WorkspaceMember[] = memberRecords.map((m) => ({
    id: m.id,
    workspaceId: m.workspaceId,
    userId: m.userId,
    role: m.role,
    isActive: m.isActive,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  }));

  return <WorkspaceMembersClient workspaceId={workspace.id} initialMembers={members} />;
}
