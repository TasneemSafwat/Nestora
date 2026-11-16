import {
  Building2,
  CalendarCheck,
  ClipboardList,
  Mail,
  Plus,
  Settings as SettingsIcon,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { useMemo } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { useLanguage, type TranslationKey } from '../../i18n';
import { propertyTypeById } from '../../data/taxonomy';
import { activityKindIcon } from '../../services/database';
import { leadMetrics, monthlyActivity, type MonthlyPoint } from '../../services/leadService';
import { portfolioStats } from '../../services/propertyService';
import { cn } from '../../lib/utils';
import { ButtonLink } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/ui/Icon';
import { SectionHeading } from '../../components/ui/SectionHeading';

interface MetricTile {
  key: TranslationKey;
  value: number;
  icon: LucideIcon;
}

const STATUS_SEGMENTS = [
  { status: 'available', color: 'bg-accent', key: 'status.available' },
  { status: 'reserved', color: 'bg-accent-soft', key: 'status.reserved' },
  { status: 'sold', color: 'bg-ink', key: 'status.sold' },
  { status: 'rented', color: 'bg-ink-soft', key: 'status.rented' },
  { status: 'draft', color: 'bg-line', key: 'status.draft' },
] as const;

const CHART_W = 760;
const CHART_H = 300;
const PAD_L = 40;
const PAD_R = 16;
const PAD_T = 28;
const PAD_B = 44;

function MonthlyChart({ points }: { points: MonthlyPoint[] }) {
  const { t, formatMonth } = useLanguage();

  const innerW = CHART_W - PAD_L - PAD_R;
  const innerH = CHART_H - PAD_T - PAD_B;
  const max = Math.max(1, ...points.map((point) => Math.max(point.inquiries, point.viewings)));
  const groupW = innerW / Math.max(1, points.length);
  const barW = Math.min(22, groupW * 0.3);
  const ticks = [0, 1, 2, 3, 4];

  const heightOf = (value: number) => (value / max) * innerH;

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full"
      role="img"
      aria-label={`${t('admin.overview.chartInquiries')} · ${t('admin.overview.chartViewings')}`}
    >
      <title>{t('admin.overview.chartTitle')}</title>

      {ticks.map((tick) => {
        const y = PAD_T + innerH - (tick / 4) * innerH;
        return (
          <g key={tick}>
            <line
              x1={PAD_L}
              x2={CHART_W - PAD_R}
              y1={y}
              y2={y}
              className="stroke-line"
              strokeWidth={1}
              strokeDasharray={tick === 0 ? undefined : '2 4'}
            />
            <text x={PAD_L - 8} y={y + 3} textAnchor="end" fontSize={10} className="fill-secondary">
              {Math.round((max * tick) / 4)}
            </text>
          </g>
        );
      })}

      {points.map((point, index) => {
        const center = PAD_L + groupW * index + groupW / 2;
        const inquiryH = heightOf(point.inquiries);
        const viewingH = heightOf(point.viewings);
        const inquiryX = center - barW - 1.5;
        const viewingX = center + 1.5;
        const baseY = PAD_T + innerH;

        return (
          <g key={point.key}>
            {point.inquiries > 0 ? (
              <rect
                x={inquiryX}
                y={baseY - inquiryH}
                width={barW}
                height={inquiryH}
                className="fill-accent"
                rx={1}
              />
            ) : null}
            {point.viewings > 0 ? (
              <rect
                x={viewingX}
                y={baseY - viewingH}
                width={barW}
                height={viewingH}
                className="fill-ink-soft"
                rx={1}
              />
            ) : null}
            {point.inquiries > 0 ? (
              <text
                x={inquiryX + barW / 2}
                y={baseY - inquiryH - 5}
                textAnchor="middle"
                fontSize={9}
                className="fill-secondary"
              >
                {point.inquiries}
              </text>
            ) : null}
            {point.viewings > 0 ? (
              <text
                x={viewingX + barW / 2}
                y={baseY - viewingH - 5}
                textAnchor="middle"
                fontSize={9}
                className="fill-secondary"
              >
                {point.viewings}
              </text>
            ) : null}
            <text x={center} y={baseY + 20} textAnchor="middle" fontSize={10} className="fill-secondary">
              {formatMonth(point.date)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Overview() {
  const { t, tx, formatNumber, formatDateTime } = useLanguage();
  const { properties, agents, activity } = useDatabase();

  const stats = portfolioStats(properties);
  const leads = leadMetrics();
  const points = useMemo(() => monthlyActivity(8), []);

  const tiles: MetricTile[] = [
    { key: 'admin.metrics.totalProperties', value: stats.total, icon: Building2 },
    { key: 'admin.metrics.available', value: stats.available, icon: Building2 },
    { key: 'admin.metrics.sold', value: stats.sold, icon: Building2 },
    { key: 'admin.metrics.totalInquiries', value: leads.inquiries, icon: Mail },
    { key: 'admin.metrics.pendingViewings', value: leads.pendingViewings, icon: CalendarCheck },
    { key: 'admin.metrics.valuations', value: leads.valuations, icon: ClipboardList },
    { key: 'admin.metrics.agents', value: agents.length, icon: UserRound },
  ];

  const segments = STATUS_SEGMENTS.map((segment) => ({
    ...segment,
    count: stats[segment.status],
  }));

  return (
    <div className="flex flex-col gap-10">
      <SectionHeading eyebrow={t('admin.demoMode')} titleLead={t('admin.overview.title')} text={t('admin.overview.subtitle')} />

      {/* Metrics */}
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7">
        {tiles.map((tile) => (
          <div key={tile.key} className="border border-line bg-surface p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-canvas-deep text-accent">
              <tile.icon size={16} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <dt className="mt-4 font-display text-[30px] leading-none text-ink">{formatNumber(tile.value)}</dt>
            <dd className="mt-2 text-[11px] uppercase tracking-editorial text-secondary">{t(tile.key)}</dd>
          </div>
        ))}
      </dl>

      {/* Chart */}
      <section className="border border-line bg-surface">
        <div className="flex flex-col gap-4 border-b border-line px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-[22px] leading-tight text-ink">{t('admin.overview.chartTitle')}</h2>
            <p className="mt-1.5 text-[12px] text-secondary">{t('admin.overview.chartSubtitle')}</p>
          </div>
          <ul className="flex items-center gap-5 text-[12px] text-secondary">
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-xs bg-accent" aria-hidden="true" />
              {t('admin.overview.chartInquiries')}
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-xs bg-ink-soft" aria-hidden="true" />
              {t('admin.overview.chartViewings')}
            </li>
          </ul>
        </div>
        <div className="px-4 py-6 sm:px-6">
          <MonthlyChart points={points} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="flex flex-col gap-6">
          {/* Portfolio by status */}
          <section className="border border-line bg-surface p-6">
            <h2 className="font-display text-[20px] leading-tight text-ink">{t('admin.overview.breakdownTitle')}</h2>

            {stats.total > 0 ? (
              <>
                <div className="mt-5 flex h-3 w-full overflow-hidden rounded-xs bg-canvas-deep">
                  {segments.map((segment) =>
                    segment.count > 0 ? (
                      <span
                        key={segment.status}
                        className={cn(segment.color)}
                        style={{ width: `${(segment.count / stats.total) * 100}%` }}
                        title={`${t(segment.key)} · ${segment.count}`}
                      />
                    ) : null
                  )}
                </div>
                <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                  {segments.map((segment) => (
                    <li key={segment.status} className="flex items-center gap-2.5 text-[13px] text-ink-soft">
                      <span className={cn('h-2.5 w-2.5 shrink-0 rounded-xs', segment.color)} aria-hidden="true" />
                      <span className="flex-1">{t(segment.key)}</span>
                      <span className="tabular-nums text-secondary">{formatNumber(segment.count)}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-4 text-[13px] text-secondary">{t('admin.empty.table')}</p>
            )}
          </section>

          {/* Portfolio by type */}
          <section className="border border-line bg-surface p-6">
            <h2 className="font-display text-[20px] leading-tight text-ink">{t('admin.overview.breakdownTypeTitle')}</h2>
            <ul className="mt-5 divide-y divide-line">
              {Object.keys(stats.byType).length > 0 ? (
                Object.entries(stats.byType).map(([typeId, count]) => {
                  const type = propertyTypeById(typeId);
                  return (
                    <li key={typeId} className="flex items-center justify-between gap-4 py-3 text-[13px]">
                      <span className="text-ink-soft">{type ? tx(type.plural) : typeId}</span>
                      <span className="tabular-nums text-secondary">{formatNumber(count)}</span>
                    </li>
                  );
                })
              ) : (
                <li className="py-3 text-[13px] text-secondary">{t('admin.empty.table')}</li>
              )}
            </ul>
          </section>
        </div>

        {/* Recent activity */}
        <section className="border border-line bg-surface p-6">
          <h2 className="font-display text-[20px] leading-tight text-ink">{t('admin.overview.recentTitle')}</h2>
          {activity.length > 0 ? (
            <ul className="mt-4 flex flex-col divide-y divide-line">
              {activity.slice(0, 10).map((entry) => (
                <li key={entry.id} className="flex gap-3 py-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-canvas-deep text-accent">
                    <Icon name={activityKindIcon[entry.kind]} size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-ink">{t(entry.labelKey as TranslationKey)}</p>
                    <p className="mt-0.5 truncate text-[12px] text-secondary">{entry.subject}</p>
                    <p className="mt-0.5 text-[11px] text-secondary/80">{formatDateTime(entry.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[13px] text-secondary">{t('admin.overview.recentEmpty')}</p>
          )}
        </section>
      </div>

      {/* Quick actions */}
      <section className="border border-line bg-surface p-6">
        <h2 className="font-display text-[20px] leading-tight text-ink">{t('admin.overview.quickActions')}</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink to="/admin/properties/new" variant="accent" icon={<Plus size={15} />}>
            {t('admin.overview.addProperty')}
          </ButtonLink>
          <ButtonLink to="/admin/inquiries" variant="outline" icon={<Mail size={15} />}>
            {t('admin.overview.reviewInquiries')}
          </ButtonLink>
          <ButtonLink to="/admin/viewings" variant="outline" icon={<CalendarCheck size={15} />}>
            {t('admin.overview.reviewViewings')}
          </ButtonLink>
          <ButtonLink to="/admin/valuations" variant="outline" icon={<ClipboardList size={15} />}>
            {t('admin.overview.reviewValuations')}
          </ButtonLink>
          <ButtonLink to="/admin/settings" variant="ghost" icon={<SettingsIcon size={15} />}>
            {t('admin.nav.settings')}
          </ButtonLink>
        </div>
      </section>

      {/* Empty portfolio helper */}
      {stats.total === 0 ? (
        <EmptyState
          title={t('admin.empty.properties')}
          icon={<Building2 size={20} />}
          action={
            <ButtonLink to="/admin/properties/new" variant="primary" icon={<Plus size={15} />}>
              {t('admin.empty.cta')}
            </ButtonLink>
          }
        />
      ) : null}
    </div>
  );
}

export default Overview;
