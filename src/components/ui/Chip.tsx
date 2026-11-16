import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  removeLabel?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Filter chip: an active filter summary that can be dismissed, or a preset. */
export function Chip({ label, onRemove, removeLabel, active = false, onClick, className }: ChipProps) {
  const interactive = Boolean(onClick);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition-colors duration-200',
        active ? 'border-ink bg-ink text-canvas' : 'border-line bg-surface text-ink-soft',
        interactive && !active && 'cursor-pointer hover:border-ink hover:text-ink',
        className
      )}
    >
      {interactive ? (
        <button type="button" onClick={onClick} className="cursor-pointer">
          {label}
        </button>
      ) : (
        <span>{label}</span>
      )}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? label}
          className="-me-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"
        >
          <X size={11} />
        </button>
      ) : null}
    </span>
  );
}
