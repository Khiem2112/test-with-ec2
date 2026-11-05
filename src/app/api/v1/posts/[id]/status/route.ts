import { NextResponse, type NextRequest } from "next/server";
import { updatePostStatusSchema } from "@/schemas/lifecycle.schema";
import { updatePostStatus } from "@/services/status.service";

// PATCH /api/v1/posts/[id]/status - Mutate post status and record status history
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  try {
    const { id: postId } = await params;
    const rawBody = (await request.json()) as Record<string, unknown>;

    const parsed = updatePostStatusSchema.safeParse(rawBody);
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

    const changedById = request.headers.get("x-user-id");

    const result = await updatePostStatus({
      postId,
      newStatusId: parsed.data.newStatusId,
      changeNote: parsed.data.changeNote,
      notifySubscribers: parsed.data.notifySubscribers,
      changedById,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";

    if (message.includes("POST_NOT_FOUND")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "POST_NOT_FOUND",
            message: "Bai viet khong ton tai",
          },
        },
        { status: 404 },
      );
    }

    if (message.includes("STATUS_NOT_FOUND")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "STATUS_NOT_FOUND",
            message: "Trang thai khong ton tai",
          },
        },
        { status: 404 },
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
