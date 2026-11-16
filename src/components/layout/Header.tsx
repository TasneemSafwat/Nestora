import { Heart, Menu, Phone, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { useLanguage } from '../../i18n';
import { company } from '../../data/content';
import { getSettings } from '../../services/settingsService';
import { cn, telHref, whatsappHref } from '../../lib/utils';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { Logo } from '../ui/Logo';
import { MobileNav } from './MobileNav';

export interface NavItem {
  to: string;
  key: 'nav.home' | 'nav.properties' | 'nav.agents' | 'nav.about' | 'nav.contact';
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', key: 'nav.home' },
  { to: '/properties', key: 'nav.properties' },
  { to: '/agents', key: 'nav.agents' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
];

export function Header() {
  const { t, lang, tx } = useLanguage();
  const { count } = useFavorites();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const settings = getSettings();

  return (
    <>
      {/* Utility strip — corporate structure cue taken from the reference sites. */}
      <div className="hidden bg-ink text-canvas lg:block">
        <div className="shell flex h-10 items-center justify-between text-[11px]">
          <p className="text-canvas/70">
            {tx(company.legalName)} · {tx(company.headOffice)}
          </p>
          <div className="flex items-center gap-5">
            <a href={telHref(settings.phone)} className="inline-flex items-center gap-1.5 text-canvas/80 transition-colors hover:text-canvas">
              <Phone size={12} />
              <span dir="ltr">{settings.phone}</span>
            </a>
            <a
              href={whatsappHref(settings.whatsapp)}
              target="_blank"
              rel="noreferrer noopener"
              className="text-canvas/80 transition-colors hover:text-canvas"
            >
              {t('action.whatsapp')}
            </a>
            <Link to="/valuation" className="inline-flex items-center gap-1.5 text-accent-soft transition-colors hover:text-canvas">
              <Sparkles size={12} />
              {t('nav.valuation')}
            </Link>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 border-b bg-canvas/92 backdrop-blur-md transition-[border-color,box-shadow] duration-300',
          scrolled ? 'border-line shadow-[0_1px_20px_-14px_rgba(36,37,34,0.5)]' : 'border-transparent'
        )}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6 lg:h-[76px]">
          <Logo tone="ink" />

          <nav className="hidden items-center gap-8 lg:flex" aria-label={t('nav.menu')}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative text-[13px] transition-colors duration-200',
                    isActive ? 'text-ink' : 'text-secondary hover:text-ink'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {t(item.key)}
                    <span
                      className={cn(
                        'absolute -bottom-1.5 start-0 h-px w-full origin-left bg-accent transition-transform duration-500 ease-editorial rtl:origin-right',
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/favorites"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-canvas-deep"
              aria-label={t('nav.favorites')}
            >
              <Heart size={17} />
              {count > 0 ? (
                <span className="absolute -top-0.5 end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                  {count}
                </span>
              ) : null}
            </Link>

            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <Link
              to="/contact"
              className="hidden h-11 items-center justify-center bg-ink px-5 text-[13px] font-medium text-canvas transition-colors duration-300 hover:bg-ink-soft lg:inline-flex"
            >
              {t('action.contactUs')}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-canvas-deep lg:hidden"
              aria-label={t('nav.open')}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} lang={lang} />
    </>
  );
}

export default Header;
