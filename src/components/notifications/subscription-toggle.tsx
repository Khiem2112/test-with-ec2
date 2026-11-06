"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";
import { useVoter } from "@/context/voter-context";
import type { PostSubscription } from "@/types/notification";

export type SubscriptionToggleProps = {
  postId: string;
  voterProfileId?: string;
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
  const { voter, setIsModalOpen } = useVoter();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(initialIsSubscribed);
  const [notifyEmail, setNotifyEmail] = useState<boolean>(initialNotifyEmail);
  const [notifyInApp, setNotifyInApp] = useState<boolean>(initialNotifyInApp);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeVoterId = voterProfileId ?? voter?.id;

  const handleToggle = async (): Promise<void> => {
    if (!activeVoterId) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    const nextSubscribed = !isSubscribed;

    try {
      if (nextSubscribed) {
        const response = await fetch("/api/v1/notifications/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            voterProfileId: activeVoterId,
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
          `/api/v1/notifications/subscribe?postId=${postId}&voterProfileId=${activeVoterId}`,
          { method: "DELETE" }
        );
        setIsSubscribed(false);
        setShowPreferences(false);
        onSubscriptionChanged?.(null);
      }
    } catch {
      // Background failure fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateChannels = async (email: boolean, inApp: boolean): Promise<void> => {
    if (!activeVoterId) return;

    setNotifyEmail(email);
    setNotifyInApp(inApp);

    try {
      const response = await fetch("/api/v1/notifications/subscribe", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          voterProfileId: activeVoterId,
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
      // Ignore background preference update error
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleToggle}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer",
            isSubscribed
              ? "bg-[#18191a] text-[#828fff] border-[#5e6ad2]/50 hover:bg-[#141516]"
              : "bg-[#141516] text-[#8a8f98] border-[#23252a] hover:text-[#f7f8f8] hover:bg-[#18191a]"
          )}
        >
          {isSubscribed ? "Dang Theo Doi" : "Theo Doi Cap Nhat"}
        </button>

        {isSubscribed && (
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="p-1.5 text-xs text-[#8a8f98] hover:text-[#f7f8f8] border border-[#23252a] bg-[#141516] rounded-md cursor-pointer"
            title="Tuy chon kenh thong bao"
          >
            &#9881;
          </button>
        )}
      </div>

      {showPreferences && isSubscribed && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#23252a] bg-[#0f1011] p-3 shadow-xl z-20 space-y-2">
          <span className="text-[10px] font-bold text-[#62666d] uppercase block">
            Kenh Nhan Thong Bao
          </span>

          <label className="flex items-center gap-2 text-xs text-[#d0d6e0] cursor-pointer">
            <input
              type="checkbox"
              checked={notifyInApp}
              onChange={(e) => handleUpdateChannels(notifyEmail, e.target.checked)}
              className="rounded border-[#23252a] bg-[#141516] text-[#5e6ad2]"
            />
            <span>Thong bao trong ung dung</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-[#d0d6e0] cursor-pointer">
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => handleUpdateChannels(e.target.checked, notifyInApp)}
              className="rounded border-[#23252a] bg-[#141516] text-[#5e6ad2]"
            />
            <span>Thong bao qua Email</span>
          </label>
        </div>
      )}
    </div>
  );
};
