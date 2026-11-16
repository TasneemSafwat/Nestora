import { Outlet } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { ErrorBoundary } from './ErrorBoundary';
import { Footer } from './Footer';
import { Header } from './Header';
import { ScrollToTop } from './ScrollToTop';

/** Chrome shared by every public page. */
export function PublicLayout() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2.5 focus:text-[13px] focus:text-canvas"
      >
        {t('a11y.skipToContent')}
      </a>
      <Header />
      <main id="main" className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
