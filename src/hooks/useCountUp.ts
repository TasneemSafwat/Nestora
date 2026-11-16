import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './useMediaQuery';

/**
 * Counts from zero to `target` once the element scrolls into view.
 * The animation is skipped entirely when reduced motion is requested.
 */
export function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (reduceMotion) {
      setValue(target);
      return undefined;
    }

    const element = ref.current;
    if (!element) return undefined;

    let frame = 0;
    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (!visible || started.current) return;
        started.current = true;

        const start = performance.now();
        const step = (now: number) => {
          if (cancelled) return;
          const progress = Math.min(1, (now - start) / duration);
          // easeOutExpo keeps the count feeling unhurried at the end
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setValue(Math.round(target * eased));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration, reduceMotion]);

  return { ref, value };
}
