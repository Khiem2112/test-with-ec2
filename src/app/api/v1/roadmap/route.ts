import { NextResponse, type NextRequest } from "next/server";
import { getRoadmapColumns } from "@/services/roadmap.service";

// GET /api/v1/roadmap?workspaceId=... - Retrieve public/internal Kanban roadmap data
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MISSING_WORKSPACE_ID",
            message: "Parameter workspaceId la bat buoc",
          },
        },
        { status: 400 },
      );
    }

    const data = await getRoadmapColumns(workspaceId);

    return NextResponse.json({
      success: true,
      data,
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
