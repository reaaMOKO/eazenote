"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useDemoSession } from "@/features/auth/session-store";
import { AppHeader } from "./AppHeader";
import { DemoModeBar } from "./DemoModeBar";

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
    <>
      <AppHeader />
      <DemoModeBar />
      {/* The key discards any on-screen state if a different doctor signs in. */}
      <main
        key={session.email}
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10 print:max-w-none print:p-0"
      >
        {children}
      </main>
    </>
  );
}
