import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Bilingual, Direction, Language } from '../types';
import { detectBrowserLanguage, readStoredLanguage, writeJSON, STORAGE_KEYS } from '../lib/storage';
import {
  formatArea,
  formatDate,
  formatDateTime,
  formatMonthShort,
  formatNumber,
  formatPercent,
  formatPrice,
  localeTag,
} from '../lib/format';
import { interpolate, pick, translate, type TranslationKey } from './dictionary';

interface LanguageContextValue {
  lang: Language;
  dir: Direction;
  isRTL: boolean;
  otherLang: Language;
  setLang: (next: Language) => void;
  toggleLang: () => void;
  /** Translate a dictionary key, with optional `{{token}}` values. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  /** Resolve a bilingual content object into the active language. */
  tx: (value: Bilingual) => string;
  locale: string;
  formatNumber: (value: number) => string;
  formatPrice: (value: number, options?: { compact?: boolean }) => string;
  formatArea: (value: number) => string;
  formatDate: (value: string | Date, style?: 'short' | 'long') => string;
  formatDateTime: (value: string | Date) => string;
  formatMonth: (value: string | Date) => string;
  formatPercent: (value: number) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function resolveInitialLanguage(): Language {
  return readStoredLanguage() ?? detectBrowserLanguage();
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => resolveInitialLanguage());

  const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    root.dataset.lang = lang;
    writeJSON(STORAGE_KEYS.language, lang);
  }, [lang, dir]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((current) => (current === 'ar' ? 'en' : 'ar'));
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const t = (key: TranslationKey, vars?: Record<string, string | number>) => translate(lang, key, vars);

    return {
      lang,
      dir,
      isRTL: dir === 'rtl',
      otherLang: lang === 'ar' ? 'en' : 'ar',
      setLang,
      toggleLang,
      t,
      tx: (value: Bilingual) => pick(value, lang),
      locale: localeTag(lang),
      formatNumber: (value: number) => formatNumber(value, lang),
      formatPrice: (value: number, options?: { compact?: boolean }) => formatPrice(value, lang, options),
      formatArea: (value: number) => formatArea(value, lang),
      formatDate: (value: string | Date, style: 'short' | 'long' = 'short') => formatDate(value, lang, style),
      formatDateTime: (value: string | Date) => formatDateTime(value, lang),
      formatMonth: (value: string | Date) => formatMonthShort(value, lang),
      formatPercent: (value: number) => formatPercent(value, lang),
    };
  }, [lang, dir, setLang, toggleLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside a <LanguageProvider>.');
  }
  return context;
}

export { interpolate };
export default LanguageProvider;
