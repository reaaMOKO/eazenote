"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { useDemoSession } from "@/features/auth/session-store";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { DemoModeBar } from "./DemoModeBar";

const HOME_PATH = "/consults";

/**
 * Frame for signed-in screens: sends signed-out visitors to the sign-in
 * screen, and adds the navigation and page layout.
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
      <PageFrame key={session.email} signedInEmail={session.email}>
        {children}
      </PageFrame>
    </Suspense>
  );
}

/**
 * The web-app layout:
 *
 *   laptop / desktop   sidebar on the left, the screen on a soft mint background
 *   phone / tablet     compact bar on top, the same screen underneath
 *
 * The Today screen arranges its own cards across a wide page. Every other
 * screen (forms, recording, documents) sits in one white card in a narrower
 * column, which is easier to read and fill in.
 */
function PageFrame({ signedInEmail, children }: { signedInEmail: string; children: ReactNode }) {
  const currentPath = usePathname();
  const isTodayScreen = currentPath === HOME_PATH;

  return (
    <div className="flex min-h-full flex-1 bg-tint print:bg-white">
      <AppSidebar signedInEmail={signedInEmail} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <DemoModeBar />

        <main className="w-full flex-1 px-3 py-5 sm:px-6 sm:py-8 lg:px-10 print:p-0">
          {isTodayScreen ? (
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">{children}</div>
          ) : (
            <Card className="mx-auto flex w-full max-w-3xl flex-col gap-8 sm:p-10 print:max-w-none">
              {children}
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
