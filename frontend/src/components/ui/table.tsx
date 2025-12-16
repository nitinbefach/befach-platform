import React from 'react';

export const Table = ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <table {...props}>{children}</table>
);

export const TableHeader = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead {...props}>{children}</thead>
);

export const TableBody = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props}>{children}</tbody>
);

export const TableFooter = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot {...props}>{children}</tfoot>
);

export const TableHead = ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th {...props}>{children}</th>
);

export const TableRow = ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props}>{children}</tr>
);

export const TableCell = ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td {...props}>{children}</td>
);

export const TableCaption = ({ children, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption {...props}>{children}</caption>
);