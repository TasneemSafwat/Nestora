import type { Language } from '../types';

/**
 * Number and date formatting for both locales.
 * Latin digits are used in Arabic output deliberately — they are the norm on
 * Saudi commercial websites and keep prices scannable.
 */
export function localeTag(lang: Language): string {
  return lang === 'ar' ? 'ar-SA-u-nu-latn' : 'en-SA';
}

const compactSuffix: Record<Language, { million: string; thousand: string; billion: string }> = {
  en: { billion: 'B', million: 'M', thousand: 'K' },
  ar: { billion: ' مليار', million: ' مليون', thousand: ' ألف' },
};

export function formatNumber(value: number, lang: Language): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(localeTag(lang)).format(value);
}

function compact(value: number, lang: Language): string {
  const suffix = compactSuffix[lang];
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${trim(value / 1_000_000_000)}${suffix.billion}`;
  if (abs >= 1_000_000) return `${trim(value / 1_000_000)}${suffix.million}`;
  if (abs >= 1_000) return `${trim(value / 1_000)}${suffix.thousand}`;
  return formatNumber(value, lang);
}

function trim(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** Formats an amount in Saudi Riyals, e.g. `SAR 12,500,000` / `12,500,000 ر.س`. */
export function formatPrice(value: number, lang: Language, options: { compact?: boolean } = {}): string {
  if (!Number.isFinite(value) || value <= 0) {
    return lang === 'ar' ? 'السعر عند الطلب' : 'Price on request';
  }
  const amount = options.compact ? compact(value, lang) : formatNumber(value, lang);
  return lang === 'ar' ? `${amount} ر.س` : `SAR ${amount}`;
}

/** Formats a surface area, e.g. `720 sqm` / `720 م²`. */
export function formatArea(value: number, lang: Language): string {
  const amount = formatNumber(value, lang);
  return lang === 'ar' ? `${amount} م²` : `${amount} sqm`;
}

export function formatAreaRange(min: number, max: number, lang: Language): string {
  return `${formatNumber(min, lang)} – ${formatArea(max, lang)}`;
}

export function formatDate(value: string | Date, lang: Language, style: 'short' | 'long' = 'short'): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(localeTag(lang), {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(value: string | Date, lang: Language): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(localeTag(lang), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatMonthYear(value: string | Date, lang: Language): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(localeTag(lang), { month: 'short', year: '2-digit' }).format(date);
}

export function formatMonthShort(value: string | Date, lang: Language): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(localeTag(lang), { month: 'short' }).format(date);
}

/** Percentage with a fixed precision, used by the dashboard charts. */
export function formatPercent(value: number, lang: Language): string {
  return `${new Intl.NumberFormat(localeTag(lang), { maximumFractionDigits: 1 }).format(value)}%`;
}
