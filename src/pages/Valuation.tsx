import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check, CheckCircle2, Info, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { TranslationKey } from '../i18n';
import { useLanguage } from '../i18n';
import { company } from '../data/content';
import { cities, cityById, conditionOptions, districtById, districtsByCity, propertyTypeById, propertyTypes } from '../data/taxonomy';
import { createValuation } from '../services/leadService';
import type { PropertyType, ValuationRequest } from '../types';
import { Button, ButtonLink } from '../components/ui/Button';
import { SelectField, TextArea, TextField } from '../components/ui/Field';
import type { SelectOption } from '../components/ui/Field';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useToast } from '../components/ui/Toast';
import { cn } from '../lib/utils';

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

interface ValuationFormValues {
  propertyType: string;
  cityId: string;
  districtId: string;
  area: number;
  lotArea?: number;
  bedrooms: number;
  condition: string;
  expectedPrice?: number;
  fullName: string;
  phone: string;
  email: string;
  details?: string;
}

function valuationSchema(t: Translate) {
  return z.object({
    propertyType: z.string().min(1, t('validation.required')),
    cityId: z.string().min(1, t('validation.required')),
    districtId: z.string().min(1, t('validation.required')),
    area: z.number({ invalid_type_error: t('validation.areaPositive') }).positive(t('validation.areaPositive')),
    lotArea: z.number().positive(t('validation.areaPositive')).optional(),
    bedrooms: z.number({ invalid_type_error: t('validation.required') }).int().min(0, t('validation.required')),
    condition: z.string().min(1, t('validation.required')),
    expectedPrice: z.number().positive(t('validation.pricePositive')).optional(),
    fullName: z.string().trim().min(2, t('validation.nameMin')),
    phone: z
      .string()
      .trim()
      .regex(/^[+]?[\d\s()-]{7,}$/, t('validation.phone')),
    email: z.string().trim().min(1, t('validation.required')).email(t('validation.email')),
    details: z.string().optional(),
  });
}

const stepOneFields: (keyof ValuationFormValues)[] = [
  'propertyType',
  'cityId',
  'districtId',
  'area',
  'lotArea',
  'bedrooms',
  'condition',
  'expectedPrice',
];

const stepTwoFields: (keyof ValuationFormValues)[] = ['fullName', 'phone', 'email', 'details'];

const whyPoints = ['valuation.why.p1', 'valuation.why.p2', 'valuation.why.p3', 'valuation.why.p4'] as const;
const nextPoints = ['valuation.whatNext.p1', 'valuation.whatNext.p2', 'valuation.whatNext.p3'] as const;

