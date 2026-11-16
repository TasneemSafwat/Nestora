import { Copy, Eye, MoreVertical, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDatabase } from '../../hooks/useDatabase';
import { useLanguage } from '../../i18n';
import { cityById, districtById, propertyStatuses, propertyTypeById, propertyTypes } from '../../data/taxonomy';
import { propertyCover } from '../../lib/images';
import type { Property, PropertyStatus, PropertyType } from '../../types';
import { getAgent } from '../../services/agentService';
import {
  DEFAULT_FILTERS,
  deleteProperty,
  duplicateProperty,
  filterProperties,
  paginate,
  setPropertyStatus,
} from '../../services/propertyService';
import { ButtonLink, IconButton } from '../../components/ui/Button';
import { ConfirmDialog, Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { SelectField, TextField } from '../../components/ui/Field';
import { Pagination } from '../../components/ui/Pagination';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { SmartImage } from '../../components/ui/SmartImage';
import { StatusBadge } from '../../components/ui/Badge';
import { Tbody, Td, Th, Thead, TableWrap, Tr } from '../../components/ui/Table';
import { useToast } from '../../components/ui/Toast';
import { PropertyCard } from '../../components/property/PropertyCard';

export function Properties() {
  const { t, tx, formatPrice } = useLanguage();
  const { properties, settings } = useDatabase();
  const toast = useToast();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<PropertyStatus | ''>('');
  const [type, setType] = useState<PropertyType | ''>('');
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Property | null>(null);
  const [preview, setPreview] = useState<Property | null>(null);

  const filtered = useMemo(
    () => filterProperties(properties, { ...DEFAULT_FILTERS, q: query, status, type }),
    [properties, query, status, type]
  );

  const paged = paginate(filtered, page, settings.listingsPerPage);

  const updateStatus = (property: Property, next: PropertyStatus) => {
    setPropertyStatus(property.id, next);
    setMenuId(null);
    toast.success(t('admin.properties.statusUpdated', { status: tx(propertyStatuses.find((s) => s.id === next)!.name) }));
  };

  const onDuplicate = (property: Property) => {
    duplicateProperty(property.id);
    setMenuId(null);
    toast.success(t('admin.properties.duplicated'));
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteProperty(toDelete.id);
    setToDelete(null);
    toast.success(t('toast.deleted'));
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow={t('admin.demoMode')}
        titleLead={t('admin.properties.title')}
        text={t('admin.properties.subtitle')}
        actions={
          <ButtonLink to="/admin/properties/new" variant="primary" icon={<Plus size={15} />}>
            {t('admin.properties.add')}
          </ButtonLink>
        }
      />

      {/* Toolbar */}
      <div className="grid gap-4 border border-line bg-surface p-5 sm:grid-cols-2 lg:grid-cols-4">
        <TextField
          label={t('admin.properties.search')}
          placeholder={t('admin.properties.search')}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          containerClassName="sm:col-span-2"
        />
        <SelectField
          label={t('admin.properties.filterStatus')}
          placeholder={t('admin.properties.allStatuses')}
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as PropertyStatus | '');
            setPage(1);
          }}
          options={propertyStatuses.map((item) => ({ value: item.id, label: tx(item.name) }))}
        />
        <SelectField
          label={t('admin.properties.filterType')}
          placeholder={t('admin.properties.allTypes')}
          value={type}
          onChange={(event) => {
            setType(event.target.value as PropertyType | '');
            setPage(1);
          }}
          options={propertyTypes.map((item) => ({ value: item.id, label: tx(item.name) }))}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={t('admin.empty.properties')}
          icon={<Search size={20} />}
          action={
            <ButtonLink to="/admin/properties/new" variant="primary" icon={<Plus size={15} />}>
              {t('admin.empty.cta')}
            </ButtonLink>
          }
        />
      ) : (
        <>
          <TableWrap>
            <Thead>
              <Th>{t('admin.table.property')}</Th>
              <Th>{t('admin.table.reference')}</Th>
              <Th>{t('admin.table.location')}</Th>
              <Th>{t('admin.table.price')}</Th>
              <Th>{t('admin.table.type')}</Th>
              <Th>{t('admin.table.status')}</Th>
              <Th>{t('admin.table.agent')}</Th>
              <Th className="text-end">{t('admin.table.actions')}</Th>
            </Thead>
            <Tbody>
              {paged.items.map((property) => {
                const city = cityById(property.cityId);
                const district = districtById(property.districtId);
                const propType = propertyTypeById(property.type);
                const agent = getAgent(property.agentId);
                const title = tx(property.title);
                const statusName = propertyStatuses.find((s) => s.id === property.status);

                return (
                  <Tr key={property.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-14 shrink-0">
                          <SmartImage
                            src={propertyCover(property.imagePrompt, 'square')}
                            alt={title}
                            ratio="aspect-square"
                            wrapperClassName="rounded-xs"
                          />
                        </div>
                        <span className="font-medium text-ink">{title}</span>
                      </div>
                    </Td>
                    <Td className="whitespace-nowrap tabular-nums">{property.reference}</Td>
                    <Td className="whitespace-nowrap">
                      {district ? tx(district.name) : null}
                      {district && city ? ', ' : null}
                      {city ? tx(city.name) : null}
                    </Td>
                    <Td className="whitespace-nowrap">{formatPrice(property.price)}</Td>
                    <Td className="whitespace-nowrap">{propType ? tx(propType.name) : null}</Td>
                    <Td>
                      <StatusBadge status={property.status} label={statusName ? tx(statusName.name) : property.status} />
                    </Td>
                    <Td className="whitespace-nowrap">{agent ? tx(agent.name) : '—'}</Td>
                    <Td className="text-end">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          label={t('admin.properties.preview')}
                          onClick={() => setPreview(property)}
                        >
                          <Eye size={15} />
                        </IconButton>
                        <Link
                          to={`/admin/properties/${property.id}/edit`}
                          aria-label={t('action.edit')}
                          title={t('action.edit')}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-surface/90 text-ink transition-colors hover:border-ink"
                        >
                          <Pencil size={15} />
                        </Link>
                        <IconButton label={t('admin.properties.duplicate')} onClick={() => onDuplicate(property)}>
                          <Copy size={15} />
                        </IconButton>
                        <div className="relative">
                          <IconButton
                            label={t('admin.properties.changeStatus')}
                            aria-expanded={menuId === property.id}
                            onClick={() => setMenuId(menuId === property.id ? null : property.id)}
                          >
                            <MoreVertical size={15} />
                          </IconButton>
                          {menuId === property.id ? (
                            <>
                              <button
                                type="button"
                                className="fixed inset-0 z-10 cursor-default"
                                aria-hidden="true"
                                onClick={() => setMenuId(null)}
                              />
                              <div className="absolute end-0 top-full z-20 mt-1 w-48 border border-line bg-surface py-1 shadow-soft">
                                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-editorial text-secondary">
                                  {t('admin.properties.changeStatus')}
                                </p>
                                {propertyStatuses.map((option) => (
                                  <button
                                    key={option.id}
                                    type="button"
                                    disabled={option.id === property.status}
                                    onClick={() => updateStatus(property, option.id)}
                                    className="block w-full px-3 py-1.5 text-start text-[12px] text-ink-soft transition-colors hover:bg-canvas-deep disabled:opacity-40"
                                  >
                                    {t('admin.properties.setStatus', { status: tx(option.name) })}
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : null}
                        </div>
                        <IconButton label={t('action.delete')} onClick={() => setToDelete(property)}>
                          <Trash2 size={15} />
                        </IconButton>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </TableWrap>

          <div className="flex flex-col items-center gap-4">
            <p className="text-[12px] text-secondary">
              {t('admin.pagination.showing', {
                from: (paged.page - 1) * paged.perPage + 1,
                to: Math.min(paged.page * paged.perPage, paged.total),
                total: paged.total,
              })}
            </p>
            <Pagination
              page={paged.page}
              pageCount={paged.pageCount}
              onChange={setPage}
              previousLabel={t('admin.pagination.previous')}
              nextLabel={t('admin.pagination.next')}
              pageLabel={(value) => t('properties.pagination.page', { page: value })}
            />
          </div>
        </>
      )}

      <Modal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title={t('admin.form.previewTitle')}
        description={t('admin.form.previewNote')}
        size="lg"
      >
        {preview ? (
          <div className="mx-auto max-w-md">
            <PropertyCard property={preview} variant="grid" />
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={t('admin.confirm.deleteTitle', { name: toDelete ? tx(toDelete.title) : '' })}
        text={t('admin.confirm.deleteText')}
        confirmLabel={t('admin.confirm.deleteConfirm')}
        cancelLabel={t('admin.confirm.cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

export default Properties;
