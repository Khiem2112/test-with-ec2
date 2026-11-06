"use client";

import React, { useState } from "react";
import { TeamMembersDrawer } from "@/components/workspace/team-members-drawer";
import type { WorkspaceMember } from "@/types/workspace";

export type WorkspaceMembersClientProps = {
  workspaceId: string;
  initialMembers: WorkspaceMember[];
};

export const WorkspaceMembersClient = ({
  workspaceId,
  initialMembers,
}: WorkspaceMembersClientProps): React.JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [members] = useState<WorkspaceMember[]>(initialMembers);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f7f8f8]">
            Thanh Vien & Phan Quyen (RBAC)
          </h1>
          <p className="text-xs text-[#8a8f98] mt-1">
            Quan ly vai tro quan tri, quan ly san pham, kiem duyet va ky su phat trien.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="px-4 py-2 bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors self-start sm:self-auto"
        >
          Moi Thanh Vien Moi
        </button>
      </div>

      <div className="rounded-xl border border-[#23252a] bg-[#0f1011] overflow-hidden">
        <div className="p-4 border-b border-[#23252a] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#8a8f98] uppercase tracking-wider">
            Thanh Vien Hien Tai ({members.length})
          </span>
        </div>

        {members.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#8a8f98]">
            Chua co thanh vien nao trong khong gian lam viec nay.
          </div>
        ) : (
          <div className="divide-y divide-[#23252a]">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-4 flex items-center justify-between hover:bg-[#141516] transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#f7f8f8]">
                      {member.userId}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#18191a] text-[#828fff] border border-[#23252a] uppercase">
                      {member.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#62666d]">
                    Gia nhap: {new Date(member.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#27a644]/10 px-2 py-0.5 text-[11px] font-medium text-[#27a644]">
                  {member.isActive ? "Hoat dong" : "Da vo hieu hoa"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <TeamMembersDrawer
        workspaceId={workspaceId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        initialMembers={members}
      />
    </div>
  );
};
