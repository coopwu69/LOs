import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes, TableHTMLAttributes } from "react";

/** Data-dense table primitives for staff dashboard lists. */

export function Table({ children, className = "", ...props }: TableHTMLAttributes<HTMLTableElement> & { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-default">
      <table className={`w-full border-collapse text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="border-b border-border-strong bg-sunken">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-border-default">{children}</tbody>;
}

export function TableRow({ children, className = "", ...props }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`transition-colors hover:bg-hover ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={`px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-tertiary whitespace-nowrap ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 text-primary ${className}`} {...props}>
      {children}
    </td>
  );
}
