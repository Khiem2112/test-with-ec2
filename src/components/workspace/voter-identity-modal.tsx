"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import type { VoterProfile, VoterAuthType } from "@/types/workspace";

export type VoterIdentityModalProps = {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
  onIdentified: (profile: VoterProfile) => void;
  className?: string;
};

export const VoterIdentityModal = ({
  workspaceId,
  isOpen,
  onClose,
  onIdentified,
  className,
}: VoterIdentityModalProps): React.JSX.Element | null => {
  const [authMode, setAuthMode] = useState<"registered" | "anonymous">("registered");
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const authType: VoterAuthType =
      authMode === "registered" ? "REGISTERED" : "ANONYMOUS_FINGERPRINT";

    const fingerprintHash =
      authMode === "anonymous"
        ? `fp-${Math.random().toString(36).substring(2, 15)}`
        : undefined;

    try {
      const response = await fetch("/api/v1/voter-profiles/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          authType,
          displayName: displayName || (authMode === "anonymous" ? "Khach An Danh" : "Nguoi Dung"),
          email: authMode === "registered" && email ? email : undefined,
          fingerprintHash,
          customerTier: "standard",
          voteWeight: 1.0,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: VoterProfile;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success || !result.data) {
        setErrorMessage(result.error?.message ?? "Xac thuc dinh danh that bai");
        return;
      }

      onIdentified(result.data);
      onClose();
    } catch {
      setErrorMessage("Loi ket noi den he thong dinh danh");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={cn("w-full max-w-md bg-white rounded-lg shadow-xl p-6", className)}>
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Xac Nhan Dinh Danh Binh Chon</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold px-2 py-1"
          >
            Dong
          </button>
        </div>

        <p className="mt-3 text-xs text-gray-600">
          Vui long xac nhan dinh danh de thuc hien bo phieu hoac tham gia thao luan cong dong.
        </p>

        {errorMessage && (
          <div className="mt-3 p-3 text-xs text-red-700 bg-red-50 border border-red-300 rounded" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="flex border-b border-gray-200 mt-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setAuthMode("registered")}
            className={cn(
              "py-2 px-4 cursor-pointer border-b-2 font-semibold",
              authMode === "registered"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            Tai Khoan / Email
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("anonymous")}
            className={cn(
              "py-2 px-4 cursor-pointer border-b-2 font-semibold",
              authMode === "anonymous"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            Khach An Danh
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="voter-name" className="block text-xs font-medium text-gray-700">
              Ten Hien Thi
            </label>
            <input
              id="voter-name"
              type="text"
              required
              value={displayName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
              placeholder="Nguyen Van A"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>

          {authMode === "registered" && (
            <div>
              <label htmlFor="voter-email" className="block text-xs font-medium text-gray-700">
                Email
              </label>
              <input
                id="voter-email"
                type="email"
                required
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="nguyenvana@example.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
            >
              Huy
            </button>
            <button
              type="submit"
              disabled={isLoading || !displayName}
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Dang xac nhan..." : "Xac Nhan Dinh Danh"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
