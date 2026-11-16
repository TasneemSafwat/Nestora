import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquare,
  PlusSquare,
  Settings as SettingsIcon,
  ShieldAlert,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useDatabase } from '../../hooks/useDatabase';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { useLanguage, type TranslationKey } from '../../i18n';
import { readJSON, STORAGE_KEYS, writeJSON } from '../../lib/storage';
import { cn } from '../../lib/utils';
import { Button, ButtonLink } from '../ui/Button';
import { CheckboxField } from '../ui/Field';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { Logo } from '../ui/Logo';

interface NavEntry {
  to: string;
  key: TranslationKey;
  icon: LucideIcon;
  end?: boolean;
}

const NAV: NavEntry[] = [
  { to: '/admin', key: 'admin.nav.overview', icon: LayoutDashboard, end: true },
  { to: '/admin/properties', key: 'admin.nav.properties', icon: Building2, end: true },
  { to: '/admin/properties/new', key: 'admin.nav.addProperty', icon: PlusSquare, end: true },
  { to: '/admin/agents', key: 'admin.nav.agents', icon: UserRound, end: true },
  { to: '/admin/inquiries', key: 'admin.nav.inquiries', icon: Mail, end: true },
  { to: '/admin/viewings', key: 'admin.nav.viewings', icon: CalendarCheck, end: true },
  { to: '/admin/valuations', key: 'admin.nav.valuations', icon: ClipboardList, end: true },
  { to: '/admin/messages', key: 'admin.nav.messages', icon: MessageSquare, end: true },
  { to: '/admin/settings', key: 'admin.nav.settings', icon: SettingsIcon, end: true },
];

function titleFor(path: string): TranslationKey {
  if (path === '/admin') return 'admin.nav.overview';
  if (path.startsWith('/admin/properties/new')) return 'admin.nav.addProperty';
  if (path.startsWith('/admin/properties')) return 'admin.nav.properties';
  if (path.startsWith('/admin/agents')) return 'admin.nav.agents';
  if (path.startsWith('/admin/inquiries')) return 'admin.nav.inquiries';
  if (path.startsWith('/admin/viewings')) return 'admin.nav.viewings';
  if (path.startsWith('/admin/valuations')) return 'admin.nav.valuations';
  if (path.startsWith('/admin/messages')) return 'admin.nav.messages';
  if (path.startsWith('/admin/settings')) return 'admin.nav.settings';
  return 'admin.title';
}

