import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { company } from '../data/content';
import { cityById, specialtyById } from '../data/taxonomy';
import { useDatabase } from '../hooks/useDatabase';
import { useLanguage } from '../i18n';
import { agentPortrait } from '../lib/images';
import { cn, telHref, whatsappHref } from '../lib/utils';
import { propertiesForAgent, publishedProperties } from '../services/propertyService';
import { AgentContactForm } from '../components/agent/AgentContactForm';
import { PropertyCard } from '../components/property/PropertyCard';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ButtonAnchor, ButtonLink } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SmartImage } from '../components/ui/SmartImage';
import { Stat } from '../components/ui/Stat';

/**
 * A single consultant profile: portrait hero with direct contact actions,
 * a figures strip, their specialties and coverage, their live listings and
 * a direct inquiry form.
 */
export function AgentDetails() {
  const { id } = useParams();
  const { t, tx } = useLanguage();
  const { agents, properties } = useDatabase();

  const agent = agents.find((item) => item.id === id);

  if (!agent) {
    return (
      <div className="shell py-24 lg:py-32">
        <EmptyState
          title={t('agent.notFound.title')}
          text={t('agent.notFound.text')}
          action={
            <ButtonLink to="/agents" variant="outline">
              {t('agent.backToTeam')}
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const name = tx(agent.name);
  const city = cityById(agent.cityId);
  const listings = publishedProperties(propertiesForAgent(agent.id));

  const figures = [
    { key: 'properties', value: listings.length, label: t('agent.stats.properties') },
    { key: 'deals', value: agent.dealsClosed, label: t('agent.stats.deals') },
    { key: 'experience', value: agent.experienceYears, label: t('agent.stats.experience') },
    { key: 'rating', value: agent.rating, label: t('agent.stats.rating') },
  ];

  return (
    <>
      <div className="shell pt-10 lg:pt-14">
        <Breadcrumbs
          items={[
            { label: t('nav.home'), to: '/' },
            { label: t('nav.agents'), to: '/agents' },
            { label: name },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="shell grid gap-10 pb-16 pt-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16 lg:pb-24 lg:pt-14">
        <Reveal>
          <SmartImage src={agentPortrait(agent.imagePrompt, tx(agent.name))} alt={name} ratio="aspect-[4/5]" priority />
        </Reveal>

        <Reveal delay={0.08} className="lg:pt-2">
          {city ? <span className="eyebrow">{tx(city.name)}</span> : null}
          <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02] text-ink">{name}</h1>
          <p className="mt-3 text-[15px] text-secondary">{tx(agent.title)}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonAnchor href={telHref(agent.phone)} variant="primary" icon={<Phone size={15} />}>
              {t('agents.card.call')}
            </ButtonAnchor>
            <ButtonAnchor
              href={whatsappHref(agent.whatsapp, name)}
              target="_blank"
              rel="noreferrer noopener"
              variant="outline"
              icon={<MessageCircle size={15} />}
            >
              {t('agents.card.whatsapp')}
            </ButtonAnchor>
            <ButtonAnchor href={`mailto:${agent.email}`} variant="outline" icon={<Mail size={15} />}>
              {t('agents.card.contact')}
            </ButtonAnchor>
          </div>

          <p className="mt-8 max-w-reading text-[15px] leading-relaxed text-secondary">{tx(agent.bio)}</p>
        </Reveal>
      </section>

      {/* Figures */}
      <section className="shell pb-16 lg:pb-24">
        <dl className="grid grid-cols-2 gap-y-10 border-y border-line py-10 sm:grid-cols-4">
          {figures.map((figure, index) => (
            <div
              key={figure.key}
              className={cn('flex flex-col', index > 0 && 'sm:border-s sm:border-line sm:ps-8')}
            >
              <Stat value={figure.value} label={figure.label} />
            </div>
          ))}
        </dl>
      </section>

      {/* Specialties, languages and coverage */}
      <section className="border-y border-line bg-surface">
        <div className="shell grid gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <Reveal>
            <h2 className="eyebrow">{t('agent.specialties')}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {agent.specialties.map((specialtyId) => {
                const specialty = specialtyById(specialtyId);
                if (!specialty) return null;
                return (
                  <li
                    key={specialtyId}
                    className="rounded-xs border border-line px-3 py-1.5 text-[12px] text-ink-soft"
                  >
                    {tx(specialty.name)}
                  </li>
                );
              })}
            </ul>

            <h2 className="eyebrow mt-10">{t('agent.languages')}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {agent.languages.map((language) => (
                <li key={language} className="rounded-xs border border-line px-3 py-1.5 text-[12px] text-ink-soft">
                  {language}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="eyebrow">{t('agent.cities')}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {agent.cityIds.map((cityId) => {
                const covered = cityById(cityId);
                if (!covered) return null;
                return (
                  <li key={cityId} className="rounded-xs border border-line px-3 py-1.5 text-[12px] text-ink-soft">
                    {tx(covered.name)}
                  </li>
                );
              })}
            </ul>

            <p className="mt-10 flex items-center gap-2 text-[13px] text-secondary">
              <MapPin size={14} className="text-accent" aria-hidden="true" />
              {t('agent.joined', { year: agent.joinedAt.slice(0, 4) })}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Listings */}
      <section className="shell py-24 lg:py-32">
        <Reveal>
          <SectionHeading
            titleLead={t('agent.listingsTitle', { name })}
            text={t('agent.listingsText')}
            actions={
              <span className="text-[12px] uppercase tracking-editorial text-secondary">
                {t('agent.listingsCount', { count: listings.length })}
              </span>
            }
          />
        </Reveal>

        {listings.length ? (
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((property, index) => (
              <Reveal key={property.id} delay={0.05 * index}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-10 max-w-reading text-[14px] leading-relaxed text-secondary">{t('agent.listingsEmpty')}</p>
        )}
      </section>

      {/* Contact */}
      <section className="border-y border-line bg-surface">
        <div className="shell grid gap-12 py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20 lg:py-32">
          <Reveal>
            <SectionHeading
              titleLead={t('agent.contactTitle', { name })}
              text={t('agent.contactText')}
              size="md"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <AgentContactForm agent={agent} />
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink text-canvas">
        <div className="shell flex flex-col items-center py-24 text-center lg:py-32">
          <span className="eyebrow text-accent-soft">{tx(company.legalName)}</span>
          <h2 className="mt-6 max-w-3xl font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.06] text-canvas">
            {t('agent.cta.title')}
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-canvas/75">{t('agent.cta.text')}</p>
          <div className="mt-10">
            <ButtonLink
              to="/contact"
              variant="accent"
              size="lg"
              iconEnd={<ArrowRight size={16} className="rtl:rotate-180" />}
            >
              {t('agent.cta.button')}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

export default AgentDetails;
