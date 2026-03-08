"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "./Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useBookmarks } from "@/contexts/BookmarkContext";

const NAV_ITEMS = [
  { href: "/", label: "Feed", icon: "dashboard" },
  { href: "/analytics", label: "Market Trends", icon: "show_chart" },
  { href: "/saved", label: "Saved", icon: "bookmark" },
] as const;

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isDark, toggle } = useTheme();
  const { savedArticles } = useBookmarks();

  return (
    <>
      <Header onMenuToggle={() => setIsOpen(!isOpen)} />

      <div className="flex-1 pt-20">
        {/* Backdrop overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Sidebar — fixed on desktop, slide-in on mobile */}
        <aside
          className={`
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            fixed
            top-20
            left-0
            z-40 md:z-auto
            w-64 flex-shrink-0
            bg-background-light dark:bg-background-dark
            border-r border-slate-100 dark:border-slate-800
            h-[calc(100vh-5rem)]
            overflow-y-auto
            p-6
            transition-transform duration-300 ease-in-out md:transition-none
            flex flex-col
          `}
        >
          {/* Nav Items */}
          <nav className="space-y-1 flex-1">
            {NAV_ITEMS.map(({ href, label, icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? "text-primary bg-primary/5 font-semibold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                  <span>{label}</span>
                  {label === "Saved" && savedArticles.length > 0 && (
                    <span className="ml-auto text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {savedArticles.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Dark mode toggle at bottom */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={toggle}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium transition-all"
            >
              <span className="material-symbols-outlined">
                {isDark ? "light_mode" : "dark_mode"}
              </span>
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              <div
                className={`ml-auto w-9 h-5 rounded-full relative transition-colors ${
                  isDark ? "bg-primary" : "bg-slate-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform ${
                    isDark ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </aside>

        {/* Main content area — offset for fixed sidebar on desktop */}
        <div className="flex-1 min-w-0 px-6 py-12 md:px-10 md:ml-64">{children}</div>
      </div>
    </>
  );
}
