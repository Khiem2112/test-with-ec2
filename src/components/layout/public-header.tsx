"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useVoter } from "@/context/voter-context";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { VoterIdentityModal } from "@/components/workspace/voter-identity-modal";
import type { Workspace } from "@/types/workspace";

export type PublicHeaderProps = {
  workspace: Workspace;
  className?: string;
};

export const PublicHeader = ({
  workspace,
  className,
}: PublicHeaderProps): React.JSX.Element => {
  const pathname = usePathname();
  const { voter, isModalOpen, setIsModalOpen, setVoter } = useVoter();

  const navLinks = [
    {
      label: "Bang Phan Hoi",
      href: `/${workspace.slug}`,
      active: pathname === `/${workspace.slug}` || pathname.startsWith(`/${workspace.slug}/boards`),
    },
    {
      label: "Lo Trinh",
      href: `/${workspace.slug}/roadmap`,
      active: pathname.startsWith(`/${workspace.slug}/roadmap`),
    },
    {
      label: "Nhat Ky Thay Doi",
      href: `/${workspace.slug}/changelog`,
      active: pathname.startsWith(`/${workspace.slug}/changelog`),
    },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b border-[#23252a] bg-[#0f1011]/90 backdrop-blur-md px-4 lg:px-8 py-3",
          className
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href={`/${workspace.slug}`}
              className="flex items-center gap-2 font-semibold text-base tracking-tight text-[#f7f8f8] hover:text-[#828fff] transition-colors"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#5e6ad2] text-xs font-bold text-white uppercase">
                {workspace.name.slice(0, 2)}
              </span>
              <span>{workspace.name}</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    link.active
                      ? "bg-[#18191a] text-[#f7f8f8] border border-[#23252a]"
                      : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#141516]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {voter?.id ? (
              <NotificationBell userId={voter.id} />
            ) : null}

            {voter ? (
              <div className="flex items-center gap-2 rounded-full border border-[#23252a] bg-[#141516] px-3 py-1">
                <div className="h-2 w-2 rounded-full bg-[#27a644]" />
                <span className="text-xs text-[#f7f8f8] font-medium max-w-[120px] truncate">
                  {voter.displayName}
                </span>
                {voter.voteWeight > 1 && (
                  <span className="text-[10px] text-[#5e6ad2] font-semibold bg-[#5e6ad2]/10 px-1 rounded">
                    x{voter.voteWeight}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-[11px] text-[#8a8f98] hover:text-[#f7f8f8] ml-1"
                >
                  Doi
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-md border border-[#23252a] bg-[#141516] px-3 py-1.5 text-xs font-medium text-[#d0d6e0] hover:bg-[#18191a] hover:text-white transition-colors"
              >
                Xac Thuc Dinh Danh
              </button>
            )}

            <Link
              href={`/admin/workspaces/${workspace.slug}/settings`}
              className="text-xs text-[#8a8f98] hover:text-[#f7f8f8] transition-colors px-2 py-1"
            >
              Quan Tri
            </Link>
          </div>
        </div>
      </header>

      <VoterIdentityModal
        workspaceId={workspace.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onIdentified={(profile) => {
          setVoter(profile);
          setIsModalOpen(false);
        }}
      />
    </>
  );
};
