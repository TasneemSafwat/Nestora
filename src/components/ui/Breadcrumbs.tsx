import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { cn } from '../../lib/utils';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const { t } = useLanguage();

  return (
    <nav aria-label={t('a11y.breadcrumb')} className={cn('flex flex-wrap items-center gap-2 text-[12px]', className)}>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.to && !last ? (
              <Link to={item.to} className="text-secondary transition-colors hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span className={last ? 'text-ink' : 'text-secondary'} aria-current={last ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!last ? <ChevronRight size={13} className="shrink-0 text-secondary/60 rtl:rotate-180" aria-hidden="true" /> : null}
          </span>
        );
      })}
    </nav>
  );
}