/** Shared sidebar body — rendered both fixed on desktop and inside the mobile drawer. */
function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useLanguage();
  const { properties, inquiries, viewings, settings } = useDatabase();
  const { pathname } = useLocation();

  const counts: Record<string, number> = {
    '/admin/properties': properties.length,
    '/admin/inquiries': inquiries.filter((item) => item.status === 'new').length,
    '/admin/viewings': viewings.filter((item) => item.status === 'pending').length,
  };

  const isActive = (entry: NavEntry): boolean => {
    if (entry.to === '/admin') return pathname === '/admin';
    if (entry.to === '/admin/properties') {
      return (
        pathname === '/admin/properties' ||
        (pathname.startsWith('/admin/properties/') && pathname !== '/admin/properties/new')
      );
    }
    return pathname === entry.to || pathname.startsWith(`${entry.to}/`);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[76px] shrink-0 items-center justify-between gap-3 border-b border-line px-5">
        <Link to="/admin" onClick={onNavigate} className="inline-flex items-center" aria-label={t('admin.title')}>
          <Logo tone="ink" linked={false} />
        </Link>
        <span className="rounded-xs border border-line bg-canvas-deep px-2 py-1 text-[10px] font-semibold uppercase tracking-editorial text-secondary">
          {t('admin.demoMode')}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label={t('admin.title')}>
        <ul className="flex flex-col gap-0.5">
          {NAV.map((entry) => {
            const active = isActive(entry);
            const count = counts[entry.to];
            return (
              <li key={entry.to}>
                <NavLink
                  to={entry.to}
                  end={entry.end}
                  onClick={onNavigate}
                  className={cn(
                    'group flex items-center gap-3 rounded-sm px-3 py-2.5 text-[13px] transition-colors duration-200',
                    active ? 'bg-canvas-deep text-ink' : 'text-ink-soft hover:bg-canvas-deep/60 hover:text-ink'
                  )}
                >
                  <entry.icon
                    size={17}
                    strokeWidth={1.6}
                    aria-hidden="true"
                    className={cn(active ? 'text-accent' : 'text-secondary group-hover:text-ink')}
                  />
                  <span className="flex-1 truncate">{t(entry.key)}</span>
                  {count > 0 ? (
                    <span className="rounded-xs bg-surface px-1.5 py-0.5 text-[10px] tabular-nums text-secondary">
                      {count}
                    </span>
                  ) : null}
                  {active ? <span className="h-4 w-px bg-accent" aria-hidden="true" /> : null}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-line px-5 py-4">
        <p className="text-[10px] uppercase tracking-editorial text-secondary">{t('admin.signedInAs')}</p>
        <p className="mt-1.5 text-[13px] text-ink">{settings.agencyName}</p>
        <p className="mt-0.5 text-[11px] text-secondary">{t('admin.role')}</p>
      </div>
    </div>
  );
}

function LoginScreen({ onEnter }: { onEnter: () => void }) {
  const { t } = useLanguage();
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-5 py-16">
      <div className="w-full max-w-md border border-line bg-surface p-8 shadow-soft sm:p-10">
        <Logo tone="ink" linked={false} />
        <span className="eyebrow mt-8">{t('admin.demoMode')}</span>
        <h1 className="mt-3 font-display text-[clamp(1.7rem,3vw,2.2rem)] leading-tight text-ink">
          {t('admin.login.title')}
        </h1>
        <p className="mt-4 text-[13px] leading-relaxed text-secondary">{t('admin.login.text')}</p>

        <div className="mt-6 flex items-start gap-2.5 border border-line bg-canvas-deep/70 px-4 py-3 text-[12px] leading-relaxed text-secondary">
          <ShieldAlert size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          <p>{t('admin.demoNotice')}</p>
        </div>

        <div className="mt-6">
          <CheckboxField
            label={t('admin.login.checkbox')}
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <LanguageSwitcher />
          <Button variant="primary" disabled={!accepted} onClick={onEnter}>
            {t('admin.login.button')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const { t, isRTL } = useLanguage();
  const { pathname } = useLocation();

  const [session, setSession] = useState(() => readJSON<boolean>(STORAGE_KEYS.adminSession, false));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  useLockBodyScroll(drawerOpen);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [drawerOpen]);

  const enter = useCallback(() => {
    writeJSON(STORAGE_KEYS.adminSession, true);
    setSession(true);
  }, []);

  const signOut = useCallback(() => {
    writeJSON(STORAGE_KEYS.adminSession, false);
    setSession(false);
    setDrawerOpen(false);
  }, []);

  if (!session) {
    return <LoginScreen onEnter={enter} />;
  }

  return (
    <div className="min-h-dvh bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-[272px] border-e border-line bg-surface lg:block">
        <SidebarBody />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-ink/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeDrawer}
              aria-hidden="true"
            />
            <motion.aside
              className="fixed inset-y-0 start-0 z-[80] w-[272px] border-e border-line bg-surface shadow-panel lg:hidden"
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              aria-label={t('admin.title')}
            >
              <SidebarBody onNavigate={closeDrawer} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      {/* Content column */}
      <div className="min-h-dvh lg:ps-[272px]">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-line bg-canvas/95 px-5 py-3.5 backdrop-blur-sm sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={t('nav.open')}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line text-ink transition-colors hover:border-ink lg:hidden"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <span className="eyebrow">{t('admin.demoMode')}</span>
            <h1 className="truncate font-display text-[22px] leading-tight text-ink">{t(titleFor(pathname))}</h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <ButtonLink
              to="/"
              variant="ghost"
              size="sm"
              icon={<ArrowLeft size={14} className="rtl:rotate-180" />}
              className="hidden sm:inline-flex"
            >
              {t('admin.backToSite')}
            </ButtonLink>
            <Button variant="outline" size="sm" onClick={signOut} icon={<X size={14} />}>
              {t('admin.signOut')}
            </Button>
          </div>
        </header>

        {!noticeDismissed ? (
          <div className="flex items-start gap-3 border-b border-line bg-canvas-deep/70 px-5 py-3 sm:px-8 lg:px-10">
            <ShieldAlert size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            <p className="flex-1 text-[12px] leading-relaxed text-secondary">{t('admin.demoNotice')}</p>
            <button
              type="button"
              onClick={() => setNoticeDismissed(true)}
              aria-label={t('action.close')}
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-secondary transition-colors hover:bg-surface hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>
        ) : null}

        <main id="admin-main" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
