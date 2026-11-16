import { ArrowRight, ArrowDown, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { company, services, stats, whyChooseUs } from '../data/content';
import { cities } from '../data/taxonomy';
import { useDatabase } from '../hooks/useDatabase';
import { agentListingCount, featuredAgents } from '../services/agentService';
import { cityImage, editorialImage } from '../lib/images';
import { countByCity, publishedProperties } from '../services/propertyService';
import { AgentCard } from '../components/agent/AgentCard';
import { TestimonialSlider } from '../components/home/TestimonialSlider';
import { PropertyCard } from '../components/property/PropertyCard';
import { SearchWidget } from '../components/property/SearchWidget';
import { ButtonAnchor, ButtonLink } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SmartImage } from '../components/ui/SmartImage';
import { Stat } from '../components/ui/Stat';

export function Home() {
  const { t, tx } = useLanguage();
  const { properties, settings, agents } = useDatabase();

  const published = publishedProperties(properties);
  const featured = published.filter((property) => property.featured).slice(0, 6);
  const counts = countByCity(published);
  const team = featuredAgents().length ? featuredAgents() : agents.slice(0, 4);

  const [lead, ...rest] = featured;

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative">
        <div className="relative flex min-h-[88vh] items-end overflow-hidden">
          <SmartImage
            src={editorialImage(
              'luxury contemporary villa exterior in Riyadh at dusk, warm interior lighting, architectural photography',
              'landscape_16_9'
            )}
            alt={tx(company.tagline)}
            priority
            wrapperClassName="absolute inset-0"
            className="scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/25"
            aria-hidden="true"
          />

          <div className="shell relative z-10 pb-20 pt-40 sm:pb-24 lg:pb-32">
            <div className="max-w-3xl">
              <span className="eyebrow text-accent-soft">{t('home.hero.eyebrow')}</span>
              <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.2rem)] font-normal leading-[0.98] text-canvas">
                {t('home.hero.titleLead')} <span className="italic text-accent-soft">{t('home.hero.titleAccent')}</span>
              </h1>
              <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-canvas/80 sm:text-[16px]">
                {t('home.hero.description')}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <ButtonLink to="/properties" variant="accent" size="lg" iconEnd={<ArrowRight size={16} className="rtl:rotate-180" />}>
                  {t('action.exploreProperties')}
                </ButtonLink>
                <ButtonLink
                  to="/about"
                  variant="outline"
                  size="lg"
                  className="border-canvas/35 text-canvas hover:border-canvas hover:bg-canvas/10"
                >
                  {t('action.discover')}
                </ButtonLink>
              </div>
            </div>
          </div>

          <span className="absolute bottom-8 end-6 z-10 hidden items-center gap-2 text-[10px] uppercase tracking-editorial text-canvas/55 lg:flex">
            <ArrowDown size={13} />
            {t('home.hero.scroll')}
          </span>
        </div>

        {/* Search overlaps the hero — the pattern shared by the reference sites. */}
        <div className="shell relative z-20 -mt-16 lg:-mt-20">
          <SearchWidget />
          <p className="mt-4 flex items-center gap-2 text-[11px] text-secondary">
            <ShieldCheck size={13} className="text-accent" aria-hidden="true" />
            {t('home.hero.trustNote')}
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Featured portfolio — asymmetric editorial grid                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell py-24 lg:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={t('home.featured.eyebrow')}
            titleLead={t('home.featured.titleLead')}
            titleAccent={t('home.featured.titleAccent')}
            text={t('home.featured.text')}
            actions={
              <ButtonLink to="/properties" variant="outline" iconEnd={<ArrowRight size={15} className="rtl:rotate-180" />}>
                {t('action.viewAll')}
              </ButtonLink>
            }
          />
        </Reveal>

        {featured.length ? (
          <div className="mt-14 grid gap-x-8 gap-y-14 lg:grid-cols-12">
            {lead ? (
              <Reveal className="lg:col-span-7">
                <PropertyCard property={lead} variant="featured" priority />
              </Reveal>
            ) : null}

            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {rest.slice(0, 2).map((property, index) => (
                <Reveal key={property.id} delay={0.08 * (index + 1)}>
                  <PropertyCard property={property} variant="compact" />
                </Reveal>
              ))}
            </div>

            {rest.slice(2).map((property, index) => (
              <Reveal key={property.id} delay={0.05 * index} className="sm:col-span-1 lg:col-span-4">
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        ) : null}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* About preview                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y border-line bg-surface">
        <div className="shell grid items-center gap-14 py-24 lg:grid-cols-2 lg:gap-20 lg:py-32">
          <Reveal>
            <figure className="relative">
              <SmartImage
                src={editorialImage(
                  'editorial interior of a luxury villa living room, double-height ceiling, natural light, warm neutral palette',
                  'portrait_4_3'
                )}
                alt={t('home.about.caption')}
                ratio="aspect-[4/5]"
              />
              <figcaption className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-editorial text-secondary">
                <MapPin size={12} className="text-accent" aria-hidden="true" />
                {t('home.about.caption')}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionHeading
              eyebrow={t('home.about.eyebrow')}
              titleLead={t('home.about.titleLead')}
              titleAccent={t('home.about.titleAccent')}
            />
            <p className="mt-6 max-w-reading text-[15px] leading-relaxed text-secondary">{t('home.about.lead')}</p>

            <ul className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {(['home.about.point1', 'home.about.point2', 'home.about.point3', 'home.about.point4'] as const).map(
                (key, index) => (
                  <li key={key} className="flex gap-3 border-t border-line pt-4">
                    <span className="font-display text-[13px] text-accent">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-[13px] leading-snug text-ink-soft">{t(key)}</span>
                  </li>
                )
              )}
            </ul>

            <div className="mt-10">
              <ButtonLink to="/about" variant="ghost" className="px-0" iconEnd={<ArrowRight size={15} className="rtl:rotate-180" />}>
                {t('home.about.cta')}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Locations                                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell py-24 lg:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={t('home.locations.eyebrow')}
            titleLead={t('home.locations.titleLead')}
            titleAccent={t('home.locations.titleAccent')}
            text={t('home.locations.text')}
          />
        </Reveal>

        <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city, index) => (
            <Reveal key={city.id} delay={0.05 * index}>
              <Link to={`/properties?city=${city.id}`} className="group block">
                <div className="relative overflow-hidden bg-canvas-deep">
                  <SmartImage
                    src={cityImage(city.imagePrompt)}
                    alt={tx(city.name)}
                    ratio={index % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[4/3]'}
                    className="transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" aria-hidden="true" />
                  <span className="absolute start-4 top-4 font-display text-[13px] text-canvas/80">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                    <div>
                      <h3 className="font-display text-[26px] leading-none text-canvas">{tx(city.name)}</h3>
                      <p className="mt-1.5 text-[11px] text-canvas/75">
                        {t('home.locations.count', { count: counts[city.id] ?? 0 })}
                      </p>
                    </div>
                    <span className="text-[11px] text-canvas/0 transition-colors duration-300 group-hover:text-canvas/90">
                      {t('home.locations.viewCity', { city: tx(city.name) })}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-secondary">{tx(city.tagline)}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Services — numbered list beside a sticky heading                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y border-line bg-canvas-deep/50">
        <div className="shell grid gap-14 py-24 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-24 lg:py-32">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <SectionHeading
                eyebrow={t('home.services.eyebrow')}
                titleLead={t('home.services.titleLead')}
                titleAccent={t('home.services.titleAccent')}
                text={t('home.services.text')}
                size="md"
              />
              <div className="mt-8">
                <ButtonLink to="/contact" variant="outline">
                  {t('action.contactUs')}
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <ol className="flex flex-col">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={0.06 * index}>
                <li className="group border-t border-line py-8 last:border-b">
                  <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:gap-8">
                    <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                      <span className="font-display text-[15px] text-accent">{String(index + 1).padStart(2, '0')}</span>
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors duration-300 group-hover:border-accent group-hover:text-accent-deep">
                        <Icon name={service.icon} size={19} />
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] leading-snug text-ink">
                        {tx(service.title)}
                      </h3>
                      <p className="mt-3 max-w-reading text-[14px] leading-relaxed text-secondary">
                        {tx(service.description)}
                      </p>
                      <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                        {service.points.map((point) => (
                          <li key={point.en} className="flex gap-2.5 text-[13px] text-ink-soft">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                            {tx(point)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Why NESTORA                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell py-24 lg:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={t('home.why.eyebrow')}
            titleLead={t('home.why.titleLead')}
            titleAccent={t('home.why.titleAccent')}
          />
        </Reveal>

        <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {whyChooseUs.map((item, index) => (
            <Reveal key={item.id} delay={0.06 * index}>
              <article className="flex gap-6 border-t border-line pt-7">
                <span className="font-display text-[34px] leading-none text-accent-soft">{item.number}</span>
                <div>
                  <h3 className="font-display text-[22px] leading-snug text-ink">{tx(item.title)}</h3>
                  <p className="mt-3 max-w-reading text-[13px] leading-relaxed text-secondary">{tx(item.description)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Featured agents                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell pb-24 lg:pb-32">
        <Reveal>
          <SectionHeading
            eyebrow={t('home.agents.eyebrow')}
            titleLead={t('home.agents.titleLead')}
            titleAccent={t('home.agents.titleAccent')}
            text={t('home.agents.text')}
            actions={
              <ButtonLink to="/agents" variant="outline" iconEnd={<ArrowRight size={15} className="rtl:rotate-180" />}>
                {t('home.agents.viewAll')}
              </ButtonLink>
            }
          />
        </Reveal>

        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((agent, index) => (
            <Reveal key={agent.id} delay={0.05 * index}>
              <AgentCard agent={agent} listingCount={agentListingCount(agent.id)} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Demonstration figures — dark band                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-ink text-canvas">
        <div className="shell py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,300px)_1fr] lg:items-center lg:gap-20">
            <div>
              <span className="eyebrow text-accent-soft">{t('home.stats.eyebrow')}</span>
              <p className="mt-4 text-[12px] leading-relaxed text-canvas/60">{t('home.stats.note')}</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.id}>
                  <Stat value={item.value} suffix={item.suffix} label={tx(item.label)} tone="canvas" />
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Testimonials                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell py-24 lg:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={t('home.testimonials.eyebrow')}
            titleLead={t('home.testimonials.titleLead')}
            titleAccent={t('home.testimonials.titleAccent')}
          />
        </Reveal>
        <Reveal delay={0.1} className="mt-14">
          <TestimonialSlider />
        </Reveal>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Closing CTA                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden">
        <SmartImage
          src={editorialImage(
            'modern luxury residential architecture at golden hour in Saudi Arabia, wide architectural photograph',
            'landscape_16_9'
          )}
          alt={t('home.cta.titleAccent')}
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-ink/72" aria-hidden="true" />

        <div className="shell relative z-10 flex flex-col items-center py-28 text-center lg:py-36">
          <span className="eyebrow text-accent-soft">{tx(company.legalName)}</span>
          <h2 className="mt-6 max-w-4xl font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1.06] text-canvas">
            {t('home.cta.titleLead')} <span className="italic text-accent-soft">{t('home.cta.titleAccent')}</span>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-canvas/75">{t('home.cta.text')}</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink to="/properties" variant="accent" size="lg" iconEnd={<ArrowRight size={16} className="rtl:rotate-180" />}>
              {t('action.exploreProperties')}
            </ButtonLink>
            <ButtonLink
              to="/contact"
              variant="outline"
              size="lg"
              className="border-canvas/35 text-canvas hover:border-canvas hover:bg-canvas/10"
            >
              {t('action.letsFindIt')}
            </ButtonLink>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12px] text-canvas/60">
            <ButtonAnchor
              href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
              className="text-canvas/70 hover:text-canvas"
              variant="ghost"
            >
              <span dir="ltr">{settings.phone}</span>
            </ButtonAnchor>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span>{tx(company.workingHours)}</span>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span>{t('home.locations.count', { count: counts.riyadh ?? 0 })}</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
