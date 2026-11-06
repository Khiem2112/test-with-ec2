import { z } from "zod";

export const updatePostStatusSchema = z.object({
  newStatusId: z.number().int().positive("Invalid status ID"),
  changeNote: z.string().trim().max(2000).optional().nullable(),
  notifySubscribers: z.boolean().optional().default(true),
});

export const mergePostsSchema = z.object({
  targetPostId: z.string().uuid("Invalid target post ID"),
});

export const previewMergeSchema = z.object({
  targetPostId: z.string().uuid("Invalid target post ID"),
});

export type UpdatePostStatusSchemaInput = z.infer<typeof updatePostStatusSchema>;
export type MergePostsSchemaInput = z.infer<typeof mergePostsSchema>;
export type PreviewMergeSchemaInput = z.infer<typeof previewMergeSchema>;
