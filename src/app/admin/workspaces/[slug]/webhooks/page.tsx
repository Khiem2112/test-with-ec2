import React from "react";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/services/workspace.service";
import { getWebhooksByWorkspace } from "@/services/webhook.service";
import { WebhooksManagementClient } from "./webhooks-management-client";

export const dynamic = "force-dynamic";

export type WebhooksPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WebhooksPage({
  params,
}: WebhooksPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace || !workspace.isActive) {
    notFound();
  }

  const webhooks = await getWebhooksByWorkspace(workspace.id);

  return (
    <WebhooksManagementClient
      workspaceId={workspace.id}
      initialWebhooks={webhooks}
    />
  );
}
