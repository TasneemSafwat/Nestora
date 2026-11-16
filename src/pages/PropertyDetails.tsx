import {
  ArrowLeft,
  Bath,
  BedDouble,
  Calendar,
  Car,
  Check,
  FileText,
  Heart,
  Images,
  Mail,
  MapPin,
  Maximize,
  MessageCircle,
  Phone,
  Printer,
  Share2,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Bilingual, Property } from '../types';
import { useLanguage } from '../i18n';
import { useDatabase } from '../hooks/useDatabase';
import { useFavorites } from '../hooks/useFavorites';
import {
  amenityById,
  cityById,
  districtById,
  furnishingOptions,
  featureById,
  propertyTypeById,
} from '../data/taxonomy';
import { agentListingCount } from '../services/agentService';
import { getPropertyBySlug, registeredView, similarProperties, propertyImages } from '../services/propertyService';
import { agentPortrait } from '../lib/images';
import { InquiryForm, ViewingForm } from '../components/property/PropertyForms';
import { PropertyCard } from '../components/property/PropertyCard';
import { AgentCard } from '../components/agent/AgentCard';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Button, ButtonAnchor, ButtonLink } from '../components/ui/Button';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EmptyState } from '../components/ui/EmptyState';
import { Icon } from '../components/ui/Icon';
import { Lightbox } from '../components/ui/Lightbox';
import { MapPanel } from '../components/ui/MapPanel';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SmartImage } from '../components/ui/SmartImage';
import { Tabs, type TabItem } from '../components/ui/Tabs';
import { useToast } from '../components/ui/Toast';
import { telHref, whatsappHref } from '../lib/utils';

type PanelTab = 'inquiry' | 'viewing';
type ContentTab = 'overview' | 'features' | 'location' | 'consultant';

const EMPTY: Bilingual = { en: '', ar: '' };

