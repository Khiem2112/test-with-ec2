import { NextResponse, type NextRequest } from "next/server";
import { createWebhookSchema } from "@/schemas/webhook.schema";
import { registerWebhook, getWebhooksByWorkspace } from "@/services/webhook.service";

// GET /api/v1/webhooks?workspaceId=... - Retrieve configured webhooks for workspace
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

    const webhooks = await getWebhooksByWorkspace(workspaceId);

    return NextResponse.json({
      success: true,
      data: webhooks,
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

// POST /api/v1/webhooks - Register new outbound webhook endpoint with secretKey
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const rawBody = (await request.json()) as Record<string, unknown>;

    const parsed = createWebhookSchema.safeParse(rawBody);
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

    const webhook = await registerWebhook(parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: webhook,
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
