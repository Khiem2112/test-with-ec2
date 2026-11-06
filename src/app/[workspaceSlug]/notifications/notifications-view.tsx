"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useVoter } from "@/context/voter-context";
import type { Notification } from "@/types/notification";

export type NotificationsViewProps = {
  workspaceSlug: string;
};

export const NotificationsView = ({
  workspaceSlug,
}: NotificationsViewProps): React.JSX.Element => {
  const { voter, setIsModalOpen } = useVoter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [filterUnread, setFilterUnread] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userId = voter?.id;

  const loadNotifications = useCallback(async (): Promise<void> => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/notifications${filterUnread ? "?unreadOnly=true" : ""}`,
        {
          headers: { "x-user-id": userId },
        }
      );
      const result = (await response.json()) as {
        success: boolean;
        data?: { unreadCount: number; notifications: Notification[] };
      };

      if (response.ok && result.success && result.data) {
        setNotifications(result.data.notifications);
        setUnreadCount(result.data.unreadCount);
      }
    } catch {
      // Fallback on notification load error
    } finally {
      setIsLoading(false);
    }
  }, [userId, filterUnread]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (id: string): Promise<void> => {
    if (!userId) return;

    try {
      await fetch(`/api/v1/notifications/${id}/read`, {
        method: "PATCH",
        headers: { "x-user-id": userId },
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Fallback
    }
  };

  const handleMarkAllAsRead = async (): Promise<void> => {
    if (!userId) return;

    try {
      await fetch("/api/v1/notifications/read-all", {
        method: "POST",
        headers: { "x-user-id": userId },
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-[#8a8f98]">
        <Link href={`/${workspaceSlug}`} className="hover:text-[#f7f8f8] transition-colors">
          Trang Chu
        </Link>
        <span>/</span>
        <span className="text-[#62666d]">Thong Bao</span>
      </div>

      {!userId ? (
        <div className="rounded-xl border border-[#23252a] bg-[#0f1011] p-12 text-center space-y-4">
          <h2 className="text-base font-semibold text-[#f7f8f8]">
            Chua Xac Dinh Danh Tinh Nguoi Dung
          </h2>
          <p className="text-xs text-[#8a8f98] max-w-md mx-auto">
            Vui long xac nhan dinh danh hoac dang nhap de xem hop thu thong bao ve cac chu de ban dang theo doi.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-md text-xs font-semibold cursor-pointer transition-colors"
          >
            Xac Thuc Dinh Danh
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#f7f8f8]">
                Hop Thu Thong Bao
              </h1>
              <p className="text-xs text-[#8a8f98] mt-1">
                Cap nhat trang thai, phan hoi chinh thuc va thong bao tinh nang moi ban dang theo doi.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterUnread(!filterUnread)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer",
                  filterUnread
                    ? "bg-[#18191a] text-[#828fff] border-[#5e6ad2]/40"
                    : "bg-[#141516] text-[#8a8f98] border-[#23252a] hover:text-[#f7f8f8]"
                )}
              >
                {filterUnread ? "Hien Thi Tat Ca" : `Chua Doc (${unreadCount})`}
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1.5 rounded-md text-xs font-medium border border-[#23252a] bg-[#141516] text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a] cursor-pointer transition-colors"
                >
                  Danh Dau Tat Ca Da Doc
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-xs text-[#8a8f98]">
              Dang tai thong bao...
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-xl border border-[#23252a] bg-[#0f1011] p-12 text-center">
              <p className="text-sm text-[#8a8f98]">
                {filterUnread
                  ? "Khong co thong bao chua doc nao."
                  : "Ban chua co thong bao nao."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 rounded-xl border flex items-start justify-between gap-4 transition-colors",
                    notification.isRead
                      ? "bg-[#0f1011] border-[#23252a]"
                      : "bg-[#141516] border-[#34343a]"
                  )}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#828fff] uppercase bg-[#5e6ad2]/10 px-2 py-0.5 rounded border border-[#5e6ad2]/20">
                        {notification.type}
                      </span>
                      {!notification.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#5e6ad2]" />
                      )}
                      <span className="text-[11px] text-[#62666d]">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-[#f7f8f8]">
                      {notification.title}
                    </h3>
                    <p className="text-xs text-[#8a8f98] leading-relaxed">
                      {notification.message}
                    </p>

                    {notification.actionUrl && (
                      <div className="pt-1">
                        <Link
                          href={notification.actionUrl}
                          className="text-xs text-[#5e6ad2] hover:text-[#828fff] underline"
                        >
                          Xem chi tiet &rarr;
                        </Link>
                      </div>
                    )}
                  </div>

                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-[11px] text-[#8a8f98] hover:text-[#f7f8f8] whitespace-nowrap cursor-pointer px-2 py-1"
                    >
                      Da doc
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
