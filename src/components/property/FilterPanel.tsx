import { RotateCcw } from 'lucide-react';
import type { PropertyFilters } from '../../types';
import { useLanguage } from '../../i18n';
import {
  amenities as amenityList,
  cities,
  districtsByCity,
  furnishingOptions,
  propertyStatuses,
  propertyTypes,
} from '../../data/taxonomy';
import { Button } from '../ui/Button';
import { Collapsible } from '../ui/Collapsible';
import { CheckboxField, Segmented, SelectField, TextField } from '../ui/Field';
import { RangeField } from '../ui/RangeField';
import { cn } from '../../lib/utils';

interface FilterPanelProps {
  value: PropertyFilters;
  onChange: (patch: Partial<PropertyFilters>) => void;
  onReset: () => void;
  /** How many listings the current draft would return. */
  resultCount: number;
  /** Supplied by the mobile drawer, which applies a draft instead of live updates. */
  onApply?: () => void;
  applyLabel?: string;
  className?: string;
}

const BED_OPTIONS = ['any', '1', '2', '3', '4', '5'] as const;

type PriceBracket = [number | null, number | null];

const SALE_BRACKETS: PriceBracket[] = [
  [null, 1_500_000],
  [1_500_000, 3_000_000],
  [3_000_000, 6_000_000],
  [6_000_000, 12_000_000],
  [12_000_000, null],
];

const RENT_BRACKETS: PriceBracket[] = [
  [null, 80_000],
  [80_000, 150_000],
  [150_000, 250_000],
  [250_000, 400_000],
  [400_000, null],
];

/**
 * The refinement panel. It is deliberately controlled and stateless so the
 * desktop sidebar can write straight to the URL while the mobile drawer keeps
 * a draft and commits it on "apply".
 */
