import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

/** Underlined tab strip used on the property detail page and in the dashboard. */
export function Tabs({ items, active, onChange, className }: TabsProps) {
  return (
    <div role="tablist" className={cn('flex gap-1 overflow-x-auto border-b border-line no-scrollbar', className)}>
      {items.map((item) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              'relative whitespace-nowrap px-4 py-3 text-[13px] transition-colors duration-200',
              selected ? 'text-ink' : 'text-secondary hover:text-ink'
            )}
          >
            {item.label}
            {selected ? <span className="absolute inset-x-2 bottom-0 h-px bg-accent" aria-hidden="true" /> : null}
          </button>
        );
      })}
    </div>
  );
}
