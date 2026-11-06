import { z } from "zod";

export const updateNotificationReadSchema = z.object({
  isRead: z.boolean().default(true),
});

export const toggleSubscriptionSchema = z.object({
  postId: z.string().uuid("Invalid post ID"),
  voterProfileId: z.string().uuid("Invalid voter profile ID"),
  notifyEmail: z.boolean().optional(),
  notifyInApp: z.boolean().optional(),
});

export type UpdateNotificationReadSchemaInput = z.infer<typeof updateNotificationReadSchema>;
export type ToggleSubscriptionSchemaInput = z.infer<typeof toggleSubscriptionSchema>;
