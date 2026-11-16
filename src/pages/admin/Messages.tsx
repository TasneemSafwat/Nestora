import { Eye, Mail, MessageSquare, MoreVertical, Phone } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { useLanguage, type TranslationKey } from '../../i18n';
import { telHref, truncate } from '../../lib/utils';
import type { ContactMessage, InquiryStatus } from '../../types';
import { setMessageStatus } from '../../services/leadService';
import { ButtonAnchor, IconButton } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { SelectField, TextField } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { TableWrap, Tbody, Td, Th, Thead, Tr } from '../../components/ui/Table';
import { useToast } from '../../components/ui/Toast';

const MESSAGE_STATUSES: InquiryStatus[] = ['new', 'contacted', 'qualified', 'closed'];

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

export function Messages() {
  const { t, formatDateTime } = useLanguage();
  const { messages } = useDatabase();
  const toast = useToast();

  const [status, setStatus] = useState<InquiryStatus | ''>('');
  const [query, setQuery] = useState('');
  const [menuId, setMenuId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ContactMessage | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return messages.filter((message) => {
      if (status && message.status !== status) return false;
      if (!needle) return true;
      return [message.fullName, message.email, message.subject, message.message].join(' ').toLowerCase().includes(needle);
    });
  }, [messages, status, query]);

  const updateStatus = (message: ContactMessage, next: InquiryStatus) => {
    setMessageStatus(message.id, next);
    setMenuId(null);
    toast.success(t('toast.saved'));
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow={t('admin.demoMode')}
        titleLead={t('admin.messages.title')}
        text={t('admin.messages.subtitle')}
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
          options={MESSAGE_STATUSES.map((item) => ({ value: item, label: t(STATUS_KEY[item]) }))}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t('admin.empty.messages')} icon={<MessageSquare size={20} />} />
      ) : (
        <TableWrap>
          <Thead>
            <Th>{t('admin.table.customer')}</Th>
            <Th>{t('admin.table.contact')}</Th>
            <Th>{t('admin.table.subject')}</Th>
            <Th>{t('admin.table.message')}</Th>
            <Th>{t('admin.table.received')}</Th>
            <Th>{t('admin.table.status')}</Th>
            <Th className="text-end">{t('admin.table.actions')}</Th>
          </Thead>
          <Tbody>
            {filtered.map((message) => (
              <Tr key={message.id}>
                <Td className="whitespace-nowrap font-medium text-ink">{message.fullName}</Td>
                <Td>
                  <div className="flex flex-col gap-0.5">
                    <a href={`mailto:${message.email}`} className="text-ink-soft hover:text-ink">
                      {message.email}
                    </a>
                    <span className="text-[12px] text-secondary" dir="ltr">
                      {message.phone}
                    </span>
                  </div>
                </Td>
                <Td className="max-w-[200px] truncate">{message.subject}</Td>
                <Td className="max-w-[240px] text-secondary">{truncate(message.message, 60)}</Td>
                <Td className="whitespace-nowrap text-secondary">{formatDateTime(message.createdAt)}</Td>
                <Td>
                  <StatusBadge status={message.status} label={t(STATUS_KEY[message.status])} />
                </Td>
                <Td className="text-end">
                  <div className="flex items-center justify-end gap-1">
                    <IconButton label={t('admin.inquiries.detail')} onClick={() => setDetail(message)}>
                      <Eye size={15} />
                    </IconButton>
                    <div className="relative">
                      <IconButton
                        label={t('admin.inquiries.changeStatus')}
                        aria-expanded={menuId === message.id}
                        onClick={() => setMenuId(menuId === message.id ? null : message.id)}
                      >
                        <MoreVertical size={15} />
                      </IconButton>
                      {menuId === message.id ? (
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
                            {MESSAGE_STATUSES.map((option) => (
                              <button
                                key={option}
                                type="button"
                                disabled={option === message.status}
                                onClick={() => updateStatus(message, option)}
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
        title={detail?.subject ?? t('admin.messages.title')}
        size="md"
        footer={
          detail ? (
            <>
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

export default Messages;
