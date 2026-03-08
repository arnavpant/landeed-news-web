"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { BookmarkProvider } from "@/contexts/BookmarkContext";
import Sidebar from "./Sidebar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <BookmarkProvider>
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
          <Sidebar>{children}</Sidebar>
        </div>
      </BookmarkProvider>
    </ThemeProvider>
  );
}
