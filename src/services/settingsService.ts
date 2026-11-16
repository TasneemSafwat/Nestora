import type { AppSettings } from '../types';
import {
  defaultSettings,
  getState,
  logActivity,
  mutate,
  replaceDatabase,
  resetDatabase,
  type DatabaseState,
} from './database';

export type SettingsPatch = Partial<AppSettings>;

export function getSettings(): AppSettings {
  return getState().settings;
}

export function updateSettings(patch: SettingsPatch, options: { silent?: boolean } = {}): AppSettings {
  mutate((current) => ({ settings: { ...current.settings, ...patch } }));
  if (!options.silent) {
    logActivity('property', 'admin.activity.settingsUpdated', 'settings');
  }
  return getState().settings;
}

export function restoreDefaultSettings(): AppSettings {
  return updateSettings({ ...defaultSettings }, { silent: true });
}

/** Wipes every user-created record and restores the original seed document. */
export function resetDemoData(): void {
  resetDatabase();
}

/** Serialises the current demo document so it can be downloaded as JSON. */
export function exportDemoData(): string {
  return JSON.stringify(getState(), null, 2);
}

export function downloadDemoData(filename = 'nestora-demo-data.json'): void {
  const blob = new Blob([exportDemoData()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Restores a previously exported document. Returns false when malformed. */
export function importDemoData(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as DatabaseState;
    if (!parsed || !Array.isArray(parsed.properties)) return false;
    replaceDatabase(parsed);
    return true;
  } catch {
    return false;
  }
}
