import { Eye, Mail, MoreVertical, Phone } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { useLanguage, type TranslationKey } from '../../i18n';
import { telHref } from '../../lib/utils';
import type { Inquiry, InquiryStatus } from '../../types';
import { setInquiryStatus } from '../../services/leadService';
import { getAgent } from '../../services/agentService';
import { ButtonAnchor, IconButton } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { SelectField, TextField } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { TableWrap, Tbody, Td, Th, Thead, Tr } from '../../components/ui/Table';
import { useToast } from '../../components/ui/Toast';

const INQUIRY_STATUSES: InquiryStatus[] = ['new', 'contacted', 'qualified', 'closed'];

const STATUS_KEY: Record<InquiryStatus, TranslationKey> = {
  new: 'status.new',
  contacted: 'status.contacted',
  qualified: 'status.qualified',
  closed: 'status.closed',
};

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line py-3 last:border-0 sm:grid-cols-[160px_1fr] sm:gap-4">
      <dt className="text-[11px] uppercase tracking-editorial text-secondary">{label}</dt>
      <dd className="text-[13px] leading-relaxed text-ink-soft">{children}</dd>
    </div>
  );
}

export function Inquiries() {
  const { t, tx, formatDateTime } = useLanguage();
  const { inquiries, properties } = useDatabase();
  const toast = useToast();

  const [status, setStatus] = useState<InquiryStatus | ''>('');
  const [query, setQuery] = useState('');
  const [menuId, setMenuId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Inquiry | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return inquiries.filter((inquiry) => {
      if (status && inquiry.status !== status) return false;
      if (!needle) return true;
      return [inquiry.fullName, inquiry.email, inquiry.phone].join(' ').toLowerCase().includes(needle);
    });
  }, [inquiries, status, query]);

  const propertyName = (propertyId: string) => {
    const property = properties.find((item) => item.id === propertyId);
    return property ? tx(property.title) : '—';
  };

  const updateStatus = (inquiry: Inquiry, next: InquiryStatus) => {
    setInquiryStatus(inquiry.id, next);
    setMenuId(null);
    toast.success(t('admin.inquiries.statusUpdated', { status: t(STATUS_KEY[next]) }));
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow={t('admin.demoMode')}
        titleLead={t('admin.inquiries.title')}
        text={t('admin.inquiries.subtitle')}
      />

      <div className="grid gap-4 border border-line bg-surface p-5 sm:grid-cols-2">
        <TextField
          label={t('action.search')}
          placeholder={t('search.placeholderKeyword')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <SelectField
          label={t('admin.inquiries.filterStatus')}
          placeholder={t('admin.inquiries.filterStatus')}
          value={status}
          onChange={(event) => setStatus(event.target.value as InquiryStatus | '')}
          options={INQUIRY_STATUSES.map((item) => ({ value: item, label: t(STATUS_KEY[item]) }))}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t('admin.empty.inquiries')} icon={<Mail size={20} />} />
      ) : (
        <TableWrap>
          <Thead>
            <Th>{t('admin.table.customer')}</Th>
            <Th>{t('admin.table.contact')}</Th>
            <Th>{t('admin.table.property_')}</Th>
            <Th>{t('admin.table.received')}</Th>
            <Th>{t('admin.table.status')}</Th>
            <Th className="text-end">{t('admin.table.actions')}</Th>
          </Thead>
          <Tbody>
            {filtered.map((inquiry) => (
              <Tr key={inquiry.id}>
                <Td className="whitespace-nowrap font-medium text-ink">{inquiry.fullName}</Td>
                <Td>
                  <div className="flex flex-col gap-0.5">
                    <a href={`mailto:${inquiry.email}`} className="text-ink-soft hover:text-ink">
                      {inquiry.email}
                    </a>
                    <span className="text-[12px] text-secondary" dir="ltr">
                      {inquiry.phone}
                    </span>
                  </div>
                </Td>
                <Td className="max-w-[220px] truncate">{propertyName(inquiry.propertyId)}</Td>
                <Td className="whitespace-nowrap text-secondary">{formatDateTime(inquiry.createdAt)}</Td>
                <Td>
                  <StatusBadge status={inquiry.status} label={t(STATUS_KEY[inquiry.status])} />
                </Td>
                <Td className="text-end">
                  <div className="flex items-center justify-end gap-1">
                    <IconButton label={t('admin.inquiries.detail')} onClick={() => setDetail(inquiry)}>
                      <Eye size={15} />
                    </IconButton>
                    <div className="relative">
                      <IconButton
                        label={t('admin.inquiries.changeStatus')}
                        aria-expanded={menuId === inquiry.id}
                        onClick={() => setMenuId(menuId === inquiry.id ? null : inquiry.id)}
                      >
                        <MoreVertical size={15} />
                      </IconButton>
                      {menuId === inquiry.id ? (
                        <>
                          <button
                            type="button"
                            className="fixed inset-0 z-10 cursor-default"
                            aria-hidden="true"
                            onClick={() => setMenuId(null)}
                          />
                          <div className="absolute end-0 top-full z-20 mt-1 w-48 border border-line bg-surface py-1 shadow-soft">
                            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-editorial text-secondary">
                              {t('admin.inquiries.changeStatus')}
                            </p>
                            {INQUIRY_STATUSES.map((option) => (
                              <button
                                key={option}
                                type="button"
                                disabled={option === inquiry.status}
                                onClick={() => updateStatus(inquiry, option)}
                                className="block w-full px-3 py-1.5 text-start text-[12px] text-ink-soft transition-colors hover:bg-canvas-deep disabled:opacity-40"
                              >
                                {t(STATUS_KEY[option])}
                              </button>
                            ))}
                          </div>
                        </>
                      ) : null}
                    </div>
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
              <ButtonAnchor variant="ghost" href={telHref(detail.phone)} icon={<Phone size={15} />}>
                {t('admin.inquiries.call')}
              </ButtonAnchor>
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
            <DetailRow label={t('admin.table.customer')}>{detail.fullName}</DetailRow>
            <DetailRow label={t('admin.table.email')}>
              <a href={`mailto:${detail.email}`} className="hover:text-ink">
                {detail.email}
              </a>
            </DetailRow>
            <DetailRow label={t('admin.table.phone')}>
              <span dir="ltr">{detail.phone}</span>
            </DetailRow>
            <DetailRow label={t('admin.table.status')}>
              <StatusBadge status={detail.status} label={t(STATUS_KEY[detail.status])} />
            </DetailRow>
            <DetailRow label={t('admin.table.received')}>{formatDateTime(detail.createdAt)}</DetailRow>
            <DetailRow label={t('admin.inquiries.property')}>{propertyName(detail.propertyId)}</DetailRow>
            <DetailRow label={t('admin.table.agent')}>{getAgent(detail.agentId) ? tx(getAgent(detail.agentId)!.name) : '—'}</DetailRow>
            <DetailRow label={t('admin.table.message')}>
              <p className="whitespace-pre-line">{detail.message}</p>
            </DetailRow>
          </dl>
        ) : null}
      </Modal>
    </div>
  );
}

export default Inquiries;
