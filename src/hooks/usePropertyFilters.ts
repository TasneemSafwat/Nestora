import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { PropertyFilters } from '../types';
import {
  DEFAULT_FILTERS,
  buildSearchParams,
  countActiveFilters,
  parseFilters,
} from '../services/propertyService';

/**
 * Keeps the Properties page filter state in the URL, so every search is
 * shareable, bookmarkable and survives a refresh or a back navigation.
 */
export function usePropertyFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<PropertyFilters>(() => parseFilters(searchParams), [searchParams]);

  /** Replaces the whole filter object. */
  const commit = useCallback(
    (next: PropertyFilters, options: { replace?: boolean } = {}) => {
      setSearchParams(buildSearchParams(next), { replace: options.replace ?? false });
    },
    [setSearchParams]
  );

  /** Merges a patch and returns to page one unless the patch changes the page. */
  const update = useCallback(
    (patch: Partial<PropertyFilters>, options: { resetPage?: boolean } = {}) => {
      setSearchParams((previous) => {
        const current = parseFilters(previous);
        const next: PropertyFilters = {
          ...current,
          ...patch,
          page: options.resetPage === false ? patch.page ?? current.page : 1,
        };
        return buildSearchParams(next);
      });
    },
    [setSearchParams]
  );

  const reset = useCallback(() => {
    setSearchParams(buildSearchParams({ ...DEFAULT_FILTERS }));
  }, [setSearchParams]);

  const activeCount = countActiveFilters(filters);

  return { filters, update, commit, reset, activeCount };
}
