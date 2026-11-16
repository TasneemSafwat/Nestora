import { cn } from '../../lib/utils';
import { Chip } from './Chip';

interface RangeFieldProps {
  minLabel: string;
  maxLabel: string;
  value: [number | null, number | null];
  onChange: (value: [number | null, number | null]) => void;
  presets?: { label: string; value: [number | null, number | null] }[];
  format?: (value: number) => string;
  className?: string;
  step?: number;
}

function parse(raw: string): number | null {
  if (raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

/**
 * Min/max pair with optional preset chips. Numeric entry is used rather than a
 * dual slider so prices stay exact and the control remains usable on mobile.
 */
export function RangeField({
  minLabel,
  maxLabel,
  value,
  onChange,
  presets = [],
  format,
  className,
  step = 1,
}: RangeFieldProps) {
  const [min, max] = value;
  const display = format ?? ((input: number) => String(input));

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="sr-only">{minLabel}</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={step}
            value={min ?? ''}
            placeholder={minLabel}
            onChange={(event) => onChange([parse(event.target.value), max])}
            className="field"
          />
        </label>
        <label className="block">
          <span className="sr-only">{maxLabel}</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={step}
            value={max ?? ''}
            placeholder={maxLabel}
            onChange={(event) => onChange([min, parse(event.target.value)])}
            className="field"
          />
        </label>
      </div>

      {presets.length ? (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => {
            const active = preset.value[0] === min && preset.value[1] === max;
            return (
              <Chip
                key={preset.label}
                label={preset.label}
                active={active}
                onClick={() => onChange(active ? [null, null] : preset.value)}
                className={active ? undefined : 'text-[11px]'}
              />
            );
          })}
        </div>
      ) : null}

      {min !== null || max !== null ? (
        <p className="text-[11px] text-secondary">
          {min !== null ? display(min) : '—'} — {max !== null ? display(max) : '—'}
        </p>
      ) : null}
    </div>
  );
}
