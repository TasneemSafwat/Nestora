import { ExternalLink, MapPin } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { cn } from '../../lib/utils';

interface MapPanelProps {
  lat: number;
  lng: number;
  label: string;
  note?: string;
  linkLabel: string;
  className?: string;
  height?: string;
}

/**
 * Deliberately stylised location panel. A live map integration would require a
 * third-party key, so the demo shows an abstract plan with the approximate
 * coordinates and a link that opens the real map service.
 */
export function MapPanel({ lat, lng, label, note, linkLabel, className, height = 'h-[320px]' }: MapPanelProps) {
  const { t } = useLanguage();
  const href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className={cn('relative overflow-hidden rounded-sm border border-line bg-canvas-deep', height, className)}>
      <svg className="absolute inset-0 h-full w-full text-line" aria-hidden="true">
        <defs>
          <pattern id="nestora-grid" width="46" height="46" patternUnits="userSpaceOnUse">
            <path d="M46 0H0V46" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#nestora-grid)" />
        <path d="M-20 130 C 120 90, 260 190, 420 120 S 700 40, 900 110" fill="none" stroke="#DBD6CC" strokeWidth="14" />
        <path d="M60 -20 C 110 120, 40 260, 130 400" fill="none" stroke="#E4E0D7" strokeWidth="10" />
        <path d="M-20 300 C 180 260, 320 360, 620 300" fill="none" stroke="#E4E0D7" strokeWidth="8" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="relative flex h-12 w-12 items-center justify-center">
          <span className="absolute h-12 w-12 animate-pulse rounded-full bg-accent/15" aria-hidden="true" />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-ink text-canvas">
            <MapPin size={17} />
          </span>
        </span>
        <p className="mt-4 max-w-xs px-6 text-[13px] font-medium text-ink">{label}</p>
        <p className="mt-1 text-[11px] text-secondary">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface/85 px-4 py-3 backdrop-blur-sm">
        <p className="text-[11px] text-secondary">{note ?? t('property.location.mapNote')}</p>
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-accent link-underline"
        >
          {linkLabel}
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
