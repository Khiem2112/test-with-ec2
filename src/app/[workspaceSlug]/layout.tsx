import React from "react";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { PublicHeader } from "@/components/layout/public-header";

export type WorkspaceLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
};

export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps): Promise<React.JSX.Element> {
  const { workspaceSlug } = await params;
  const workspace = await getWorkspaceBySlug(workspaceSlug);

  if (!workspace || !workspace.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#010102] text-[#f7f8f8] flex flex-col">
      <PublicHeader workspace={workspace} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
