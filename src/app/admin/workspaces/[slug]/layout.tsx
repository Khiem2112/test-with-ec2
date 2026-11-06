import React from "react";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export type AdminWorkspaceLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function AdminWorkspaceLayout({
  children,
  params,
}: AdminWorkspaceLayoutProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace || !workspace.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#010102] text-[#f7f8f8] flex">
      <AdminSidebar workspaceSlug={workspace.slug} workspaceName={workspace.name} />
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
