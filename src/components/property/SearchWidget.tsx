import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { cities, propertyTypes } from '../../data/taxonomy';
import type { ListingType, PropertyType } from '../../types';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface Bracket {
  id: string;
  min: number | null;
  max: number | null;
}

const SALE_BRACKETS: Bracket[] = [
  { id: 'any', min: null, max: null },
  { id: 's1', min: null, max: 1_500_000 },
  { id: 's2', min: 1_500_000, max: 3_000_000 },
  { id: 's3', min: 3_000_000, max: 6_000_000 },
  { id: 's4', min: 6_000_000, max: 12_000_000 },
  { id: 's5', min: 12_000_000, max: null },
];

const RENT_BRACKETS: Bracket[] = [
  { id: 'any', min: null, max: null },
  { id: 'r1', min: null, max: 80_000 },
  { id: 'r2', min: 80_000, max: 150_000 },
  { id: 'r3', min: 150_000, max: 250_000 },
  { id: 'r4', min: 250_000, max: 400_000 },
  { id: 'r5', min: 400_000, max: null },
];

/**
 * The hero search. It only builds a query string — the Properties page owns
 * the filter state, so every search is shareable and bookmarkable.
 */
export function SearchWidget({ className }: { className?: string }) {
  const { t, tx, formatPrice } = useLanguage();
  const navigate = useNavigate();

  const [listing, setListing] = useState<ListingType>('sale');
  const [cityId, setCityId] = useState('');
  const [type, setType] = useState<PropertyType | ''>('');
  const [bracket, setBracket] = useState('any');

  const brackets = listing === 'sale' ? SALE_BRACKETS : RENT_BRACKETS;

  const bracketOptions = useMemo(
    () =>
      brackets.map((item) => {
        if (item.min === null && item.max === null) return { id: item.id, label: t('search.budgetAny') };
        if (item.min === null) return { id: item.id, label: `${t('misc.upTo')} ${formatPrice(item.max as number, { compact: true })}` };
        if (item.max === null) return { id: item.id, label: `${t('misc.from')} ${formatPrice(item.min, { compact: true })}` };
        return {
          id: item.id,
          label: `${formatPrice(item.min, { compact: true })} – ${formatPrice(item.max, { compact: true })}`,
        };
      }),
    [brackets, formatPrice, t]
  );

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set('listing', listing);
    if (cityId) params.set('city', cityId);
    if (type) params.set('type', type);
    const chosen = brackets.find((item) => item.id === bracket);
    if (chosen?.min !== null && chosen?.min !== undefined) params.set('minPrice', String(chosen.min));
    if (chosen?.max !== null && chosen?.max !== undefined) params.set('maxPrice', String(chosen.max));
    navigate(`/properties?${params.toString()}`);
  };

  const fieldWrap = 'flex flex-col gap-1.5 px-5 py-4 lg:py-5';

  return (
    <form
      onSubmit={submit}
      className={cn('w-full border border-line bg-surface shadow-panel', className)}
      aria-label={t('search.title')}
    >
      {/* Purpose */}
      <div className="flex items-center gap-1 border-b border-line px-5 pt-4">
        {(['sale', 'rent'] as ListingType[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setListing(value);
              setBracket('any');
            }}
            aria-pressed={listing === value}
            className={cn(
              'relative px-4 pb-3.5 pt-1 text-[12px] font-medium transition-colors duration-200',
              listing === value ? 'text-ink' : 'text-secondary hover:text-ink'
            )}
          >
            {t(value === 'sale' ? 'nav.buy' : 'nav.rent')}
            {listing === value ? <span className="absolute inset-x-2 bottom-0 h-px bg-accent" aria-hidden="true" /> : null}
          </button>
        ))}
      </div>

      <div className="grid divide-y divide-line lg:grid-cols-[1.2fr_1.2fr_1.3fr_auto] lg:divide-x lg:divide-y-0 lg:rtl:divide-x-reverse">
        <label className={fieldWrap}>
          <span className="field-label mb-0">{t('search.location')}</span>
          <select
            value={cityId}
            onChange={(event) => setCityId(event.target.value)}
            className="cursor-pointer border-0 bg-transparent p-0 text-[14px] font-medium text-ink focus:outline-none"
          >
            <option value="">{t('search.allCities')}</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {tx(city.name)}
              </option>
            ))}
          </select>
        </label>

        <label className={fieldWrap}>
          <span className="field-label mb-0">{t('search.category')}</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as PropertyType | '')}
            className="cursor-pointer border-0 bg-transparent p-0 text-[14px] font-medium text-ink focus:outline-none"
          >
            <option value="">{t('search.allTypes')}</option>
            {propertyTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {tx(item.name)}
              </option>
            ))}
          </select>
        </label>

        <label className={fieldWrap}>
          <span className="field-label mb-0">{t('search.priceRange')}</span>
          <select
            value={bracket}
            onChange={(event) => setBracket(event.target.value)}
            className="cursor-pointer border-0 bg-transparent p-0 text-[14px] font-medium text-ink focus:outline-none"
          >
            {bracketOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-stretch p-3 lg:items-center lg:p-4">
          <Button type="submit" size="lg" full icon={<Search size={16} />} className="lg:w-auto lg:px-8">
            {t('action.search')}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default SearchWidget;
