import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { cityById, districtById, propertyTypeById } from '../../data/taxonomy';
import { propertyCover } from '../../lib/images';
import type { Property } from '../../types';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { SmartImage } from '../ui/SmartImage';
import { FavoriteButton } from './FavoriteButton';
import { PropertyMeta } from './PropertyMeta';

interface PropertyCardProps {
  property: Property;
  /** `featured` is used for the homepage portfolio; `compact` inside side columns. */
  variant?: 'grid' | 'featured' | 'compact';
  className?: string;
  priority?: boolean;
}

export function PropertyCard({ property, variant = 'grid', className, priority = false }: PropertyCardProps) {
  const { t, tx, formatPrice } = useLanguage();

  const city = cityById(property.cityId);
  const district = districtById(property.districtId);
  const type = propertyTypeById(property.type);
  const title = tx(property.title);
  const soldOut = property.status === 'sold' || property.status === 'rented';

  const ratio = variant === 'featured' ? 'aspect-[16/11]' : variant === 'compact' ? 'aspect-[3/2]' : 'aspect-[4/3]';

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <Link to={`/properties/${property.slug}`} className="flex flex-1 flex-col">
        <div className="relative overflow-hidden bg-canvas-deep">
          <SmartImage
            src={propertyCover(property.imagePrompt, variant === 'featured' ? 'landscape_16_9' : 'landscape_4_3')}
            alt={`${title} — ${tx(property.address)}`}
            ratio={ratio}
            priority={priority}
            className={cn('transition-transform duration-[900ms] ease-editorial', !soldOut && 'group-hover:scale-[1.035]')}
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3.5">
            <div className="flex flex-wrap gap-2">
              {soldOut ? (
                <Badge tone="muted">{t(property.status === 'sold' ? 'status.sold' : 'status.rented')}</Badge>
              ) : property.status === 'reserved' ? (
                <Badge tone="warning">{t('status.reserved')}</Badge>
              ) : (
                <Badge tone={property.listingType === 'sale' ? 'neutral' : 'accent'}>
                  {t(property.listingType === 'sale' ? 'badge.forSale' : 'badge.forRent')}
                </Badge>
              )}
              {property.featured && !soldOut ? <Badge tone="accent">{t('badge.featured')}</Badge> : null}
            </div>
            <FavoriteButton propertyId={property.id} propertyName={title} className="shrink-0" />
          </div>

          {variant === 'featured' ? (
            <span className="pointer-events-none absolute bottom-4 end-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface/92 text-ink opacity-0 backdrop-blur-sm transition-all duration-500 ease-editorial group-hover:opacity-100">
              <ArrowUpRight size={17} className="rtl:-scale-x-100" />
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <p className="text-[11px] uppercase tracking-editorial text-secondary">
            {district ? tx(district.name) : null}
            {district && city ? ' · ' : null}
            {city ? tx(city.name) : null}
            {type ? <span className="text-secondary/60"> — {tx(type.name)}</span> : null}
          </p>

          <h3
            className={cn(
              'mt-2.5 font-display leading-snug text-ink transition-colors duration-300 group-hover:text-accent-deep',
              variant === 'featured' ? 'text-[clamp(1.35rem,2.2vw,1.7rem)]' : 'text-[21px]'
            )}
          >
            {title}
          </h3>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t border-line pt-4">
            <PropertyMeta bedrooms={property.bedrooms} bathrooms={property.bathrooms} area={property.area} />
            <p className="flex items-baseline gap-1.5">
              <span
                className={cn(
                  'font-display text-ink',
                  variant === 'featured' ? 'text-[clamp(1.15rem,1.9vw,1.45rem)]' : 'text-[19px]'
                )}
              >
                {formatPrice(property.price, { compact: variant === 'featured' })}
              </span>
              {property.listingType === 'rent' ? (
                <span className="text-[11px] text-secondary">/ {t('meta.perYear')}</span>
              ) : null}
            </p>
          </div>

          <p className="mt-3 text-[11px] text-secondary/80">
            {t('property.refLabel', { reference: property.reference })}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default PropertyCard;
