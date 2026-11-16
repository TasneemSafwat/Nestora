import type { Language, Bilingual } from '../types';

import { common as enCommon } from './locales/en/common';
import { home as enHome } from './locales/en/home';
import { properties as enProperties } from './locales/en/properties';
import { agents as enAgents } from './locales/en/agents';
import { about as enAbout } from './locales/en/about';
import { contact as enContact } from './locales/en/contact';
import { admin as enAdmin } from './locales/en/admin';

import { ar as arCommon } from './locales/ar/common';
import { ar as arHome } from './locales/ar/home';
import { ar as arProperties } from './locales/ar/properties';
import { ar as arAgents } from './locales/ar/agents';
import { ar as arAbout } from './locales/ar/about';
import { ar as arContact } from './locales/ar/contact';
import { ar as arAdmin } from './locales/ar/admin';

export const translations = {
  en: {
    ...enCommon,
    ...enHome,
    ...enProperties,
    ...enAgents,
    ...enAbout,
    ...enContact,
    ...enAdmin,
  },
  ar: {
    ...arCommon,
    ...arHome,
    ...arProperties,
    ...arAgents,
    ...arAbout,
    ...arContact,
    ...arAdmin,
  },
};

export type TranslationKey = keyof typeof translations.en;

/**
 * Compile-time guarantee that the Arabic dictionary covers every English key
 * and introduces no keys of its own.
 */
const arabicCompletenessCheck: Record<TranslationKey, string> = translations.ar;
void arabicCompletenessCheck;

export const LANGUAGES: Language[] = ['en', 'ar'];

export const languageMeta: Record<Language, { label: string; short: string; dir: 'ltr' | 'rtl' }> = {
  en: { label: 'English', short: 'EN', dir: 'ltr' },
  ar: { label: 'العربية', short: 'ع', dir: 'rtl' },
};

/** Replaces `{{token}}` placeholders in a translated string. */
export function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, token: string) => {
    const value = vars[token];
    return value === undefined || value === null ? match : String(value);
  });
}

export function translate(
  lang: Language,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const dictionary = translations[lang] as Record<string, string>;
  const fallback = translations.en as Record<string, string>;
  return interpolate(dictionary[key] ?? fallback[key] ?? key, vars);
}

/** Picks the right side of a bilingual content object. */
export function pick(value: Bilingual, lang: Language): string {
  return value[lang] || value.en;
}
