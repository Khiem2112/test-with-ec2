import { NextResponse, type NextRequest } from "next/server";
import { createChangelogSchema } from "@/schemas/roadmap.schema";
import { createChangelog, getChangelogsByWorkspace } from "@/services/changelog.service";

// GET /api/v1/changelogs?workspaceId=... - Retrieve changelogs
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const includeDrafts = searchParams.get("includeDrafts") === "true";

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

    const changelogs = await getChangelogsByWorkspace(workspaceId, includeDrafts);

    return NextResponse.json({
      success: true,
      data: changelogs,
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

// POST /api/v1/changelogs - Create and publish changelog entry
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const rawBody = (await request.json()) as Record<string, unknown>;

    const parsed = createChangelogSchema.safeParse(rawBody);
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

    const changelog = await createChangelog(parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: changelog,
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
