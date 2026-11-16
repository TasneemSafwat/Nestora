import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { useLanguage } from '../../i18n';
import { Badge } from './Badge';
import { IconButton } from './Button';
import { SmartImage } from './SmartImage';

export interface LightboxImage {
  src: string;
  label: string;
}

interface LightboxProps {
  images: LightboxImage[];
  title: string;
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/** Full-screen gallery viewer with keyboard navigation. */
export function Lightbox({ images, title, index, onClose, onNavigate }: LightboxProps) {
  const { t } = useLanguage();
  const open = index !== null;
  useLockBodyScroll(open);

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      const next = (index + delta + images.length) % images.length;
      onNavigate(next);
    },
    [index, images.length, onNavigate]
  );

  useEffect(() => {
    if (!open) return undefined;
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [open, onClose, step]);

  if (typeof document === 'undefined') return null;

  const current = index !== null ? images[index] : null;

  return createPortal(
    <AnimatePresence>
      {open && current ? (
        <motion.div
          className="fixed inset-0 z-[130] flex flex-col bg-ink/96"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={t('property.gallery.viewAll', { count: images.length })}
        >
          <header className="flex items-center justify-between gap-4 px-5 py-4 text-canvas sm:px-8">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium">{title}</p>
              <p className="mt-0.5 text-[11px] text-canvas/60">
                {t('property.gallery.photo', { index: (index ?? 0) + 1, total: images.length })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone="muted" className="hidden bg-canvas/10 text-canvas sm:inline-flex">
                {current.label}
              </Badge>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('a11y.closeGallery')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-canvas/25 text-canvas transition-colors hover:bg-canvas/10"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-10">
            <IconButton
              label={t('a11y.prevImage')}
              onClick={() => step(-1)}
              className="absolute start-3 z-10 border-canvas/25 bg-canvas/10 text-canvas hover:bg-canvas/20 sm:start-6"
            >
              <ChevronLeft size={18} className="rtl:rotate-180" />
            </IconButton>

            <motion.div
              key={current.src}
              className="flex h-full w-full items-center justify-center"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <SmartImage
                src={current.src}
                alt={`${title} — ${current.label}`}
                priority
                className="max-h-full w-auto object-contain"
                wrapperClassName="flex h-full w-full items-center justify-center bg-transparent"
              />
            </motion.div>

            <IconButton
              label={t('a11y.nextImage')}
              onClick={() => step(1)}
              className="absolute end-3 z-10 border-canvas/25 bg-canvas/10 text-canvas hover:bg-canvas/20 sm:end-6"
            >
              <ChevronRight size={18} className="rtl:rotate-180" />
            </IconButton>
          </div>

          <footer className="flex justify-center gap-2 overflow-x-auto px-5 pb-6 no-scrollbar">
            {images.map((image, position) => (
              <button
                key={image.src}
                type="button"
                onClick={() => onNavigate(position)}
                aria-label={image.label}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-xs border transition-opacity ${
                  position === index ? 'border-accent opacity-100' : 'border-transparent opacity-55 hover:opacity-90'
                }`}
              >
                <img src={image.src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </footer>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
