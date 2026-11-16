import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Mail, Phone, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { useLanguage } from '../../i18n';
import { company } from '../../data/content';
import { getSettings } from '../../services/settingsService';
import { telHref, whatsappHref } from '../../lib/utils';
import { ButtonLink } from '../ui/Button';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { Logo } from '../ui/Logo';
import { NAV_ITEMS } from './Header';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
}

export function MobileNav({ open, onClose, lang }: MobileNavProps) {
  const { t, tx } = useLanguage();
  const { count } = useFavorites();
  useLockBodyScroll(open);

  const settings = getSettings();
  const fromRight = lang !== 'ar';

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[110] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.menu')}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

          <motion.div
            className="absolute inset-y-0 end-0 flex w-[min(400px,92vw)] flex-col bg-canvas shadow-panel"
            initial={{ x: fromRight ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: fromRight ? '100%' : '-100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-line px-5">
              <Logo tone="ink" linked={false} />
              <button
                type="button"
                onClick={onClose}
                aria-label={t('nav.close')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-canvas-deep"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <nav className="flex flex-col" aria-label={t('nav.menu')}>
                {NAV_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * index + 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-baseline justify-between border-b border-line py-4 font-display text-[26px] leading-none transition-colors ${
                          isActive ? 'text-accent' : 'text-ink'
                        }`
                      }
                    >
                      <span>{t(item.key)}</span>
                      <span className="font-sans text-[11px] tracking-editorial text-secondary">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-3">
                <NavLink
                  to="/favorites"
                  onClick={onClose}
                  className="flex items-center justify-between border-b border-line py-3.5 text-[14px] text-ink"
                >
                  <span className="inline-flex items-center gap-2">
                    <Heart size={16} />
                    {t('nav.favorites')}
                  </span>
                  {count > 0 ? <span className="text-[12px] text-secondary">{count}</span> : null}
                </NavLink>
                <NavLink
                  to="/valuation"
                  onClick={onClose}
                  className="flex items-center justify-between border-b border-line py-3.5 text-[14px] text-ink"
                >
                  {t('nav.valuation')}
                </NavLink>
                <NavLink
                  to="/admin"
                  onClick={onClose}
                  className="flex items-center justify-between border-b border-line py-3.5 text-[14px] text-secondary"
                >
                  {t('nav.admin')}
                </NavLink>
              </div>

              <div className="mt-8 space-y-4">
                <LanguageSwitcher />
                <ButtonLink to="/contact" onClick={onClose} full size="lg">
                  {t('action.contactUs')}
                </ButtonLink>
              </div>

              <div className="mt-8 space-y-3 border-t border-line pt-6 text-[13px] text-secondary">
                <a href={telHref(settings.phone)} className="flex items-center gap-2.5 hover:text-ink">
                  <Phone size={14} />
                  <span dir="ltr">{settings.phone}</span>
                </a>
                <a
                  href={whatsappHref(settings.whatsapp)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2.5 hover:text-ink"
                >
                  <Phone size={14} />
                  {t('action.whatsapp')}
                </a>
                <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2.5 hover:text-ink">
                  <Mail size={14} />
                  {settings.contactEmail}
                </a>
                <p className="pt-1 text-[12px]">{tx(company.workingHours)}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default MobileNav;
