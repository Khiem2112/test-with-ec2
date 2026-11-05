import { z } from "zod";

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
] as const;

export const postAttachmentSchema = z.object({
  fileName: z.string().trim().min(1, "File name is required").max(255),
  fileUrl: z.string().url("File URL must be a valid URL"),
  fileSize: z
    .number()
    .int()
    .positive("File size must be positive")
    .max(10 * 1024 * 1024, "File size must not exceed 10MB"),
  mimeType: z.enum(ALLOWED_MIME_TYPES, {
    errorMap: () => ({ message: "Only PNG, JPG, WEBP, and PDF files are allowed" }),
  }),
});

export const searchSimilarPostsSchema = z.object({
  boardId: z.string().uuid("Invalid board ID"),
  q: z.string().trim().min(3, "Search query must be at least 3 characters").max(200),
});

export const createPostSchema = z.object({
  boardId: z.string().uuid("Invalid board ID"),
  categoryId: z.number().int().positive().optional().nullable(),
  voterProfileId: z.string().uuid().optional().nullable(),
  authorUserId: z.string().uuid().optional().nullable(),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  content: z.string().trim().min(5, "Content must be at least 5 characters").max(20000),
  tagIds: z.array(z.number().int().positive()).optional().default([]),
  attachments: z.array(postAttachmentSchema).optional().default([]),
});

export type PostAttachmentSchemaInput = z.infer<typeof postAttachmentSchema>;
export type SearchSimilarPostsSchemaInput = z.infer<typeof searchSimilarPostsSchema>;
export type CreatePostSchemaInput = z.infer<typeof createPostSchema>;
