import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { NAV_ITEMS } from '../components/layout/Header';
import { ButtonLink } from '../components/ui/Button';

/** 404. Treated as an editorial page rather than an error dialog. */
export function NotFound() {
  const { t } = useLanguage();
  const links = NAV_ITEMS.filter((item) => item.to !== '/');

  return (
    <section className="shell flex min-h-[74vh] items-center py-24">
      <div className="grid w-full gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-20">
        <div className="lg:border-e lg:border-line lg:pe-16">
          <span className="eyebrow">{t('brand.name')}</span>
          <p
            className="mt-6 font-display text-[clamp(5rem,15vw,10rem)] font-normal leading-[0.8] tracking-[-0.02em] text-ink"
            aria-hidden="true"
          >
            4<span className="text-accent">0</span>4
          </p>
        </div>

        <div className="max-w-xl">
          <h1 className="font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.08] text-ink">{t('notFound.title')}</h1>
          <p className="mt-5 max-w-reading text-[15px] leading-relaxed text-secondary">{t('notFound.text')}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to="/properties" size="lg" iconEnd={<MoveRight size={15} className="rtl:rotate-180" />}>
              {t('notFound.cta')}
            </ButtonLink>
            <ButtonLink to="/" variant="outline" size="lg">
              {t('action.goHome')}
            </ButtonLink>
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-7">
            {links.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="link-underline text-[13px] text-secondary transition-colors duration-200 hover:text-ink"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
