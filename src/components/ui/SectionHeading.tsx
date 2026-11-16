import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  titleLead?: string;
  titleAccent?: string;
  text?: string;
  /** Rendered to the right of the heading on wide screens. */
  actions?: ReactNode;
  align?: 'start' | 'center';
  size?: 'md' | 'lg';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  id?: string;
}

/**
 * The editorial headline pattern used across the site: a tracked eyebrow,
 * a display-size headline split into a lead and an accented phrase, and an
 * optional standfirst. Kept in one place so every section reads the same.
 */
export function SectionHeading({
  eyebrow,
  titleLead,
  titleAccent,
  text,
  actions,
  align = 'start',
  size = 'lg',
  as: Tag = 'h2',
  className,
  id,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className={cn(centered ? 'max-w-3xl' : 'max-w-2xl')}>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        {titleLead || titleAccent ? (
          <Tag
            id={id}
            className={cn(
              'mt-4 font-display font-normal leading-[1.08] text-ink',
              size === 'lg' ? 'text-[clamp(1.9rem,4.2vw,3.35rem)]' : 'text-[clamp(1.6rem,3vw,2.4rem)]'
            )}
          >
            {titleLead} {titleAccent ? <span className="italic text-accent">{titleAccent}</span> : null}
          </Tag>
        ) : null}
        {text ? (
          <p className={cn('mt-5 max-w-reading text-[15px] leading-relaxed text-secondary', centered && 'mx-auto')}>
            {text}
          </p>
        ) : null}
      </div>

      {actions ? <div className={cn('shrink-0', centered && 'mt-2')}>{actions}</div> : null}
    </div>
  );
}
