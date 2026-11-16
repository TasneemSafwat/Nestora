import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  previousLabel: string;
  nextLabel: string;
  pageLabel: (page: number) => string;
  className?: string;
}

/** Compact numeric pagination with an ellipsis for long ranges. */
function pageRange(page: number, pageCount: number): (number | 'gap')[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  const pages = new Set<number>([1, pageCount, page, page - 1, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((value) => pages.add(value));
  if (page >= pageCount - 2) [pageCount - 1, pageCount - 2, pageCount - 3].forEach((value) => pages.add(value));

  const sorted = [...pages].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);
  const output: (number | 'gap')[] = [];
  sorted.forEach((value, index) => {
    if (index > 0 && value - (sorted[index - 1] as number) > 1) output.push('gap');
    output.push(value);
  });
  return output;
}

export function Pagination({
  page,
  pageCount,
  onChange,
  previousLabel,
  nextLabel,
  pageLabel,
  className,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1.5', className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label={previousLabel}
        className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line text-ink transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-line"
      >
        <ArrowLeft size={15} className="rtl:rotate-180" />
      </button>

      {pageRange(page, pageCount).map((entry, index) =>
        entry === 'gap' ? (
          <span key={`gap-${index}`} className="px-1 text-secondary">
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onChange(entry)}
            aria-label={pageLabel(entry)}
            aria-current={entry === page ? 'page' : undefined}
            className={cn(
              'inline-flex h-9 min-w-9 items-center justify-center rounded-sm border px-2 text-[13px] transition-colors',
              entry === page
                ? 'border-ink bg-ink text-canvas'
                : 'border-line text-ink-soft hover:border-ink hover:text-ink'
            )}
          >
            {entry}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        aria-label={nextLabel}
        className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line text-ink transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-line"
      >
        <ArrowRight size={15} className="rtl:rotate-180" />
      </button>
    </nav>
  );
}
