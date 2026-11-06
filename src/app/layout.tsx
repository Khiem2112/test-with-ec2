import React from "react";
import type { Metadata } from "next";
import { VoterProvider } from "@/context/voter-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoFlow - Feedback and Product Operations Platform",
  description: "Continuous customer feedback, voting, roadmap, and release lifecycle management.",
};

export type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen bg-[#010102] text-[#f7f8f8] antialiased selection:bg-[#5e6ad2] selection:text-white">
        <VoterProvider>
          {children}
        </VoterProvider>
      </body>
    </html>
  );
}
