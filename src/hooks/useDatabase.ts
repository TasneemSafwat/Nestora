import { useSyncExternalStore } from 'react';
import { getState, subscribe, type DatabaseState } from '../services/database';

/**
 * Subscribes a component to the demo data store. Every mutation made through
 * the service layer re-renders the components that read it.
 */
export function useDatabase(): DatabaseState {
  return useSyncExternalStore(subscribe, getState, getState);
}
