import type { Bilingual } from '../types';

/**
 * NESTORA image system — 100% local, works offline and on any host.
 *
 * Every photograph is resolved to a file in /public/images. A listing's
 * `imagePrompt` is treated as a seed: it picks a category (villa, land, …)
 * and a deterministic photograph from that category's bank.
 *
 * To use a real photo for a listing, put its URL or a path such as
 * `/images/my-villa.jpg` in `imagePrompt` — it is used as-is.
 */
export type ImageSize =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9';

const file = (name: string) => `/images/${name}.jpg`;
const isDirect = (s: string) => /^(https?:)?\/\/|^\/|^data:/.test(s.trim());

function hash(seed: string): number {
  let h = 2166136261;
  for (const ch of seed) {
    h ^= ch.codePointAt(0) ?? 0;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const pick = (bank: string[], seed: string, offset = 0) => bank[(hash(seed) + offset) % bank.length];

type Kind = 'villa' | 'penthouse' | 'townhouse' | 'apartment' | 'commercial' | 'land';

function kindOf(seed: string): Kind {
  const s = seed.toLowerCase();
  if (/\b(land|plot)\b/.test(s)) return 'land';
  if (/commercial|office|retail|shop/.test(s)) return 'commercial';
  if (/penthouse|duplex/.test(s)) return 'penthouse';
  if (/townhouse/.test(s)) return 'townhouse';
  if (/apartment|flat|balcony|building/.test(s)) return 'apartment';
  return 'villa';
}

const COVERS: Record<Kind, string[]> = {
  villa: ['ed-hero-dusk', 'a2', 'ed-about-hero', 'a3', 'c2', 'ed-golden-hour-wide', 'a4', 'c4'],
  penthouse: ['b3', 'c3', 'b2', 'ed-golden-hour-wide', 'b4'],
  townhouse: ['b4', 'a2', 'b2', 'c2', 'a3'],
  apartment: ['d1', 'd2', 'b4', 'd4', 'd3'],
  commercial: ['d3', 'd2', 'd4', 'd1', 'ed-office-facade'],
  land: ['l1', 'l3', 'l2'],
};

const INTERIORS = ['e1', 'e3', 'e4', 'e2'];
const ARCHITECTURE = ['b4', 'd2', 'a4', 'c2', 'b2', 'a3'];
const OUTDOOR = ['b3', 'c3', 'b2', 'c4'];
const EVENING = ['ed-hero-dusk', 'ed-about-hero', 'c3'];

export interface GalleryView {
  id: string;
  label: Bilingual;
}

const L = (en: string, ar: string): Bilingual => ({ en, ar });

/** Retained for compatibility; labels are chosen per category below. */
export const GALLERY_VIEWS: GalleryView[] = [
  { id: 'exterior', label: L('Exterior', 'الواجهة الخارجية') },
  { id: 'living', label: L('Living Space', 'المساحة المعيشية') },
  { id: 'architecture', label: L('Architecture', 'التصميم المعماري') },
  { id: 'details', label: L('Interior Details', 'تفاصيل داخلية') },
  { id: 'outdoor', label: L('Outdoor Living', 'المساحات الخارجية') },
  { id: 'evening', label: L('Evening Light', 'إضاءة المساء') },
];

const LAND_VIEWS: GalleryView[] = [
  { id: 'plot', label: L('The Plot', 'الأرض') },
  { id: 'surroundings', label: L('Surroundings', 'المحيط') },
  { id: 'landscape', label: L('Landscape', 'الطبيعة') },
  { id: 'neighbourhood', label: L('Neighbourhood', 'الحي') },
  { id: 'sunset', label: L('Sunset View', 'إطلالة الغروب') },
  { id: 'evening', label: L('Evening Light', 'إضاءة المساء') },
];

const COMMERCIAL_VIEWS: GalleryView[] = [
  { id: 'facade', label: L('Façade', 'الواجهة') },
  { id: 'entrance', label: L('Entrance', 'المدخل') },
  { id: 'architecture', label: L('Architecture', 'التصميم المعماري') },
  { id: 'street', label: L('Street Level', 'مستوى الشارع') },
  { id: 'details', label: L('Material Details', 'تفاصيل التشطيب') },
  { id: 'surroundings', label: L('Surroundings', 'المحيط') },
];

/** Fills `list` to unique entries, borrowing from `spare` when a photo repeats. */
function unique(list: string[], spare: string[]): string[] {
  const used = new Set<string>();
  const pool = [...spare];
  return list.map((name) => {
    let n = name;
    while (used.has(n) && pool.length) n = pool.shift() as string;
    used.add(n);
    return n;
  });
}

export function propertyGallery(seed: string): { id: string; label: Bilingual; src: string }[] {
  if (isDirect(seed)) return [{ id: 'exterior', label: GALLERY_VIEWS[0].label, src: seed }];
  const kind = kindOf(seed);
  const cover = pick(COVERS[kind], seed);

  let views = GALLERY_VIEWS;
  let names: string[];
  if (kind === 'land') {
    views = LAND_VIEWS;
    names = [cover, 'l3', 'l2', 'a3', 'b3', 'ed-about-hero'];
  } else if (kind === 'commercial') {
    views = COMMERCIAL_VIEWS;
    names = [cover, 'ed-office-facade', 'd2', 'd3', 'd4', 'b4'];
  } else {
    names = [
      cover,
      pick(INTERIORS, seed),
      pick(ARCHITECTURE, seed, 1),
      pick(INTERIORS, seed, 1),
      pick(OUTDOOR, seed),
      pick(EVENING, seed, 1),
    ];
  }
  const spare = [...ARCHITECTURE, ...OUTDOOR, ...EVENING, 'd1', 'd2', 'a2', 'l3'];
  return unique(names, spare).map((name, i) => ({ ...views[i], src: file(name) }));
}

export function propertyCover(seed: string, _size: ImageSize = 'landscape_4_3'): string {
  if (isDirect(seed)) return seed;
  return file(pick(COVERS[kindOf(seed)], seed));
}

const CITY_PHOTOS: Record<string, string> = {
  riyadh: 'p-riyadh',
  jeddah: 'p-jeddah',
  dammam: 'p-dammam',
  khobar: 'p-khobar',
  makkah: 'p-makkah',
  madinah: 'p-madinah',
};

export function cityImage(seed: string): string {
  const s = seed.toLowerCase();
  const key = Object.keys(CITY_PHOTOS).find((c) => s.includes(c));
  return file(key ? CITY_PHOTOS[key] : pick(Object.values(CITY_PHOTOS), seed));
}

export function editorialImage(seed: string, _size: ImageSize = 'landscape_4_3'): string {
  if (isDirect(seed)) return seed;
  const s = seed.toLowerCase();
  if (/office|facade/.test(s)) return file('ed-office-facade');
  if (/living|interior/.test(s)) return file('ed-living-double-height');
  if (/editorial exterior/.test(s)) return file('ed-about-hero');
  if (/dusk/.test(s)) return file('ed-hero-dusk');
  if (/golden/.test(s)) return file('ed-golden-hour-wide');
  return file(pick(COVERS.villa, seed));
}

/* ----------------------------------------------------------------------------
   Agent portraits — refined monogram plates (no stock faces, no network).
   Pass a real photo path/URL as `seed` to use it instead.
   -------------------------------------------------------------------------- */
const PLATES: [string, string, string][] = [
  ['#2B2C28', '#4A4636', '#C8AD7A'],
  ['#34362F', '#6B5B3E', '#E7DDCB'],
  ['#242522', '#5A4B33', '#D9C49A'],
  ['#3A3B37', '#77694B', '#F0E6D0'],
];

export function agentPortrait(seed: string, name = ''): string {
  if (isDirect(seed)) return seed;
  const [a, b, gold] = PLATES[hash(seed + name) % PLATES.length];
  const words = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  const arabic = /[\u0600-\u06FF]/.test(name);
  const letters = words.map((w) => Array.from(w)[0]?.toUpperCase() ?? '');
  const initials = arabic ? letters.join(' ') : letters.join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="400" height="500" fill="url(#g)"/>
<path d="M70 500V250a130 130 0 0 1 260 0v250" fill="none" stroke="${gold}" stroke-opacity=".22" stroke-width="1.5"/>
<path d="M100 500V255a100 100 0 0 1 200 0v245" fill="none" stroke="${gold}" stroke-opacity=".14" stroke-width="1.5"/>
<text x="200" y="278" text-anchor="middle" font-family="Cormorant Garamond,Amiri,Georgia,serif" font-size="108" letter-spacing="${arabic ? 0 : 6}" fill="${gold}">${initials}</text>
<rect x="176" y="318" width="48" height="1.5" fill="${gold}" fill-opacity=".7"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
