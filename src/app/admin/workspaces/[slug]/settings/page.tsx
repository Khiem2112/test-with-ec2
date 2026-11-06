import React from "react";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { WorkspaceSettingsClient } from "./workspace-settings-client";

export const dynamic = "force-dynamic";

export type WorkspaceSettingsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WorkspaceSettingsPage({
  params,
}: WorkspaceSettingsPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace || !workspace.isActive) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#f7f8f8]">
          Cai Dat Khong Gian Lam Viec
        </h1>
        <p className="text-xs text-[#8a8f98] mt-1">
          Quan ly ten mien tuy chinh, nhan dien thuong hieu va che do cong khai cua cong phan hoi.
        </p>
      </div>

      <WorkspaceSettingsClient workspace={workspace} />
    </div>
  );
}
