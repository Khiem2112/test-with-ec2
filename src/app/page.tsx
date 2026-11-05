import type { JSX } from "react";

export default function HomePage(): JSX.Element {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <header className="border-b border-neutral-800 pb-8 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          AutoFlow Mock Project 1
        </h1>
        <p className="text-neutral-400 text-sm">
          Autonomous multi-agent practice environment: Next.js App Router, Tailwind CSS, and Prisma ORM.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50">
          <h2 className="text-lg font-semibold text-neutral-200 mb-2">Stage 1: Autonomous Design</h2>
          <p className="text-neutral-400 text-sm">
            Flow specifications, UI contracts, and technical specs governed under docs/ directory.
          </p>
        </div>

        <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50">
          <h2 className="text-lg font-semibold text-neutral-200 mb-2">Stage 2: Autonomous Implementation</h2>
          <p className="text-neutral-400 text-sm">
            Worker agents execute atomic tasks bounded to target files and verified with intermediate gates.
          </p>
        </div>

        <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50">
          <h2 className="text-lg font-semibold text-neutral-200 mb-2">Stage 3: Autonomous Review</h2>
          <p className="text-neutral-400 text-sm">
            Dual-pass reviews (Functional and Convention) with strict blocker remediation and safe commits.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Architecture & Tech Stack Status</h2>
        <div className="space-y-3 text-sm text-neutral-300">
          <div className="flex justify-between py-2 border-b border-neutral-800/60">
            <span className="text-neutral-400">Framework</span>
            <span className="font-mono text-neutral-200">Next.js 15 (App Router)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-800/60">
            <span className="text-neutral-400">Styling</span>
            <span className="font-mono text-neutral-200">Tailwind CSS v4</span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-800/60">
            <span className="text-neutral-400">ORM & Database</span>
            <span className="font-mono text-neutral-200">Prisma Client with SQLite / PostgreSQL</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-neutral-400">Validation & Safety</span>
            <span className="font-mono text-neutral-200">Strict TypeScript + Zod</span>
          </div>
        </div>
      </section>
    </main>
  );
}
