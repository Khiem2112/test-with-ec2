"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import type { Workspace } from "@/types/workspace";

export type WorkspaceOnboardingFormProps = {
  onSuccess?: (workspace: Workspace) => void;
  className?: string;
};

// Generate kebab-case slug from string safely
const formatKebabSlug = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const WorkspaceOnboardingForm = ({
  onSuccess,
  className,
}: WorkspaceOnboardingFormProps): React.JSX.Element => {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [customDomain, setCustomDomain] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("#10B981");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<Workspace | null>(null);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextName = event.target.value;
    setName(nextName);
    setSlug(formatKebabSlug(nextName));
  };

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSlug(formatKebabSlug(event.target.value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/v1/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          customDomain: customDomain ? customDomain : null,
          brandingConfig: {
            primaryColor,
            logoUrl: logoUrl ? logoUrl : undefined,
          },
          isPublicPortal: true,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: Workspace;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success) {
        setErrorMessage(
          result.error?.message ?? "Duong dan dinh danh da duoc su dung, vui long chon ten khac",
        );
        return;
      }

      if (result.data) {
        setSuccessData(result.data);
        onSuccess?.(result.data);
      }
    } catch {
      setErrorMessage("Loi ket noi den he thong, vui long thu lai sau");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm", className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Tao Khong Gian Lam Viec</h2>
        <p className="text-sm text-gray-600">
          Thiet lap cong thong tin thu thap phan hoi va cong bo lo trinh tinh nang cho san pham cua ban.
        </p>

        {errorMessage && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-300 rounded" role="alert">
            {errorMessage}
          </div>
        )}

        {successData && (
          <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-300 rounded">
            Khong gian lam viec da duoc tao thanh cong: {successData.name} ({successData.slug})
          </div>
        )}

        <div>
          <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700">
            Ten To Chuc / San Pham
          </label>
          <input
            id="workspace-name"
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            placeholder="Vi du: RoadmapHub SaaS"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <label htmlFor="workspace-slug" className="block text-sm font-medium text-gray-700">
            Duong Dan Dinh Danh (Slug)
          </label>
          <input
            id="workspace-slug"
            type="text"
            required
            value={slug}
            onChange={handleSlugChange}
            placeholder="vi-du-roadnaphub"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
          />
        </div>

        <div>
          <label htmlFor="custom-domain" className="block text-sm font-medium text-gray-700">
            Ten Mien Rieng (Tuy chon)
          </label>
          <input
            id="custom-domain"
            type="text"
            value={customDomain}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomDomain(e.target.value)}
            placeholder="feedback.yourcompany.com"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700">
              Mau Chu Dao
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                id="primary-color"
                type="color"
                value={primaryColor}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPrimaryColor(e.target.value)}
                className="block w-full px-2 py-1 border border-gray-300 rounded text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label htmlFor="logo-url" className="block text-sm font-medium text-gray-700">
              URL Logo
            </label>
            <input
              id="logo-url"
              type="url"
              value={logoUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !name || !slug}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Dang khoi tao..." : "Tao Khong Gian Lam Viec"}
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Xem Truoc Giao Dien</h3>
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-inner">
          <div
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center space-x-3">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded object-cover" />
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center font-bold text-xs">
                  {name ? name.substring(0, 2).toUpperCase() : "WS"}
                </div>
              )}
              <span className="font-semibold text-lg">{name ? name : "Ten San Pham"}</span>
            </div>
            <span className="text-xs px-2 py-1 bg-white/20 rounded">Cong Khai</span>
          </div>

          <div className="p-4 bg-gray-50 min-h-[160px] space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="mt-4 p-3 bg-white border border-gray-200 rounded text-xs text-gray-500">
              Duong dan truy cap: https://roadnaphub.internal/{slug || "slug-mau"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
