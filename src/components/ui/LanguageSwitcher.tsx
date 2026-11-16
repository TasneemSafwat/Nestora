import { Globe } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { languageMeta } from '../../i18n/dictionary';
import { cn } from '../../lib/utils';

/** Two-state language control that swaps the whole interface between EN and AR. */
export function LanguageSwitcher({ className, tone = 'ink' }: { className?: string; tone?: 'ink' | 'canvas' }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-sm border p-0.5',
        tone === 'canvas' ? 'border-canvas/25' : 'border-line',
        className
      )}
      role="group"
      aria-label={t('lang.switch')}
    >
      <Globe size={14} className={cn('mx-1.5', tone === 'canvas' ? 'text-canvas/70' : 'text-secondary')} aria-hidden="true" />
      {(['en', 'ar'] as const).map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={t('lang.switchTo', { lang: languageMeta[code].label })}
            className={cn(
              'rounded-xs px-2.5 py-1 text-[11px] font-medium transition-colors duration-200',
              active
                ? tone === 'canvas'
                  ? 'bg-canvas text-ink'
                  : 'bg-ink text-canvas'
                : tone === 'canvas'
                  ? 'text-canvas/75 hover:text-canvas'
                  : 'text-secondary hover:text-ink'
            )}
          >
            {languageMeta[code].short}
          </button>
        );
      })}
    </div>
  );
}
