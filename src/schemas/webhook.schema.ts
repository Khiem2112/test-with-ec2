import { z } from "zod";

export const createWebhookSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  targetUrl: z.string().url("Invalid target webhook URL"),
  events: z
    .array(
      z.enum([
        "POST_CREATED",
        "POST_STATUS_CHANGED",
        "POST_MERGED",
        "COMMENT_ADDED",
        "RELEASE_PUBLISHED",
      ]),
    )
    .min(1, "At least one event must be selected"),
});

export type CreateWebhookSchemaInput = z.infer<typeof createWebhookSchema>;
