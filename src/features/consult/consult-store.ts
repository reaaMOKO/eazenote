/**
 * Where consults are kept.
 *
 * PHASE 1: this browser tab only (cleared when the tab closes). Sample data only.
 * PHASE 2: the Supabase database, where each doctor can read only their own consults.
 */
import { useMemo } from "react";
import { createBrowserStore, useBrowserStoreValue } from "@/lib/browser-store";
import type { Consult } from "./consult-types";

type ConsultsById = Record<string, Consult>;

const NO_CONSULTS: ConsultsById = {};

const consultStore = createBrowserStore<ConsultsById>({
  storageKey: "eazenote.demo-consults",
  storageArea: "session",
  emptyValue: NO_CONSULTS,
});

/** `undefined` while loading, `null` if no consult has that id. */
export function useConsult(consultId: string): Consult | null | undefined {
  const consultsById = useBrowserStoreValue(consultStore);
  if (consultsById === undefined) return undefined;
  return consultsById[consultId] ?? null;
}

/** All consults in this tab, newest first. `undefined` while loading. */
export function useConsultList(): Consult[] | undefined {
  const consultsById = useBrowserStoreValue(consultStore);
  return useMemo(() => {
    if (consultsById === undefined) return undefined;
    return Object.values(consultsById).sort((first, second) =>
      second.createdAt.localeCompare(first.createdAt),
    );
  }, [consultsById]);
}

/** Adds or replaces a consult. Returns false if the browser could not save. */
export function saveConsult(consult: Consult): boolean {
  return consultStore.write({ ...consultStore.read(), [consult.id]: consult });
}

export function deleteConsult(consultId: string): void {
  const remainingConsults = { ...consultStore.read() };
  delete remainingConsults[consultId];
  consultStore.write(remainingConsults);
}
