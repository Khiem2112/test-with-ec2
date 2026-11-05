import { NextResponse, type NextRequest } from "next/server";
import { getAuditLogsByWorkspace } from "@/services/audit.service";

// GET /api/v1/audit-logs?workspaceId=... - Query immutable administrative audit logs
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const entityType = searchParams.get("entityType") ?? undefined;
    const entityId = searchParams.get("entityId") ?? undefined;

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

    const logs = await getAuditLogsByWorkspace(workspaceId, {
      entityType,
      entityId,
    });

    return NextResponse.json({
      success: true,
      data: logs,
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
