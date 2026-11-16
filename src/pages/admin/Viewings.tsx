import { Check, Eye, Mail, Phone, X } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { useLanguage, type TranslationKey } from '../../i18n';
import { telHref } from '../../lib/utils';
import type { ViewingRequest, ViewingStatus } from '../../types';
import { setViewingStatus } from '../../services/leadService';
import { getAgent } from '../../services/agentService';
import { Button, ButtonAnchor, IconButton } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { SelectField } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { TableWrap, Tbody, Td, Th, Thead, Tr } from '../../components/ui/Table';
import { useToast } from '../../components/ui/Toast';

const VIEWING_STATUSES: ViewingStatus[] = ['pending', 'scheduled', 'completed', 'cancelled'];

const STATUS_KEY: Record<ViewingStatus, TranslationKey> = {
  pending: 'status.pending',
  scheduled: 'status.scheduled',
  completed: 'status.completed',
  cancelled: 'status.cancelled',
};

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line py-3 last:border-0 sm:grid-cols-[160px_1fr] sm:gap-4">
      <dt className="text-[11px] uppercase tracking-editorial text-secondary">{label}</dt>
      <dd className="text-[13px] leading-relaxed text-ink-soft">{children}</dd>
    </div>
  );
}

export function Viewings() {
  const { t, tx, formatDate, formatDateTime } = useLanguage();
  const { viewings, properties } = useDatabase();
  const toast = useToast();

  const [status, setStatus] = useState<ViewingStatus | ''>('');
  const [detail, setDetail] = useState<ViewingRequest | null>(null);

  const filtered = useMemo(
    () => viewings.filter((viewing) => !status || viewing.status === status),
    [viewings, status]
  );

  const propertyName = (propertyId: string) => {
    const property = properties.find((item) => item.id === propertyId);
    return property ? tx(property.title) : '—';
  };

  const update = (viewing: ViewingRequest, next: ViewingStatus) => {
    setViewingStatus(viewing.id, next);
    toast.success(t('admin.viewings.statusUpdated', { status: t(STATUS_KEY[next]) }));
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow={t('admin.demoMode')}
        titleLead={t('admin.viewings.title')}
        text={t('admin.viewings.subtitle')}
      />

      <div className="border border-line bg-surface p-5 sm:max-w-xs">
        <SelectField
          label={t('admin.inquiries.filterStatus')}
          placeholder={t('admin.inquiries.filterStatus')}
          value={status}
          onChange={(event) => setStatus(event.target.value as ViewingStatus | '')}
          options={VIEWING_STATUSES.map((item) => ({ value: item, label: t(STATUS_KEY[item]) }))}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t('admin.empty.viewings')} icon={<Eye size={20} />} />
      ) : (
        <TableWrap>
          <Thead>
            <Th>{t('admin.table.customer')}</Th>
            <Th>{t('admin.table.contact')}</Th>
            <Th>{t('admin.table.property_')}</Th>
            <Th>{t('admin.table.preferred')}</Th>
            <Th>{t('admin.table.status')}</Th>
            <Th className="text-end">{t('admin.table.actions')}</Th>
          </Thead>
          <Tbody>
            {filtered.map((viewing) => (
              <Tr key={viewing.id}>
                <Td className="whitespace-nowrap font-medium text-ink">{viewing.fullName}</Td>
                <Td>
                  <div className="flex flex-col gap-0.5">
                    <a href={`mailto:${viewing.email}`} className="text-ink-soft hover:text-ink">
                      {viewing.email}
                    </a>
                    <span className="text-[12px] text-secondary" dir="ltr">
                      {viewing.phone}
                    </span>
                  </div>
                </Td>
                <Td className="max-w-[200px] truncate">{propertyName(viewing.propertyId)}</Td>
                <Td className="whitespace-nowrap">
                  {formatDate(viewing.preferredDate)}
                  {viewing.preferredTime ? <span className="block text-[12px] text-secondary">{viewing.preferredTime}</span> : null}
                </Td>
                <Td>
                  <StatusBadge status={viewing.status} label={t(STATUS_KEY[viewing.status])} />
                </Td>
                <Td className="text-end">
                  <div className="flex items-center justify-end gap-1">
                    <IconButton label={t('admin.inquiries.detail')} onClick={() => setDetail(viewing)}>
                      <Eye size={15} />
                    </IconButton>
                    <IconButton
                      label={t('admin.viewings.confirm')}
                      disabled={viewing.status === 'scheduled'}
                      onClick={() => update(viewing, 'scheduled')}
                    >
                      <Check size={15} />
                    </IconButton>
                    <IconButton
                      label={t('admin.viewings.complete')}
                      disabled={viewing.status === 'completed'}
                      onClick={() => update(viewing, 'completed')}
                    >
                      <Check size={15} />
                    </IconButton>
                    <IconButton
                      label={t('admin.viewings.cancel')}
                      disabled={viewing.status === 'cancelled'}
                      onClick={() => update(viewing, 'cancelled')}
                    >
                      <X size={15} />
                    </IconButton>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </TableWrap>
      )}

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={t('admin.inquiries.detail')}
        size="md"
        footer={
          detail ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  update(detail, 'scheduled');
                  setDetail(null);
                }}
              >
                {t('admin.viewings.confirm')}
              </Button>
              <ButtonAnchor variant="ghost" href={telHref(detail.phone)} icon={<Phone size={15} />}>
                {t('admin.inquiries.call')}
              </ButtonAnchor>
              <ButtonAnchor variant="primary" href={`mailto:${detail.email}`} icon={<Mail size={15} />}>
                {t('admin.inquiries.reply')}
              </ButtonAnchor>
            </>
          ) : null
        }
      >
        {detail ? (
          <dl>
            <DetailRow label={t('admin.table.customer')}>{detail.fullName}</DetailRow>
            <DetailRow label={t('admin.table.email')}>{detail.email}</DetailRow>
            <DetailRow label={t('admin.table.phone')}>
              <span dir="ltr">{detail.phone}</span>
            </DetailRow>
            <DetailRow label={t('admin.table.status')}>
              <StatusBadge status={detail.status} label={t(STATUS_KEY[detail.status])} />
            </DetailRow>
            <DetailRow label={t('admin.viewings.schedule')}>
              {formatDate(detail.preferredDate)}
              {detail.preferredTime ? ` · ${detail.preferredTime}` : ''}
            </DetailRow>
            <DetailRow label={t('admin.inquiries.property')}>{propertyName(detail.propertyId)}</DetailRow>
            <DetailRow label={t('admin.table.agent')}>
              {getAgent(detail.agentId) ? tx(getAgent(detail.agentId)!.name) : '—'}
            </DetailRow>
            <DetailRow label={t('admin.table.received')}>{formatDateTime(detail.createdAt)}</DetailRow>
            <DetailRow label={t('admin.table.message')}>
              <p className="whitespace-pre-line">{detail.message}</p>
            </DetailRow>
          </dl>
        ) : null}
      </Modal>
    </div>
  );
}

export default Viewings;
