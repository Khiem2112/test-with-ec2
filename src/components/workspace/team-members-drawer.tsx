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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
      <div className={cn("w-full max-w-md bg-[#0f1011] border-l border-[#23252a] h-full shadow-2xl flex flex-col p-6 overflow-y-auto text-[#f7f8f8]", className)}>
        <div className="flex items-center justify-between pb-4 border-b border-[#23252a]">
          <h2 className="text-base font-bold text-[#f7f8f8]">Quan Ly Thanh Vien Noi Bo</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8a8f98] hover:text-[#f7f8f8] text-xs font-semibold px-2 py-1 border border-[#23252a] rounded-md cursor-pointer transition-colors"
          >
            Dong
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 text-xs text-red-400 bg-red-950/20 border border-red-800/40 rounded-lg" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 text-xs text-[#27a644] bg-[#27a644]/10 border border-[#27a644]/30 rounded-lg">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleInvite} className="mt-6 space-y-4">
          <h3 className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider">
            Moi Thanh Vien Vao Workspace
          </h3>
          <div>
            <label htmlFor="member-email" className="block text-[11px] font-medium text-[#8a8f98] mb-1">
              Email Thanh Vien
            </label>
            <input
              id="member-email"
              type="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="nhansu@congty.com"
              className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2]"
            />
          </div>

          <div>
            <label htmlFor="member-role" className="block text-[11px] font-medium text-[#8a8f98] mb-1">
              Vai Tro (RBAC)
            </label>
            <select
              id="member-role"
              value={role}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as WorkspaceRole)}
              className="block w-full px-3 py-2 bg-[#141516] border border-[#23252a] rounded-lg text-xs text-[#f7f8f8] focus:outline-hidden focus:border-[#5e6ad2]"
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
            className="w-full py-2 px-4 bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer transition-colors"
          >
            {isLoading ? "Dang xu ly..." : "Gui Loi Moi"}
          </button>
        </form>

        <div className="mt-8 flex-1">
          <h3 className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-3">
            Danh Sach Thanh Vien ({members.length})
          </h3>
          {members.length === 0 ? (
            <p className="text-xs text-[#62666d] italic">Chua co thanh vien nao khac trong workspace.</p>
          ) : (
            <div className="divide-y divide-[#23252a] border border-[#23252a] rounded-xl bg-[#141516]">
              {members.map((member) => (
                <div key={member.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-[#f7f8f8]">{member.userId}</span>
                    <span className="ml-2 px-2 py-0.5 bg-[#18191a] text-[#828fff] border border-[#23252a] rounded text-[10px] uppercase font-semibold">
                      {member.role}
                    </span>
                  </div>
                  <span className="text-[#62666d] text-[11px]">{member.isActive ? "Hoat dong" : "Ngung"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
