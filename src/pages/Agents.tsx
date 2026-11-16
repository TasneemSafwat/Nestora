import { ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { company } from '../data/content';
import { cities, specialties } from '../data/taxonomy';
import { useDatabase } from '../hooks/useDatabase';
import { useLanguage } from '../i18n';
import {
  DEFAULT_AGENT_CRITERIA,
  agentLanguages,
  agentListingCount,
  queryAgents,
  type AgentCriteria,
} from '../services/agentService';
import { AgentCard } from '../components/agent/AgentCard';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button, ButtonLink } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { SelectField, TextField } from '../components/ui/Field';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';

/**
 * The consultant directory. A single editorial filter row drives the grid;
 * every filter is applied in-memory through `queryAgents`, so no network
 * round-trip is ever needed and the result is deterministic.
 */
export function Agents() {
  const { t, tx } = useLanguage();
  const { agents } = useDatabase();
  const [criteria, setCriteria] = useState<AgentCriteria>(DEFAULT_AGENT_CRITERIA);

  const results = queryAgents(agents, criteria);

  const hasFilter = Boolean(criteria.q || criteria.specialty || criteria.cityId || criteria.language);
  const clear = () => setCriteria(DEFAULT_AGENT_CRITERIA);
  const patch = (value: Partial<AgentCriteria>) => setCriteria((current) => ({ ...current, ...value }));

  const specialtyOptions = specialties.map((item) => ({ value: item.id, label: tx(item.name) }));
  const cityOptions = cities.map((item) => ({ value: item.id, label: tx(item.name) }));
  const languageOptions = agentLanguages(agents).map((value) => ({ value, label: value }));

  return (
    <>
      <div className="shell pt-10 lg:pt-14">
        <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.agents') }]} />
      </div>

      <section className="shell pt-8 lg:pt-10">
        <SectionHeading
          as="h1"
          eyebrow={t('agents.page.eyebrow')}
          titleLead={t('agents.page.titleLead')}
          titleAccent={t('agents.page.titleAccent')}
          text={t('agents.page.subtitle')}
        />
      </section>

      <section className="shell pb-24 pt-10 lg:pb-32 lg:pt-12">
        <div className="border-y border-line py-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <TextField
              label={t('search.keyword')}
              type="search"
              placeholder={t('agents.search.placeholder')}
              value={criteria.q}
              onChange={(event) => patch({ q: event.target.value })}
            />
            <SelectField
              label={t('agents.filter.specialty')}
              placeholder={t('agents.filter.allSpecialties')}
              options={specialtyOptions}
              value={criteria.specialty}
              onChange={(event) => patch({ specialty: event.target.value })}
            />
            <SelectField
              label={t('agents.filter.city')}
              placeholder={t('agents.filter.allCities')}
              options={cityOptions}
              value={criteria.cityId}
              onChange={(event) => patch({ cityId: event.target.value })}
            />
            <SelectField
              label={t('agents.filter.language')}
              placeholder={t('agents.filter.allLanguages')}
              options={languageOptions}
              value={criteria.language}
              onChange={(event) => patch({ language: event.target.value })}
            />
          </div>

          {hasFilter ? (
            <div className="mt-5 flex justify-end">
              <Button variant="ghost" size="sm" icon={<X size={13} />} onClick={clear}>
                {t('action.reset')}
              </Button>
            </div>
          ) : null}
        </div>

        <p className="mt-6 text-[13px] text-secondary" aria-live="polite">
          {results.length === 1 ? t('agents.countOne') : t('agents.count', { count: results.length })}
        </p>

        {results.length ? (
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((agent, index) => (
              <Reveal key={agent.id} delay={0.05 * index}>
                <AgentCard agent={agent} listingCount={agentListingCount(agent.id)} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title={t('agents.empty.title')}
              text={t('agents.empty.text')}
              action={<Button onClick={clear}>{t('action.resetFilters')}</Button>}
            />
          </div>
        )}
      </section>

      {/* Closing CTA — mirrors the weight of the dark band on the homepage. */}
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

export default Agents;
