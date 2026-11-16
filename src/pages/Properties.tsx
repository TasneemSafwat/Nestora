import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import type { PropertyFilters, SortOption, ViewMode } from '../types';
import { useLanguage, type TranslationKey } from '../i18n';
import { useDatabase } from '../hooks/useDatabase';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { usePropertyFilters } from '../hooks/usePropertyFilters';
import { amenityById, cityById, districtById, furnishingOptions, propertyTypeById, propertyStatuses } from '../data/taxonomy';
import { filterProperties, publishedProperties, queryProperties } from '../services/propertyService';
import { FilterPanel } from '../components/property/FilterPanel';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyListItem } from '../components/property/PropertyListItem';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { Segmented, SelectField } from '../components/ui/Field';
import { Pagination } from '../components/ui/Pagination';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SkeletonGrid } from '../components/ui/Skeleton';

const SORT_OPTIONS: SortOption[] = ['recommended', 'price-asc', 'price-desc', 'area-desc', 'newest'];

const SORT_LABEL: Record<SortOption, TranslationKey> = {
  recommended: 'sort.recommended',
  'price-asc': 'sort.priceAsc',
  'price-desc': 'sort.priceDesc',
  'area-desc': 'sort.areaDesc',
  newest: 'sort.newest',
};

export function Properties() {
  const { t, tx, isRTL, formatPrice } = useLanguage();
  const { properties, settings } = useDatabase();
  const { filters, update, commit, reset, activeCount } = usePropertyFilters();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<PropertyFilters>(filters);
  const [isPending, startTransition] = useTransition();

  useLockBodyScroll(drawerOpen);

  const published = useMemo(() => publishedProperties(properties), [properties]);
  const perPage = settings.listingsPerPage || 9;
  const result = useMemo(() => queryProperties(published, filters, perPage), [published, filters, perPage]);

  const draftCount = useMemo(() => filterProperties(published, draft).length, [published, draft]);

  const patch = (next: Partial<PropertyFilters>) => {
    startTransition(() => update(next));
  };

  const openDrawer = () => {
    setDraft(filters);
    setDrawerOpen(true);
  };

  const applyDraft = () => {
    setDrawerOpen(false);
    startTransition(() => commit(draft));
  };

  const from = result.total === 0 ? 0 : (result.page - 1) * perPage + 1;
  const to = Math.min(result.page * perPage, result.total);

  const chips = useMemo(() => {
    const list: { key: string; label: string; clear: () => void }[] = [];
    const push = (key: string, label: string, next: Partial<PropertyFilters>) =>
      list.push({ key, label, clear: () => patch(next) });

    if (filters.q.trim()) push('q', t('properties.chips.results', { value: filters.q.trim() }), { q: '' });
    if (filters.listingType)
      push('listing', t(filters.listingType === 'sale' ? 'nav.buy' : 'nav.rent'), { listingType: '' });
    if (filters.cityId) push('city', tx(cityById(filters.cityId)?.name ?? { en: '', ar: '' }), { cityId: '', districtId: '' });
    if (filters.districtId)
      push('district', tx(districtById(filters.districtId)?.name ?? { en: '', ar: '' }), { districtId: '' });
    if (filters.type) push('type', tx(propertyTypeById(filters.type)?.name ?? { en: '', ar: '' }), { type: '' });
    if (filters.minPrice !== null)
      push('minPrice', t('properties.chips.over', { value: formatPrice(filters.minPrice, { compact: true }) }), {
        minPrice: null,
      });
    if (filters.maxPrice !== null)
      push('maxPrice', t('properties.chips.under', { value: formatPrice(filters.maxPrice, { compact: true }) }), {
        maxPrice: null,
      });
    if (filters.bedrooms !== null)
      push('beds', t('properties.bedrooms.label', { count: filters.bedrooms }), { bedrooms: null });
    if (filters.bathrooms !== null)
      push('baths', t('properties.bathrooms.label', { count: filters.bathrooms }), { bathrooms: null });
    if (filters.minArea !== null) push('minArea', t('properties.area.min'), { minArea: null });
    if (filters.maxArea !== null) push('maxArea', t('properties.area.max'), { maxArea: null });
    if (filters.furnishing) {
      const option = furnishingOptions.find((item) => item.id === filters.furnishing);
      if (option) push('furnishing', tx(option.name), { furnishing: '' });
    }
    if (filters.status) {
      const status = propertyStatuses.find((item) => item.id === filters.status);
      if (status) push('status', tx(status.name), { status: '' });
    }
    filters.amenities.forEach((id) => {
      const amenity = amenityById(id);
      if (amenity)
        push(`amenity-${id}`, tx(amenity.name), { amenities: filters.amenities.filter((item) => item !== id) });
    });

    return list;
  }, [filters, patch, t, tx, formatPrice]);

  return (
    <>
      {/* Page header */}
      <section className="border-b border-line bg-surface">
        <div className="shell pb-12 pt-10 lg:pb-16 lg:pt-14">
          <Breadcrumbs
            items={[
              { label: t('nav.home'), to: '/' },
              { label: t('nav.properties') },
            ]}
          />
          <div className="mt-8">
            <SectionHeading
              as="h1"
              eyebrow={t('properties.page.eyebrow')}
              titleLead={t('properties.page.titleLead')}
              titleAccent={t('properties.page.titleAccent')}
              text={t('properties.page.subtitle')}
            />
          </div>
        </div>
      </section>

      {/* Sticky toolbar */}
      <div className="sticky top-[68px] z-30 border-b border-line bg-canvas/95 backdrop-blur-md lg:top-[76px]">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-3.5">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="lg:hidden"
              icon={<SlidersHorizontal size={14} aria-hidden="true" />}
              onClick={openDrawer}
            >
              {t('properties.filters.show')}
            </Button>
            {activeCount > 0 ? <Badge tone="accent">{t('results.filtersActive', { count: activeCount })}</Badge> : null}
            <p className="hidden text-[12px] text-secondary sm:block">
              {t('results.showing', { from, to, total: result.total })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <SelectField
              aria-label={t('sort.label')}
              containerClassName="w-[190px]"
              value={filters.sort}
              options={SORT_OPTIONS.map((option) => ({ value: option, label: t(SORT_LABEL[option]) }))}
              onChange={(event) => patch({ sort: event.target.value as SortOption })}
              className="py-2 text-[12px]"
            />
            <Segmented
              ariaLabel={t('properties.toolbar.viewMode')}
              value={filters.view}
              onChange={(next) => patch({ view: next as ViewMode })}
              options={[
                { value: 'grid', label: t('view.grid') },
                { value: 'list', label: t('view.list') },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="shell grid gap-10 py-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14 lg:py-16">
        <aside className="hidden lg:block" aria-label={t('properties.filters.title')}>
          <div className="sticky top-36">
            <h2 className="eyebrow mb-6">{t('properties.filters.title')}</h2>
            <FilterPanel
              value={filters}
              onChange={patch}
              onReset={reset}
              resultCount={result.total}
            />
          </div>
        </aside>

        <div>
          {chips.length ? (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <Chip
                  key={chip.key}
                  label={chip.label}
                  onRemove={chip.clear}
                  removeLabel={t('properties.chips.remove', { label: chip.label })}
                />
              ))}
              <button
                type="button"
                className="link-underline text-[12px] text-accent-deep"
                onClick={reset}
              >
                {t('action.clearAll')}
              </button>
            </div>
          ) : null}

          {isPending ? <SkeletonGrid count={3} /> : null}

          {!isPending && result.items.length === 0 ? (
            <EmptyState
              title={t('empty.properties')}
              text={t('empty.propertiesHint')}
              action={<Button onClick={reset}>{t('action.resetFilters')}</Button>}
            />
          ) : null}

          {!isPending && result.items.length > 0 ? (
            <div className={isPending ? 'opacity-60' : undefined}>
              {filters.view === 'grid' ? (
                <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                  {result.items.map((property, index) => (
                    <Reveal key={property.id} delay={0.04 * (index % 3)}>
                      <PropertyCard property={property} priority={index < 3} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {result.items.map((property, index) => (
                    <Reveal key={property.id} delay={0.04 * (index % 3)}>
                      <PropertyListItem property={property} />
                    </Reveal>
                  ))}
                </div>
              )}

              <div className="mt-16">
                <Pagination
                  page={result.page}
                  pageCount={result.pageCount}
                  onChange={(page) => patch({ page })}
                  previousLabel={t('properties.pagination.previous')}
                  nextLabel={t('properties.pagination.next')}
                  pageLabel={(page) => t('properties.pagination.page', { page })}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile filter drawer — keeps a draft and commits it on apply. */}
      <AnimatePresence>
        {drawerOpen ? (
          <div className="fixed inset-0 z-[110] lg:hidden">
            <motion.div
              className="absolute inset-0 bg-ink/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={t('properties.filters.title')}
              className="absolute inset-y-0 end-0 flex w-[min(420px,92vw)] flex-col bg-canvas"
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="text-[13px] uppercase tracking-editorial text-ink">{t('properties.filters.title')}</h2>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label={t('nav.close')}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink transition-colors hover:bg-canvas-deep"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-7">
                <FilterPanel
                  value={draft}
                  onChange={(next) => setDraft((current) => ({ ...current, ...next }))}
                  onReset={() => setDraft({ ...filters, q: '', cityId: '', districtId: '', listingType: '', type: '', minPrice: null, maxPrice: null, bedrooms: null, bathrooms: null, minArea: null, maxArea: null, furnishing: '', amenities: [], status: '' })}
                  resultCount={draftCount}
                  onApply={applyDraft}
                  applyLabel={
                    draftCount === 1
                      ? t('properties.filters.showResultOne')
                      : t('properties.filters.showResults', { count: draftCount })
                  }
                />
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Properties;
