import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../lib/utils';

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'quiet';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 font-sans text-[13px] font-medium leading-none ' +
  'transition-all duration-300 ease-editorial disabled:cursor-not-allowed disabled:opacity-45 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-canvas hover:bg-ink-soft active:translate-y-px',
  accent: 'bg-accent text-white hover:bg-accent-deep active:translate-y-px',
  outline: 'border border-line bg-transparent text-ink hover:border-ink hover:bg-surface',
  ghost: 'bg-transparent text-ink hover:bg-canvas-deep',
  quiet: 'bg-canvas-deep text-ink hover:bg-line',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[12px]',
  md: 'h-11 px-5',
  lg: 'h-[52px] px-7 text-[14px]',
};

export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  full = false
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], full && 'w-full');
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  icon?: ReactNode;
  iconEnd?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  icon,
  iconEnd,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={cn(buttonStyles(variant, size, full), className)} {...rest}>
      {icon}
      {children}
      {iconEnd}
    </button>
  );
}

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  icon?: ReactNode;
  iconEnd?: ReactNode;
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  full = false,
  icon,
  iconEnd,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonStyles(variant, size, full), className)} {...rest}>
      {icon}
      {children}
      {iconEnd}
    </Link>
  );
}

interface ButtonAnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  icon?: ReactNode;
  iconEnd?: ReactNode;
}

export function ButtonAnchor({
  variant = 'primary',
  size = 'md',
  full = false,
  icon,
  iconEnd,
  className,
  children,
  ...rest
}: ButtonAnchorProps) {
  return (
    <a className={cn(buttonStyles(variant, size, full), className)} {...rest}>
      {icon}
      {children}
      {iconEnd}
    </a>
  );
}

/** Small square icon-only button used in toolbars and gallery controls. */
export function IconButton({
  label,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-surface/90 ' +
          'text-ink transition-colors duration-200 hover:border-ink hover:bg-surface',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
