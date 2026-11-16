import { SearchX } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  title: string;
  text?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({ title, text, icon, action, className, compact = false }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-sm border border-dashed border-line bg-surface/60 text-center',
        compact ? 'px-6 py-10' : 'px-6 py-20',
        className
      )}
    >
      <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-canvas-deep text-secondary">
        {icon ?? <SearchX size={20} />}
      </span>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {text ? <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-secondary">{text}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
