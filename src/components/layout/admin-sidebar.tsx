"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export type AdminSidebarProps = {
  workspaceSlug: string;
  workspaceName: string;
  className?: string;
};

type NavItem = {
  label: string;
  href: string;
  badge?: string;
};

export const AdminSidebar = ({
  workspaceSlug,
  workspaceName,
  className,
}: AdminSidebarProps): React.JSX.Element => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const basePath = `/admin/workspaces/${workspaceSlug}`;

  const navItems: NavItem[] = [
    {
      label: "Cai Dat Chung",
      href: `${basePath}/settings`,
    },
    {
      label: "Kiem Duyet Bai Dang",
      href: `${basePath}/moderation`,
    },
    {
      label: "Thanh Vien & Phan Quyen",
      href: `${basePath}/members`,
    },
    {
      label: "Phat Hanh Phien Ban",
      href: `${basePath}/releases`,
    },
    {
      label: "Ket Noi Webhooks",
      href: `${basePath}/webhooks`,
    },
    {
      label: "Nhat Ky Kiem Toan",
      href: `${basePath}/audit`,
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-[#23252a] bg-[#0f1011] transition-all duration-200",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-[#23252a] px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#5e6ad2] text-xs font-bold text-white uppercase">
              {workspaceName.slice(0, 1)}
            </span>
            <span className="truncate text-sm font-semibold text-[#f7f8f8]">
              {workspaceName}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded p-1 text-[#8a8f98] hover:bg-[#141516] hover:text-[#f7f8f8] text-xs"
          aria-label={isCollapsed ? "Mo rong sidebar" : "Thu gon sidebar"}
        >
          {isCollapsed ? ">>" : "<<"}
        </button>
      </div>

      <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-[#62666d] uppercase">
        {!isCollapsed && "Quan Tri Khong Gian"}
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-[#18191a] text-[#f7f8f8] border border-[#23252a]"
                  : "text-[#8a8f98] hover:bg-[#141516] hover:text-[#f7f8f8]"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="truncate">
                {isCollapsed ? item.label.slice(0, 2) : item.label}
              </span>
              {!isCollapsed && item.badge && (
                <span className="rounded bg-[#5e6ad2]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#828fff]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#23252a] p-3">
        <Link
          href={`/${workspaceSlug}`}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#8a8f98] hover:bg-[#141516] hover:text-[#f7f8f8] transition-colors"
        >
          <span className="text-[11px]">&larr;</span>
          {!isCollapsed && <span>Ve Cong Thong Tin</span>}
        </Link>
      </div>
    </aside>
  );
};
