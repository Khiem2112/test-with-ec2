"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import type { Notification } from "@/types/notification";

export type NotificationBellProps = {
  userId: string;
  initialUnreadCount?: number;
  initialNotifications?: Notification[];
  className?: string;
};

export const NotificationBell = ({
  userId,
  initialUnreadCount = 0,
  initialNotifications = [],
  className,
}: NotificationBellProps): React.JSX.Element => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRecent = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/notifications", {
        headers: { "x-user-id": userId },
      });
      const result = (await response.json()) as {
        success: boolean;
        data?: { unreadCount: number; notifications: Notification[] };
      };

      if (response.ok && result.success && result.data) {
        setUnreadCount(result.data.unreadCount);
        setNotifications(result.data.notifications);
      }
    } catch {
      // Silent error on background poll
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (): void => {
    if (!isOpen) {
      void fetchRecent();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAllRead = async (): Promise<void> => {
    try {
      await fetch("/api/v1/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ markAll: true }),
      });

      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Ignore
    }
  };

  const handleItemClick = async (notif: Notification): Promise<void> => {
    if (!notif.isRead) {
      try {
        await fetch("/api/v1/notifications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
          body: JSON.stringify({ notificationId: notif.id }),
        });

        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
        );
      } catch {
        // Ignore
      }
    }

    setIsOpen(false);
    if (notif.actionUrl) {
      router.push(notif.actionUrl);
    }
  };

  return (
    <div className={cn("relative inline-block text-left", className)}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer shadow-2xs flex items-center gap-1.5"
      >
        <span>THONG BAO</span>
        {unreadCount > 0 && (
          <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px] font-extrabold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Flyout Dropdown */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black/5 z-50 divide-y divide-gray-100 border border-gray-200">
          <div className="p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 uppercase">
              Thong Bao Cua Ban
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Da doc tat ca
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-gray-400">Dang tai...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400">
                Chua co thong bao nao
              </div>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  onClick={() => void handleItemClick(n)}
                  className={cn(
                    "p-3 text-xs cursor-pointer hover:bg-gray-50 transition-colors",
                    !n.isRead && "bg-blue-50/60 font-semibold",
                  )}
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-0.5">
                    <span className="uppercase font-bold tracking-wide text-blue-700">
                      {n.type}
                    </span>
                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-gray-900 text-xs font-bold">{n.title}</h4>
                  <p className="text-gray-600 line-clamp-2 mt-0.5 font-normal">
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
