import { NextResponse, type NextRequest } from "next/server";
import { createCommentSchema } from "@/schemas/comment.schema";
import { getCommentsByPost, createComment } from "@/services/comment.service";

// GET /api/v1/posts/[id]/comments - Retrieve threaded comments with internal note security guard
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  try {
    const { id: postId } = await params;
    const requesterUserId = request.headers.get("x-user-id");

    const comments = await getCommentsByPost(postId, requesterUserId);

    return NextResponse.json({
      success: true,
      data: comments,
    });
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

// POST /api/v1/posts/[id]/comments - Submit public comment or internal staff note
export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  try {
    const { id: postId } = await params;
    const rawBody = (await request.json()) as Record<string, unknown>;

    const parsed = createCommentSchema.safeParse({
      ...rawBody,
      postId,
    });

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

    const comment = await createComment({
      postId,
      authorName: parsed.data.authorName,
      content: parsed.data.content,
      parentId: parsed.data.parentId,
      isInternalNote: parsed.data.isInternalNote,
      authorUserId: parsed.data.authorUserId,
    });

    return NextResponse.json(
      {
        success: true,
        data: comment,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";

    if (message.includes("POST_LOCKED")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "POST_LOCKED",
            message: "Bai viet nay da bi dong bang thao luan va binh chon boi ban quan tri",
          },
        },
        { status: 400 },
      );
    }

    if (message.includes("FORBIDDEN")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Chi thanh vien workspace moi co the tao ghi chu noi bo",
          },
        },
        { status: 403 },
      );
    }

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