export function PropertyDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { t, tx, formatPrice, formatArea, formatNumber, formatDate } = useLanguage();
  const { properties, agents } = useDatabase();
  const { has, toggle } = useFavorites();
  const toast = useToast();

  const property = useMemo(
    () => properties.find((item) => item.slug === slug) ?? getPropertyBySlug(slug ?? ''),
    [properties, slug]
  );

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [contentTab, setContentTab] = useState<ContentTab>('overview');
  const [panelTab, setPanelTab] = useState<PanelTab>('inquiry');
  const counted = useRef<string | null>(null);

  useEffect(() => {
    if (!property) return;
    if (counted.current === property.id) return;
    counted.current = property.id;
    registeredView(property.id);
  }, [property]);

  useEffect(() => {
    setLightbox(null);
    setContentTab('overview');
    setPanelTab('inquiry');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  if (!property) {
    return (
      <div className="shell py-28">
        <EmptyState
          title={t('notFound.title')}
          text={t('notFound.text')}
          action={<ButtonLink to="/properties">{t('notFound.cta')}</ButtonLink>}
        />
      </div>
    );
  }

  const gallery = propertyImages(property);
  const agent = agents.find((item) => item.id === property.agentId);
  const city = cityById(property.cityId);
  const district = districtById(property.districtId);
  const type = propertyTypeById(property.type);
  const furnishing = furnishingOptions.find((item) => item.id === property.furnishing);
  const similar = similarProperties(property, 3);
  const saved = has(property.id);

  const locationLabel = t('property.location.district', {
    district: tx(district?.name ?? EMPTY),
    city: tx(city?.name ?? EMPTY),
  });

  const statusNote =
    property.status === 'sold'
      ? t('property.status.soldNote')
      : property.status === 'rented'
        ? t('property.status.rentedNote')
        : property.status === 'reserved'
          ? t('property.status.reservedNote')
          : property.status === 'draft'
            ? t('property.status.draftNote')
            : null;

  const specs: { label: string; value: string }[] = [
    { label: t('meta.reference'), value: property.reference },
    { label: t('meta.type'), value: tx(type?.name ?? EMPTY) },
    { label: t('meta.listingType'), value: t(property.listingType === 'sale' ? 'nav.buy' : 'nav.rent') },
    { label: t('meta.status'), value: t(`status.${property.status}`) },
    { label: t('meta.bedrooms'), value: formatNumber(property.bedrooms) },
    { label: t('meta.bathrooms'), value: formatNumber(property.bathrooms) },
    { label: t('meta.area'), value: formatArea(property.area) },
    ...(property.lotArea ? [{ label: t('valuation.field.lotArea'), value: formatArea(property.lotArea) }] : []),
    { label: t('meta.parking'), value: formatNumber(property.parking) },
    { label: t('meta.yearBuilt'), value: String(property.yearBuilt) },
    { label: t('meta.furnishing'), value: tx(furnishing?.name ?? EMPTY) },
    { label: t('meta.city'), value: tx(city?.name ?? EMPTY) },
    { label: t('meta.district'), value: tx(district?.name ?? EMPTY) },
  ];

  const handleShare = async () => {
    const url = window.location.href;
    const shareText = t('property.share.shareText', {
      title: tx(property.title),
      price: formatPrice(property.price),
      location: locationLabel,
    });
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: tx(property.title), text: shareText, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success(t('property.share.copied'));
    } catch {
      toast.error(t('toast.copyFailed'));
    }
  };

  const handleFavorite = () => {
    const next = toggle(property.id);
    toast.info(next ? t('toast.favoriteAdded') : t('toast.favoriteRemoved'));
  };

  const tabItems: TabItem[] = [
    { id: 'overview', label: t('property.tabs.overview') },
    { id: 'features', label: t('property.tabs.features') },
    { id: 'location', label: t('property.tabs.location') },
    { id: 'consultant', label: t('property.tabs.consultant') },
  ];

  return (
    <>
      <div className="shell pt-8 pb-28 lg:pb-24">
        <Breadcrumbs
          items={[
            { label: t('property.breadcrumbHome'), to: '/' },
            { label: t('property.breadcrumbProperties'), to: '/properties' },
            { label: tx(property.title) },
          ]}
        />

        {/* Gallery ---------------------------------------------------------- */}
        <div className="mt-8 grid gap-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <button
            type="button"
            onClick={() => setLightbox(0)}
            aria-label={t('a11y.openGallery', { index: 1 })}
            className="group relative block overflow-hidden bg-canvas-deep"
          >
            <SmartImage
              src={gallery[0].src}
              alt={t('property.gallery.caption', { label: tx(gallery[0].label), title: tx(property.title) })}
              ratio="aspect-[16/11]"
              priority
              className="transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.03]"
            />
            <span className="absolute bottom-4 end-4 inline-flex items-center gap-2 rounded-sm bg-canvas/92 px-3 py-2 text-[11px] text-ink">
              <Images size={13} aria-hidden="true" />
              {t('property.gallery.viewAll', { count: gallery.length })}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-2">
            {gallery.slice(1, 5).map((view, index) => (
              <button
                key={view.id}
                type="button"
                onClick={() => setLightbox(index + 1)}
                aria-label={t('a11y.openGallery', { index: index + 2 })}
                className="group relative block overflow-hidden bg-canvas-deep"
              >
                <SmartImage
                  src={view.src}
                  alt={t('property.gallery.caption', { label: tx(view.label), title: tx(property.title) })}
                  ratio="aspect-[4/3]"
                  className="transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.04]"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title + price ---------------------------------------------------- */}
        <div className="mt-10 grid gap-10 border-b border-line pb-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {property.status === 'available' ? (
                <Badge tone="accent">{t(property.listingType === 'sale' ? 'badge.forSale' : 'badge.forRent')}</Badge>
              ) : (
                <StatusBadge label={t(`status.${property.status}`)} status={property.status} />
              )}
              {property.featured ? <Badge tone="neutral">{t('badge.featured')}</Badge> : null}
            </div>

            <h1 className="mt-5 font-display text-[clamp(1.9rem,4.4vw,3.1rem)] leading-[1.06] text-ink">
              {tx(property.title)}
            </h1>

            <p className="mt-4 flex items-center gap-2 text-[14px] text-secondary">
              <MapPin size={15} className="text-accent" aria-hidden="true" />
              {tx(property.address)}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 text-[13px] text-ink-soft">
              <span className="inline-flex items-center gap-2">
                <BedDouble size={16} className="text-secondary" aria-hidden="true" />
                {formatNumber(property.bedrooms)} {t('meta.bedrooms')}
              </span>
              <span className="inline-flex items-center gap-2">
                <Bath size={16} className="text-secondary" aria-hidden="true" />
                {formatNumber(property.bathrooms)} {t('meta.bathrooms')}
              </span>
              <span className="inline-flex items-center gap-2">
                <Maximize size={16} className="text-secondary" aria-hidden="true" />
                {formatArea(property.area)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Car size={16} className="text-secondary" aria-hidden="true" />
                {formatNumber(property.parking)} {t('meta.parking')}
              </span>
            </div>

            <p className="mt-6 text-[12px] text-secondary">
              {t('property.refLabel', { reference: property.reference })} · {t('property.viewsLabel', { count: formatNumber(property.views) })} ·{' '}
              {t('property.listedOn', { date: formatDate(property.createdAt) })}
            </p>
          </div>

          <div className="flex flex-col justify-center gap-6 lg:border-s lg:border-line lg:ps-10">
            <div>
              <span className="eyebrow">
                {t(property.listingType === 'rent' ? 'property.rentLabel' : 'property.priceLabel')}
              </span>
              <p className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.4rem)] leading-none text-ink">
                {formatPrice(property.price)}
                {property.listingType === 'rent' ? (
                  <span className="ms-2 font-sans text-[12px] text-secondary">{t('meta.perYear')}</span>
                ) : null}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" icon={<MessageCircle size={15} aria-hidden="true" />} onClick={() => setPanelTab('inquiry')}>
                {t('property.actions.inquiry')}
              </Button>
              <Button variant="outline" icon={<Calendar size={15} aria-hidden="true" />} onClick={() => setPanelTab('viewing')}>
                {t('property.actions.viewing')}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" icon={<Share2 size={14} aria-hidden="true" />} onClick={handleShare}>
                {t('property.actions.share')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<Heart size={14} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />}
                aria-pressed={saved}
                onClick={handleFavorite}
              >
                {saved ? t('property.actions.favorited') : t('property.actions.favorite')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="no-print"
                icon={<Printer size={14} aria-hidden="true" />}
                onClick={() => window.print()}
              >
                {t('property.actions.print')}
              </Button>
            </div>
          </div>
        </div>

        {statusNote ? (
          <div className="mt-8 flex items-start gap-3 border border-line bg-surface p-5 text-[13px] leading-relaxed text-ink-soft">
            <FileText size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            {statusNote}
          </div>
        ) : null}

        {/* Body ------------------------------------------------------------- */}
        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          <div>
            <Tabs items={tabItems} active={contentTab} onChange={(id) => setContentTab(id as ContentTab)} />

            <div className="pt-10">
              {contentTab === 'overview' ? (
                <div className="flex flex-col gap-12">
                  <section>
                    <h2 className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug text-ink">
                      {t('property.about.title')}
                    </h2>
                    <p className="mt-5 max-w-reading whitespace-pre-line text-[15px] leading-relaxed text-secondary">
                      {tx(property.description)}
                    </p>
                  </section>

                  <section>
                    <h2 className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug text-ink">
                      {t('property.specs.title')}
                    </h2>
                    <dl className="mt-6 grid gap-x-12 gap-y-0 sm:grid-cols-2">
                      {specs.map((spec) => (
                        <div
                          key={spec.label}
                          className="flex items-center justify-between gap-6 border-b border-line py-3.5"
                        >
                          <dt className="text-[13px] text-secondary">{spec.label}</dt>
                          <dd className="text-[13px] text-ink">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                </div>
              ) : null}

              {contentTab === 'features' ? (
                <div className="flex flex-col gap-12">
                  <section>
                    <h2 className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug text-ink">
                      {t('property.amenities.title')}
                    </h2>
                    <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                      {property.amenities.map((id) => {
                        const amenity = amenityById(id);
                        if (!amenity) return null;
                        return (
                          <li key={id} className="flex items-center gap-3 text-[13px] text-ink-soft">
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-accent-deep">
                              <Icon name={amenity.icon} size={16} />
                            </span>
                            {tx(amenity.name)}
                          </li>
                        );
                      })}
                    </ul>
                  </section>

                  {property.interiorFeatures.length ? (
                    <section>
                      <h2 className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug text-ink">
                        {t('property.interior.title')}
                      </h2>
                      <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                        {property.interiorFeatures.map((id) => {
                          const feature = featureById(id);
                          if (!feature) return null;
                          return (
                            <li key={id} className="flex items-center gap-2.5 text-[13px] text-ink-soft">
                              <Check size={14} className="shrink-0 text-accent" aria-hidden="true" />
                              {tx(feature.name)}
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ) : null}

                  {property.exteriorFeatures.length ? (
                    <section>
                      <h2 className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug text-ink">
                        {t('property.exterior.title')}
                      </h2>
                      <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                        {property.exteriorFeatures.map((id) => {
                          const feature = featureById(id);
                          if (!feature) return null;
                          return (
                            <li key={id} className="flex items-center gap-2.5 text-[13px] text-ink-soft">
                              <Check size={14} className="shrink-0 text-accent" aria-hidden="true" />
                              {tx(feature.name)}
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ) : null}
                </div>
              ) : null}

              {contentTab === 'location' ? (
                <section>
                  <h2 className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug text-ink">
                    {t('property.location.title')}
                  </h2>
                  <p className="mt-4 flex items-center gap-2 text-[13px] text-secondary">
                    <MapPin size={14} className="text-accent" aria-hidden="true" />
                    {locationLabel}
                  </p>
                  <div className="mt-6">
                    <MapPanel
                      lat={property.coordinates.lat}
                      lng={property.coordinates.lng}
                      label={locationLabel}
                      note={t('property.location.mapNote')}
                      linkLabel={t('property.location.openMap')}
                    />
                  </div>
                </section>
              ) : null}

              {contentTab === 'consultant' ? (
                <section>
                  <h2 className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug text-ink">
                    {t('property.agent.title')}
                  </h2>
                  {agent ? (
                    <div className="mt-6 max-w-sm">
                      <AgentCard agent={agent} listingCount={agentListingCount(agent.id)} />
                    </div>
                  ) : null}
                </section>
              ) : null}
            </div>
          </div>

          {/* Sticky action panel ------------------------------------------- */}
          <aside className="no-print lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-surface">
              <div className="border-b border-line px-6 py-5">
                <span className="eyebrow">{t('property.refLabel', { reference: property.reference })}</span>
                <p className="mt-3 font-display text-[24px] leading-none text-ink">{formatPrice(property.price)}</p>
              </div>

              {agent ? (
                <div className="flex items-start gap-4 border-b border-line px-6 py-5">
                  <SmartImage
                    src={agent.imagePrompt.startsWith('http') ? agent.imagePrompt : agentPortrait(agent.imagePrompt, tx(agent.name))}
                    alt={tx(agent.name)}
                    ratio="aspect-[4/5]"
                    wrapperClassName="w-20 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-display text-[19px] leading-tight text-ink">{tx(agent.name)}</p>
                    <p className="mt-1 text-[12px] text-secondary">{tx(agent.title)}</p>
                    <p className="mt-2 text-[11px] text-secondary">
                      {t('property.agent.properties', { count: formatNumber(agent.dealsClosed) })}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <ButtonAnchor
                        href={telHref(agent.phone)}
                        variant="outline"
                        size="sm"
                        icon={<Phone size={13} aria-hidden="true" />}
                      >
                        {t('property.actions.call')}
                      </ButtonAnchor>
                      <ButtonAnchor
                        href={whatsappHref(agent.whatsapp, tx(property.title))}
                        target="_blank"
                        rel="noreferrer noopener"
                        variant="outline"
                        size="sm"
                        icon={<MessageCircle size={13} aria-hidden="true" />}
                      >
                        {t('property.actions.whatsapp')}
                      </ButtonAnchor>
                    </div>
                    <ButtonLink
                      to={`/agents/${agent.id}`}
                      variant="ghost"
                      size="sm"
                      className="mt-2 px-0"
                      icon={<UserRound size={13} aria-hidden="true" />}
                    >
                      {t('property.agent.viewProfile')}
                    </ButtonLink>
                  </div>
                </div>
              ) : null}

              <div className="flex border-b border-line">
                <button
                  type="button"
                  onClick={() => setPanelTab('inquiry')}
                  className={`flex-1 px-4 py-3.5 text-[12px] transition-colors duration-200 ${
                    panelTab === 'inquiry' ? 'bg-canvas-deep text-ink' : 'text-secondary hover:text-ink'
                  }`}
                >
                  {t('property.inquiry.cta')}
                </button>
                <button
                  type="button"
                  onClick={() => setPanelTab('viewing')}
                  className={`flex-1 border-s border-line px-4 py-3.5 text-[12px] transition-colors duration-200 ${
                    panelTab === 'viewing' ? 'bg-canvas-deep text-ink' : 'text-secondary hover:text-ink'
                  }`}
                >
                  {t('property.viewing.cta')}
                </button>
              </div>

              <div className="px-6 py-6">
                <h2 className="font-display text-[19px] leading-snug text-ink">
                  {panelTab === 'inquiry' ? t('property.inquiry.title') : t('property.viewing.title')}
                </h2>
                <p className="mt-2 text-[12px] leading-relaxed text-secondary">
                  {panelTab === 'inquiry' ? t('property.inquiry.text') : t('property.viewing.text')}
                </p>
                <div className="mt-5">
                  {panelTab === 'inquiry' ? <InquiryForm property={property} /> : <ViewingForm property={property} />}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar ---------------------------------------------------------- */}
        {similar.length ? (
          <section className="mt-24 border-t border-line pt-16">
            <Reveal>
              <SectionHeading
                eyebrow={t('nav.properties')}
                titleLead={t('property.similar.title')}
                titleAccent={t('property.similar.titleAccent')}
                text={t('property.similar.text')}
                size="md"
                actions={
                  <ButtonLink to="/properties" variant="outline" size="sm" iconEnd={<ArrowLeft size={14} className="rtl:rotate-180" />}>
                    {t('property.similar.viewAll')}
                  </ButtonLink>
                }
              />
            </Reveal>
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item, index) => (
                <Reveal key={item.id} delay={0.05 * index}>
                  <PropertyCard property={item} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {/* Mobile action bar -------------------------------------------------- */}
      <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/96 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3 px-5 py-3">
          {agent ? (
            <>
              <ButtonAnchor
                href={telHref(agent.phone)}
                variant="outline"
                size="sm"
                icon={<Phone size={14} aria-hidden="true" />}
              >
                {t('action.callNow')}
              </ButtonAnchor>
              <ButtonAnchor
                href={whatsappHref(agent.whatsapp, tx(property.title))}
                target="_blank"
                rel="noreferrer noopener"
                variant="outline"
                size="sm"
                icon={<MessageCircle size={14} aria-hidden="true" />}
              >
                {t('action.whatsapp')}
              </ButtonAnchor>
            </>
          ) : null}
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            icon={<Mail size={14} aria-hidden="true" />}
            onClick={() => setPanelTab('inquiry')}
          >
            {t('property.actions.inquiry')}
          </Button>
        </div>
      </div>

      <Lightbox
        images={gallery.map((view) => ({
          src: view.src,
          label: t('property.gallery.caption', { label: tx(view.label), title: tx(property.title) }),
        }))}
        title={tx(property.title)}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={setLightbox}
      />
    </>
  );
}

export default PropertyDetails;
