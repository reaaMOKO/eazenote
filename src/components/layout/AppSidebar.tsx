"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { EazeNoteLogo } from "@/components/brand/EazeNoteLogo";
import { HomeIcon, MicrophoneIcon, PracticeIcon, SignOutIcon } from "@/components/ui/icons";
import { endDemoSession } from "@/features/auth/session-store";
import { describeConsultStatus, shortenPatientName } from "@/features/consult/consult-display";
import { findNextStep } from "@/features/consult/consult-rules";
import { useConsultList } from "@/features/consult/consult-store";
import { ConsultStatusChip } from "@/features/consult/ConsultStatusChip";
import { PatientAvatar } from "@/features/consult/PatientAvatar";

interface NavigationItem {
  href: string;
  label: string;
  icon: ReactNode;
  /** Decides whether this item is the current screen. */
  isCurrent: (currentPath: string) => boolean;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: "/consults",
    label: "Today",
    icon: <HomeIcon />,
    isCurrent: (currentPath) => currentPath === "/consults",
  },
  {
    href: "/consults/new",
    label: "New consult",
    icon: <MicrophoneIcon />,
    isCurrent: (currentPath) => currentPath === "/consults/new",
  },
  {
    href: "/practice",
    label: "Practice",
    icon: <PracticeIcon />,
    isCurrent: (currentPath) => currentPath.startsWith("/practice"),
  },
];

/**
 * The left-hand column on laptop and desktop screens: navigation, today's
 * consults, and sign out. Phones and small tablets get the compact top bar
 * (AppHeader) instead, so this is hidden below the "lg" width.
 */
export function AppSidebar({ signedInEmail }: { signedInEmail: string }) {
  const currentPath = usePathname();
  const router = useRouter();
  const consults = useConsultList() ?? [];

  function handleSignOut() {
    endDemoSession();
    router.replace("/sign-in");
  }

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-7 overflow-y-auto border-r border-line bg-white px-4 py-6 lg:flex print:hidden">
      <Link href="/consults" aria-label="EazeNote: go to Today" className="self-start rounded-lg px-2 py-1">
        <EazeNoteLogo badgeSize={36} />
      </Link>

      <nav aria-label="Main" className="flex flex-col gap-1">
        {NAVIGATION_ITEMS.map((item) => {
          const isCurrent = item.isCurrent(currentPath);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-base font-semibold ${
                isCurrent ? "bg-deep text-white" : "text-ink hover:bg-tint"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {consults.length > 0 && (
        <section aria-labelledby="sidebar-consults-heading" className="flex flex-col gap-1">
          <h2
            id="sidebar-consults-heading"
            className="px-3 pb-1 text-xs font-bold tracking-widest text-slate uppercase"
          >
            Today&apos;s consults
          </h2>
          <ul className="flex flex-col gap-0.5">
            {consults.map((consult) => {
              // Highlight the consult whose screens are open right now.
              const isOpenNow = currentPath.startsWith(`/consults/${consult.id}/`);
              return (
                <li key={consult.id}>
                  <Link
                    href={`/consults/${consult.id}/${findNextStep(consult)}`}
                    aria-current={isOpenNow ? "true" : undefined}
                    className={`flex min-h-12 items-center gap-2.5 rounded-xl px-3 ${
                      isOpenNow ? "bg-tint" : "hover:bg-tint"
                    }`}
                  >
                    <PatientAvatar patientName={consult.patientName} size="small" isActive={isOpenNow} />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                      {shortenPatientName(consult.patientName)}
                    </span>
                    <ConsultStatusChip status={describeConsultStatus(consult)} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-auto flex flex-col gap-1 border-t border-line pt-4">
        <p className="truncate px-3 text-sm text-slate" title={signedInEmail}>
          {signedInEmail}
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-base font-semibold text-ink hover:bg-tint"
        >
          <SignOutIcon />
          Sign out
        </button>
      </div>
    </aside>
  );
}
