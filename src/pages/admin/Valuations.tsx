import { ClipboardCheck, Eye, Mail, Phone, Search } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { cityById, conditionOptions, districtById, propertyTypeById } from '../../data/taxonomy';
import { useDatabase } from '../../hooks/useDatabase';
import { useLanguage, type TranslationKey } from '../../i18n';
import { telHref } from '../../lib/utils';
import type { ValuationRequest, ValuationStatus } from '../../types';
import { setValuationStatus } from '../../services/leadService';
import { Button, ButtonAnchor, IconButton } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { SelectField } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { TableWrap, Tbody, Td, Th, Thead, Tr } from '../../components/ui/Table';
import { useToast } from '../../components/ui/Toast';

const VALUATION_STATUSES: ValuationStatus[] = ['new', 'in-review', 'appraised', 'closed'];

const STATUS_KEY: Record<ValuationStatus, TranslationKey> = {
  new: 'status.new',
  'in-review': 'status.inReview',
  appraised: 'status.appraised',
  closed: 'status.closed',
};

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line py-3 last:border-0 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-[11px] uppercase tracking-editorial text-secondary">{label}</dt>
      <dd className="text-[13px] leading-relaxed text-ink-soft">{children}</dd>
    </div>
  );
}

export function Valuations() {
  const { t, tx, formatNumber, formatPrice, formatArea, formatDateTime } = useLanguage();
  const { valuations } = useDatabase();
  const toast = useToast();

  const [status, setStatus] = useState<ValuationStatus | ''>('');
  const [detail, setDetail] = useState<ValuationRequest | null>(null);

  const filtered = useMemo(
    () => valuations.filter((item) => !status || item.status === status),
    [valuations, status]
  );

  const update = (request: ValuationRequest, next: ValuationStatus) => {
    setValuationStatus(request.id, next);
    toast.success(t('admin.valuations.statusUpdated', { status: t(STATUS_KEY[next]) }));
  };

  const location = (request: ValuationRequest) => {
    const city = cityById(request.cityId);
    const district = districtById(request.districtId);
    return [district ? tx(district.name) : null, city ? tx(city.name) : null].filter(Boolean).join(', ') || '—';
  };

  const typeName = (request: ValuationRequest) => {
    const type = propertyTypeById(request.propertyType);
    return type ? tx(type.name) : request.propertyType;
  };

  const conditionName = (request: ValuationRequest) => {
    const condition = conditionOptions.find((item) => item.id === request.condition);
    return condition ? tx(condition.name) : request.condition;
  };

  const priceLabel = (request: ValuationRequest) =>
    request.expectedPrice === null ? t('price.onRequest') : formatPrice(request.expectedPrice);

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow={t('admin.demoMode')}
        titleLead={t('admin.valuations.title')}
        text={t('admin.valuations.subtitle')}
      />

      <div className="border border-line bg-surface p-5 sm:max-w-xs">
        <SelectField
          label={t('admin.inquiries.filterStatus')}
          placeholder={t('admin.inquiries.filterStatus')}
          value={status}
          onChange={(event) => setStatus(event.target.value as ValuationStatus | '')}
          options={VALUATION_STATUSES.map((item) => ({ value: item, label: t(STATUS_KEY[item]) }))}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t('admin.empty.valuations')} icon={<ClipboardCheck size={20} />} />
      ) : (
        <TableWrap>
          <Thead>
            <Th>{t('admin.table.customer')}</Th>
            <Th>{t('admin.table.type')}</Th>
            <Th>{t('admin.table.location')}</Th>
            <Th className="text-end">{t('admin.table.area')}</Th>
            <Th>{t('admin.table.condition')}</Th>
            <Th className="text-end">{t('admin.table.expectedPrice')}</Th>
            <Th>{t('admin.table.status')}</Th>
            <Th className="text-end">{t('admin.table.actions')}</Th>
          </Thead>
          <Tbody>
            {filtered.map((request) => (
              <Tr key={request.id}>
                <Td className="whitespace-nowrap font-medium text-ink">{request.fullName}</Td>
                <Td className="whitespace-nowrap">{typeName(request)}</Td>
                <Td className="max-w-[200px] truncate">{location(request)}</Td>
                <Td className="text-end whitespace-nowrap tabular-nums">{formatArea(request.area)}</Td>
                <Td className="whitespace-nowrap">{conditionName(request)}</Td>
                <Td className="text-end whitespace-nowrap tabular-nums">{priceLabel(request)}</Td>
                <Td>
                  <StatusBadge status={request.status} label={t(STATUS_KEY[request.status])} />
                </Td>
                <Td className="text-end">
                  <div className="flex items-center justify-end gap-1">
                    <IconButton label={t('admin.valuations.detail')} onClick={() => setDetail(request)}>
                      <Eye size={15} />
                    </IconButton>
                    <IconButton
                      label={t('admin.valuations.startReview')}
                      disabled={request.status === 'in-review'}
                      onClick={() => update(request, 'in-review')}
                    >
                      <Search size={15} />
                    </IconButton>
                    <IconButton
                      label={t('admin.valuations.markAppraised')}
                      disabled={request.status === 'appraised'}
                      onClick={() => update(request, 'appraised')}
                    >
                      <ClipboardCheck size={15} />
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
        title={t('admin.valuations.detail')}
        size="md"
        footer={
          detail ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  update(detail, 'in-review');
                  setDetail(null);
                }}
              >
                {t('admin.valuations.startReview')}
              </Button>
              <ButtonAnchor
                variant="primary"
                href={`mailto:${detail.email}`}
                icon={<Mail size={15} />}
              >
                {t('admin.inquiries.reply')}
              </ButtonAnchor>
            </>
          ) : null
        }
      >
        {detail ? (
          <dl>
            <dt className="mb-2 text-[11px] font-semibold uppercase tracking-editorial text-secondary">
              {t('admin.valuations.ownerDetails')}
            </dt>
            <DetailRow label={t('admin.table.customer')}>{detail.fullName}</DetailRow>
            <DetailRow label={t('admin.table.email')}>{detail.email}</DetailRow>
            <DetailRow label={t('admin.table.phone')}>
              <span dir="ltr">{detail.phone}</span>
            </DetailRow>
            <DetailRow label={t('admin.table.status')}>
              <StatusBadge status={detail.status} label={t(STATUS_KEY[detail.status])} />
            </DetailRow>
            <DetailRow label={t('admin.table.type')}>{typeName(detail)}</DetailRow>
            <DetailRow label={t('admin.table.location')}>{location(detail)}</DetailRow>
            <DetailRow label={t('admin.table.area')}>{formatArea(detail.area)}</DetailRow>
            <DetailRow label={t('meta.bedrooms')}>{formatNumber(detail.bedrooms)}</DetailRow>
            <DetailRow label={t('admin.table.condition')}>{conditionName(detail)}</DetailRow>
            <DetailRow label={t('admin.table.expectedPrice')}>{priceLabel(detail)}</DetailRow>
            <DetailRow label={t('admin.table.received')}>{formatDateTime(detail.createdAt)}</DetailRow>
            <DetailRow label={t('admin.table.message')}>
              <p className="whitespace-pre-line">{detail.message}</p>
            </DetailRow>
            <div className="mt-4">
              <ButtonAnchor variant="ghost" size="sm" href={telHref(detail.phone)} icon={<Phone size={14} />}>
                {t('admin.inquiries.call')}
              </ButtonAnchor>
            </div>
          </dl>
        ) : null}
      </Modal>
    </div>
  );
}

export default Valuations;
