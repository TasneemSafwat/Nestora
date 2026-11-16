import { AlertCircle } from 'lucide-react';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '../../lib/utils';

interface FieldShellProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

function FieldShell({ label, hint, error, required, htmlFor, className, children }: FieldShellProps) {
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <label className="field-label" htmlFor={htmlFor}>
          {label}
          {required ? <span className="ms-1 text-accent">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#8E3B2E]">
          <AlertCircle size={13} aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-secondary">{hint}</p>
      ) : null}
    </div>
  );
}

/* --------------------------------- Input ---------------------------------- */

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  containerClassName?: string;
}

export function TextField({ label, hint, error, containerClassName, className, id, ...rest }: TextFieldProps) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={rest.required}
      htmlFor={inputId}
      className={containerClassName}
    >
      <input
        id={inputId}
        className={cn('field', error ? 'border-[#C08A80] focus:border-[#8E3B2E]' : null, className)}
        aria-invalid={Boolean(error)}
        {...rest}
      />
    </FieldShell>
  );
}

/* -------------------------------- Textarea -------------------------------- */

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  containerClassName?: string;
}

export function TextArea({ label, hint, error, containerClassName, className, id, rows = 5, ...rest }: TextAreaProps) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={rest.required}
      htmlFor={inputId}
      className={containerClassName}
    >
      <textarea
        id={inputId}
        rows={rows}
        className={cn('field resize-y leading-relaxed', error ? 'border-[#C08A80]' : null, className)}
        aria-invalid={Boolean(error)}
        {...rest}
      />
    </FieldShell>
  );
}

/* --------------------------------- Select --------------------------------- */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export function SelectField({
  label,
  hint,
  error,
  options,
  placeholder,
  containerClassName,
  className,
  id,
  ...rest
}: SelectFieldProps) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={rest.required}
      htmlFor={inputId}
      className={containerClassName}
    >
      <select
        id={inputId}
        className={cn('field cursor-pointer appearance-none pe-9', error ? 'border-[#C08A80]' : null, className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23777873' stroke-width='1.6'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
        aria-invalid={Boolean(error)}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/* -------------------------------- Checkbox -------------------------------- */

interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
}

export function CheckboxField({ label, description, error, className, id, ...rest }: CheckboxFieldProps) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <div className={cn('w-full', className)}>
      <label htmlFor={inputId} className="flex cursor-pointer items-start gap-3">
        <input
          id={inputId}
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-xs border border-line bg-surface
            transition-colors duration-200 checked:border-accent checked:bg-accent
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          style={
            rest.checked
              ? {
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E\")",
                  backgroundSize: '80%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }
              : undefined
          }
          {...rest}
        />
        <span className="text-[13px] leading-snug text-ink-soft">
          {label}
          {description ? <span className="mt-0.5 block text-[12px] text-secondary">{description}</span> : null}
        </span>
      </label>
      {error ? <p className="mt-1.5 text-[12px] text-[#8E3B2E]">{error}</p> : null}
    </div>
  );
}

/* ------------------------------ Radio group ------------------------------- */

interface RadioGroupProps<T extends string> {
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}

export function RadioGroup<T extends string>({ name, value, onChange, options, className }: RadioGroupProps<T>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="radiogroup">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              'cursor-pointer rounded-sm border px-3.5 py-2 text-[12px] transition-colors duration-200',
              active ? 'border-ink bg-ink text-canvas' : 'border-line bg-surface text-ink-soft hover:border-secondary/50'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={active}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}

/* ----------------------------- Segmented control -------------------------- */

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  ariaLabel: string;
}

export function Segmented<T extends string>({ value, onChange, options, ariaLabel }: SegmentedProps<T>) {
  return (
    <div className="inline-flex rounded-sm border border-line bg-surface p-0.5" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-xs px-3 py-1.5 text-[12px] transition-colors duration-200',
              active ? 'bg-ink text-canvas' : 'text-secondary hover:text-ink'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export { FieldShell };
