import { Bath, BedDouble, Maximize } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { cn } from '../../lib/utils';

interface PropertyMetaProps {
  bedrooms: number;
  bathrooms: number;
  area: number;
  className?: string;
  tone?: 'ink' | 'muted';
}

/** Beds / baths / area line, consistent across cards, tables and detail pages. */
export function PropertyMeta({ bedrooms, bathrooms, area, className, tone = 'muted' }: PropertyMetaProps) {
  const { formatArea, t } = useLanguage();
  const color = tone === 'ink' ? 'text-ink' : 'text-secondary';

  const items = [
    { icon: BedDouble, label: `${bedrooms}`, title: t('meta.bedrooms') },
    { icon: Bath, label: `${bathrooms}`, title: t('meta.bathrooms') },
    { icon: Maximize, label: formatArea(area), title: t('meta.area') },
  ];

  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]', color, className)}>
      {items.map((item) => {
        const ItemIcon = item.icon;
        return (
          <li key={item.title} className="inline-flex items-center gap-1.5" title={item.title}>
            <ItemIcon size={14} className="shrink-0 opacity-70" aria-hidden="true" />
            <span>{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default PropertyMeta;
