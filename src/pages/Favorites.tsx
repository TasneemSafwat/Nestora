import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Info, Mail, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { TranslationKey } from '../i18n';
import { useLanguage } from '../i18n';
import { useDatabase } from '../hooks/useDatabase';
import { useFavorites } from '../hooks/useFavorites';
import { createMessage } from '../services/leadService';
import { publishedProperties } from '../services/propertyService';
import { PropertyCard } from '../components/property/PropertyCard';
import { Button, ButtonLink } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { TextArea, TextField } from '../components/ui/Field';
import { ConfirmDialog, Modal } from '../components/ui/Modal';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useToast } from '../components/ui/Toast';

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

interface NotesValues {
  fullName: string;
  phone: string;
  message: string;
}

function notesSchema(t: Translate) {
  return z.object({
    fullName: z.string().trim().min(2, t('validation.nameMin')),
    phone: z
      .string()
      .trim()
      .regex(/^[+]?[\d\s()-]{7,}$/, t('validation.phone')),
    message: z.string().trim().min(10, t('validation.messageMin')),
  });
}

export function Favorites() {
  const { t, tx } = useLanguage();
  const { properties } = useDatabase();
  const { ids, count, clear } = useFavorites();
  const toast = useToast();

  const saved = publishedProperties(properties).filter((property) => ids.includes(property.id));

  const prefilledMessage = [
    t('favorites.notes.title'),
    ...saved.map((property) => `• ${tx(property.title)} (${property.reference})`),
  ].join('\n');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesSent, setNotesSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NotesValues>({
    resolver: zodResolver(notesSchema(t)),
    defaultValues: { fullName: '', phone: '', message: prefilledMessage },
    mode: 'onTouched',
  });

  const openNotes = () => {
    reset({ fullName: '', phone: '', message: prefilledMessage });
    setNotesSent(false);
    setNotesOpen(true);
  };

  const closeNotes = () => {
    setNotesOpen(false);
    setNotesSent(false);
  };

  const onNotesSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    createMessage({
      fullName: values.fullName,
      phone: values.phone,
      email: '',
      subject: t('favorites.notes.title'),
      message: values.message,
    });
    setNotesSent(true);
    toast.success(t('favorites.notes.success'));
  });

  const handleClear = () => {
    clear();
    setConfirmOpen(false);
    toast.info(t('favorites.cleared'));
  };

  return (
    <section className="shell py-24 lg:py-32">
      <Reveal>
        <SectionHeading
          eyebrow={t('favorites.page.eyebrow')}
          titleLead={t('favorites.page.titleLead')}
          titleAccent={t('favorites.page.titleAccent')}
          text={t('favorites.page.subtitle')}
        />
      </Reveal>

      <p className="mt-6 flex items-start gap-2 text-[12px] leading-relaxed text-secondary">
        <Info size={13} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
        {t('favorites.localNote')}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-5">
        <p className="text-[13px] text-ink-soft">
          {count === 1 ? t('favorites.countOne') : t('favorites.count', { count })}
        </p>
        {count > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={15} aria-hidden="true" />}
            onClick={() => setConfirmOpen(true)}
          >
            {t('favorites.clear')}
          </Button>
        ) : null}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:gap-14">
        <div>
          {count === 0 ? (
            <EmptyState
              title={t('empty.favorites')}
              text={t('empty.favoritesHint')}
              action={<ButtonLink to="/properties">{t('action.exploreProperties')}</ButtonLink>}
            />
          ) : (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((property, index) => (
                <Reveal key={property.id} delay={0.05 * index}>
                  <PropertyCard property={property} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-line bg-surface p-7">
            <h2 className="font-display text-[22px] leading-snug text-ink">{t('favorites.notes.title')}</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-secondary">{t('favorites.notes.text')}</p>
            <Button
              variant="outline"
              className="mt-6"
              icon={<Mail size={15} aria-hidden="true" />}
              onClick={openNotes}
            >
              {t('favorites.notes.button')}
            </Button>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={t('favorites.clearConfirmTitle')}
        text={t('favorites.clearConfirmText')}
        confirmLabel={t('action.clearAll')}
        cancelLabel={t('action.cancel')}
        onConfirm={handleClear}
        onCancel={() => setConfirmOpen(false)}
      />

      <Modal
        open={notesOpen}
        onClose={closeNotes}
        title={t('favorites.notes.title')}
        description={t('favorites.notes.text')}
      >
        {notesSent ? (
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
              <CheckCircle2 size={20} aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-[20px] text-ink">{t('favorites.notes.success')}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-secondary">{t('favorites.notes.successText')}</p>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={closeNotes}>
                {t('action.close')}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onNotesSubmit} noValidate className="flex flex-col gap-5">
            <TextField
              label={t('form.fullName')}
              required
              autoComplete="name"
              error={errors.fullName?.message}
              {...register('fullName')}
            />
            <TextField
              label={t('form.phone')}
              type="tel"
              required
              autoComplete="tel"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <TextArea label={t('form.message')} required rows={6} error={errors.message?.message} {...register('message')} />
            <p className="text-[12px] leading-relaxed text-secondary">{t('form.privacyNote')}</p>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={closeNotes}>
                {t('action.cancel')}
              </Button>
              <Button type="submit" variant="accent" disabled={isSubmitting}>
                {isSubmitting ? t('form.submitting') : t('action.send')}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </section>
  );
}

export default Favorites;
