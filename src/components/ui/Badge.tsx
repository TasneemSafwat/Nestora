import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export type BadgeTone = 'neutral' | 'accent' | 'positive' | 'warning' | 'danger' | 'muted';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-ink text-canvas',
  accent: 'bg-accent-soft text-accent-deep',
  positive: 'bg-[#E4EEE4] text-[#3E6B45]',
  warning: 'bg-[#F5EBD9] text-[#8A6522]',
  danger: 'bg-[#F6E4E1] text-[#8E3B2E]',
  muted: 'bg-canvas-deep text-secondary',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xs px-2.5 py-1 text-[10px] font-semibold uppercase tracking-editorial',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Maps every workflow status used across the site to a consistent tone. */
export function statusTone(status: string): BadgeTone {
  switch (status) {
    case 'available':
    case 'completed':
    case 'qualified':
    case 'appraised':
      return 'positive';
    case 'reserved':
    case 'pending':
    case 'in-review':
    case 'new':
      return 'warning';
    case 'sold':
    case 'rented':
    case 'scheduled':
    case 'contacted':
      return 'accent';
    case 'draft':
    case 'cancelled':
    case 'closed':
      return 'muted';
    default:
      return 'neutral';
  }
}

export function StatusBadge({ label, status, className }: { label: string; status: string; className?: string }) {
  return (
    <Badge tone={statusTone(status)} className={className}>
      {label}
    </Badge>
  );
}
