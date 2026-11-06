import { NextResponse, type NextRequest } from "next/server";
import { createPostSchema } from "@/schemas/post.schema";
import { createPost } from "@/services/post.service";

// POST /api/v1/posts - Submit a new feedback post with attachments and moderation handling
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const rawBody = (await request.json()) as Record<string, unknown>;

    // Pre-validate attachment file size bounds
    if (Array.isArray(rawBody.attachments)) {
      for (const item of rawBody.attachments) {
        if (typeof item === "object" && item !== null && "fileSize" in item) {
          const size = Number((item as { fileSize: unknown }).fileSize);
          if (size > 10 * 1024 * 1024) {
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: "ATTACHMENT_TOO_LARGE",
                  message: "Dung luong tep dinh kem vuot qua gioi han 10MB",
                },
              },
              { status: 413 },
            );
          }
        }
      }
    }

    const parsed = createPostSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: parsed.error.issues[0]?.message ?? "Du lieu khong hop le",
          },
        },
        { status: 400 },
      );
    }

    const post = await createPost({
      boardId: parsed.data.boardId,
      categoryId: parsed.data.categoryId,
      authorUserId: parsed.data.authorUserId,
      voterProfileId: parsed.data.voterProfileId,
      title: parsed.data.title,
      content: parsed.data.content,
      tagIds: parsed.data.tagIds,
      attachments: parsed.data.attachments,
    });

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message,
        },
      },
      { status: 500 },
    );
  }
};
