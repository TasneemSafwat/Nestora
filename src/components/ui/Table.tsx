import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function TableWrap({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-sm border border-line bg-surface', className)}>
      <table className="w-full min-w-[720px] border-collapse text-start text-[13px]">{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-canvas-deep">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children, className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap px-4 py-3.5 text-start text-[10px] font-semibold uppercase tracking-editorial text-secondary',
        className
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function Tbody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-line">{children}</tbody>;
}

export function Tr({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn('transition-colors duration-200 hover:bg-canvas/70', className)}>{children}</tr>;
}

export function Td({ children, className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-4 align-middle text-ink-soft', className)} {...rest}>
      {children}
    </td>
  );
}
