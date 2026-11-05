import { NextResponse, type NextRequest } from "next/server";
import { mergePostsSchema } from "@/schemas/lifecycle.schema";
import { previewMerge, executeMerge } from "@/services/merge-engine.service";

// GET /api/v1/posts/[id]/merge?targetPostId=... - Preview merge impact before confirmation
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  try {
    const { id: sourcePostId } = await params;
    const { searchParams } = new URL(request.url);
    const targetPostId = searchParams.get("targetPostId");

    if (!targetPostId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MISSING_TARGET_POST_ID",
            message: "Parameter targetPostId la bat buoc",
          },
        },
        { status: 400 },
      );
    }

    const preview = await previewMerge(sourcePostId, targetPostId);

    return NextResponse.json({
      success: true,
      data: preview,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";

    if (message.includes("CIRCULAR_MERGE_DETECTED")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CIRCULAR_MERGE_DETECTED",
            message: "Khong the gop bai viet vao chinh no hoac tao chu trinh gop bai vong tron",
          },
        },
        { status: 400 },
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

// POST /api/v1/posts/[id]/merge - Execute atomic post merge
export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  try {
    const { id: sourcePostId } = await params;
    const rawBody = (await request.json()) as Record<string, unknown>;

    const parsed = mergePostsSchema.safeParse(rawBody);
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

    const performedById = request.headers.get("x-user-id");

    const result = await executeMerge(
      sourcePostId,
      parsed.data.targetPostId,
      performedById,
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";

    if (message.includes("CIRCULAR_MERGE_DETECTED")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CIRCULAR_MERGE_DETECTED",
            message: "Khong the gop bai viet vao chinh no hoac tao chu trinh gop bai vong tron",
          },
        },
        { status: 400 },
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
