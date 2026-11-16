import { useCountUp } from '../../hooks/useCountUp';
import { useLanguage } from '../../i18n';
import { cn } from '../../lib/utils';

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
  tone?: 'ink' | 'canvas';
}

/** Animated figure used on the homepage and about page. */
export function Stat({ value, suffix = '', label, className, tone = 'ink' }: StatProps) {
  const { ref, value: current } = useCountUp(value);
  const { formatNumber } = useLanguage();

  return (
    <div className={cn('flex flex-col', className)}>
      <span
        ref={ref}
        className={cn(
          'font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-none',
          tone === 'canvas' ? 'text-canvas' : 'text-ink'
        )}
      >
        {formatNumber(current)}
        {suffix}
      </span>
      <span
        className={cn(
          'mt-3 text-[12px] uppercase tracking-editorial',
          tone === 'canvas' ? 'text-canvas/65' : 'text-secondary'
        )}
      >
        {label}
      </span>
    </div>
  );
}
