import { NextResponse, type NextRequest } from "next/server";
import {
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notification.service";

// GET /api/v1/notifications - Retrieve user in-app notifications
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const userId = request.headers.get("x-user-id");
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Header x-user-id la bat buoc",
          },
        },
        { status: 401 },
      );
    }

    const result = await getNotificationsByUser(userId, unreadOnly);

    return NextResponse.json({
      success: true,
      data: result,
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

// PATCH /api/v1/notifications - Mark single or all notifications as read
export const PATCH = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Header x-user-id la bat buoc",
          },
        },
        { status: 401 },
      );
    }

    const rawBody = (await request.json()) as {
      notificationId?: string;
      markAll?: boolean;
    };

    if (rawBody.markAll) {
      const count = await markAllNotificationsAsRead(userId);
      return NextResponse.json({
        success: true,
        data: { updatedCount: count },
      });
    }

    if (rawBody.notificationId) {
      const updated = await markNotificationAsRead(rawBody.notificationId, userId);
      return NextResponse.json({
        success: true,
        data: updated,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_PARAMETERS",
          message: "notificationId hoac markAll la bat buoc",
        },
      },
      { status: 400 },
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
