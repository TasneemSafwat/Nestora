import type { Paginated, Property, PropertyFilters, SortOption, ViewMode } from '../types';
import { cities, districts } from '../data/taxonomy';
import { propertyGallery } from '../lib/images';
import { slugify, uid } from '../lib/utils';
import { getState, logActivity, mutate } from './database';

export const DEFAULT_FILTERS: PropertyFilters = {
  q: '',
  cityId: '',
  districtId: '',
  listingType: '',
  type: '',
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
  bathrooms: null,
  minArea: null,
  maxArea: null,
  furnishing: '',
  amenities: [],
  status: '',
  sort: 'recommended',
  view: 'grid',
  page: 1,
};

const SORT_VALUES: SortOption[] = ['recommended', 'price-asc', 'price-desc', 'area-desc', 'newest'];

function num(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/* -------------------------------------------------------------------------- */
/*                          URL <-> filter synchronisation                     */
/* -------------------------------------------------------------------------- */

export function parseFilters(params: URLSearchParams): PropertyFilters {
  const sort = params.get('sort') as SortOption | null;
  const view = params.get('view') as ViewMode | null;
  const amenities = params.get('amenities');

  return {
    q: params.get('q') ?? '',
    cityId: params.get('city') ?? '',
    districtId: params.get('district') ?? '',
    listingType: (params.get('listing') as PropertyFilters['listingType']) ?? '',
    type: (params.get('type') as PropertyFilters['type']) ?? '',
    minPrice: num(params.get('minPrice')),
    maxPrice: num(params.get('maxPrice')),
    bedrooms: num(params.get('beds')),
    bathrooms: num(params.get('baths')),
    minArea: num(params.get('minArea')),
    maxArea: num(params.get('maxArea')),
    furnishing: (params.get('furnishing') as PropertyFilters['furnishing']) ?? '',
    amenities: amenities ? amenities.split(',').filter(Boolean) : [],
    status: (params.get('status') as PropertyFilters['status']) ?? '',
    sort: sort && SORT_VALUES.includes(sort) ? sort : 'recommended',
    view: view === 'list' ? 'list' : 'grid',
    page: Math.max(1, num(params.get('page')) ?? 1),
  };
}

export function buildSearchParams(filters: PropertyFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.cityId) params.set('city', filters.cityId);
  if (filters.districtId) params.set('district', filters.districtId);
  if (filters.listingType) params.set('listing', filters.listingType);
  if (filters.type) params.set('type', filters.type);
  if (filters.minPrice !== null) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== null) params.set('maxPrice', String(filters.maxPrice));
  if (filters.bedrooms !== null) params.set('beds', String(filters.bedrooms));
  if (filters.bathrooms !== null) params.set('baths', String(filters.bathrooms));
  if (filters.minArea !== null) params.set('minArea', String(filters.minArea));
  if (filters.maxArea !== null) params.set('maxArea', String(filters.maxArea));
  if (filters.furnishing) params.set('furnishing', filters.furnishing);
  if (filters.amenities.length) params.set('amenities', filters.amenities.join(','));
  if (filters.status) params.set('status', filters.status);
  if (filters.sort !== 'recommended') params.set('sort', filters.sort);
  if (filters.view !== 'grid') params.set('view', filters.view);
  if (filters.page > 1) params.set('page', String(filters.page));
  return params;
}

export function countActiveFilters(filters: PropertyFilters): number {
  let count = 0;
  if (filters.q.trim()) count += 1;
  if (filters.cityId) count += 1;
  if (filters.districtId) count += 1;
  if (filters.listingType) count += 1;
  if (filters.type) count += 1;
  if (filters.minPrice !== null) count += 1;
  if (filters.maxPrice !== null) count += 1;
  if (filters.bedrooms !== null) count += 1;
  if (filters.bathrooms !== null) count += 1;
  if (filters.minArea !== null) count += 1;
  if (filters.maxArea !== null) count += 1;
  if (filters.furnishing) count += 1;
  if (filters.status) count += 1;
  count += filters.amenities.length;
  return count;
}

/* -------------------------------------------------------------------------- */
/*                                 Querying                                    */
/* -------------------------------------------------------------------------- */

