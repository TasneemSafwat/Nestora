import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { cityById, districtById, propertyTypeById } from '../../data/taxonomy';
import { propertyCover } from '../../lib/images';
import type { Property } from '../../types';
import { cn, truncate } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { ButtonLink } from '../ui/Button';
import { SmartImage } from '../ui/SmartImage';
import { FavoriteButton } from './FavoriteButton';
import { PropertyMeta } from './PropertyMeta';

/** Horizontal result row used when the visitor switches the results to list view. */
export function PropertyListItem({ property, className }: { property: Property; className?: string }) {
  const { t, tx, formatPrice } = useLanguage();

  const city = cityById(property.cityId);
  const district = districtById(property.districtId);
  const type = propertyTypeById(property.type);
  const title = tx(property.title);
  const soldOut = property.status === 'sold' || property.status === 'rented';

  return (
    <article className={cn('group relative border-b border-line pb-8 last:border-0', className)}>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,300px)_1fr] sm:gap-7 lg:grid-cols-[minmax(0,380px)_1fr]">
        <Link to={`/properties/${property.slug}`} className="relative block overflow-hidden bg-canvas-deep">
          <SmartImage
            src={propertyCover(property.imagePrompt)}
            alt={title}
            ratio="aspect-[4/3]"
            className="transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.03]"
          />
          <span className="absolute start-3 top-3">
            <Badge tone={soldOut ? 'muted' : property.listingType === 'sale' ? 'neutral' : 'accent'}>
              {t(soldOut ? (property.status === 'sold' ? 'status.sold' : 'status.rented') : property.listingType === 'sale' ? 'badge.forSale' : 'badge.forRent')}
            </Badge>
          </span>
        </Link>

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-editorial text-secondary">
                {type ? tx(type.name) : null}
                {type && district ? ' — ' : null}
                {district ? tx(district.name) : null}
              </p>
              <h3 className="mt-2 font-display text-[clamp(1.25rem,2.2vw,1.7rem)] leading-snug text-ink">
                <Link to={`/properties/${property.slug}`} className="transition-colors hover:text-accent-deep">
                  {title}
                </Link>
              </h3>
            </div>
            <FavoriteButton propertyId={property.id} propertyName={title} className="shrink-0" />
          </div>

          <p className="mt-2 flex items-center gap-1.5 text-[12px] text-secondary">
            <MapPin size={13} className="text-accent" aria-hidden="true" />
            {tx(property.address)}
            {city ? <span className="text-secondary/60"> · {tx(city.name)}</span> : null}
          </p>

          <p className="mt-4 hidden max-w-reading text-[13px] leading-relaxed text-secondary md:block">
            {truncate(tx(property.description), 190)}
          </p>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-5 border-t border-line pt-4">
            <PropertyMeta bedrooms={property.bedrooms} bathrooms={property.bathrooms} area={property.area} />
            <div className="flex items-center gap-5">
              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-[clamp(1.15rem,2vw,1.5rem)] text-ink">
                  {formatPrice(property.price)}
                </span>
                {property.listingType === 'rent' ? (
                  <span className="text-[11px] text-secondary">/ {t('meta.perYear')}</span>
                ) : null}
              </p>
              <ButtonLink to={`/properties/${property.slug}`} variant="outline" size="sm" iconEnd={<ArrowRight size={14} className="rtl:rotate-180" />}>
                {t('action.viewDetails')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PropertyListItem;
