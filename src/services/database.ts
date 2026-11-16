import type {
  ActivityEntry,
  ActivityKind,
  Agent,
  AppSettings,
  ContactMessage,
  Inquiry,
  Property,
  ValuationRequest,
  ViewingRequest,
} from '../types';
import { properties as seedProperties } from '../data/properties';
import { agents as seedAgents } from '../data/agents';
import { company } from '../data/content';
import { STORAGE_KEYS, readJSON, removeKey, writeJSON } from '../lib/storage';
import { uid } from '../lib/utils';
import {
  SEED_VERSION,
  seedActivity,
  seedInquiries,
  seedMessages,
  seedValuations,
  seedViewings,
} from './seed';

/**
 * A tiny in-browser data store.
 *
 * It is deliberately shaped like a remote API client so that a real backend can
 * replace it later: components read through the service functions, never from
 * localStorage directly.
 *
 * IMPORTANT: localStorage is not a secure database, and nothing here should be
 * treated as authentication or as a source of truth.
 */
export interface DatabaseState {
  version: string;
  properties: Property[];
  agents: Agent[];
  inquiries: Inquiry[];
  viewings: ViewingRequest[];
  valuations: ValuationRequest[];
  messages: ContactMessage[];
  activity: ActivityEntry[];
  settings: AppSettings;
}

export const defaultSettings: AppSettings = {
  agencyName: 'NESTORA',
  contactEmail: company.email,
  phone: company.phone,
  whatsapp: company.whatsapp,
  currency: 'SAR',
  defaultLanguage: 'en',
  listingsPerPage: 9,
  showDemoBanner: true,
};

function buildSeedState(): DatabaseState {
  return {
    version: SEED_VERSION,
    properties: seedProperties.map((property) => ({ ...property })),
    agents: seedAgents.map((agent) => ({ ...agent })),
    inquiries: seedInquiries.map((inquiry) => ({ ...inquiry })),
    viewings: seedViewings.map((viewing) => ({ ...viewing })),
    valuations: seedValuations.map((item) => ({ ...item })),
    messages: seedMessages.map((message) => ({ ...message })),
    activity: seedActivity.map((entry) => ({ ...entry })),
    settings: { ...defaultSettings },
  };
}

function loadState(): DatabaseState {
  const stored = readJSON<DatabaseState | null>(STORAGE_KEYS.database, null);
  if (stored && stored.version === SEED_VERSION && Array.isArray(stored.properties)) {
    return { ...buildSeedState(), ...stored, settings: { ...defaultSettings, ...stored.settings } };
  }
  if (stored && stored.version !== SEED_VERSION) {
    // Seed data has changed since this browser last ran the demo.
    removeKey(STORAGE_KEYS.database);
  }
  return buildSeedState();
}

let state: DatabaseState = loadState();
const listeners = new Set<() => void>();

function persist(): void {
  writeJSON(STORAGE_KEYS.database, state);
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getState(): DatabaseState {
  return state;
}

/** Applies a mutation and notifies every subscriber once. */
export function mutate(updater: (current: DatabaseState) => Partial<DatabaseState>): void {
  const patch = updater(state);
  state = { ...state, ...patch };
  persist();
  emit();
}

export function resetDatabase(): void {
  state = buildSeedState();
  persist();
  emit();
}

/** Replaces the whole document — used by the settings import flow. */
export function replaceDatabase(next: DatabaseState): void {
  state = { ...buildSeedState(), ...next, version: SEED_VERSION };
  persist();
  emit();
}

/* -------------------------------------------------------------------------- */
/*                               Activity log                                  */
/* -------------------------------------------------------------------------- */

const MAX_ACTIVITY = 40;

export function logActivity(kind: ActivityKind, labelKey: string, subject: string): void {
  const entry: ActivityEntry = {
    id: uid('act'),
    kind,
    labelKey,
    subject,
    createdAt: new Date().toISOString(),
  };
  mutate((current) => ({ activity: [entry, ...current.activity].slice(0, MAX_ACTIVITY) }));
}

export const activityKindIcon: Record<ActivityKind, string> = {
  property: 'Building2',
  agent: 'UserRound',
  inquiry: 'Mail',
  viewing: 'CalendarCheck',
  valuation: 'ClipboardList',
};