function matchesKeyword(property: Property, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const city = cities.find((item) => item.id === property.cityId);
  const district = districts.find((item) => item.id === property.districtId);

  const haystack = [
    property.title.en,
    property.title.ar,
    property.reference,
    property.slug,
    property.address.en,
    property.address.ar,
    city?.name.en,
    city?.name.ar,
    district?.name.en,
    district?.name.ar,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(needle);
}

export function filterProperties(list: Property[], filters: PropertyFilters): Property[] {
  return list.filter((property) => {
    if (!matchesKeyword(property, filters.q)) return false;
    if (filters.cityId && property.cityId !== filters.cityId) return false;
    if (filters.districtId && property.districtId !== filters.districtId) return false;
    if (filters.listingType && property.listingType !== filters.listingType) return false;
    if (filters.type && property.type !== filters.type) return false;
    if (filters.status && property.status !== filters.status) return false;
    if (filters.furnishing && property.furnishing !== filters.furnishing) return false;
    if (filters.minPrice !== null && property.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && property.price > filters.maxPrice) return false;
    if (filters.bedrooms !== null && property.bedrooms < filters.bedrooms) return false;
    if (filters.bathrooms !== null && property.bathrooms < filters.bathrooms) return false;
    if (filters.minArea !== null && property.area < filters.minArea) return false;
    if (filters.maxArea !== null && property.area > filters.maxArea) return false;
    if (filters.amenities.length && !filters.amenities.every((id) => property.amenities.includes(id))) {
      return false;
    }
    return true;
  });
}

export function sortProperties(list: Property[], sort: SortOption): Property[] {
  const sorted = [...list];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'area-desc':
      return sorted.sort((a, b) => b.area - a.area);
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'recommended':
    default:
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.views - a.views;
      });
  }
}

export function paginate<T>(list: T[], page: number, perPage: number): Paginated<T> {
  const total = list.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * perPage;
  return {
    items: list.slice(start, start + perPage),
    total,
    page: safePage,
    pageCount,
    perPage,
  };
}

/** The full public query used by the Properties page. */
export function queryProperties(
  list: Property[],
  filters: PropertyFilters,
  perPage: number
): Paginated<Property> & { filtered: Property[] } {
  const matched = sortProperties(filterProperties(list, filters), filters.sort);
  const page = paginate(matched, filters.page, perPage);
  return { ...page, filtered: matched };
}

/* -------------------------------------------------------------------------- */
/*                              Read operations                                */
/* -------------------------------------------------------------------------- */

/** Public site never shows drafts. */
export const publishedProperties = (list: Property[]): Property[] => list.filter((p) => p.status !== 'draft');

export function allProperties(): Property[] {
  return getState().properties;
}

export function getProperty(id: string): Property | undefined {
  return getState().properties.find((property) => property.id === id);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return getState().properties.find((property) => property.slug === slug);
}

export function registeredView(id: string): void {
  const property = getProperty(id);
  if (!property) return;
  mutate((current) => ({
    properties: current.properties.map((item) =>
      item.id === id ? { ...item, views: item.views + 1 } : item
    ),
  }));
}

export function countByCity(list: Property[]): Record<string, number> {
  return list.reduce<Record<string, number>>((accumulator, property) => {
    accumulator[property.cityId] = (accumulator[property.cityId] ?? 0) + 1;
    return accumulator;
  }, {});
}

export function propertiesForAgent(agentId: string, includeDrafts = false): Property[] {
  return getState().properties.filter(
    (property) => property.agentId === agentId && (includeDrafts || property.status !== 'draft')
  );
}

