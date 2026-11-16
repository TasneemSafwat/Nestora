import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarCheck, Check, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Property } from '../../types';
import { useLanguage } from '../../i18n';
import { Button } from '../ui/Button';
import { SelectField, TextArea, TextField } from '../ui/Field';
import { useToast } from '../ui/Toast';
import { createInquiry, createViewing } from '../../services/leadService';

type Translate = ReturnType<typeof useLanguage>['t'];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

function inquirySchema(t: Translate) {
  return z.object({
    fullName: z.string().min(2, t('validation.nameMin')),
    email: z.string().email(t('validation.email')),
    phone: z.string().min(7, t('validation.phone')),
    message: z.string().min(10, t('validation.messageMin')),
  });
}

function viewingSchema(t: Translate) {
  const today = new Date().toISOString().slice(0, 10);
  return z.object({
    fullName: z.string().min(2, t('validation.nameMin')),
    email: z.string().email(t('validation.email')),
    phone: z.string().min(7, t('validation.phone')),
    preferredDate: z
      .string()
      .min(1, t('validation.required'))
      .refine((value) => value >= today, t('validation.dateFuture')),
    preferredTime: z.string().min(1, t('validation.required')),
    message: z.string().min(10, t('validation.messageMin')),
  });
}

type InquiryValues = z.infer<ReturnType<typeof inquirySchema>>;
type ViewingValues = z.infer<ReturnType<typeof viewingSchema>>;

function SuccessPanel({
  title,
  text,
  onReset,
  resetLabel,
}: {
  title: string;
  text: string;
  onReset: () => void;
  resetLabel: string;
}) {
  return (
    <div className="rounded-sm border border-line bg-surface p-6">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
        <Check size={18} aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-[21px] leading-snug text-ink">{title}</h3>
      <p className="mt-2.5 text-[13px] leading-relaxed text-secondary">{text}</p>
      <Button type="button" variant="ghost" className="mt-3 px-0" onClick={onReset}>
        {resetLabel}
      </Button>
    </div>
  );
}

/** Direct inquiry for a single listing. Writes through the lead service. */
export function InquiryForm({ property }: { property: Property }) {
  const { t, tx } = useLanguage();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema(t)),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      message: `${tx(property.title)} — ${property.reference}`,
    },
  });

  const submit = handleSubmit((values) => {
    createInquiry({
      propertyId: property.id,
      agentId: property.agentId,
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      message: values.message,
    });
    toast.success(t('property.inquiry.success'));
  });

  if (isSubmitSuccessful) {
    return (
      <SuccessPanel
        title={t('property.inquiry.success')}
        text={t('property.inquiry.successText')}
        onReset={() => reset({ fullName: '', email: '', phone: '', message: '' })}
        resetLabel={t('property.inquiry.cta')}
      />
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
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
      <TextField
        label={t('form.phone')}
        type="tel"
        dir="ltr"
        autoComplete="tel"
        required
        error={errors.phone?.message}
        {...register('phone')}
      />
      <TextArea
        label={t('form.message')}
        rows={4}
        required
        error={errors.message?.message}
        {...register('message')}
      />
      <Button type="submit" variant="primary" full disabled={isSubmitting} icon={<Send size={14} aria-hidden="true" />}>
        {isSubmitting ? t('form.submitting') : t('property.inquiry.cta')}
      </Button>
      <p className="text-[11px] leading-relaxed text-secondary">{t('form.privacyNote')}</p>
    </form>
  );
}

/** Appointment request for a single listing, with a date and a time slot. */
export function ViewingForm({ property }: { property: Property }) {
  const { t, tx } = useLanguage();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ViewingValues>({
    resolver: zodResolver(viewingSchema(t)),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      preferredDate: '',
      preferredTime: '',
      message: `${tx(property.title)} — ${property.reference}`,
    },
  });

  const submit = handleSubmit((values) => {
    createViewing({
      propertyId: property.id,
      agentId: property.agentId,
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      preferredDate: values.preferredDate,
      preferredTime: values.preferredTime,
      message: values.message,
    });
    toast.success(t('property.viewing.success'));
  });

  if (isSubmitSuccessful) {
    return (
      <SuccessPanel
        title={t('property.viewing.success')}
        text={t('property.viewing.successText')}
        onReset={() =>
          reset({ fullName: '', email: '', phone: '', preferredDate: '', preferredTime: '', message: '' })
        }
        resetLabel={t('property.viewing.cta')}
      />
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
      <TextField
        label={t('form.fullName')}
        autoComplete="name"
        required
        error={errors.fullName?.message}
        {...register('fullName')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={t('form.email')}
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label={t('form.phone')}
          type="tel"
          dir="ltr"
          autoComplete="tel"
          required
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={t('form.preferredDate')}
          type="date"
          required
          error={errors.preferredDate?.message}
          {...register('preferredDate')}
        />
        <SelectField
          label={t('form.preferredTime')}
          required
          placeholder={t('form.selectPlaceholder')}
          error={errors.preferredTime?.message}
          options={TIME_SLOTS.map((slot) => ({ value: slot, label: slot }))}
          {...register('preferredTime')}
        />
      </div>
      <TextArea
        label={t('form.message')}
        rows={3}
        required
        error={errors.message?.message}
        {...register('message')}
      />
      <Button
        type="submit"
        variant="accent"
        full
        disabled={isSubmitting}
        icon={<CalendarCheck size={14} aria-hidden="true" />}
      >
        {isSubmitting ? t('form.submitting') : t('property.viewing.cta')}
      </Button>
      <p className="text-[11px] leading-relaxed text-secondary">{t('form.privacyNote')}</p>
    </form>
  );
}
