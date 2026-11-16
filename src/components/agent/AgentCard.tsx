import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { cityById, specialtyById } from '../../data/taxonomy';
import { agentPortrait } from '../../lib/images';
import { telHref, whatsappHref } from '../../lib/utils';
import type { Agent } from '../../types';
import { SmartImage } from '../ui/SmartImage';
import { ButtonLink } from '../ui/Button';

interface AgentCardProps {
  agent: Agent;
  listingCount: number;
  className?: string;
}

export function AgentCard({ agent, listingCount, className }: AgentCardProps) {
  const { t, tx } = useLanguage();
  const city = cityById(agent.cityId);
  const name = tx(agent.name);

  return (
    <article className={className}>
      <div className="group relative overflow-hidden bg-canvas-deep">
        <Link to={`/agents/${agent.id}`} aria-label={name}>
          <SmartImage
            src={agentPortrait(agent.imagePrompt, tx(agent.name))}
            alt={name}
            ratio="aspect-[4/5]"
            className="transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center gap-2 p-4 opacity-0 transition-all duration-500 ease-editorial group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <a
            href={telHref(agent.phone)}
            aria-label={`${t('agents.card.call')} ${name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface/92 text-ink backdrop-blur-sm transition-colors hover:bg-surface"
          >
            <Phone size={15} />
          </a>
          <a
            href={whatsappHref(agent.whatsapp, tx(agent.name))}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${t('agents.card.whatsapp')} ${name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface/92 text-ink backdrop-blur-sm transition-colors hover:bg-surface"
          >
            <MessageCircle size={15} />
          </a>
          <a
            href={`mailto:${agent.email}`}
            aria-label={`${t('agents.card.contact')} ${name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface/92 text-ink backdrop-blur-sm transition-colors hover:bg-surface"
          >
            <Mail size={15} />
          </a>
        </div>
      </div>

      <div className="pt-5">
        <h3 className="font-display text-[22px] leading-snug text-ink">
          <Link to={`/agents/${agent.id}`} className="transition-colors hover:text-accent-deep">
            {name}
          </Link>
        </h3>
        <p className="mt-1.5 text-[12px] text-accent-deep">{tx(agent.title)}</p>

        <p className="mt-3 flex items-center gap-1.5 text-[12px] text-secondary">
          <MapPin size={13} className="text-accent" aria-hidden="true" />
          {city ? tx(city.name) : null}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {agent.specialties.slice(0, 2).map((id) => {
            const specialty = specialtyById(id);
            if (!specialty) return null;
            return (
              <li
                key={id}
                className="rounded-xs border border-line px-2 py-1 text-[10px] uppercase tracking-editorial text-secondary"
              >
                {tx(specialty.name)}
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <div className="text-[12px] text-secondary">
            <p>{t('agents.card.listings', { count: listingCount })}</p>
            <p className="mt-0.5">
              {t('agents.card.experience', { count: agent.experienceYears })} · {tx(agent.languages[0] === 'Arabic' ? { en: 'AR', ar: 'ع' } : { en: 'EN', ar: 'EN' })}
            </p>
          </div>
          <ButtonLink to={`/agents/${agent.id}`} variant="ghost" size="sm">
            {t('action.viewProfile')}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export default AgentCard;
