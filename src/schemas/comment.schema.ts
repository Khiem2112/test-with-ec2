import { z } from "zod";

export const createCommentSchema = z.object({
  postId: z.string().uuid("Invalid post ID"),
  authorName: z.string().trim().min(1, "Author name is required").max(100),
  content: z
    .string()
    .trim()
    .min(3, "Comment content must be at least 3 characters")
    .max(5000, "Comment content must not exceed 5000 characters"),
  parentId: z.string().uuid("Invalid parent comment ID").optional().nullable(),
  isInternalNote: z.boolean().optional().default(false),
  authorUserId: z.string().uuid().optional().nullable(),
});

export const addCommentReactionSchema = z.object({
  commentId: z.string().uuid("Invalid comment ID"),
  type: z.enum(["THUMBS_UP", "THUMBS_DOWN", "HEART", "ROCKET", "INSIGHTFUL"]),
  userId: z.string().uuid().optional().nullable(),
  voterId: z.string().uuid().optional().nullable(),
});

export type CreateCommentSchemaInput = z.infer<typeof createCommentSchema>;
export type AddCommentReactionSchemaInput = z.infer<typeof addCommentReactionSchema>;
