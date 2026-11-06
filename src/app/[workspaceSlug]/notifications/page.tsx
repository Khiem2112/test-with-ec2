import React from "react";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { NotificationsView } from "./notifications-view";

export const dynamic = "force-dynamic";

export type NotificationsPageProps = {
  params: Promise<{
    workspaceSlug: string;
  }>;
};

export default async function NotificationsPage({
  params,
}: NotificationsPageProps): Promise<React.JSX.Element> {
  const { workspaceSlug } = await params;

  const workspace = await getWorkspaceBySlug(workspaceSlug);
  if (!workspace || !workspace.isActive) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-10">
      <NotificationsView workspaceSlug={workspaceSlug} />
    </div>
  );
}
