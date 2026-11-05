import { NextResponse, type NextRequest } from "next/server";
import { createReleaseVersionSchema, attachCompletedPostsSchema } from "@/schemas/roadmap.schema";
import {
  createReleaseVersion,
  attachCompletedPosts,
  getReleasesByWorkspace,
} from "@/services/release.service";

// GET /api/v1/releases?workspaceId=... - Retrieve release versions
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

    const releases = await getReleasesByWorkspace(workspaceId);

    return NextResponse.json({
      success: true,
      data: releases,
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

// POST /api/v1/releases - Create release version or attach completed posts
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const rawBody = (await request.json()) as Record<string, unknown>;

    // Handle attaching posts branch
    if ("postIds" in rawBody) {
      const parsedAttach = attachCompletedPostsSchema.safeParse(rawBody);
      if (!parsedAttach.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_FAILED",
              message: parsedAttach.error.issues[0]?.message ?? "Du lieu khong hop le",
            },
          },
          { status: 400 },
        );
      }

      const items = await attachCompletedPosts({
        releaseVersionId: parsedAttach.data.releaseVersionId,
        postIds: parsedAttach.data.postIds,
        completedNote: parsedAttach.data.completedNote,
      });

      return NextResponse.json({
        success: true,
        data: items,
      });
    }

    // Standard release version creation
    const parsed = createReleaseVersionSchema.safeParse(rawBody);
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

    const release = await createReleaseVersion({
      workspaceId: parsed.data.workspaceId,
      versionName: parsed.data.versionName,
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : null,
    });

    return NextResponse.json(
      {
        success: true,
        data: release,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";

    if (message.includes("VERSION_ALREADY_EXISTS")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VERSION_ALREADY_EXISTS",
            message: "Ten phien ban da ton tai trong khong gian lam viec",
          },
        },
        { status: 409 },
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
