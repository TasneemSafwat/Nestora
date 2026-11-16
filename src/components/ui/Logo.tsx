import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface LogoProps {
  tone?: 'ink' | 'canvas';
  className?: string;
  /** Set to false inside the admin sidebar, which supplies its own link. */
  linked?: boolean;
  compact?: boolean;
}

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none" aria-hidden="true">
      <path
        d="M4.5 23.5V12.4C4.5 7.2 8.75 3 14 3s9.5 4.2 9.5 9.4V23.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path d="M14 23.5V12.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M9.2 23.5h9.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Brand lockup. The Arabic lockup drops the Latin wordmark so the brand reads
 * correctly in RTL without applying letter-spacing to Arabic script.
 */
export function Logo({ tone = 'ink', className, linked = true, compact = false }: LogoProps) {
  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-2.5',
        tone === 'canvas' ? 'text-canvas' : 'text-ink',
        className
      )}
    >
      <Mark className="h-6 w-6 shrink-0 text-accent" />
      {!compact ? (
        <>
          <span className="font-display text-[21px] font-medium uppercase leading-none tracking-[0.22em]">
            Nestora
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-secondary sm:inline" aria-hidden="true">
            Real Estate
          </span>
        </>
      ) : null}
    </span>
  );

  if (!linked) return content;

  return (
    <Link to="/" aria-label="NESTORA — home" className="inline-flex items-center">
      {content}
    </Link>
  );
}
