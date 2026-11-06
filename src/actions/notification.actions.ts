"use server";

import type { ApiResponse } from "@/types";
import type {
  Notification,
  PostSubscription,
  WebhookSubscription,
} from "@/types/notification";
import {
  toggleSubscriptionSchema,
  type ToggleSubscriptionSchemaInput,
} from "@/schemas/notification.schema";
import {
  createWebhookSchema,
  type CreateWebhookSchemaInput,
} from "@/schemas/webhook.schema";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notification.service";
import { subscribeToPost } from "@/services/subscription.service";
import { registerWebhook } from "@/services/webhook.service";

// Server action marking single notification as read
export const markNotificationReadAction = async (
  notificationId: string,
  userId: string,
): Promise<ApiResponse<Notification>> => {
  try {
    const updated = await markNotificationAsRead(notificationId, userId);
    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the danh dau da doc";
    return {
      success: false,
      error: {
        code: "MARK_READ_FAILED",
        message,
      },
    };
  }
};

// Server action marking all unread notifications as read
export const markAllNotificationsReadAction = async (
  userId: string,
): Promise<ApiResponse<{ count: number }>> => {
  try {
    const count = await markAllNotificationsAsRead(userId);
    return {
      success: true,
      data: { count },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the danh dau tat ca da doc";
    return {
      success: false,
      error: {
        code: "MARK_ALL_READ_FAILED",
        message,
      },
    };
  }
};

// Server action updating post subscription channel preferences
export const toggleSubscriptionAction = async (
  input: ToggleSubscriptionSchemaInput,
): Promise<ApiResponse<PostSubscription>> => {
  try {
    const validated = toggleSubscriptionSchema.parse(input);
    const sub = await subscribeToPost({
      postId: validated.postId,
      voterProfileId: validated.voterProfileId,
      notifyEmail: validated.notifyEmail,
      notifyInApp: validated.notifyInApp,
    });
    return {
      success: true,
      data: sub,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Cap nhat dang ky theo doi that bai";
    return {
      success: false,
      error: {
        code: "SUBSCRIPTION_UPDATE_FAILED",
        message,
      },
    };
  }
};

// Server action registering outbound webhook
export const registerWebhookAction = async (
  input: CreateWebhookSchemaInput,
): Promise<ApiResponse<WebhookSubscription>> => {
  try {
    const validated = createWebhookSchema.parse(input);
    const webhook = await registerWebhook(validated);
    return {
      success: true,
      data: webhook,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Dang ky webhook that bai";
    return {
      success: false,
      error: {
        code: "WEBHOOK_REGISTRATION_FAILED",
        message,
      },
    };
  }
};
