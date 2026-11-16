import { useState, type ImgHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Tailwind aspect utility, e.g. `aspect-[4/3]`. Omit for natural height. */
  ratio?: string;
  wrapperClassName?: string;
  priority?: boolean;
}

/**
 * Photography wrapper that reserves space, fades the image in once decoded
 * and degrades to a neutral surface if the source fails.
 */
export function SmartImage({
  src,
  alt,
  ratio,
  wrapperClassName,
  className,
  priority = false,
  ...rest
}: SmartImageProps) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  return (
    <div className={cn('relative overflow-hidden bg-canvas-deep', ratio, wrapperClassName)}>
      {state === 'loading' ? <span className="skeleton absolute inset-0 block" aria-hidden="true" /> : null}
      {state === 'error' ? (
        <span
          className="absolute inset-0 flex items-center justify-center bg-canvas-deep text-[11px] uppercase tracking-editorial text-secondary"
          aria-hidden="true"
        >
          NESTORA
        </span>
      ) : null}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setState('ready')}
        onError={() => setState('error')}
        className={cn(
          'h-full w-full object-cover transition-[opacity,transform] duration-700 ease-editorial',
          state === 'ready' ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...rest}
      />
    </div>
  );
}
