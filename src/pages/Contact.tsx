import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { TranslationKey } from '../i18n';
import { useLanguage } from '../i18n';
import { company } from '../data/content';
import { useDatabase } from '../hooks/useDatabase';
import { createMessage } from '../services/leadService';
import { telHref, whatsappHref } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Button, ButtonAnchor } from '../components/ui/Button';
import { SelectField, TextArea, TextField } from '../components/ui/Field';
import type { SelectOption } from '../components/ui/Field';
import { Collapsible } from '../components/ui/Collapsible';
import { MapPanel } from '../components/ui/MapPanel';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useToast } from '../components/ui/Toast';

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

interface ContactValues {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

function contactSchema(t: Translate) {
  return z.object({
    fullName: z.string().trim().min(2, t('validation.nameMin')),
    email: z.string().trim().min(1, t('validation.required')).email(t('validation.email')),
    phone: z
      .string()
      .trim()
      .regex(/^[+]?[\d\s()-]{7,}$/, t('validation.phone')),
    subject: z.string().min(1, t('validation.required')),
    message: z.string().trim().min(10, t('validation.messageMin')),
  });
}

const officeCoords: Record<string, { lat: number; lng: number }> = {
  riyadh: company.mapCenter,
  jeddah: { lat: company.mapCenter.lat - 0.15, lng: company.mapCenter.lng - 0.18 },
  khobar: { lat: company.mapCenter.lat - 0.1, lng: company.mapCenter.lng + 0.16 },
};

export function Contact() {
  const { t, tx } = useLanguage();
  const { settings } = useDatabase();
  const toast = useToast();

  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema(t)),
    defaultValues: { fullName: '', email: '', phone: '', subject: '', message: '' },
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    createMessage({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      subject: values.subject,
      message: values.message,
    });
    reset();
    setSent(true);
    toast.success(t('contact.form.success'));
  });

  const subjectOptions: SelectOption[] = [
    { value: 'general', label: t('contact.form.subject.general') },
    { value: 'buying', label: t('contact.form.subject.buying') },
    { value: 'selling', label: t('contact.form.subject.selling') },
    { value: 'renting', label: t('contact.form.subject.renting') },
    { value: 'valuation', label: t('contact.form.subject.valuation') },
    { value: 'management', label: t('contact.form.subject.management') },
  ];

  const faqItems = [
    { q: t('contact.faq.q1'), a: t('contact.faq.a1') },
    { q: t('contact.faq.q2'), a: t('contact.faq.a2') },
    { q: t('contact.faq.q3'), a: t('contact.faq.a3') },
    { q: t('contact.faq.q4'), a: t('contact.faq.a4') },
  ];

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Heading                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-b border-line bg-canvas-deep/40">
        <div className="shell py-24 lg:py-28">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow={t('contact.hero.eyebrow')}
              titleLead={t('contact.hero.titleLead')}
              titleAccent={t('contact.hero.titleAccent')}
              text={t('contact.hero.subtitle')}
            />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Message form beside direct lines                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-20">
          <div>
            {sent ? (
              <div className="border border-line bg-surface p-8 lg:p-10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
                  <CheckCircle2 size={22} aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-display text-[clamp(1.6rem,3vw,2.2rem)] text-ink">
                  {t('contact.form.success')}
                </h2>
                <p className="mt-4 max-w-reading text-[14px] leading-relaxed text-secondary">
                  {t('contact.form.successText')}
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <h2 className="font-display text-[clamp(1.7rem,3vw,2.3rem)] leading-tight text-ink">
                  {t('contact.form.title')}
                </h2>
                <p className="mt-3 max-w-reading text-[14px] leading-relaxed text-secondary">
                  {t('contact.form.text')}
                </p>

                <div className="mt-9 grid gap-5 sm:grid-cols-2">
                  <TextField
                    label={t('form.fullName')}
                    required
                    autoComplete="name"
                    error={errors.fullName?.message}
                    {...register('fullName')}
                  />
                  <TextField
                    label={t('form.email')}
                    type="email"
                    required
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <TextField
                    label={t('form.phone')}
                    type="tel"
                    required
                    autoComplete="tel"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <SelectField
                    label={t('contact.form.subject')}
                    required
                    placeholder={t('form.selectPlaceholder')}
                    options={subjectOptions}
                    error={errors.subject?.message}
                    {...register('subject')}
                  />
                </div>

                <div className="mt-5">
                  <TextArea
                    label={t('form.message')}
                    required
                    rows={6}
                    placeholder={t('contact.form.messagePlaceholder')}
                    error={errors.message?.message}
                    {...register('message')}
                  />
                </div>

                <div className="mt-7">
                  <Button type="submit" variant="accent" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? t('form.submitting') : t('contact.form.submit')}
                  </Button>
                  <p className="mt-4 max-w-reading text-[12px] leading-relaxed text-secondary">
                    {t('form.privacyNote')}
                  </p>
                </div>
              </form>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-[clamp(1.4rem,2.4vw,1.8rem)] text-ink">{t('contact.details.title')}</h2>

            <dl className="mt-8 flex flex-col divide-y divide-line border-y border-line">
              <div className="flex items-start gap-4 py-5">
                <Phone size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-[11px] uppercase tracking-editorial text-secondary">
                    {t('contact.details.phone')}
                  </dt>
                  <dd className="mt-1.5">
                    <a href={telHref(settings.phone)} className="link-underline text-[14px] text-ink-soft" dir="ltr">
                      {settings.phone}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-4 py-5">
                <MessageCircle size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-[11px] uppercase tracking-editorial text-secondary">
                    {t('contact.details.whatsapp')}
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href={whatsappHref(settings.whatsapp)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-underline text-[14px] text-ink-soft"
                      dir="ltr"
                    >
                      {settings.whatsapp}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-4 py-5">
                <Mail size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-[11px] uppercase tracking-editorial text-secondary">
                    {t('contact.details.email')}
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="link-underline text-[14px] text-ink-soft"
                      dir="ltr"
                    >
                      {settings.contactEmail}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-4 py-5">
                <Clock size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-[11px] uppercase tracking-editorial text-secondary">
                    {t('contact.details.hours')}
                  </dt>
                  <dd className="mt-1.5 text-[14px] text-ink-soft">{tx(company.workingHours)}</dd>
                </div>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Offices                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y border-line bg-canvas-deep/40">
        <div className="shell py-24 lg:py-32">
          <Reveal>
            <SectionHeading
              eyebrow={t('contact.offices.eyebrow')}
              titleLead={t('contact.offices.titleLead')}
              titleAccent={t('contact.offices.titleAccent')}
              text={t('contact.offices.text')}
            />
          </Reveal>

          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {company.branches.map((branch, index) => {
              const coords = officeCoords[branch.id] ?? company.mapCenter;
              return (
                <Reveal key={branch.id} delay={0.06 * index}>
                  <article>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="font-display text-[20px] leading-snug text-ink">{tx(branch.label)}</h3>
                      {branch.id === 'riyadh' ? (
                        <Badge tone="accent">{t('contact.offices.headOfficeTag')}</Badge>
                      ) : null}
                    </div>
                    <MapPanel
                      lat={coords.lat}
                      lng={coords.lng}
                      label={tx(branch.label)}
                      note={t('contact.offices.mapNote')}
                      linkLabel={t('contact.offices.directions')}
                    />
                    <p className="mt-4 flex items-center gap-1.5 text-[12px] text-secondary">
                      <MapPin size={13} className="text-accent" aria-hidden="true" />
                      {tx(company.headOffice)}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FAQ                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell py-24 lg:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={t('contact.faq.eyebrow')}
            titleLead={t('contact.faq.titleLead')}
            titleAccent={t('contact.faq.titleAccent')}
          />
        </Reveal>

        <div className="mt-12 max-w-3xl">
          {faqItems.map((item, index) => (
            <Reveal key={item.q} delay={0.04 * index}>
              <Collapsible title={item.q} defaultOpen={index === 0}>
                <p className="max-w-reading text-[14px] leading-relaxed text-secondary">{item.a}</p>
              </Collapsible>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Closing CTA                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-line bg-ink text-canvas">
        <div className="shell py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-[clamp(1.9rem,4.2vw,3.35rem)] leading-[1.08] text-canvas">
              {t('contact.cta.titleLead')}{' '}
              <span className="italic text-accent-soft">{t('contact.cta.titleAccent')}</span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-canvas/70">{t('contact.cta.text')}</p>
            <div className="mt-9 flex justify-center">
              <ButtonAnchor
                href={telHref(settings.phone)}
                variant="accent"
                size="lg"
                icon={<Phone size={16} aria-hidden="true" />}
              >
                {t('contact.cta.button', { phone: settings.phone })}
              </ButtonAnchor>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
