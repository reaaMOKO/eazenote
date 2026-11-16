"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { EazeNoteLogo } from "@/components/brand/EazeNoteLogo";
import { endDemoSession } from "@/features/auth/session-store";

const NAVIGATION_LINKS = [
  { href: "/consults", label: "Today" },
  { href: "/practice", label: "Practice" },
];

/**
 * Compact top bar for phones and small tablets. From the "lg" width up, the
 * sidebar (AppSidebar) takes over and this bar is hidden. Never printed.
 */
export function AppHeader() {
  const currentPath = usePathname();
  const router = useRouter();

  function handleSignOut() {
    endDemoSession();
    router.replace("/sign-in");
  }

  return (
    <header className="border-b border-line bg-white lg:hidden print:hidden">
      <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:px-6">
        <Link href="/consults" aria-label="EazeNote: go to Today" className="rounded-lg py-1.5">
          <EazeNoteLogo badgeSize={32} />
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1 text-base font-semibold">
          {NAVIGATION_LINKS.map((link) => {
            const isCurrentSection = currentPath.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrentSection ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-lg px-3 ${
                  isCurrentSection ? "bg-deep text-white" : "text-slate hover:text-deep"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex min-h-11 items-center rounded-lg px-3 text-slate hover:text-deep"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
