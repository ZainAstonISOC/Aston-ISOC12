"use client";
import { useCallback, useSyncExternalStore } from "react";

/**
 * Reader preferences and "last read", kept in this browser only
 * (localStorage). Nothing is sent anywhere. Every read and write is guarded:
 * private windows and blocked storage simply fall back to the defaults.
 */
const EVENT = "isoc-quran-prefs";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writePref(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: the choice lasts for this page view only.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** A stored string, or `fallback` on the server and when nothing is stored. */
export function usePref<T extends string>(key: string, fallback: T, allowed: readonly T[]): [T, (v: T) => void] {
  const raw = useSyncExternalStore(subscribe, () => read(key), () => null);
  const value = raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;
  const set = useCallback((v: T) => writePref(key, v), [key]);
  return [value, set];
}

export const LAST_READ_KEY = "isoc-quran-last";

export interface LastRead {
  surah: number;
  ayah: number;
  name: string;
}

export function useLastRead(): LastRead | null {
  const raw = useSyncExternalStore(subscribe, () => read(LAST_READ_KEY), () => null);
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as LastRead;
    return Number.isInteger(v.surah) && Number.isInteger(v.ayah) && typeof v.name === "string" ? v : null;
  } catch {
    return null;
  }
}
