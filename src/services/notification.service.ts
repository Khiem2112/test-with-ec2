import { prisma } from "@/lib/prisma";
import type {
  Notification,
  CreateNotificationInput,
} from "@/types/notification";

// Map Prisma notification record to domain model
const mapNotificationRecord = (record: {
  id: string;
  userId: string;
  type: "STATUS_CHANGED" | "NEW_COMMENT" | "OFFICIAL_RESPONSE" | "FEATURE_RELEASED" | "MENTIONED";
  title: string;
  message: string;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: Date;
}): Notification => {
  return {
    id: record.id,
    userId: record.userId,
    type: record.type,
    title: record.title,
    message: record.message,
    actionUrl: record.actionUrl,
    isRead: record.isRead,
    createdAt: record.createdAt,
  };
};

// Create a new in-app notification entry
export const createNotification = async (
  input: CreateNotificationInput,
): Promise<Notification> => {
  const record = await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      actionUrl: input.actionUrl ?? null,
    },
  });

  return mapNotificationRecord(record);
};

// Retrieve in-app notifications for user with unread counter
export const getNotificationsByUser = async (
  userId: string,
  unreadOnly: boolean = false,
): Promise<{ unreadCount: number; notifications: Notification[] }> => {
  const [unreadCount, records] = await Promise.all([
    prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    }),
    prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { isRead: false } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    }),
  ]);

  return {
    unreadCount,
    notifications: records.map(mapNotificationRecord),
  };
};

// Mark single notification as read
export const markNotificationAsRead = async (
  id: string,
  userId: string,
): Promise<Notification> => {
  const record = await prisma.notification.update({
    where: {
      id,
      userId,
    },
    data: {
      isRead: true,
    },
  });

  return mapNotificationRecord(record);
};

// Mark all unread notifications as read for a user
export const markAllNotificationsAsRead = async (
  userId: string,
): Promise<number> => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return result.count;
};
