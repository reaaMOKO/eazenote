/**
 * A small typed wrapper around the browser's own storage.
 *
 * PHASE 1 ONLY. There is no database yet, so sample-consult data is kept in the
 * browser. Phase 2 replaces these stores with Supabase; the screens keep
 * working because they only use the functions exported by each "*-store.ts" file.
 *
 * Do not use this for real patient data.
 */
import { useSyncExternalStore } from "react";

export interface BrowserStore<StoredValue> {
  /** Current value, or the empty value if nothing is saved yet. */
  read: () => StoredValue;
  /** Saves the value. Returns false if the browser refused (storage full or blocked). */
  write: (nextValue: StoredValue) => boolean;
  /** Tells React when the value changes. */
  subscribe: (onChange: () => void) => () => void;
}

interface BrowserStoreOptions<StoredValue> {
  /** Name the value is saved under. */
  storageKey: string;
  /**
   * "session": cleared when the tab closes (used for consults).
   * "local": kept on this device until removed (used for practice details).
   */
  storageArea: "session" | "local";
  /** Returned when nothing has been saved. Must be one fixed object, not a new one each time. */
  emptyValue: StoredValue;
}

export function createBrowserStore<StoredValue>(
  options: BrowserStoreOptions<StoredValue>,
): BrowserStore<StoredValue> {
  const changeListeners = new Set<() => void>();

  // React needs read() to return the SAME object until the data changes,
  // so the parsed value is cached against the raw saved text.
  let cachedRawText: string | null | undefined;
  let cachedValue: StoredValue = options.emptyValue;

  function getStorageArea(): Storage | null {
    if (typeof window === "undefined") return null;
    try {
      return options.storageArea === "local" ? window.localStorage : window.sessionStorage;
    } catch {
      return null; // Storage is blocked (some private-browsing modes).
    }
  }

  function read(): StoredValue {
    const storageArea = getStorageArea();
    if (!storageArea) return options.emptyValue;

    let rawText: string | null;
    try {
      rawText = storageArea.getItem(options.storageKey);
    } catch {
      rawText = null;
    }

    if (rawText === cachedRawText) return cachedValue;

    cachedRawText = rawText;
    try {
      cachedValue = rawText === null ? options.emptyValue : (JSON.parse(rawText) as StoredValue);
    } catch {
      cachedValue = options.emptyValue; // Saved text was damaged: start clean.
    }
    return cachedValue;
  }

  function write(nextValue: StoredValue): boolean {
    const storageArea = getStorageArea();
    if (!storageArea) return false;

    try {
      storageArea.setItem(options.storageKey, JSON.stringify(nextValue));
    } catch {
      return false;
    }

    changeListeners.forEach((notifyListener) => notifyListener());
    return true;
  }

  function subscribe(onChange: () => void): () => void {
    changeListeners.add(onChange);
    // Also pick up changes made in another tab.
    window.addEventListener("storage", onChange);
    return () => {
      changeListeners.delete(onChange);
      window.removeEventListener("storage", onChange);
    };
  }

  return { read, write, subscribe };
}

/**
 * Reads a store inside a React component.
 * Returns `undefined` for the brief moment before the browser's storage has
 * been read, so screens can show "Loading" instead of wrongly showing "empty".
 */
export function useBrowserStoreValue<StoredValue>(
  store: BrowserStore<StoredValue>,
): StoredValue | undefined {
  return useSyncExternalStore<StoredValue | undefined>(
    store.subscribe,
    store.read,
    () => undefined,
  );
}
