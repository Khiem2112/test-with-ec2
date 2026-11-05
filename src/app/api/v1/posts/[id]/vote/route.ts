import { NextResponse, type NextRequest } from "next/server";
import { voteToggleSchema } from "@/schemas/vote.schema";
import { toggleVote } from "@/services/voting.service";

// POST /api/v1/posts/[id]/vote - Toggle vote on a feedback post
export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  try {
    const { id: postId } = await params;
    const rawBody = (await request.json()) as Record<string, unknown>;

    const parsed = voteToggleSchema.safeParse(rawBody);
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

    const ipAddress =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      parsed.data.ipAddress ??
      null;
    const userAgent = request.headers.get("user-agent") ?? parsed.data.userAgent ?? null;

    const result = await toggleVote(
      postId,
      parsed.data.voterProfileId,
      ipAddress,
      userAgent,
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
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
