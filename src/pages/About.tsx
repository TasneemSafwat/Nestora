import { ArrowRight, Info, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n';
import { company, coreValues, processSteps, stats, whyChooseUs } from '../data/content';
import { useDatabase } from '../hooks/useDatabase';
import { agentListingCount, DEFAULT_AGENT_CRITERIA, queryAgents } from '../services/agentService';
import { editorialImage } from '../lib/images';
import { telHref } from '../lib/utils';
import { AgentCard } from '../components/agent/AgentCard';
import { Badge } from '../components/ui/Badge';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SmartImage } from '../components/ui/SmartImage';
import { Stat } from '../components/ui/Stat';

export function About() {
  const { t, tx, formatNumber } = useLanguage();
  const { agents, settings } = useDatabase();

  const team = queryAgents(agents, DEFAULT_AGENT_CRITERIA).slice(0, 4);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero — full-width editorial                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative">
        <div className="relative flex min-h-[72vh] items-end overflow-hidden">
          <SmartImage
            src={editorialImage(
              'editorial exterior of a modern luxury villa in Riyadh at dusk, warm interior lighting, architectural photography',
              'landscape_16_9'
            )}
            alt={t('about.hero.titleAccent')}
            priority
            wrapperClassName="absolute inset-0"
            className="scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/30" aria-hidden="true" />

          <div className="shell relative z-10 pb-20 pt-36 lg:pb-24">
            <div className="max-w-3xl">
              <span className="eyebrow text-accent-soft">{t('about.hero.eyebrow')}</span>
              <h1 className="mt-6 font-display text-[clamp(2.4rem,6.4vw,4.9rem)] font-normal leading-[1.0] text-canvas">
                {t('about.hero.titleLead')}{' '}
                <span className="italic text-accent-soft">{t('about.hero.titleAccent')}</span>
              </h1>
              <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-canvas/80 sm:text-[16px]">
                {t('about.hero.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Story — portrait beside running text                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell grid items-center gap-14 py-24 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-20 lg:py-32">
        <Reveal>
          <figure>
            <SmartImage
              src={editorialImage(
                'editorial photograph of a contemporary real estate office facade on King Fahd Road Riyadh, warm afternoon light',
                'portrait_4_3'
              )}
              alt={t('about.story.caption')}
              ratio="aspect-[4/5]"
            />
            <figcaption className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-editorial text-secondary">
              <MapPin size={12} className="text-accent" aria-hidden="true" />
              {t('about.story.caption')}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.1}>
          <span className="eyebrow">{t('about.story.eyebrow')}</span>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.1] text-ink">
            {t('about.story.title')}
          </h2>
          <p className="mt-6 max-w-reading text-[15px] leading-relaxed text-secondary">{t('about.story.p1')}</p>
          <p className="mt-4 max-w-reading text-[15px] leading-relaxed text-secondary">{t('about.story.p2')}</p>

          <p className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-[11px] uppercase tracking-editorial text-secondary">
            <span>{t('about.founded', { year: company.founded })}</span>
            <span aria-hidden="true">·</span>
            <span>
              {t('about.branches')}: {formatNumber(company.branches.length)}
            </span>
          </p>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Mission & vision — one dark panel, one bordered panel              */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y border-line bg-canvas-deep/40">
        <div className="shell grid gap-8 py-24 md:grid-cols-2 lg:py-32">
          <Reveal>
            <article className="flex h-full flex-col justify-between bg-ink p-9 text-canvas lg:p-12">
              <span className="font-display text-[13px] text-accent-soft">01</span>
              <div className="mt-10">
                <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-snug text-canvas">
                  {t('about.mission.title')}
                </h3>
                <p className="mt-5 max-w-reading text-[14px] leading-relaxed text-canvas/75">{t('about.mission.text')}</p>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="flex h-full flex-col justify-between border border-line bg-surface p-9 lg:p-12">
              <span className="font-display text-[13px] text-accent">02</span>
              <div className="mt-10">
                <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-snug text-ink">
                  {t('about.vision.title')}
                </h3>
                <p className="mt-5 max-w-reading text-[14px] leading-relaxed text-secondary">{t('about.vision.text')}</p>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Core values — numbered editorial list                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell py-24 lg:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={t('about.values.eyebrow')}
            titleLead={t('about.values.titleLead')}
            titleAccent={t('about.values.titleAccent')}
            text={t('about.values.text')}
          />
        </Reveal>

        <ol className="mt-14 flex flex-col">
          {coreValues.map((value, index) => (
            <Reveal key={value.id} delay={0.05 * index}>
              <li className="grid gap-5 border-t border-line py-8 last:border-b sm:grid-cols-[auto_1fr] sm:gap-12">
                <span className="font-display text-[clamp(2rem,4vw,2.9rem)] leading-none text-accent-soft sm:w-24">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-[clamp(1.3rem,2.2vw,1.75rem)] leading-snug text-ink">
                    {tx(value.title)}
                  </h3>
                  <p className="mt-3 max-w-reading text-[14px] leading-relaxed text-secondary">{tx(value.description)}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Why choose us — 2×2 grid                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y border-line bg-surface">
        <div className="shell py-24 lg:py-32">
          <Reveal>
            <SectionHeading
              eyebrow={t('about.why.eyebrow')}
              titleLead={t('about.why.titleLead')}
              titleAccent={t('about.why.titleAccent')}
              text={t('about.why.text')}
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
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Process — horizontal four-step row                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell py-24 lg:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={t('about.process.eyebrow')}
            titleLead={t('about.process.titleLead')}
            titleAccent={t('about.process.titleAccent')}
            text={t('about.process.text')}
          />
        </Reveal>

        <ol className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <Reveal key={step.id} delay={0.06 * index}>
              <li className="relative border-t border-line pt-7">
                <span
                  className="absolute -top-[3px] start-0 h-1.5 w-1.5 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <span className="font-display text-[15px] text-accent">{step.number}</span>
                <h3 className="mt-3 font-display text-[20px] leading-snug text-ink">{tx(step.title)}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-secondary">{tx(step.description)}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Statistics band — dark                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-ink text-canvas">
        <div className="shell py-20 lg:py-24">
          <Reveal>
            <div className="max-w-2xl">
              <span className="eyebrow text-accent-soft">{t('about.stats.eyebrow')}</span>
              <h2 className="mt-4 font-display text-[clamp(1.9rem,4.2vw,3.35rem)] leading-[1.08] text-canvas">
                {t('about.stats.titleLead')}{' '}
                <span className="italic text-accent-soft">{t('about.stats.titleAccent')}</span>
              </h2>
              <p className="mt-5 max-w-reading text-[12px] leading-relaxed text-canvas/60">{t('about.stats.note')}</p>
            </div>
          </Reveal>

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {stats.map((item) => (
              <div key={item.id}>
                <Stat value={item.value} suffix={item.suffix} label={tx(item.label)} tone="canvas" />
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Team                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell py-24 lg:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={t('about.team.eyebrow')}
            titleLead={t('about.team.titleLead')}
            titleAccent={t('about.team.titleAccent')}
            text={t('about.team.text')}
            actions={
              <ButtonLink
                to="/agents"
                variant="outline"
                iconEnd={<ArrowRight size={15} className="rtl:rotate-180" />}
              >
                {t('about.team.cta')}
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
      {/* Offices                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y border-line bg-canvas-deep/40">
        <div className="shell py-24 lg:py-32">
          <Reveal>
            <SectionHeading eyebrow={t('about.offices.eyebrow')} titleLead={t('about.offices.title')} />
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {company.branches.map((branch, index) => (
              <Reveal key={branch.id} delay={0.06 * index}>
                <article className="flex h-full flex-col border border-line bg-surface p-8">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[20px] leading-snug text-ink">{tx(branch.label)}</h3>
                    {branch.id === 'riyadh' ? (
                      <Badge tone="accent">{t('contact.offices.headOfficeTag')}</Badge>
                    ) : null}
                  </div>

                  <dl className="mt-6 flex flex-col gap-5 border-t border-line pt-6">
                    <div>
                      <dt className="text-[11px] uppercase tracking-editorial text-secondary">
                        {t('search.location')}
                      </dt>
                      <dd className="mt-1 text-[13px] leading-relaxed text-ink-soft">{tx(company.headOffice)}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-editorial text-secondary">
                        {t('contact.details.phone')}
                      </dt>
                      <dd className="mt-1">
                        <a href={telHref(settings.phone)} className="link-underline text-[13px] text-ink-soft" dir="ltr">
                          {settings.phone}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-editorial text-secondary">
                        {t('contact.details.hours')}
                      </dt>
                      <dd className="mt-1 text-[13px] leading-relaxed text-ink-soft">{tx(company.workingHours)}</dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Demonstration disclosure                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell py-20 lg:py-24">
        <Reveal>
          <div className="border border-line bg-surface p-8 lg:p-10">
            <p className="flex items-start gap-3 text-[13px] leading-relaxed text-secondary">
              <Info size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              <span>{t('about.demoNote')}</span>
            </p>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Closing CTA                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden">
        <SmartImage
          src={editorialImage(
            'modern luxury residential architecture in Saudi Arabia at golden hour, wide architectural photograph',
            'landscape_16_9'
          )}
          alt={t('about.cta.titleAccent')}
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-ink/72" aria-hidden="true" />

        <div className="shell relative z-10 flex flex-col items-center py-28 text-center lg:py-36">
          <span className="eyebrow text-accent-soft">{tx(company.legalName)}</span>
          <h2 className="mt-6 max-w-4xl font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1.06] text-canvas">
            {t('about.cta.titleLead')}{' '}
            <span className="italic text-accent-soft">{t('about.cta.titleAccent')}</span>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-canvas/75">{t('about.cta.text')}</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink
              to="/contact"
              variant="accent"
              size="lg"
              iconEnd={<ArrowRight size={16} className="rtl:rotate-180" />}
            >
              {t('about.cta.primary')}
            </ButtonLink>
            <ButtonLink
              to="/valuation"
              variant="outline"
              size="lg"
              className="border-canvas/35 text-canvas hover:border-canvas hover:bg-canvas/10"
            >
              {t('about.cta.secondary')}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