export function Valuation() {
  const { t, tx, formatArea, formatNumber, formatPrice } = useLanguage();
  const toast = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [created, setCreated] = useState<ValuationRequest | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ValuationFormValues>({
    resolver: zodResolver(valuationSchema(t)),
    defaultValues: {
      propertyType: '',
      cityId: '',
      districtId: '',
      condition: '',
      fullName: '',
      phone: '',
      email: '',
      details: '',
    },
    mode: 'onTouched',
  });

  const selectedCity = watch('cityId');
  const values = watch();

  useEffect(() => {
    setValue('districtId', '');
  }, [selectedCity, setValue]);

  const propertyTypeOptions: SelectOption[] = propertyTypes.map((type) => ({
    value: type.id,
    label: tx(type.name),
  }));
  const cityOptions: SelectOption[] = cities.map((city) => ({ value: city.id, label: tx(city.name) }));
  const districtOptions: SelectOption[] = districtsByCity(selectedCity).map((district) => ({
    value: district.id,
    label: tx(district.name),
  }));
  const conditionSelectOptions: SelectOption[] = conditionOptions.map((option) => ({
    value: option.id,
    label: tx(option.name),
  }));

  const handleNext = async () => {
    const fields = step === 1 ? stepOneFields : stepTwoFields;
    const valid = await trigger(fields);
    if (valid) {
      setStep((current) => (current === 1 ? 2 : 3));
    }
  };

  const onSubmit = handleSubmit(async (submitted) => {
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    const record = createValuation({
      propertyType: submitted.propertyType as PropertyType,
      cityId: submitted.cityId,
      districtId: submitted.districtId,
      area: submitted.area,
      bedrooms: submitted.bedrooms,
      condition: submitted.condition as ValuationRequest['condition'],
      expectedPrice: submitted.expectedPrice ?? null,
      fullName: submitted.fullName,
      phone: submitted.phone,
      email: submitted.email,
      message: submitted.details ?? '',
    });
    setCreated(record);
    toast.success(t('valuation.success.title'));
  });

  const resetWizard = () => {
    reset();
    setStep(1);
    setCreated(null);
  };

  const reviewRows: { label: string; value: string }[] = [
    { label: t('valuation.field.propertyType'), value: propertyTypeById(values.propertyType) ? tx(propertyTypeById(values.propertyType)!.name) : t('misc.notSpecified') },
    { label: t('valuation.field.city'), value: cityById(values.cityId) ? tx(cityById(values.cityId)!.name) : t('misc.notSpecified') },
    { label: t('valuation.field.district'), value: districtById(values.districtId) ? tx(districtById(values.districtId)!.name) : t('misc.notSpecified') },
    { label: t('valuation.field.area'), value: values.area ? formatArea(values.area) : t('misc.notSpecified') },
    { label: t('valuation.field.lotArea'), value: values.lotArea ? formatArea(values.lotArea) : t('misc.notSpecified') },
    { label: t('valuation.field.bedrooms'), value: values.bedrooms ? formatNumber(values.bedrooms) : t('misc.notSpecified') },
    {
      label: t('valuation.field.condition'),
      value: conditionOptions.find((option) => option.id === values.condition)
        ? tx(conditionOptions.find((option) => option.id === values.condition)!.name)
        : t('misc.notSpecified'),
    },
    {
      label: t('valuation.field.expectedPrice'),
      value: values.expectedPrice ? formatPrice(values.expectedPrice) : t('misc.notSpecified'),
    },
    { label: t('valuation.field.fullName'), value: getValues('fullName') || t('misc.notSpecified') },
    { label: t('valuation.field.phone'), value: getValues('phone') || t('misc.notSpecified') },
    { label: t('valuation.field.email'), value: getValues('email') || t('misc.notSpecified') },
    { label: t('valuation.field.details'), value: getValues('details') || t('misc.notSpecified') },
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
              eyebrow={t('valuation.hero.eyebrow')}
              titleLead={t('valuation.hero.titleLead')}
              titleAccent={t('valuation.hero.titleAccent')}
              text={t('valuation.hero.subtitle')}
            />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Wizard beside the sidebar                                          */}
      {/* ------------------------------------------------------------------ */}
      <section className="shell py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-16">
          <div>
            {created ? (
              <div className="border border-line bg-surface p-8 lg:p-10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
                  <CheckCircle2 size={22} aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-display text-[clamp(1.6rem,3vw,2.2rem)] text-ink">
                  {t('valuation.success.title')}
                </h2>
                <p className="mt-4 max-w-reading text-[14px] leading-relaxed text-secondary">
                  {t('valuation.success.text', { name: created.fullName })}
                </p>

                <p className="mt-7 inline-flex flex-wrap items-center gap-3 border border-line bg-canvas-deep px-4 py-3">
                  <span className="text-[11px] uppercase tracking-editorial text-secondary">
                    {t('valuation.success.reference')}
                  </span>
                  <span className="font-display text-[15px] text-ink" dir="ltr">
                    {created.id}
                  </span>
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button variant="outline" onClick={resetWizard}>
                    {t('valuation.success.submitAnother')}
                  </Button>
                  <ButtonLink
                    to="/admin/valuations"
                    variant="primary"
                    iconEnd={<ArrowRight size={15} className="rtl:rotate-180" />}
                  >
                    {t('valuation.success.viewDashboard')}
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                {/* Stepper */}
                <ol className="flex flex-wrap items-center gap-3 border-b border-line pb-6">
                  {[
                    { n: 1 as const, label: t('valuation.form.stepProperty') },
                    { n: 2 as const, label: t('valuation.form.stepOwner') },
                  ].map((item) => (
                    <li key={item.n} className="flex items-center gap-3">
                      <span
                        className={cn(
                          'inline-flex h-8 w-8 items-center justify-center rounded-full border text-[12px]',
                          step >= item.n ? 'border-ink bg-ink text-canvas' : 'border-line bg-surface text-secondary'
                        )}
                      >
                        {item.n}
                      </span>
                      <span
                        className={cn(
                          'text-[11px] uppercase tracking-editorial',
                          step >= item.n ? 'text-ink' : 'text-secondary'
                        )}
                      >
                        {item.label}
                      </span>
                      {item.n === 1 ? <span className="h-px w-6 bg-line sm:w-12" aria-hidden="true" /> : null}
                    </li>
                  ))}
                  <li className="ms-auto text-[11px] uppercase tracking-editorial text-secondary">
                    {t('valuation.form.step', { current: Math.min(step, 2), total: 2 })}
                  </li>
                </ol>

                {/* Step 1 — property */}
                {step === 1 ? (
                  <div className="mt-9">
                    <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-ink">
                      {t('valuation.form.title')}
                    </h2>
                    <p className="mt-3 max-w-reading text-[14px] leading-relaxed text-secondary">
                      {t('valuation.form.text')}
                    </p>

                    <div className="mt-9 grid gap-5 sm:grid-cols-2">
                      <SelectField
                        label={t('valuation.field.propertyType')}
                        required
                        placeholder={t('form.selectPlaceholder')}
                        options={propertyTypeOptions}
                        error={errors.propertyType?.message}
                        {...register('propertyType')}
                      />
                      <SelectField
                        label={t('valuation.field.city')}
                        required
                        placeholder={t('form.selectPlaceholder')}
                        options={cityOptions}
                        error={errors.cityId?.message}
                        {...register('cityId')}
                      />
                      <SelectField
                        label={t('valuation.field.district')}
                        required
                        disabled={!selectedCity}
                        placeholder={t('form.selectPlaceholder')}
                        options={districtOptions}
                        error={errors.districtId?.message}
                        {...register('districtId')}
                      />
                      <SelectField
                        label={t('valuation.field.condition')}
                        required
                        placeholder={t('form.selectPlaceholder')}
                        options={conditionSelectOptions}
                        error={errors.condition?.message}
                        {...register('condition')}
                      />
                      <TextField
                        label={t('valuation.field.area')}
                        type="number"
                        min={0}
                        inputMode="numeric"
                        required
                        error={errors.area?.message}
                        {...register('area', { valueAsNumber: true })}
                      />
                      <TextField
                        label={t('valuation.field.lotArea')}
                        type="number"
                        min={0}
                        inputMode="numeric"
                        error={errors.lotArea?.message}
                        {...register('lotArea', {
                          setValueAs: (value) =>
                            value === '' || value === null || value === undefined ? undefined : Number(value),
                        })}
                      />
                      <TextField
                        label={t('valuation.field.bedrooms')}
                        type="number"
                        min={0}
                        inputMode="numeric"
                        required
                        error={errors.bedrooms?.message}
                        {...register('bedrooms', { valueAsNumber: true })}
                      />
                      <TextField
                        label={t('valuation.field.expectedPrice')}
                        type="number"
                        min={0}
                        inputMode="numeric"
                        hint={t('valuation.field.expectedPriceHint')}
                        error={errors.expectedPrice?.message}
                        {...register('expectedPrice', {
                          setValueAs: (value) =>
                            value === '' || value === null || value === undefined ? undefined : Number(value),
                        })}
                      />
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Button type="button" variant="accent" size="lg" onClick={handleNext}>
                        {t('action.next')}
                      </Button>
                      <span className="text-[12px] text-secondary">{t('valuation.form.reviewInput')}</span>
                    </div>
                  </div>
                ) : null}

                {/* Step 2 — owner */}
                {step === 2 ? (
                  <div className="mt-9">
                    <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-ink">
                      {t('valuation.form.stepOwner')}
                    </h2>
                    <p className="mt-3 max-w-reading text-[14px] leading-relaxed text-secondary">
                      {t('valuation.form.text')}
                    </p>

                    <div className="mt-9 grid gap-5 sm:grid-cols-2">
                      <TextField
                        label={t('valuation.field.fullName')}
                        required
                        autoComplete="name"
                        error={errors.fullName?.message}
                        {...register('fullName')}
                      />
                      <TextField
                        label={t('valuation.field.phone')}
                        type="tel"
                        required
                        autoComplete="tel"
                        error={errors.phone?.message}
                        {...register('phone')}
                      />
                      <TextField
                        label={t('valuation.field.email')}
                        type="email"
                        required
                        autoComplete="email"
                        containerClassName="sm:col-span-2"
                        error={errors.email?.message}
                        {...register('email')}
                      />
                      <TextField
                        label={t('valuation.field.details')}
                        placeholder={t('valuation.field.detailsPlaceholder')}
                        containerClassName="sm:col-span-2"
                        error={errors.details?.message}
                        {...register('details')}
                      />
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                        {t('action.back')}
                      </Button>
                      <Button type="button" variant="accent" size="lg" onClick={handleNext}>
                        {t('action.next')}
                      </Button>
                    </div>
                  </div>
                ) : null}

                {/* Step 3 — review */}
                {step === 3 ? (
                  <div className="mt-9">
                    <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-ink">
                      {t('valuation.review.title')}
                    </h2>
                    <p className="mt-3 max-w-reading text-[14px] leading-relaxed text-secondary">
                      {t('valuation.review.text')}
                    </p>

                    <dl className="mt-9 divide-y divide-line border-y border-line">
                      {reviewRows.map((row) => (
                        <div key={row.label} className="grid gap-1 py-3.5 sm:grid-cols-[minmax(0,200px)_1fr] sm:gap-6">
                          <dt className="text-[11px] uppercase tracking-editorial text-secondary">{row.label}</dt>
                          <dd className="text-[14px] leading-relaxed text-ink-soft">{row.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-5 flex items-start gap-2 text-[12px] leading-relaxed text-secondary">
                      <Info size={13} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                      {t('valuation.form.reviewInput')}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Button type="button" variant="outline" size="lg" onClick={() => setStep(2)}>
                        {t('action.back')}
                      </Button>
                      <Button type="submit" variant="accent" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? t('form.submitting') : t('valuation.form.submit')}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-surface p-7">
              <h2 className="font-display text-[22px] text-ink">{t('valuation.whatNext.title')}</h2>
              <ol className="mt-5 flex flex-col gap-4">
                {nextPoints.map((key, index) => (
                  <li key={key} className="flex gap-3 text-[13px] leading-relaxed text-secondary">
                    <span className="font-display text-[12px] text-accent">{String(index + 1).padStart(2, '0')}</span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-7 border-t border-line pt-6">
                <h3 className="text-[12px] font-medium uppercase tracking-editorial text-ink-soft">
                  {t('valuation.why.title')}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {whyPoints.map((key) => (
                    <li key={key} className="flex gap-3 text-[13px] leading-relaxed text-secondary">
                      <Check size={15} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 border border-line bg-surface p-7">
              <h3 className="font-display text-[20px] text-ink">{t('valuation.sidebar.title')}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-secondary">{t('valuation.sidebar.text')}</p>
              <a
                href={`mailto:${company.valuationsEmail}`}
                className="mt-4 inline-flex items-center gap-2 text-[13px] text-accent link-underline"
              >
                <Mail size={15} aria-hidden="true" />
                {t('valuation.sidebar.email')}
              </a>
            </div>

            <p className="mt-6 flex items-start gap-3 border border-line bg-canvas-deep p-5 text-[12px] leading-relaxed text-secondary">
              <Info size={15} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              {t('valuation.demoNote')}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Valuation;
