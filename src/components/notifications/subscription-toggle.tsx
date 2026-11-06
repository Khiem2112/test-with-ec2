"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";
import type { PostSubscription } from "@/types/notification";

export type SubscriptionToggleProps = {
  postId: string;
  voterProfileId: string;
  initialIsSubscribed?: boolean;
  initialNotifyEmail?: boolean;
  initialNotifyInApp?: boolean;
  onSubscriptionChanged?: (sub: PostSubscription | null) => void;
  className?: string;
};

export const SubscriptionToggle = ({
  postId,
  voterProfileId,
  initialIsSubscribed = false,
  initialNotifyEmail = true,
  initialNotifyInApp = true,
  onSubscriptionChanged,
  className,
}: SubscriptionToggleProps): React.JSX.Element => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(initialIsSubscribed);
  const [notifyEmail, setNotifyEmail] = useState<boolean>(initialNotifyEmail);
  const [notifyInApp, setNotifyInApp] = useState<boolean>(initialNotifyInApp);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleToggle = async (): Promise<void> => {
    setIsLoading(true);
    const nextSubscribed = !isSubscribed;

    try {
      if (nextSubscribed) {
        const response = await fetch("/api/v1/notifications/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            voterProfileId,
            notifyEmail,
            notifyInApp,
          }),
        });

        const result = (await response.json()) as {
          success: boolean;
          data?: PostSubscription;
        };

        if (response.ok && result.success && result.data) {
          setIsSubscribed(true);
          onSubscriptionChanged?.(result.data);
        }
      } else {
        await fetch(
          `/api/v1/notifications/subscribe?postId=${postId}&voterProfileId=${voterProfileId}`,
          { method: "DELETE" },
        );
        setIsSubscribed(false);
        setShowPreferences(false);
        onSubscriptionChanged?.(null);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateChannels = async (email: boolean, inApp: boolean): Promise<void> => {
    setNotifyEmail(email);
    setNotifyInApp(inApp);

    try {
      const response = await fetch("/api/v1/notifications/subscribe", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          voterProfileId,
          notifyEmail: email,
          notifyInApp: inApp,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: PostSubscription;
      };

      if (response.ok && result.success && result.data) {
        onSubscriptionChanged?.(result.data);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div className="inline-flex rounded-md shadow-2xs">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleToggle}
          className={cn(
            "px-3 py-1.5 text-xs font-bold rounded-l border cursor-pointer transition-colors",
            isSubscribed
              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
          )}
        >
          {isLoading
            ? "Dang xu ly..."
            : isSubscribed
              ? "Dang Theo Doi"
              : "Theo Doi"}
        </button>

        {isSubscribed && (
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-2 py-1.5 text-xs font-semibold bg-blue-700 text-white border-l border-blue-500 rounded-r hover:bg-blue-800 cursor-pointer"
          >
            Kenh
          </button>
        )}
      </div>

      {showPreferences && isSubscribed && (
        <div className="origin-top-right absolute right-0 mt-2 w-64 p-3 rounded-md shadow-lg bg-white ring-1 ring-black/5 z-50 border border-gray-200 text-xs space-y-2">
          <span className="font-bold text-gray-800 uppercase block text-[10px]">
            Kenh Thong Bao Tien Do
          </span>

          <label className="flex items-center gap-2 cursor-pointer text-gray-700">
            <input
              type="checkbox"
              checked={notifyInApp}
              onChange={(e) => void handleUpdateChannels(notifyEmail, e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            Trong ung dung (In-App)
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-gray-700">
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => void handleUpdateChannels(e.target.checked, notifyInApp)}
              className="rounded border-gray-300 text-blue-600"
            />
            Hop thu dien tu (Email)
          </label>
        </div>
      )}
    </div>
  );
};