export function FilterPanel({
  value,
  onChange,
  onReset,
  resultCount,
  onApply,
  applyLabel,
  className,
}: FilterPanelProps) {
  const { t, tx, formatPrice, formatNumber } = useLanguage();

  const districtOptions = value.cityId ? districtsByCity(value.cityId) : [];
  const brackets = value.listingType === 'rent' ? RENT_BRACKETS : SALE_BRACKETS;

  const pricePresets = brackets.map(([min, max]) => ({
    value: [min, max] as PriceBracket,
    label:
      min === null && max !== null
        ? t('properties.chips.under', { value: formatPrice(max, { compact: true }) })
        : max === null && min !== null
          ? t('properties.chips.over', { value: formatPrice(min, { compact: true }) })
          : `${formatPrice(min ?? 0, { compact: true })} – ${formatPrice(max ?? 0, { compact: true })}`,
  }));

  const toggleAmenity = (id: string) => {
    const next = value.amenities.includes(id)
      ? value.amenities.filter((item) => item !== id)
      : [...value.amenities, id];
    onChange({ amenities: next });
  };

  const numberValue = (input: number | null): string => (input === null ? '' : String(input));

  return (
    <div className={cn('flex flex-col gap-9', className)}>
      <div className="flex flex-col gap-5">
        <TextField
          label={t('properties.filters.keyword')}
          placeholder={t('search.placeholderKeyword')}
          value={value.q}
          onChange={(event) => onChange({ q: event.target.value })}
        />

        <div>
          <span className="field-label">{t('properties.filters.listingType')}</span>
          <Segmented
            ariaLabel={t('properties.filters.listingType')}
            value={value.listingType || 'all'}
            onChange={(next) =>
              onChange({
                listingType: next === 'all' ? '' : (next as PropertyFilters['listingType']),
                minPrice: null,
                maxPrice: null,
              })
            }
            options={[
              { value: 'all', label: t('properties.filters.anyListing') },
              { value: 'sale', label: t('nav.buy') },
              { value: 'rent', label: t('nav.rent') },
            ]}
          />
        </div>

        <SelectField
          label={t('properties.filters.city')}
          value={value.cityId}
          placeholder={t('search.allCities')}
          options={cities.map((city) => ({ value: city.id, label: tx(city.name) }))}
          onChange={(event) => onChange({ cityId: event.target.value, districtId: '' })}
        />

        <SelectField
          label={t('properties.filters.district')}
          value={value.districtId}
          placeholder={t('search.allDistricts')}
          disabled={!value.cityId}
          hint={!value.cityId ? t('properties.filters.city') : undefined}
          options={districtOptions.map((district) => ({ value: district.id, label: tx(district.name) }))}
          onChange={(event) => onChange({ districtId: event.target.value })}
        />

        <SelectField
          label={t('properties.filters.type')}
          value={value.type}
          placeholder={t('search.allTypes')}
          options={propertyTypes.map((type) => ({ value: type.id, label: tx(type.name) }))}
          onChange={(event) => onChange({ type: event.target.value as PropertyFilters['type'] })}
        />
      </div>

      <div className="rule" aria-hidden="true" />

      <div className="flex flex-col gap-6">
        <RangeField
          minLabel={t('properties.filters.price')}
          maxLabel={t('properties.filters.price')}
          value={[value.minPrice, value.maxPrice]}
          step={value.listingType === 'rent' ? 5_000 : 100_000}
          presets={pricePresets}
          format={(amount) => formatPrice(amount, { compact: true })}
          onChange={([min, max]) => onChange({ minPrice: min, maxPrice: max })}
        />

        <div>
          <span className="field-label">{t('properties.filters.bedrooms')}</span>
          <Segmented
            ariaLabel={t('properties.filters.bedrooms')}
            value={numberValue(value.bedrooms) || 'any'}
            onChange={(next) => onChange({ bedrooms: next === 'any' ? null : Number(next) })}
            options={BED_OPTIONS.map((option) => ({
              value: option,
              label:
                option === 'any'
                  ? t('properties.bedrooms.any')
                  : t('properties.bedrooms.label', { count: option }),
            }))}
          />
        </div>

        <div>
          <span className="field-label">{t('properties.filters.bathrooms')}</span>
          <Segmented
            ariaLabel={t('properties.filters.bathrooms')}
            value={numberValue(value.bathrooms) || 'any'}
            onChange={(next) => onChange({ bathrooms: next === 'any' ? null : Number(next) })}
            options={BED_OPTIONS.map((option) => ({
              value: option,
              label:
                option === 'any'
                  ? t('properties.bathrooms.any')
                  : t('properties.bathrooms.label', { count: option }),
            }))}
          />
        </div>

        <RangeField
          minLabel={t('properties.area.min')}
          maxLabel={t('properties.area.max')}
          value={[value.minArea, value.maxArea]}
          step={10}
          format={(amount) => formatNumber(amount)}
          onChange={([min, max]) => onChange({ minArea: min, maxArea: max })}
        />

        <div>
          <span className="field-label">{t('properties.filters.furnishing')}</span>
          <Segmented
            ariaLabel={t('properties.filters.furnishing')}
            value={value.furnishing || 'all'}
            onChange={(next) =>
              onChange({ furnishing: next === 'all' ? '' : (next as PropertyFilters['furnishing']) })
            }
            options={[
              { value: 'all', label: t('form.anyOption') },
              ...furnishingOptions.map((option) => ({ value: option.id, label: tx(option.name) })),
            ]}
          />
        </div>

        <SelectField
          label={t('properties.filters.status')}
          value={value.status}
          placeholder={t('properties.filters.anyStatus')}
          options={propertyStatuses
            .filter((status) => status.id !== 'draft')
            .map((status) => ({ value: status.id, label: tx(status.name) }))}
          onChange={(event) => onChange({ status: event.target.value as PropertyFilters['status'] })}
        />
      </div>

      <div className="rule" aria-hidden="true" />

      <Collapsible
        title={t('properties.filters.amenities')}
        defaultOpen={value.amenities.length > 0}
        meta={
          value.amenities.length ? t('properties.filters.amenitiesSelected', { count: value.amenities.length }) : null
        }
      >
        <div className="no-scrollbar mt-4 max-h-64 space-y-3 overflow-y-auto pe-1">
          {amenityList.map((amenity) => (
            <CheckboxField
              key={amenity.id}
              label={tx(amenity.name)}
              checked={value.amenities.includes(amenity.id)}
              onChange={() => toggleAmenity(amenity.id)}
            />
          ))}
        </div>
      </Collapsible>

      <div className="rule" aria-hidden="true" />

      <div className="flex flex-col gap-3">
        {onApply ? (
          <Button type="button" variant="primary" full onClick={onApply}>
            {applyLabel ?? t('action.applyFilters')}
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          full
          icon={<RotateCcw size={14} aria-hidden="true" />}
          onClick={onReset}
        >
          {t('action.resetFilters')}
        </Button>
        <p className="text-center text-[11px] text-secondary">
          {resultCount === 1
            ? t('properties.filters.showResultOne')
            : t('properties.filters.showResults', { count: resultCount })}
        </p>
      </div>
    </div>
  );
}

export default FilterPanel;
