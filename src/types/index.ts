/**
 * NESTORA — shared domain types.
 * These interfaces are the contract for both the component layer and the
 * service layer, so that a real backend can replace localStorage without
 * touching the UI.
 */

export type Language = 'en' | 'ar';

export type Direction = 'ltr' | 'rtl';

export interface Bilingual {
  en: string;
  ar: string;
}

/* -------------------------------------------------------------------------- */
/*                              Taxonomy                                       */
/* -------------------------------------------------------------------------- */

export type PropertyType = 'villa' | 'apartment' | 'penthouse' | 'townhouse' | 'commercial' | 'land';

export type ListingType = 'sale' | 'rent';

export type PropertyStatus = 'available' | 'reserved' | 'sold' | 'rented' | 'draft';

export type Furnishing = 'furnished' | 'semi-furnished' | 'unfurnished';

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'area-desc' | 'newest';

export type ViewMode = 'grid' | 'list';

export interface City {
  id: string;
  name: Bilingual;
  imagePrompt: string;
  /** Short editorial line used on the locations grid. */
  tagline: Bilingual;
}

export interface District {
  id: string;
  cityId: string;
  name: Bilingual;
}

/* -------------------------------------------------------------------------- */
/*                              Properties                                     */
/* -------------------------------------------------------------------------- */

export interface Property {
  id: string;
  reference: string;
  slug: string;
  title: Bilingual;
  description: Bilingual;
  listingType: ListingType;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  /** Rent is quoted per year; sale prices are totals. */
  cityId: string;
  districtId: string;
  address: Bilingual;
  bedrooms: number;
  bathrooms: number;
  area: number;
  lotArea: number | null;
  parking: number;
  yearBuilt: number;
  furnishing: Furnishing;
  amenities: string[];
  interiorFeatures: string[];
  exteriorFeatures: string[];
  /** Seed used to derive every gallery image for this property. */
  imagePrompt: string;
  featured: boolean;
  agentId: string;
  coordinates: { lat: number; lng: number };
  createdAt: string;
  views: number;
}

export interface PropertyFilters {
  q: string;
  cityId: string;
  districtId: string;
  listingType: ListingType | '';
  type: PropertyType | '';
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  minArea: number | null;
  maxArea: number | null;
  furnishing: Furnishing | '';
  amenities: string[];
  status: PropertyStatus | '';
  sort: SortOption;
  view: ViewMode;
  page: number;
}

/* -------------------------------------------------------------------------- */
/*                                Agents                                       */
/* -------------------------------------------------------------------------- */

export interface Agent {
  id: string;
  name: Bilingual;
  title: Bilingual;
  bio: Bilingual;
  cityId: string;
  cityIds: string[];
  specialties: string[];
  languages: string[];
  email: string;
  phone: string;
  whatsapp: string;
  imagePrompt: string;
  experienceYears: number;
  dealsClosed: number;
  rating: number;
  featured: boolean;
  joinedAt: string;
}

/* -------------------------------------------------------------------------- */
/*                                Leads                                        */
/* -------------------------------------------------------------------------- */

export type InquiryStatus = 'new' | 'contacted' | 'qualified' | 'closed';
export type ViewingStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled';
export type ValuationStatus = 'new' | 'in-review' | 'appraised' | 'closed';

interface LeadBase {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface Inquiry extends LeadBase {
  propertyId: string;
  agentId: string;
  status: InquiryStatus;
}

export interface ViewingRequest extends LeadBase {
  propertyId: string;
  agentId: string;
  preferredDate: string;
  preferredTime: string;
  status: ViewingStatus;
}

export interface ValuationRequest extends LeadBase {
  propertyType: PropertyType;
  cityId: string;
  districtId: string;
  area: number;
  bedrooms: number;
  condition: 'new' | 'excellent' | 'good' | 'needs-work';
  expectedPrice: number | null;
  status: ValuationStatus;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: InquiryStatus;
}

export type ActivityKind = 'property' | 'agent' | 'inquiry' | 'viewing' | 'valuation';

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  /** Translation key describing the event. */
  labelKey: string;
  /** Optional human readable subject (property title, person name…). */
  subject: string;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/*                                Content                                      */
/* -------------------------------------------------------------------------- */

export interface Testimonial {
  id: string;
  name: Bilingual;
  role: Bilingual;
  quote: Bilingual;
  cityId: string;
  /** Demo content flag — deliberately explicit so it is never mistaken for real. */
  isDemo: true;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: Bilingual;
  description: Bilingual;
  points: Bilingual[];
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: Bilingual;
}

/* -------------------------------------------------------------------------- */
/*                                Settings                                     */
/* -------------------------------------------------------------------------- */

export interface AppSettings {
  agencyName: string;
  contactEmail: string;
  phone: string;
  whatsapp: string;
  currency: string;
  defaultLanguage: Language;
  listingsPerPage: number;
  showDemoBanner: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              Query results                                 */
/* -------------------------------------------------------------------------- */

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
  perPage: number;
}

