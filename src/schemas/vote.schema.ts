import { z } from "zod";

export const voteToggleSchema = z.object({
  voterProfileId: z.string().uuid("Invalid voter profile ID"),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
});

export type VoteToggleSchemaInput = z.infer<typeof voteToggleSchema>;
