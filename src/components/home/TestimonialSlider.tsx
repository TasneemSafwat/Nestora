import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../i18n';
import { testimonials } from '../../data/content';
import { cityById } from '../../data/taxonomy';
import { Badge } from '../ui/Badge';
import { IconButton } from '../ui/Button';

/** Rotating quote carousel. All quotes are clearly flagged as demo content. */
export function TestimonialSlider() {
  const { t, tx } = useLanguage();
  const [index, setIndex] = useState(0);
  const active = testimonials[index];
  const city = cityById(active.cityId);

  const step = (delta: number) => {
    setIndex((current) => (current + delta + testimonials.length) % testimonials.length);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center lg:gap-20">
      <div className="relative">
        <Quote size={44} className="text-accent-soft" aria-hidden="true" />

        <div className="mt-6 min-h-[240px] sm:min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-[clamp(1.35rem,2.7vw,2.05rem)] leading-[1.45] text-ink">
                “{tx(active.quote)}”
              </p>
              <footer className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                <cite className="not-italic">
                  <span className="block text-[14px] font-medium text-ink">{tx(active.name)}</span>
                  <span className="mt-0.5 block text-[12px] text-secondary">{tx(active.role)}</span>
                </cite>
                {city ? (
                  <span className="text-[11px] uppercase tracking-editorial text-secondary/80">{tx(city.name)}</span>
                ) : null}
                <Badge tone="muted">{t('home.testimonials.demoBadge')}</Badge>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <IconButton label={t('action.previous')} onClick={() => step(-1)}>
            <ArrowLeft size={15} className="rtl:rotate-180" />
          </IconButton>
          <IconButton label={t('action.next')} onClick={() => step(1)}>
            <ArrowRight size={15} className="rtl:rotate-180" />
          </IconButton>

          <div className="ms-2 flex items-center gap-2">
            {testimonials.map((item, position) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`${position + 1}`}
                aria-current={position === index}
                className={`h-1 transition-all duration-300 ${
                  position === index ? 'w-7 bg-accent' : 'w-3 bg-line hover:bg-secondary/50'
                }`}
              />
            ))}
          </div>

          <span className="ms-auto text-[12px] text-secondary">
            {String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      <aside className="border-s border-line ps-8">
        <p className="text-[12px] leading-relaxed text-secondary">{t('home.testimonials.text')}</p>
        <ul className="mt-6 space-y-3 text-[12px] text-secondary">
          <li className="flex gap-2.5">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {t('badge.demo')}
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {t('home.stats.note')}
          </li>
        </ul>
      </aside>
    </div>
  );
}

export default TestimonialSlider;
