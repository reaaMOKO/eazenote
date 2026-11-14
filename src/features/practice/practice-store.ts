/**
 * Where the practice details are kept.
 * PHASE 1: this device's browser storage. PHASE 2: the Supabase database.
 */
import { createBrowserStore, useBrowserStoreValue } from "@/lib/browser-store";
import type { PracticeProfile } from "./practice-types";

const practiceStore = createBrowserStore<PracticeProfile | null>({
  storageKey: "eazenote.practice-profile",
  storageArea: "local",
  emptyValue: null,
});

/** `undefined` while loading, `null` when the doctor has not set up the practice yet. */
export function usePracticeProfile(): PracticeProfile | null | undefined {
  return useBrowserStoreValue(practiceStore);
}

/** Returns false if the browser could not save (for example, storage is full). */
export function savePracticeProfile(profile: PracticeProfile): boolean {
  return practiceStore.write(profile);
}

export function readPracticeProfile(): PracticeProfile | null {
  return practiceStore.read();
}
