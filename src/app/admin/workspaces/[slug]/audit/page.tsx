import React from "react";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { getAuditLogsByWorkspace } from "@/services/audit.service";
import { AuditLogTable } from "@/components/audit/audit-log-table";

export const dynamic = "force-dynamic";

export type AuditPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AuditPage({
  params,
}: AuditPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace || !workspace.isActive) {
    notFound();
  }

  const logs = await getAuditLogsByWorkspace(workspace.id);

  return (
    <div className="space-y-6">
      <AuditLogTable logs={logs} />
    </div>
  );
}
