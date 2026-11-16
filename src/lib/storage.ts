import type { Language } from '../types';

/**
 * Small helper for parsing a typed, validated localStorage document.
 */
export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Quota errors are non-fatal for a demo application. */
  }
}

export function removeKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

export const STORAGE_KEYS = {
  language: 'nestora:language',
  favorites: 'nestora:favorites',
  newsletter: 'nestora:newsletter',
  adminSession: 'nestora:admin-session',
  /** Single document holding every seeded and user-created record. */
  database: 'nestora:db',
} as const;

const LANGUAGE_VALUES: Language[] = ['en', 'ar'];

export function readStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.language);
  return raw && (LANGUAGE_VALUES as string[]).includes(raw) ? (raw as Language) : null;
}

export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

/** Rough byte size of the demo dataset, shown on the settings screen. */
export function storageFootprintKb(): number {
  if (typeof window === 'undefined') return 0;
  let total = 0;
  Object.values(STORAGE_KEYS).forEach((key) => {
    const value = window.localStorage.getItem(key);
    if (value) total += value.length;
  });
  return Math.round((total / 1024) * 10) / 10;
}
