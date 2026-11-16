import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Plus } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useLanguage, type TranslationKey } from '../../i18n';
import {
  amenities,
  cities,
  cityById,
  districtById,
  districtsByCity,
  exteriorFeatures,
  furnishingOptions,
  interiorFeatures,
  listingTypes,
  propertyStatuses,
  propertyTypes,
} from '../../data/taxonomy';
import { propertyCover } from '../../lib/images';
import type { Property } from '../../types';
import { allAgents } from '../../services/agentService';
import { createProperty, getProperty, updateProperty, type PropertyDraft } from '../../services/propertyService';
import { Button, ButtonLink } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { CheckboxField, SelectField, TextArea, TextField } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { SmartImage } from '../../components/ui/SmartImage';
import { useToast } from '../../components/ui/Toast';
import { PropertyCard } from '../../components/property/PropertyCard';

function buildSchema(t: (key: TranslationKey) => string) {
  const required = t('validation.required');
  const number = () => z.number({ invalid_type_error: required });

  return z.object({
    titleEn: z.string().min(2, t('validation.nameMin')),
    titleAr: z.string().min(2, t('validation.nameMin')),
    descriptionEn: z.string().min(10, t('validation.messageMin')),
    descriptionAr: z.string().min(10, t('validation.messageMin')),
    reference: z.string(),
    slug: z.string(),
    type: z.enum(['villa', 'apartment', 'penthouse', 'townhouse', 'commercial', 'land']),
    listingType: z.enum(['sale', 'rent']),
    price: number().positive(t('validation.pricePositive')),
    status: z.enum(['available', 'reserved', 'sold', 'rented', 'draft']),
    featured: z.boolean(),
    bedrooms: number().min(0, required),
    bathrooms: number().min(0, required),
    area: number().positive(t('validation.areaPositive')),
    lotArea: number().min(0, required),
    parking: number().min(0, required),
    yearBuilt: number().min(1800, required).max(2100, required),
    furnishing: z.enum(['furnished', 'semi-furnished', 'unfurnished']),
    amenities: z.array(z.string()),
    interiorFeatures: z.array(z.string()),
    exteriorFeatures: z.array(z.string()),
    imagePrompt: z.string().min(4, required),
    cityId: z.string().min(1, required),
    districtId: z.string().min(1, required),
    latitude: number().refine((value) => Number.isFinite(value), required),
    longitude: number().refine((value) => Number.isFinite(value), required),
    agentId: z.string().min(1, required),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

function defaultsFor(property?: Property): FormValues {
  if (property) {
    return {
      titleEn: property.title.en,
      titleAr: property.title.ar,
      descriptionEn: property.description.en,
      descriptionAr: property.description.ar,
      reference: property.reference,
      slug: property.slug,
      type: property.type,
      listingType: property.listingType,
      price: property.price,
      status: property.status,
      featured: property.featured,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      lotArea: property.lotArea ?? 0,
      parking: property.parking,
      yearBuilt: property.yearBuilt,
      furnishing: property.furnishing,
      amenities: [...property.amenities],
      interiorFeatures: [...property.interiorFeatures],
      exteriorFeatures: [...property.exteriorFeatures],
      imagePrompt: property.imagePrompt,
      cityId: property.cityId,
      districtId: property.districtId,
      latitude: property.coordinates.lat,
      longitude: property.coordinates.lng,
      agentId: property.agentId,
    };
  }

  return {
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    reference: '',
    slug: '',
    type: 'villa',
    listingType: 'sale',
    price: 0,
    status: 'available',
    featured: false,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    lotArea: 0,
    parking: 0,
    yearBuilt: new Date().getFullYear(),
    furnishing: 'unfurnished',
    amenities: [],
    interiorFeatures: [],
    exteriorFeatures: [],
    imagePrompt: '',
    cityId: '',
    districtId: '',
    latitude: 24.6939,
    longitude: 46.6859,
    agentId: '',
  };
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-line bg-surface p-6">
      <h2 className="font-display text-[20px] leading-tight text-ink">{title}</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

function ToggleChips({
  items,
  selected,
  onToggle,
}: {
  items: { id: string; name: { en: string; ar: string } }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const { tx } = useLanguage();
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Chip key={item.id} label={tx(item.name)} active={selected.includes(item.id)} onClick={() => onToggle(item.id)} />
      ))}
    </div>
  );
}

export function PropertyForm() {
  const { t, tx } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const schema = useMemo(() => buildSchema(t), [t]);
  const existing = id ? getProperty(id) : undefined;
  const agents = allAgents();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultsFor(existing),
  });

  const [blocked, setBlocked] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    reset(defaultsFor(id ? getProperty(id) : undefined));
  }, [id, reset]);

  const values = watch();
  const districts = districtsByCity(values.cityId);

  const toggle = (name: 'amenities' | 'interiorFeatures' | 'exteriorFeatures', itemId: string) => {
    const current = values[name];
    const next = current.includes(itemId) ? current.filter((entry) => entry !== itemId) : [...current, itemId];
    setValue(name, next, { shouldValidate: true });
  };

  if (id && !existing) {
    return <Navigate to="/admin/properties" replace />;
  }

  const isEdit = Boolean(existing);

  const previewProperty: Property = {
    id: existing?.id ?? 'preview',
    reference: values.reference || 'NST-PREVIEW',
    slug: values.slug || 'preview',
    title: { en: values.titleEn, ar: values.titleAr },
    description: { en: values.descriptionEn, ar: values.descriptionAr },
    listingType: values.listingType,
    type: values.type,
    status: values.status,
    price: values.price,
    cityId: values.cityId,
    districtId: values.districtId,
    address: { en: '', ar: '' },
    bedrooms: values.bedrooms,
    bathrooms: values.bathrooms,
    area: values.area,
    lotArea: values.lotArea > 0 ? values.lotArea : null,
    parking: values.parking,
    yearBuilt: values.yearBuilt,
    furnishing: values.furnishing,
    amenities: values.amenities,
    interiorFeatures: values.interiorFeatures,
    exteriorFeatures: values.exteriorFeatures,
    imagePrompt: values.imagePrompt || 'modern villa',
    featured: values.featured,
    agentId: values.agentId,
    coordinates: { lat: values.latitude, lng: values.longitude },
    createdAt: new Date().toISOString().slice(0, 10),
    views: 0,
  };

  const onSubmit = (form: FormValues) => {
    const city = cityById(form.cityId);
    const district = districtById(form.districtId);

    const draft: PropertyDraft = {
      reference: form.reference.trim(),
      slug: form.slug.trim() || undefined,
      title: { en: form.titleEn.trim(), ar: form.titleAr.trim() },
      description: { en: form.descriptionEn.trim(), ar: form.descriptionAr.trim() },
      listingType: form.listingType,
      type: form.type,
      status: form.status,
      price: form.price,
      cityId: form.cityId,
      districtId: form.districtId,
      address: {
        en: [district?.name.en, city?.name.en].filter(Boolean).join(', '),
        ar: [district?.name.ar, city?.name.ar].filter(Boolean).join(', '),
      },
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      area: form.area,
      lotArea: form.lotArea > 0 ? form.lotArea : null,
      parking: form.parking,
      yearBuilt: form.yearBuilt,
      furnishing: form.furnishing,
      amenities: form.amenities,
      interiorFeatures: form.interiorFeatures,
      exteriorFeatures: form.exteriorFeatures,
      imagePrompt: form.imagePrompt.trim(),
      featured: form.featured,
      agentId: form.agentId,
      coordinates: { lat: form.latitude, lng: form.longitude },
    };

    if (isEdit && id) {
      updateProperty(id, draft);
      toast.success(t('toast.saved'));
    } else {
      createProperty(draft);
      toast.success(t('toast.created'));
    }
    navigate('/admin/properties');
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow={t('admin.demoMode')}
        titleLead={isEdit ? t('admin.form.editTitle') : t('admin.form.createTitle')}
        text={isEdit ? t('admin.form.editSubtitle') : t('admin.form.createSubtitle')}
      />

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit, () => setBlocked(true))}
        className="flex flex-col gap-6"
      >
        {blocked && Object.keys(errors).length > 0 ? (
          <p role="alert" className="border border-[#DFB9B2] bg-[#FBF1EF] px-4 py-3 text-[13px] text-[#8E3B2E]">
            {t('validation.fixErrors')}
          </p>
        ) : null}

        <FormSection title={t('admin.form.section.basics')}>
          <TextField label={t('admin.form.titleEn')} required error={errors.titleEn?.message} {...register('titleEn')} />
          <TextField label={t('admin.form.titleAr')} required error={errors.titleAr?.message} {...register('titleAr')} />
          <TextField label={t('admin.form.reference')} hint={t('admin.form.reference')} {...register('reference')} />
          <TextField label={t('admin.form.slug')} {...register('slug')} containerClassName="lg:col-span-2" />
          <TextArea
            label={t('admin.form.descriptionEn')}
            required
            error={errors.descriptionEn?.message}
            containerClassName="sm:col-span-2 lg:col-span-3"
            {...register('descriptionEn')}
          />
          <TextArea
            label={t('admin.form.descriptionAr')}
            required
            error={errors.descriptionAr?.message}
            containerClassName="sm:col-span-2 lg:col-span-3"
            {...register('descriptionAr')}
          />
        </FormSection>

        <FormSection title={t('admin.form.section.pricing')}>
          <SelectField
            label={t('admin.form.listingType')}
            placeholder={t('form.selectPlaceholder')}
            options={listingTypes.map((item) => ({ value: item.id, label: tx(item.name) }))}
            error={errors.listingType?.message}
            {...register('listingType')}
          />
          <SelectField
            label={t('meta.type')}
            placeholder={t('form.selectPlaceholder')}
            options={propertyTypes.map((item) => ({ value: item.id, label: tx(item.name) }))}
            error={errors.type?.message}
            {...register('type')}
          />
          <SelectField
            label={t('admin.form.status')}
            placeholder={t('form.selectPlaceholder')}
            options={propertyStatuses.map((item) => ({ value: item.id, label: tx(item.name) }))}
            error={errors.status?.message}
            {...register('status')}
          />
          <TextField
            label={t('admin.form.price')}
            type="number"
            min={0}
            step={1000}
            inputMode="numeric"
            error={errors.price?.message}
            {...register('price', { valueAsNumber: true })}
          />
          <div className="flex items-end pb-2 lg:col-span-2">
            <CheckboxField
              label={t('admin.form.featured')}
              checked={values.featured}
              onChange={(event) => setValue('featured', event.target.checked, { shouldValidate: true })}
            />
          </div>
        </FormSection>

        <FormSection title={t('admin.form.section.layout')}>
          <TextField label={t('admin.form.bedrooms')} type="number" min={0} inputMode="numeric" error={errors.bedrooms?.message} {...register('bedrooms', { valueAsNumber: true })} />
          <TextField label={t('admin.form.bathrooms')} type="number" min={0} inputMode="numeric" error={errors.bathrooms?.message} {...register('bathrooms', { valueAsNumber: true })} />
          <TextField label={t('admin.form.area')} type="number" min={0} inputMode="numeric" error={errors.area?.message} {...register('area', { valueAsNumber: true })} />
          <TextField label={t('admin.form.lotArea')} type="number" min={0} inputMode="numeric" error={errors.lotArea?.message} {...register('lotArea', { valueAsNumber: true })} />
          <TextField label={t('admin.form.parking')} type="number" min={0} inputMode="numeric" error={errors.parking?.message} {...register('parking', { valueAsNumber: true })} />
          <TextField label={t('admin.form.yearBuilt')} type="number" min={1800} max={2100} inputMode="numeric" error={errors.yearBuilt?.message} {...register('yearBuilt', { valueAsNumber: true })} />
          <SelectField
            label={t('admin.form.furnishing')}
            placeholder={t('form.selectPlaceholder')}
            options={furnishingOptions.map((item) => ({ value: item.id, label: tx(item.name) }))}
            error={errors.furnishing?.message}
            {...register('furnishing')}
          />
        </FormSection>

        <FormSection title={t('admin.form.section.features')}>
          <div className="sm:col-span-2 lg:col-span-3">
            <span className="field-label">{t('admin.form.amenities')}</span>
            <ToggleChips items={amenities} selected={values.amenities} onToggle={(value) => toggle('amenities', value)} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <span className="field-label">{t('admin.form.interior')}</span>
            <ToggleChips
              items={interiorFeatures}
              selected={values.interiorFeatures}
              onToggle={(value) => toggle('interiorFeatures', value)}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <span className="field-label">{t('admin.form.exterior')}</span>
            <ToggleChips
              items={exteriorFeatures}
              selected={values.exteriorFeatures}
              onToggle={(value) => toggle('exteriorFeatures', value)}
            />
          </div>
        </FormSection>

        <FormSection title={t('admin.form.section.media')}>
          <TextField
            label={t('admin.form.imagePrompt')}
            hint={t('admin.form.imagePromptHint')}
            error={errors.imagePrompt?.message}
            containerClassName="sm:col-span-2 lg:col-span-2"
            {...register('imagePrompt')}
          />
          <div className="sm:col-span-2 lg:col-span-1">
            {values.imagePrompt.trim() ? (
              <SmartImage
                src={propertyCover(values.imagePrompt, 'landscape_4_3')}
                alt={t('admin.form.imagePrompt')}
                ratio="aspect-[4/3]"
                wrapperClassName="rounded-sm border border-line"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-sm border border-dashed border-line bg-canvas-deep text-center text-[12px] text-secondary">
                <span className="flex flex-col items-center gap-2 px-4">
                  <ImageIcon size={18} aria-hidden="true" />
                  {t('admin.form.imagePromptHint')}
                </span>
              </div>
            )}
          </div>
        </FormSection>

        <FormSection title={t('admin.form.section.location')}>
          <SelectField
            label={t('admin.form.city')}
            placeholder={t('form.selectPlaceholder')}
            options={cities.map((item) => ({ value: item.id, label: tx(item.name) }))}
            error={errors.cityId?.message}
            {...register('cityId', { onChange: () => setValue('districtId', '', { shouldValidate: true }) })}
          />
          <SelectField
            label={t('admin.form.district')}
            placeholder={t('form.selectPlaceholder')}
            options={districts.map((item) => ({ value: item.id, label: tx(item.name) }))}
            error={errors.districtId?.message}
            {...register('districtId')}
          />
          <TextField label={t('admin.form.latitude')} type="number" step="any" error={errors.latitude?.message} {...register('latitude', { valueAsNumber: true })} />
          <TextField label={t('admin.form.longitude')} type="number" step="any" error={errors.longitude?.message} {...register('longitude', { valueAsNumber: true })} />
        </FormSection>

        <FormSection title={t('admin.form.section.assignment')}>
          <SelectField
            label={t('admin.form.agent')}
            placeholder={t('form.selectPlaceholder')}
            options={agents.map((agent) => ({ value: agent.id, label: tx(agent.name) }))}
            error={errors.agentId?.message}
            {...register('agentId')}
          />
        </FormSection>

        <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3 border-t border-line bg-canvas/95 py-4 backdrop-blur-sm">
          <ButtonLink to="/admin/properties" variant="ghost">
            {t('admin.form.cancel')}
          </ButtonLink>
          <Button variant="outline" onClick={() => setPreviewOpen(true)}>
            {t('admin.form.preview')}
          </Button>
          <Button type="submit" variant="primary" icon={<Plus size={15} />}>
            {isEdit ? t('admin.form.save') : t('admin.form.create')}
          </Button>
        </div>
      </form>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={t('admin.form.previewTitle')}
        description={t('admin.form.previewNote')}
        size="lg"
      >
        <div className="mx-auto max-w-md">
          <PropertyCard property={previewProperty} variant="grid" />
        </div>
      </Modal>
    </div>
  );
}

export default PropertyForm;
