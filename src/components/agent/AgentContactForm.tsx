import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLanguage } from '../../i18n';
import { createInquiry } from '../../services/leadService';
import { propertiesForAgent } from '../../services/propertyService';
import type { Agent } from '../../types';
import { Button } from '../ui/Button';
import { TextArea, TextField } from '../ui/Field';
import { useToast } from '../ui/Toast';

/** The translation function signature, so the schema messages stay localised. */
type Translate = ReturnType<typeof useLanguage>['t'];

function buildContactSchema(t: Translate) {
  return z.object({
    fullName: z.string().trim().min(2, t('validation.nameMin')),
    email: z.string().trim().min(1, t('validation.required')).email(t('validation.email')),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d][\d\s().-]{5,}$/, t('validation.phone')),
    message: z.string().trim().min(10, t('validation.messageMin')),
  });
}

type ContactValues = z.infer<ReturnType<typeof buildContactSchema>>;

/**
 * Direct inquiry form for a single consultant. Records a real inquiry in the
 * demo store, then swaps itself for a confirmation panel.
 */
export function AgentContactForm({ agent }: { agent: Agent }) {
  const { t } = useLanguage();
  const toast = useToast();
  const [sent, setSent] = useState(false);

  const schema = useMemo(() => buildContactSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', phone: '', message: '' },
  });

  const onSubmit = async (values: ContactValues) => {
    const firstListing = propertiesForAgent(agent.id)[0]?.id ?? '';

    createInquiry({
      propertyId: firstListing,
      agentId: agent.id,
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      message: values.message,
    });

    toast.success(t('agent.contactSuccess'));
    reset();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-sm border border-line bg-canvas p-8">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
          <CheckCircle2 size={20} aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-[24px] leading-snug text-ink">{t('agent.contactSuccess')}</h3>
        <p className="mt-2 max-w-reading text-[13px] leading-relaxed text-secondary">{t('agent.contactSuccessText')}</p>
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={() => setSent(false)}>
            {t('valuation.success.submitAnother')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label={t('form.fullName')}
          autoComplete="name"
          required
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <TextField
          label={t('form.email')}
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <TextField
        label={t('form.phone')}
        type="tel"
        autoComplete="tel"
        required
        error={errors.phone?.message}
        {...register('phone')}
      />

      <TextArea label={t('form.message')} required error={errors.message?.message} {...register('message')} />

      <div className="flex flex-col gap-3">
        <Button type="submit" full disabled={isSubmitting}>
          {isSubmitting ? t('form.submitting') : t('action.send')}
        </Button>
        <p className="text-[11px] leading-relaxed text-secondary">{t('form.privacyNote')}</p>
      </div>
    </form>
  );
}

export default AgentContactForm;
