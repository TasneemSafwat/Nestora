import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { cities, languageOptions, specialties } from '../../data/taxonomy';
import { useDatabase } from '../../hooks/useDatabase';
import { useLanguage, type TranslationKey } from '../../i18n';
import { agentPortrait } from '../../lib/images';
import type { Agent } from '../../types';
import {
  DEFAULT_AGENT_CRITERIA,
  agentListingCount,
  createAgent,
  deleteAgent,
  queryAgents,
  updateAgent,
  type AgentDraft,
} from '../../services/agentService';
import { Button, IconButton } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { CheckboxField, SelectField, TextArea, TextField } from '../../components/ui/Field';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog, Modal } from '../../components/ui/Modal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { SmartImage } from '../../components/ui/SmartImage';
import { TableWrap, Tbody, Td, Th, Thead, Tr } from '../../components/ui/Table';
import { useToast } from '../../components/ui/Toast';

function buildSchema(t: (key: TranslationKey) => string) {
  const required = t('validation.required');
  return z.object({
    nameEn: z.string().min(2, t('validation.nameMin')),
    nameAr: z.string().min(2, t('validation.nameMin')),
    titleEn: z.string().min(2, t('validation.nameMin')),
    titleAr: z.string().min(2, t('validation.nameMin')),
    bioEn: z.string().min(10, t('validation.messageMin')),
    bioAr: z.string().min(10, t('validation.messageMin')),
    email: z.string().email(t('validation.email')),
    phone: z.string().min(1, required),
    whatsapp: z.string().min(1, required),
    experienceYears: z.number().min(0, required),
    dealsClosed: z.number().min(0, required),
    rating: z.number().min(0, required).max(5, required),
    featured: z.boolean(),
    specialties: z.array(z.string()).min(1, required),
    languages: z.array(z.string()).min(1, required),
    cityIds: z.array(z.string()).min(1, required),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

function defaultsFor(agent: Agent | null): FormValues {
  if (agent) {
    return {
      nameEn: agent.name.en,
      nameAr: agent.name.ar,
      titleEn: agent.title.en,
      titleAr: agent.title.ar,
      bioEn: agent.bio.en,
      bioAr: agent.bio.ar,
      email: agent.email,
      phone: agent.phone,
      whatsapp: agent.whatsapp,
      experienceYears: agent.experienceYears,
      dealsClosed: agent.dealsClosed,
      rating: agent.rating,
      featured: agent.featured,
      specialties: [...agent.specialties],
      languages: [...agent.languages],
      cityIds: [...agent.cityIds],
    };
  }

  return {
    nameEn: '',
    nameAr: '',
    titleEn: '',
    titleAr: '',
    bioEn: '',
    bioAr: '',
    email: '',
    phone: '',
    whatsapp: '',
    experienceYears: 0,
    dealsClosed: 0,
    rating: 5,
    featured: false,
    specialties: [],
    languages: [],
    cityIds: [],
  };
}

function ToggleChips({
  items,
  selected,
  onToggle,
  label,
}: {
  items: { id: string; name: { en: string; ar: string } }[];
  selected: string[];
  onToggle: (id: string) => void;
  label: string;
}) {
  const { tx } = useLanguage();
  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Chip
            key={item.id}
            label={tx(item.name)}
            active={selected.includes(item.id)}
            onClick={() => onToggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function AgentFormBody({
  agent,
  onSubmit,
  onCancel,
}: {
  agent: Agent | null;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}) {
  const { t, tx } = useLanguage();
  const schema = useMemo(() => buildSchema(t), [t]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: defaultsFor(agent) });

  const values = watch();
  const cityItems = cities.map((city) => ({ id: city.id, name: city.name }));
  const languageItems = languageOptions.map((item) => ({ id: item.en, name: item }));

  const toggle = (name: 'specialties' | 'languages' | 'cityIds', itemId: string) => {
    const current = values[name];
    const next = current.includes(itemId) ? current.filter((entry) => entry !== itemId) : [...current, itemId];
    setValue(name, next, { shouldValidate: true });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label={t('admin.agents.nameEn')} required error={errors.nameEn?.message} {...register('nameEn')} />
        <TextField label={t('admin.agents.nameAr')} required error={errors.nameAr?.message} {...register('nameAr')} />
        <TextField label={t('admin.agents.titleEn')} required error={errors.titleEn?.message} {...register('titleEn')} />
        <TextField label={t('admin.agents.titleAr')} required error={errors.titleAr?.message} {...register('titleAr')} />
        <TextArea
          label={t('admin.agents.bioEn')}
          required
          error={errors.bioEn?.message}
          containerClassName="sm:col-span-2"
          {...register('bioEn')}
        />
        <TextArea
          label={t('admin.agents.bioAr')}
          required
          error={errors.bioAr?.message}
          containerClassName="sm:col-span-2"
          {...register('bioAr')}
        />
        <TextField label={t('admin.agents.email')} type="email" required error={errors.email?.message} {...register('email')} />
        <TextField label={t('admin.agents.phone')} type="tel" required error={errors.phone?.message} {...register('phone')} />
        <TextField label={t('admin.agents.whatsapp')} type="tel" required error={errors.whatsapp?.message} {...register('whatsapp')} />
        <TextField
          label={t('admin.agents.experience')}
          type="number"
          min={0}
          inputMode="numeric"
          error={errors.experienceYears?.message}
          {...register('experienceYears', { valueAsNumber: true })}
        />
        <TextField
          label={t('admin.agents.deals')}
          type="number"
          min={0}
          inputMode="numeric"
          error={errors.dealsClosed?.message}
          {...register('dealsClosed', { valueAsNumber: true })}
        />
        <TextField
          label={t('admin.agents.rating')}
          type="number"
          min={0}
          max={5}
          step={0.1}
          inputMode="decimal"
          error={errors.rating?.message}
          {...register('rating', { valueAsNumber: true })}
        />
      </div>

      <div className="grid gap-5">
        <ToggleChips
          label={t('admin.agents.specialties')}
          items={specialties}
          selected={values.specialties}
          onToggle={(value) => toggle('specialties', value)}
        />
        <ToggleChips
          label={t('admin.agents.languages')}
          items={languageItems}
          selected={values.languages}
          onToggle={(value) => toggle('languages', value)}
        />
        <ToggleChips
          label={t('admin.agents.cities')}
          items={cityItems}
          selected={values.cityIds}
          onToggle={(value) => toggle('cityIds', value)}
        />
      </div>

      <CheckboxField
        label={t('admin.agents.featured')}
        checked={values.featured}
        onChange={(event) => setValue('featured', event.target.checked)}
      />

      <div className="flex items-center justify-end gap-3 border-t border-line pt-5">
        <Button variant="ghost" onClick={onCancel}>
          {t('admin.form.cancel')}
        </Button>
        <Button type="submit" variant="primary">
          {agent ? t('admin.form.save') : t('admin.form.create')}
        </Button>
      </div>
    </form>
  );
}

export function Agents() {
  const { t, tx } = useLanguage();
  const { agents } = useDatabase();
  const toast = useToast();

  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [cityId, setCityId] = useState('');
  const [form, setForm] = useState<{ open: boolean; agent: Agent | null }>({ open: false, agent: null });
  const [toDelete, setToDelete] = useState<Agent | null>(null);

  const filtered = useMemo(
    () => queryAgents(agents, { ...DEFAULT_AGENT_CRITERIA, q: query, specialty, cityId }),
    [agents, query, specialty, cityId]
  );

  const closeForm = () => setForm({ open: false, agent: null });

  const handleSubmit = (values: FormValues) => {
    const draft: AgentDraft = {
      name: { en: values.nameEn.trim(), ar: values.nameAr.trim() },
      title: { en: values.titleEn.trim(), ar: values.titleAr.trim() },
      bio: { en: values.bioEn.trim(), ar: values.bioAr.trim() },
      cityId: values.cityIds[0] ?? '',
      cityIds: values.cityIds,
      specialties: values.specialties,
      languages: values.languages,
      email: values.email.trim(),
      phone: values.phone.trim(),
      whatsapp: values.whatsapp.trim(),
      imagePrompt: values.nameEn.trim(),
      experienceYears: values.experienceYears,
      dealsClosed: values.dealsClosed,
      rating: values.rating,
      featured: values.featured,
    };

    if (form.agent) {
      updateAgent(form.agent.id, draft);
      toast.success(t('toast.saved'));
    } else {
      createAgent(draft);
      toast.success(t('toast.created'));
    }
    closeForm();
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteAgent(toDelete.id);
    setToDelete(null);
    toast.success(t('toast.deleted'));
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow={t('admin.demoMode')}
        titleLead={t('admin.agents.title')}
        text={t('admin.agents.subtitle')}
        actions={
          <Button variant="primary" icon={<Plus size={15} />} onClick={() => setForm({ open: true, agent: null })}>
            {t('admin.agents.add')}
          </Button>
        }
      />

      <div className="grid gap-4 border border-line bg-surface p-5 sm:grid-cols-3">
        <TextField
          label={t('admin.agents.search')}
          placeholder={t('admin.agents.search')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <SelectField
          label={t('admin.table.specialty')}
          placeholder={t('form.anyOption')}
          value={specialty}
          onChange={(event) => setSpecialty(event.target.value)}
          options={specialties.map((item) => ({ value: item.id, label: tx(item.name) }))}
        />
        <SelectField
          label={t('meta.city')}
          placeholder={t('search.allCities')}
          value={cityId}
          onChange={(event) => setCityId(event.target.value)}
          options={cities.map((city) => ({ value: city.id, label: tx(city.name) }))}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={t('admin.empty.agents')}
          icon={<Search size={20} />}
          action={
            <Button variant="primary" icon={<Plus size={15} />} onClick={() => setForm({ open: true, agent: null })}>
              {t('admin.empty.cta')}
            </Button>
          }
        />
      ) : (
        <TableWrap>
          <Thead>
            <Th>{t('admin.table.name')}</Th>
            <Th>{t('admin.table.contact')}</Th>
            <Th>{t('admin.table.specialty')}</Th>
            <Th className="text-end">{t('admin.table.listings')}</Th>
            <Th className="text-end">{t('admin.table.actions')}</Th>
          </Thead>
          <Tbody>
            {filtered.map((agent) => {
              const name = tx(agent.name);
              const primarySpecialty = specialties.find((item) => item.id === agent.specialties[0]);
              return (
                <Tr key={agent.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-11 shrink-0">
                        <SmartImage
                          src={agentPortrait(agent.imagePrompt, name)}
                          alt={name}
                          ratio="aspect-square"
                          wrapperClassName="rounded-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate font-medium text-ink">{name}</span>
                        <span className="block truncate text-[12px] text-secondary">{tx(agent.title)}</span>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-col gap-0.5">
                      <a href={`mailto:${agent.email}`} className="text-ink-soft hover:text-ink">
                        {agent.email}
                      </a>
                      <span className="text-[12px] text-secondary" dir="ltr">
                        {agent.phone}
                      </span>
                    </div>
                  </Td>
                  <Td className="whitespace-nowrap">
                    {primarySpecialty ? tx(primarySpecialty.name) : '—'}
                    {agent.specialties.length > 1 ? (
                      <span className="ms-1 text-[12px] text-secondary">+{agent.specialties.length - 1}</span>
                    ) : null}
                  </Td>
                  <Td className="text-end tabular-nums">{agentListingCount(agent.id)}</Td>
                  <Td className="text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/agents/${agent.id}`}
                        aria-label={t('admin.agents.view')}
                        title={t('admin.agents.view')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-surface/90 text-ink transition-colors hover:border-ink"
                      >
                        <Eye size={15} />
                      </Link>
                      <IconButton
                        label={t('action.edit')}
                        onClick={() => setForm({ open: true, agent })}
                      >
                        <Pencil size={15} />
                      </IconButton>
                      <IconButton label={t('action.delete')} onClick={() => setToDelete(agent)}>
                        <Trash2 size={15} />
                      </IconButton>
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </TableWrap>
      )}

      <Modal
        open={form.open}
        onClose={closeForm}
        title={form.agent ? t('admin.agents.form.editTitle') : t('admin.agents.form.createTitle')}
        size="lg"
      >
        <AgentFormBody
          key={form.agent?.id ?? 'new'}
          agent={form.agent}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={t('admin.confirm.deleteTitle', { name: toDelete ? tx(toDelete.name) : '' })}
        text={`${t('admin.confirm.deleteText')} ${t('admin.agents.deleteWarning')}`}
        confirmLabel={t('admin.confirm.deleteConfirm')}
        cancelLabel={t('admin.confirm.cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

export default Agents;
