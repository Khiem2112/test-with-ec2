import { randomBytes, createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import type {
  WebhookSubscription,
  WebhookEvent,
  CreateWebhookInput,
} from "@/types/notification";

// Generate a cryptographically secure 32-character secret key
export const generateWebhookSecret = (): string => {
  return randomBytes(16).toString("hex");
};

// Compute HMAC SHA-256 signature for payload verification
export const computeHmacSignature = (
  payloadString: string,
  secretKey: string,
): string => {
  const hash = createHmac("sha256", secretKey).update(payloadString).digest("hex");
  return `sha256=${hash}`;
};

// Map Prisma webhook subscription record to domain model
const mapWebhookRecord = (record: {
  id: string;
  workspaceId: string;
  targetUrl: string;
  secretKey: string;
  events: WebhookEvent[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): WebhookSubscription => {
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    targetUrl: record.targetUrl,
    secretKey: record.secretKey,
    events: record.events,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

// Register outbound webhook with generated secretKey and subscribed event array
export const registerWebhook = async (
  input: CreateWebhookInput,
): Promise<WebhookSubscription> => {
  const secretKey = generateWebhookSecret();

  const record = await prisma.webhookSubscription.create({
    data: {
      workspaceId: input.workspaceId,
      targetUrl: input.targetUrl,
      secretKey,
      events: input.events,
    },
  });

  return mapWebhookRecord(record);
};

// Retrieve all webhooks registered for a workspace
export const getWebhooksByWorkspace = async (
  workspaceId: string,
): Promise<WebhookSubscription[]> => {
  const records = await prisma.webhookSubscription.findMany({
    where: {
      workspaceId,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return records.map(mapWebhookRecord);
};

// Deactivate or delete registered webhook
export const deleteWebhook = async (
  id: string,
  workspaceId: string,
): Promise<boolean> => {
  try {
    await prisma.webhookSubscription.delete({
      where: {
        id,
        workspaceId,
      },
    });
    return true;
  } catch {
    return false;
  }
};

// Simulate delivery dispatch of an outbound webhook event with HMAC header
export const dispatchWebhookEvent = async (
  webhook: WebhookSubscription,
  event: WebhookEvent,
  data: Record<string, unknown>,
): Promise<{ signature: string; delivered: boolean }> => {
  const payloadObject = {
    event,
    timestamp: new Date().toISOString(),
    webhookId: webhook.id,
    data,
  };

  const payloadString = JSON.stringify(payloadObject);
  const signature = computeHmacSignature(payloadString, webhook.secretKey);

  // Note: Outbound HTTP dispatch can be attempted asynchronously with X-RoadmapHub-Signature header
  return {
    signature,
    delivered: true,
  };
};
