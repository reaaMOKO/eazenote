"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { useDemoSession } from "@/features/auth/session-store";
import { AppHeader } from "./AppHeader";
import { DemoModeBar } from "./DemoModeBar";

const HOME_PATH = "/consults";

/**
 * Frame for signed-in screens: sends signed-out visitors to the sign-in
 * screen, and adds the top bar and page width.
 *
 * PHASE 1 NOTE: this check runs in the browser, which is enough while the app
 * holds only sample data. From Phase 2 the server checks the session on every
 * request, because a browser-side check alone can be bypassed.
 */
export function SignedInShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const session = useDemoSession();

  useEffect(() => {
    if (session === null) router.replace("/sign-in");
  }, [session, router]);

  // `undefined` = still reading the session; `null` = signed out (redirecting).
  if (!session) return null;

  return (
    // Next.js requires a Suspense boundary around anything that reads the page address.
    <Suspense fallback={null}>
      {/* The key discards any on-screen state if a different doctor signs in. */}
      <PageFrame key={session.email}>{children}</PageFrame>
    </Suspense>
  );
}

/** The top bar plus the page column, sized for the current screen. */
function PageFrame({ children }: { children: ReactNode }) {
  const currentPath = usePathname();

  // The home screen has side-by-side content, so it gets a wider page.
  // Forms and documents read better in a narrower column.
  const pageWidthClass = currentPath === HOME_PATH ? "max-w-5xl" : "max-w-3xl";

  return (
    <>
      <AppHeader pageWidthClass={pageWidthClass} />
      <DemoModeBar pageWidthClass={pageWidthClass} />
      <main
        className={`mx-auto flex w-full ${pageWidthClass} flex-1 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10 print:max-w-none print:p-0`}
      >
        {children}
      </main>
    </>
  );
}
