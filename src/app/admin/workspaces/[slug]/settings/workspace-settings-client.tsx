"use client";

import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { updateWorkspaceBrandingAction } from "@/actions/workspace.actions";
import type { Workspace } from "@/types/workspace";

export type WorkspaceSettingsClientProps = {
  workspace: Workspace;
};

export const WorkspaceSettingsClient = ({
  workspace,
}: WorkspaceSettingsClientProps): React.JSX.Element => {
  const [customDomain, setCustomDomain] = useState<string>(workspace.customDomain ?? "");
  const [primaryColor, setPrimaryColor] = useState<string>(
    workspace.brandingConfig.primaryColor ?? "#5e6ad2"
  );
  const [isPublicPortal, setIsPublicPortal] = useState<boolean>(workspace.isPublicPortal);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await updateWorkspaceBrandingAction(
        {
          workspaceId: workspace.id,
          customDomain: customDomain.trim() ? customDomain.trim() : null,
          brandingConfig: {
            ...workspace.brandingConfig,
            primaryColor,
          },
        },
        "OWNER"
      );

      if (!result.success) {
        setErrorMessage(result.error?.message ?? "Cap nhat cai dat that bai");
        return;
      }

      setSuccessMessage("Da luu thiet lap khong gian thanh cong");
    } catch {
      setErrorMessage("Loi ket noi khi cap nhat thiet lap");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {successMessage && (
        <div className="p-3 text-xs text-[#27a644] bg-[#27a644]/10 border border-[#27a644]/30 rounded-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-3 text-xs text-red-400 bg-red-950/20 border border-red-800/40 rounded-lg" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="rounded-xl border border-[#23252a] bg-[#0f1011] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#f7f8f8]">
          Thong Tin Khong Gian Lam Viec
        </h2>

        <div>
          <label className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
            Ten Khong Gian
          </label>
          <input
            type="text"
            disabled
            value={workspace.name}
            className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#8a8f98] cursor-not-allowed"
          />
          <p className="text-[11px] text-[#62666d] mt-1">
            Dinh danh duy nhat: /{workspace.slug}
          </p>
        </div>

        <div>
          <label htmlFor="custom-domain" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
            Ten Mien Tuy Chinh (Custom Domain)
          </label>
          <input
            id="custom-domain"
            type="text"
            value={customDomain}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomDomain(e.target.value)}
            placeholder="feedback.yourdomain.com"
            className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2]"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#23252a] bg-[#0f1011] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#f7f8f8]">
          Nhan Dien Thuong Hieu
        </h2>

        <div>
          <label htmlFor="primary-color" className="block text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
            Mau Sac Chu Dao (Accent Color)
          </label>
          <div className="flex items-center gap-3">
            <input
              id="primary-color"
              type="color"
              value={primaryColor}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPrimaryColor(e.target.value)}
              className="h-8 w-10 bg-transparent cursor-pointer rounded border border-[#23252a]"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPrimaryColor(e.target.value)}
              className="w-32 px-3 py-1.5 bg-[#141516] border border-[#23252a] rounded-lg text-xs font-mono text-[#f7f8f8]"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 text-xs text-[#d0d6e0] cursor-pointer">
            <input
              type="checkbox"
              checked={isPublicPortal}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setIsPublicPortal(e.target.checked)}
              className="rounded border-[#23252a] bg-[#141516] text-[#5e6ad2]"
            />
            <span>Cho phep cong khai Cong Thong Tin (Public Portal)</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2 bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors"
        >
          {isSaving ? "Dang luu..." : "Luu Thay Doi"}
        </button>
      </div>
    </form>
  );
};
