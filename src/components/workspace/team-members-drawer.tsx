"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import type { WorkspaceMember, WorkspaceRole } from "@/types/workspace";

export type TeamMembersDrawerProps = {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
  initialMembers?: WorkspaceMember[];
  className?: string;
};

export const TeamMembersDrawer = ({
  workspaceId,
  isOpen,
  onClose,
  initialMembers = [],
  className,
}: TeamMembersDrawerProps): React.JSX.Element | null => {
  const [members, setMembers] = useState<WorkspaceMember[]>(initialMembers);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<WorkspaceRole>("DEVELOPER");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleInvite = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/v1/workspaces/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          email,
          role,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: WorkspaceMember;
        error?: { code: string; message: string };
      };

      if (!response.ok || !result.success) {
        setErrorMessage(result.error?.message ?? "Moi thanh vien that bai");
        return;
      }

      if (result.data) {
        setMembers((prev) => [...prev, result.data!]);
        setSuccessMessage(`Da gui loi moi toi ${email}`);
        setEmail("");
      }
    } catch {
      setErrorMessage("Loi ket noi khi gui loi moi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className={cn("w-full max-w-md bg-white h-full shadow-xl flex flex-col p-6 overflow-y-auto", className)}>
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Quan Ly Thanh Vien Noi Bo</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm font-semibold px-2 py-1 border border-gray-300 rounded cursor-pointer"
          >
            Dong
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 text-sm text-red-700 bg-red-50 border border-red-300 rounded" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 text-sm text-green-700 bg-green-50 border border-green-300 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleInvite} className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">Moi Thanh Vien Vao Workspace</h3>
          <div>
            <label htmlFor="member-email" className="block text-xs font-medium text-gray-700">
              Email Thanh Vien
            </label>
            <input
              id="member-email"
              type="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="nhansu@congty.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label htmlFor="member-role" className="block text-xs font-medium text-gray-700">
              Vai Tro (RBAC)
            </label>
            <select
              id="member-role"
              value={role}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as WorkspaceRole)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
            >
              <option value="ADMIN">Quan Tri Vien (Admin)</option>
              <option value="PRODUCT_MANAGER">Quan Ly San Pham (Product Manager)</option>
              <option value="DEVELOPER">Lap Trinh Vien (Developer)</option>
              <option value="MODERATOR">Kiem Duyet Vien (Moderator)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Dang xu ly..." : "Gui Loi Moi"}
          </button>
        </form>

        <div className="mt-8 flex-1">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Danh Sach Thanh Vien ({members.length})</h3>
          {members.length === 0 ? (
            <p className="text-xs text-gray-500 italic">Chua co thanh vien nao khac trong workspace.</p>
          ) : (
            <div className="divide-y divide-gray-200 border border-gray-200 rounded">
              {members.map((member) => (
                <div key={member.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-gray-800">{member.userId}</span>
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-gray-600 uppercase font-semibold">
                      {member.role}
                    </span>
                  </div>
                  <span className="text-gray-400">{member.isActive ? "Hoat dong" : "Ngung"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
