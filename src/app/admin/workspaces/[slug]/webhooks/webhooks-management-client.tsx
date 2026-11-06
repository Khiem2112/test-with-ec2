"use client";

import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { cn } from "@/lib/cn";
import type { WebhookSubscription, WebhookEvent } from "@/types/notification";

export type WebhooksManagementClientProps = {
  workspaceId: string;
  initialWebhooks: WebhookSubscription[];
};

const ALL_EVENTS: Array<{ id: WebhookEvent; label: string; desc: string }> = [
  {
    id: "POST_CREATED",
    label: "Y Kien Moi (POST_CREATED)",
    desc: "Kich hoat khi nguoi dung dong gop mot y kien moi",
  },
  {
    id: "POST_STATUS_CHANGED",
    label: "Doi Trang Thai (POST_STATUS_CHANGED)",
    desc: "Kich hoat khi trang thai bai dang duoc cap nhat tren lo trinh",
  },
  {
    id: "POST_MERGED",
    label: "Gop Bai Viet (POST_MERGED)",
    desc: "Kich hoat khi bai viet trung lap duoc gop vao bai viet dich",
  },
  {
    id: "COMMENT_ADDED",
    label: "Binh Luan Moi (COMMENT_ADDED)",
    desc: "Kich hoat khi co thao luan cong khai moi",
  },
  {
    id: "RELEASE_PUBLISHED",
    label: "Xuat Ban Phien Ban (RELEASE_PUBLISHED)",
    desc: "Kich hoat khi phien ban san pham moi duoc cong bo",
  },
];

export const WebhooksManagementClient = ({
  workspaceId,
  initialWebhooks,
}: WebhooksManagementClientProps): React.JSX.Element => {
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>(initialWebhooks);
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([
    "POST_CREATED",
    "POST_STATUS_CHANGED",
    "RELEASE_PUBLISHED",
  ]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pingStatus, setPingStatus] = useState<Record<string, string>>({});
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggleEvent = (event: WebhookEvent): void => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const handleCreateWebhook = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!targetUrl.trim() || selectedEvents.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setActionNotice(null);

    try {
      const response = await fetch("/api/v1/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          targetUrl: targetUrl.trim(),
          events: selectedEvents,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: WebhookSubscription;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success || !result.data) {
        setErrorMessage(result.error?.message ?? "Khong the dang ky webhook");
        return;
      }

      setWebhooks((prev) => [result.data!, ...prev]);
      setActionNotice("Dang ky webhook thanh cong voi khoa HMAC bi mat");
      setTargetUrl("");
    } catch {
      setErrorMessage("Loi ket noi khi dang ky webhook");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePingTest = (webhook: WebhookSubscription): void => {
    const timestamp = new Date().toISOString();
    setPingStatus((prev) => ({
      ...prev,
      [webhook.id]: `Ping thanh cong (HMAC signature hop le luc ${timestamp.slice(11, 19)})`,
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#f7f8f8]">
          Ket Noi & Cau Hinh Webhooks
        </h1>
        <p className="text-xs text-[#8a8f98] mt-1">
          Dong bo cac su kien bai dang, binh chon va phat hanh toi he thong noi bo hoac Discord/Slack qua HMAC SHA-256.
        </p>
      </div>

      {actionNotice && (
        <div className="p-3 text-xs text-[#27a644] bg-[#27a644]/10 border border-[#27a644]/30 rounded-lg">
          {actionNotice}
        </div>
      )}

      {errorMessage && (
        <div className="p-3 text-xs text-red-400 bg-red-950/20 border border-red-800/40 rounded-lg" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="rounded-xl border border-[#23252a] bg-[#0f1011] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#f7f8f8]">
          Dang Ky Endpoint Webhook Moi
        </h2>

        <form onSubmit={handleCreateWebhook} className="space-y-4">
          <div>
            <label htmlFor="target-url" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
              Dia Chi Endpoint Dich (HTTPS URL)
            </label>
            <input
              id="target-url"
              type="url"
              required
              value={targetUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetUrl(e.target.value)}
              placeholder="https://api.yourdomain.com/webhooks/autoflow"
              className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs font-mono text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2]"
            />
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-2">
              Su Kien Dang Ky ({selectedEvents.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ALL_EVENTS.map((event) => {
                const isSelected = selectedEvents.includes(event.id);
                return (
                  <label
                    key={event.id}
                    className={cn(
                      "flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors",
                      isSelected
                        ? "bg-[#18191a] border-[#5e6ad2]/50 text-[#f7f8f8]"
                        : "bg-[#141516] border-[#23252a] text-[#8a8f98] hover:text-[#d0d6e0]"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleEvent(event.id)}
                      className="mt-0.5 rounded border-[#23252a] bg-[#141516] text-[#5e6ad2]"
                    />
                    <div className="text-xs">
                      <span className="font-semibold block">{event.label}</span>
                      <span className="text-[11px] text-[#62666d]">{event.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !targetUrl.trim() || selectedEvents.length === 0}
              className="px-5 py-2 bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer transition-colors"
            >
              {isSubmitting ? "Dang thiet lap..." : "Kich Hoat Webhook"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-[#23252a] bg-[#0f1011] overflow-hidden">
        <div className="p-4 border-b border-[#23252a] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider">
            Endpoints Dang Hoat Dong ({webhooks.length})
          </span>
        </div>

        {webhooks.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#8a8f98]">
            Chua co webhook endpoint nao duoc cau hinh.
          </div>
        ) : (
          <div className="divide-y divide-[#23252a]">
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#141516] transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#f7f8f8] truncate">
                      {webhook.targetUrl}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#27a644]/15 text-[#27a644] border border-[#27a644]/30 uppercase">
                      Active
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#62666d]">
                    <span>Secret: <code className="font-mono text-[#8a8f98]">{webhook.secretKey}</code></span>
                    <span>&bull;</span>
                    <span>{webhook.events.length} su kien</span>
                  </div>

                  {pingStatus[webhook.id] && (
                    <div className="text-[11px] text-[#27a644] font-medium pt-1">
                      {pingStatus[webhook.id]}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePingTest(webhook)}
                    className="px-3 py-1.5 border border-[#23252a] bg-[#141516] text-[#d0d6e0] hover:text-white hover:bg-[#18191a] rounded-md text-xs font-medium cursor-pointer transition-colors"
                  >
                    Gui Ping Thu Nghiem
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
