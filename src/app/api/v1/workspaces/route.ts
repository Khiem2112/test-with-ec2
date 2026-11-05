import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createWorkspaceSchema } from "@/schemas/workspace.schema";
import { createWorkspace, getWorkspaceBySlug } from "@/services/workspace.service";

// Retrieve default user or fallback creator for workspace provisioning
const resolveDefaultCreatorId = async (): Promise<string> => {
  const existingUser = await prisma.user.findFirst();
  if (existingUser) {
    return existingUser.id;
  }
  const created = await prisma.user.create({
    data: {
      email: "admin@roadnaphub.internal",
      fullName: "System Admin",
    },
  });
  return created.id;
};

// GET /api/v1/workspaces - Lookup workspace by slug query parameter
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MISSING_SLUG_PARAMETER",
            message: "Parameter slug la bat buoc",
          },
        },
        { status: 400 },
      );
    }

    const workspace = await getWorkspaceBySlug(slug);
    if (!workspace) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "WORKSPACE_NOT_FOUND",
            message: "Khong tim thay khong gian lam viec",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: workspace,
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

// POST /api/v1/workspaces - Provision a new workspace and assign creator as OWNER
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const rawBody = (await request.json()) as unknown;
    const parsed = createWorkspaceSchema.safeParse(rawBody);

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

    const creatorUserId =
      request.headers.get("x-user-id") ?? (await resolveDefaultCreatorId());

    const createdWorkspace = await createWorkspace({
      ...parsed.data,
      creatorUserId,
    });

    return NextResponse.json(
      {
        success: true,
        data: createdWorkspace,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Loi he thong";

    if (message.includes("Duong dan dinh danh da duoc su dung")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SLUG_ALREADY_EXISTS",
            message: "Duong dan dinh danh da duoc su dung, vui long chon ten khac",
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
