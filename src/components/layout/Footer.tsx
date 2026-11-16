import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { company, services } from '../../data/content';
import { useDatabase } from '../../hooks/useDatabase';
import { STORAGE_KEYS, readJSON, writeJSON } from '../../lib/storage';
import { telHref, whatsappHref } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

const QUICK_LINKS = [
  { to: '/properties', key: 'nav.properties' },
  { to: '/agents', key: 'nav.agents' },
  { to: '/about', key: 'nav.about' },
  { to: '/valuation', key: 'nav.valuation' },
  { to: '/favorites', key: 'nav.favorites' },
  { to: '/contact', key: 'nav.contact' },
] as const;

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function Footer() {
  const { t, tx, lang } = useLanguage();
  const { settings } = useDatabase();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isEmail(email)) return;
    const list = readJSON<string[]>(STORAGE_KEYS.newsletter, []);
    if (!list.includes(email.trim().toLowerCase())) {
      writeJSON(STORAGE_KEYS.newsletter, [...list, email.trim().toLowerCase()]);
    }
    setSubscribed(true);
    setEmail('');
  };

  const year = new Date().getFullYear();

  return (
    <footer className="mt-px border-t border-line bg-surface">
      {/* Newsletter */}
      <div className="border-b border-line bg-canvas-deep/60">
        <div className="shell grid gap-8 py-14 lg:grid-cols-[1fr_minmax(0,460px)] lg:items-center lg:gap-16">
          <div>
            <span className="eyebrow">{t('footer.newsletterTitle')}</span>
            <h2 className="mt-4 max-w-xl font-display text-[clamp(1.6rem,2.6vw,2.3rem)] leading-tight text-ink">
              {t('footer.newsletterTitle')}
            </h2>
            <p className="mt-4 max-w-reading text-[14px] leading-relaxed text-secondary">{t('footer.newsletterText')}</p>
          </div>

          <div>
            {subscribed ? (
              <p className="rounded-sm border border-[#C6DCC6] bg-[#F2F7F2] px-5 py-4 text-[13px] text-[#2F5A38]">
                {t('footer.subscribed')}
              </p>
            ) : (
              <form onSubmit={subscribe} className="flex flex-col gap-3 sm:flex-row">
                <label className="flex-1">
                  <span className="sr-only">{t('footer.newsletterPlaceholder')}</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t('footer.newsletterPlaceholder')}
                    className="field h-[52px]"
                  />
                </label>
                <Button type="submit" size="lg" iconEnd={<ArrowRight size={15} className="rtl:rotate-180" />}>
                  {t('footer.subscribe')}
                </Button>
              </form>
            )}
            <p className="mt-3 text-[11px] text-secondary">{t('form.privacyNote')}</p>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="shell grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo tone="ink" />
          <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-secondary">{tx(company.tagline)}</p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {company.social.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[12px] text-secondary link-underline hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-editorial text-ink">{t('nav.quickLinks')}</h3>
          <ul className="mt-5 space-y-3">
            {QUICK_LINKS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-[13px] text-secondary transition-colors hover:text-ink">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-editorial text-ink">{t('nav.services')}</h3>
          <ul className="mt-5 space-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <Link to="/contact" className="text-[13px] text-secondary transition-colors hover:text-ink">
                  {tx(service.title)}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/valuation" className="text-[13px] text-secondary transition-colors hover:text-ink">
                {t('nav.valuation')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-editorial text-ink">{t('footer.contact')}</h3>
          <ul className="mt-5 space-y-4 text-[13px] text-secondary">
            <li className="flex gap-3">
              <MapPin size={15} className="mt-0.5 shrink-0 text-accent" />
              <span>{tx(company.headOffice)}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={15} className="mt-0.5 shrink-0 text-accent" />
              <span className="flex flex-col gap-1">
                <a href={telHref(settings.phone)} dir="ltr" className="hover:text-ink">
                  {settings.phone}
                </a>
                <a
                  href={whatsappHref(settings.whatsapp)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-ink"
                >
                  {t('action.whatsapp')}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <Mail size={15} className="mt-0.5 shrink-0 text-accent" />
              <a href={`mailto:${settings.contactEmail}`} className="hover:text-ink">
                {settings.contactEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="shell flex flex-col gap-4 py-6 text-[11px] text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {tx(company.legalName)}. {t('footer.rights')}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/contact" className="hover:text-ink">
              {t('footer.privacy')}
            </Link>
            <Link to="/contact" className="hover:text-ink">
              {t('footer.terms')}
            </Link>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span>{t('footer.builtWith')}</span>
          </div>
        </div>
        {settings.showDemoBanner ? (
          <div className="border-t border-line bg-canvas">
            <p className="shell py-4 text-[11px] leading-relaxed text-secondary">{t('footer.demoNotice')}</p>
          </div>
        ) : null}
        <span className="sr-only">{lang}</span>
      </div>
    </footer>
  );
}

export default Footer;
