import { useCallback, useSyncExternalStore } from 'react';
import { STORAGE_KEYS, readJSON, writeJSON } from '../lib/storage';

/**
 * Saved properties. Persisted in this browser only — the brief explicitly
 * requires that we do not present this as an account-level feature.
 */
const listeners = new Set<() => void>();
let favorites: string[] = readJSON<string[]>(STORAGE_KEYS.favorites, []);

function emit(): void {
  listeners.forEach((listener) => listener());
}

function persist(next: string[]): void {
  favorites = next;
  writeJSON(STORAGE_KEYS.favorites, next);
  emit();
}

function subscribeFavorites(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getFavorites(): string[] {
  return favorites;
}

export function addFavorite(id: string): void {
  if (favorites.includes(id)) return;
  persist([...favorites, id]);
}

export function removeFavorite(id: string): void {
  if (!favorites.includes(id)) return;
  persist(favorites.filter((item) => item !== id));
}

export function toggleFavorite(id: string): boolean {
  if (favorites.includes(id)) {
    removeFavorite(id);
    return false;
  }
  addFavorite(id);
  return true;
}

export function clearFavorites(): void {
  persist([]);
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribeFavorites, getFavorites, getFavorites);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return {
    ids,
    count: ids.length,
    has,
    add: addFavorite,
    remove: removeFavorite,
    toggle: toggleFavorite,
    clear: clearFavorites,
  };
}
