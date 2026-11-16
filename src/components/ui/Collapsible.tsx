import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CollapsibleProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  /** Rendered next to the title, e.g. a count of selected values. */
  meta?: ReactNode;
  className?: string;
}

export function Collapsible({ title, children, defaultOpen = false, meta, className }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={cn('border-b border-line', className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-4 text-start"
      >
        <span className="text-[12px] font-medium uppercase tracking-editorial text-ink-soft">{title}</span>
        <span className="flex items-center gap-2 text-secondary">
          {meta}
          <ChevronDown size={15} className={cn('transition-transform duration-300', open && 'rotate-180')} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
