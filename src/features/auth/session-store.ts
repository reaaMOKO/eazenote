/**
 * Who is signed in.
 *
 * PHASE 1: a stand-in. It only remembers the email typed on the sign-in screen;
 * it proves nothing about identity. Phase 2 replaces it with Supabase Auth
 * (password or emailed code), where the server checks every request.
 */
import { createBrowserStore, useBrowserStoreValue } from "@/lib/browser-store";

export interface DemoSession {
  email: string;
  signedInAt: string;
}

const sessionStore = createBrowserStore<DemoSession | null>({
  storageKey: "eazenote.demo-session",
  storageArea: "local",
  emptyValue: null,
});

/** `undefined` while loading, `null` when signed out. */
export function useDemoSession(): DemoSession | null | undefined {
  return useBrowserStoreValue(sessionStore);
}

export function startDemoSession(email: string): boolean {
  return sessionStore.write({ email: email.trim(), signedInAt: new Date().toISOString() });
}

export function endDemoSession(): void {
  sessionStore.write(null);
}
