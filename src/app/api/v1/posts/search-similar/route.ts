import { NextResponse, type NextRequest } from "next/server";
import { findSimilarPosts } from "@/services/deduplication.service";

// GET /api/v1/posts/search-similar - Search for similar posts to prevent duplicate submissions
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get("boardId");
    const q = searchParams.get("q");

    if (!boardId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MISSING_BOARD_ID",
            message: "Parameter boardId la bat buoc",
          },
        },
        { status: 400 },
      );
    }

    if (!q || q.trim().length < 3) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const results = await findSimilarPosts(boardId, q.trim());

    return NextResponse.json({
      success: true,
      data: results,
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