/** Similar by city + type first, then city, then price proximity. */
export function similarProperties(property: Property, limit = 3): Property[] {
  const pool = publishedProperties(allProperties()).filter((item) => item.id !== property.id);
  const scored = pool.map((item) => {
    let score = 0;
    if (item.cityId === property.cityId) score += 6;
    if (item.districtId === property.districtId) score += 3;
    if (item.type === property.type) score += 5;
    if (item.listingType === property.listingType) score += 4;
    const priceGap = Math.abs(item.price - property.price) / Math.max(property.price, 1);
    score += Math.max(0, 4 - priceGap * 4);
    const areaGap = Math.abs(item.area - property.area) / Math.max(property.area, 1);
    score += Math.max(0, 2 - areaGap * 2);
    return { item, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export interface PortfolioStats {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  rented: number;
  draft: number;
  byType: Record<string, number>;
  totalValue: number;
  averagePrice: number;
}

export function portfolioStats(list: Property[]): PortfolioStats {
  const byType: Record<string, number> = {};
  let totalValue = 0;

  list.forEach((property) => {
    byType[property.type] = (byType[property.type] ?? 0) + 1;
    totalValue += property.price;
  });

  return {
    total: list.length,
    available: list.filter((p) => p.status === 'available').length,
    reserved: list.filter((p) => p.status === 'reserved').length,
    sold: list.filter((p) => p.status === 'sold').length,
    rented: list.filter((p) => p.status === 'rented').length,
    draft: list.filter((p) => p.status === 'draft').length,
    byType,
    totalValue,
    averagePrice: list.length ? Math.round(totalValue / list.length) : 0,
  };
}

/* -------------------------------------------------------------------------- */
/*                             Write operations                                */
/* -------------------------------------------------------------------------- */

export type PropertyDraft = Omit<Property, 'id' | 'slug' | 'views' | 'createdAt'> & {
  id?: string;
  slug?: string;
};

function ensureUniqueSlug(base: string, ignoreId?: string): string {
  const list = getState().properties;
  const root = slugify(base) || uid('property');
  let candidate = root;
  let counter = 2;
  while (list.some((property) => property.slug === candidate && property.id !== ignoreId)) {
    candidate = `${root}-${counter}`;
    counter += 1;
  }
  return candidate;
}

function nextReference(): string {
  const existing = getState().properties.map((property) => Number(property.reference.replace(/\D/g, '')) || 0);
  const next = Math.max(4000, ...existing) + 1;
  return `NST-${next}`;
}

export function createProperty(draft: PropertyDraft): Property {
  const timestamp = new Date().toISOString().slice(0, 10);
  const property: Property = {
    ...draft,
    id: uid('p'),
    reference: draft.reference?.trim() || nextReference(),
    slug: ensureUniqueSlug(draft.slug || draft.title.en || draft.title.ar),
    views: 0,
    createdAt: timestamp,
    amenities: [...draft.amenities],
    interiorFeatures: [...draft.interiorFeatures],
    exteriorFeatures: [...draft.exteriorFeatures],
  };

  mutate((current) => ({ properties: [property, ...current.properties] }));
  logActivity('property', 'admin.activity.propertyCreated', property.title.en || property.reference);
  return property;
}

export function updateProperty(id: string, draft: PropertyDraft): Property | undefined {
  const existing = getProperty(id);
  if (!existing) return undefined;

  const updated: Property = {
    ...existing,
    ...draft,
    id,
    slug: ensureUniqueSlug(draft.slug || draft.title.en || draft.title.ar, id),
    views: existing.views,
    createdAt: existing.createdAt,
  };

  mutate((current) => ({
    properties: current.properties.map((property) => (property.id === id ? updated : property)),
  }));
  logActivity('property', 'admin.activity.propertyUpdated', updated.title.en || updated.reference);
  return updated;
}

export function deleteProperty(id: string): void {
  const property = getProperty(id);
  mutate((current) => ({ properties: current.properties.filter((item) => item.id !== id) }));
  if (property) {
    logActivity('property', 'admin.activity.propertyDeleted', property.title.en || property.reference);
  }
}

export function setPropertyStatus(id: string, status: Property['status']): void {
  const property = getProperty(id);
  if (!property) return;
  mutate((current) => ({
    properties: current.properties.map((item) => (item.id === id ? { ...item, status } : item)),
  }));
  logActivity('property', 'admin.activity.statusChanged', `${property.title.en} · ${status}`);
}

export function duplicateProperty(id: string): Property | undefined {
  const property = getProperty(id);
  if (!property) return undefined;
  return createProperty({
    ...property,
    title: { en: `${property.title.en} (copy)`, ar: `${property.title.ar} (نسخة)` },
    status: 'draft',
    featured: false,
    reference: '',
  });
}

/** Reassigns every listing of a removed consultant. */
export function reassignProperties(fromAgentId: string, toAgentId: string): void {
  mutate((current) => ({
    properties: current.properties.map((property) =>
      property.agentId === fromAgentId ? { ...property, agentId: toAgentId } : property
    ),
  }));
}

/** Every image of a property, derived from its seed prompt. */
export const propertyImages = (property: Property) => propertyGallery(property.imagePrompt);

/** Maps a display language to an image-caption friendly label list. */
export function propertySearchSubtitle(property: Property): string {
  return `${property.address.en} · ${property.reference}`;
}
