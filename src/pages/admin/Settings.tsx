import { Download, RotateCcw, Save } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { useLanguage } from '../../i18n';
import { LANGUAGES, languageMeta } from '../../i18n/dictionary';
import { storageFootprintKb } from '../../lib/storage';
import type { AppSettings, Language } from '../../types';
import {
  downloadDemoData,
  resetDemoData,
  updateSettings,
} from '../../services/settingsService';
import { Button } from '../../components/ui/Button';
import { CheckboxField, SelectField, TextField } from '../../components/ui/Field';
import { ConfirmDialog } from '../../components/ui/Modal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { useToast } from '../../components/ui/Toast';

const CURRENCIES = ['SAR', 'AED', 'USD', 'EGP', 'GBP', 'EUR', 'QAR', 'KWD'];

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-line bg-surface p-6">
      <h2 className="font-display text-[20px] leading-tight text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Settings() {
  const { t, formatNumber } = useLanguage();
  const { settings } = useDatabase();
  const toast = useToast();

  const [draft, setDraft] = useState<AppSettings>(settings);
  const [confirmingReset, setConfirmingReset] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const patch = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const save = () => {
    updateSettings(draft);
    toast.success(t('admin.settings.saved'));
  };

  const confirmReset = () => {
    resetDemoData();
    setConfirmingReset(false);
    toast.success(t('admin.settings.resetDone'));
  };

  const exportData = () => {
    downloadDemoData();
    toast.success(t('admin.settings.exported'));
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow={t('admin.demoMode')}
        titleLead={t('admin.settings.title')}
        text={t('admin.settings.subtitle')}
        actions={
          <Button variant="primary" icon={<Save size={15} />} onClick={save}>
            {t('action.saveChanges')}
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title={t('admin.settings.agency')}>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label={t('admin.settings.agencyName')}
              value={draft.agencyName}
              onChange={(event) => patch('agencyName', event.target.value)}
              containerClassName="sm:col-span-2"
            />
            <TextField
              label={t('admin.settings.contactEmail')}
              type="email"
              value={draft.contactEmail}
              onChange={(event) => patch('contactEmail', event.target.value)}
              containerClassName="sm:col-span-2"
            />
            <TextField
              label={t('admin.settings.phone')}
              type="tel"
              value={draft.phone}
              onChange={(event) => patch('phone', event.target.value)}
            />
            <TextField
              label={t('admin.settings.whatsapp')}
              type="tel"
              value={draft.whatsapp}
              onChange={(event) => patch('whatsapp', event.target.value)}
            />
          </div>
        </Card>

        <Card title={t('admin.settings.branding')}>
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label={t('admin.settings.defaultCurrency')}
              value={draft.currency}
              onChange={(event) => patch('currency', event.target.value)}
              options={CURRENCIES.map((code) => ({ value: code, label: code }))}
            />
            <SelectField
              label={t('admin.settings.defaultLanguage')}
              value={draft.defaultLanguage}
              onChange={(event) => patch('defaultLanguage', event.target.value as Language)}
              options={LANGUAGES.map((code) => ({ value: code, label: languageMeta[code].label }))}
            />
            <TextField
              label={t('admin.settings.listingsPerPage')}
              type="number"
              min={3}
              max={48}
              inputMode="numeric"
              value={draft.listingsPerPage}
              onChange={(event) => patch('listingsPerPage', Number(event.target.value) || 0)}
              containerClassName="sm:col-span-2"
            />
          </div>
          <div className="mt-5 border-t border-line pt-5">
            <CheckboxField
              label={t('admin.settings.showDemoBanner')}
              checked={draft.showDemoBanner}
              onChange={(event) => patch('showDemoBanner', event.target.checked)}
            />
          </div>
        </Card>

        <Card title={t('admin.settings.data')}>
          <p className="text-[13px] leading-relaxed text-secondary">{t('admin.settings.resetWarning')}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="outline" icon={<Download size={15} />} onClick={exportData}>
              {t('admin.settings.export')}
            </Button>
            <Button variant="accent" icon={<RotateCcw size={15} />} onClick={() => setConfirmingReset(true)}>
              {t('admin.settings.resetData')}
            </Button>
          </div>
        </Card>

        <Card title={t('admin.settings.storageTitle')}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[13px] leading-relaxed text-secondary">{t('admin.settings.storageUsage')}</span>
            <span className="font-display text-[28px] leading-none text-ink tabular-nums">
              {formatNumber(storageFootprintKb())}
              <span className="ms-1 text-[13px] text-secondary">KB</span>
            </span>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" icon={<Save size={15} />} onClick={save}>
          {t('action.saveChanges')}
        </Button>
      </div>

      <ConfirmDialog
        open={confirmingReset}
        title={t('admin.settings.resetConfirmTitle')}
        text={t('admin.settings.resetConfirmText')}
        confirmLabel={t('admin.settings.resetData')}
        cancelLabel={t('admin.confirm.cancel')}
        onConfirm={confirmReset}
        onCancel={() => setConfirmingReset(false)}
      />
    </div>
  );
}

export default Settings;
