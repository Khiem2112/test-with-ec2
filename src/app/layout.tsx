import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoFlow Mock Project 1",
  description: "Mock Project 1 for practicing autonomous multi-agent software engineering",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-neutral-950 text-neutral-100">
        {children}
      </body>
    </html>
  );
}
