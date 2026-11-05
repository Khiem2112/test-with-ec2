import { z } from "zod";

export const roadmapQuerySchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
});

export const createReleaseVersionSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  versionName: z.string().trim().min(1, "Version name is required").max(50),
  targetDate: z.string().datetime().optional().nullable(),
});

export const attachCompletedPostsSchema = z.object({
  releaseVersionId: z.string().uuid("Invalid release version ID"),
  postIds: z.array(z.string().uuid()).min(1, "At least one post must be selected"),
  completedNote: z.string().trim().max(1000).optional(),
});

export const createChangelogSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  releaseVersionId: z.string().uuid("Invalid release version ID").optional().nullable(),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/).optional(),
  summary: z.string().trim().min(5, "Summary must be at least 5 characters").max(1000),
  bodyMarkdown: z.string().trim().min(10, "Body markdown must be at least 10 characters"),
  isPublished: z.boolean().optional().default(false),
});

export type RoadmapQuerySchemaInput = z.infer<typeof roadmapQuerySchema>;
export type CreateReleaseVersionSchemaInput = z.infer<typeof createReleaseVersionSchema>;
export type AttachCompletedPostsSchemaInput = z.infer<typeof attachCompletedPostsSchema>;
export type CreateChangelogSchemaInput = z.infer<typeof createChangelogSchema>;
