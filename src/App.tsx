import { Route, Routes } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './i18n';
import { AdminLayout } from './components/admin/AdminLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { ButtonLink } from './components/ui/Button';
import { EmptyState } from './components/ui/EmptyState';
import { ToastProvider } from './components/ui/Toast';
import { About } from './pages/About';
import { AgentDetails } from './pages/AgentDetails';
import { Agents } from './pages/Agents';
import { Contact } from './pages/Contact';
import { Favorites } from './pages/Favorites';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Properties } from './pages/Properties';
import { PropertyDetails } from './pages/PropertyDetails';
import { Valuation } from './pages/Valuation';
import { Agents as AdminAgents } from './pages/admin/Agents';
import { Inquiries } from './pages/admin/Inquiries';
import { Messages } from './pages/admin/Messages';
import { Overview } from './pages/admin/Overview';
import { Properties as AdminProperties } from './pages/admin/Properties';
import { PropertyForm } from './pages/admin/PropertyForm';
import { Settings as AdminSettings } from './pages/admin/Settings';
import { Valuations } from './pages/admin/Valuations';
import { Viewings } from './pages/admin/Viewings';

/** Shown when an unknown admin section is requested. */
function AdminFallback() {
  const { t } = useLanguage();

  return (
    <EmptyState
      title={t('admin.notFound.title')}
      text={t('admin.notFound.text')}
      action={<ButtonLink to="/admin">{t('admin.nav.overview')}</ButtonLink>}
    />
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="properties" element={<Properties />} />
            <Route path="properties/:slug" element={<PropertyDetails />} />
            <Route path="about" element={<About />} />
            <Route path="agents" element={<Agents />} />
            <Route path="agents/:id" element={<AgentDetails />} />
            <Route path="contact" element={<Contact />} />
            <Route path="valuation" element={<Valuation />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="properties/new" element={<PropertyForm />} />
            <Route path="properties/:id/edit" element={<PropertyForm />} />
            <Route path="agents" element={<AdminAgents />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="viewings" element={<Viewings />} />
            <Route path="valuations" element={<Valuations />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<AdminFallback />} />
          </Route>
        </Routes>
      </ToastProvider>
    </LanguageProvider>
  );
}
