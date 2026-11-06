import React from "react";
import Link from "next/link";
import { listWorkspaces } from "@/services/workspace.service";
import { WorkspaceOnboardingForm } from "@/components/workspace/workspace-onboarding-form";

export const dynamic = "force-dynamic";

export default async function HomePage(): Promise<React.JSX.Element> {
  const workspaces = await listWorkspaces();

  return (
    <div className="min-h-screen bg-[#010102] text-[#f7f8f8] flex flex-col">
      <header className="border-b border-[#23252a] bg-[#0f1011]/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5e6ad2] text-sm font-bold text-white tracking-wider">
              AF
            </span>
            <span className="font-semibold text-base tracking-tight text-[#f7f8f8]">
              AutoFlow Product Operations
            </span>
          </div>
          <span className="text-xs text-[#8a8f98] font-mono">
            Vong Doi Phan Hoi Khach Hang
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <div className="mb-12 max-w-2xl">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#f7f8f8] mb-3">
            Khong Gian Lam Viec & Cong Phan Hoi
          </h1>
          <p className="text-sm text-[#8a8f98] leading-relaxed">
            Nen tang thu thap y kien, binh chon tinh nang thong minh, quan tri lo trinh phat trien san pham va dong bo phien ban phat hanh.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-semibold tracking-wider text-[#62666d] uppercase mb-4">
              Danh Sach Khong Gian Hoat Dong ({workspaces.length})
            </h2>

            {workspaces.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#23252a] bg-[#0f1011] p-8 text-center">
                <p className="text-sm text-[#8a8f98] mb-2">
                  Chua co khong gian lam viec nao duoc tao.
                </p>
                <p className="text-xs text-[#62666d]">
                  Vui long dien bieu mau ben canh de tao khong gian lam viec dau tien.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    className="flex flex-col justify-between rounded-xl border border-[#23252a] bg-[#0f1011] p-5 hover:border-[#34343a] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded bg-[#18191a] text-xs font-bold text-[#828fff] border border-[#23252a] uppercase">
                          {workspace.name.slice(0, 2)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#27a644]/10 px-2 py-0.5 text-[11px] font-medium text-[#27a644]">
                          Hoat Dong
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-[#f7f8f8] mb-1">
                        {workspace.name}
                      </h3>
                      <p className="text-xs text-[#8a8f98] font-mono mb-4">
                        /{workspace.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-[#18191a]">
                      <Link
                        href={`/${workspace.slug}`}
                        className="flex-1 text-center rounded-md bg-[#5e6ad2] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#828fff] transition-colors"
                      >
                        Cong Thong Tin
                      </Link>
                      <Link
                        href={`/admin/workspaces/${workspace.slug}/settings`}
                        className="flex-1 text-center rounded-md border border-[#23252a] bg-[#141516] px-3 py-1.5 text-xs font-medium text-[#d0d6e0] hover:bg-[#18191a] transition-colors"
                      >
                        Quan Tri
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[#23252a] bg-[#0f1011] p-6 h-fit">
            <h2 className="text-sm font-semibold text-[#f7f8f8] mb-1">
              Tao Khong Gian Lam Viec Moi
            </h2>
            <p className="text-xs text-[#8a8f98] mb-4">
              Thiet lap cong phan hoi danh rieng cho san pham cua ban.
            </p>
            <WorkspaceOnboardingForm />
          </div>
        </div>
      </main>

      <footer className="border-t border-[#23252a] py-6 px-6 text-center text-xs text-[#62666d]">
        AutoFlow Autonomous Agentic Development Framework
      </footer>
    </div>
  );
}
