'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  title,
  emptyMessage = 'Ei tietoja',
  className,
}: DataTableProps<T>) {
  const getNestedValue = (obj: T, path: string): unknown => {
    return path.split('.').reduce((acc: unknown, part) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  };

  return (
    <Card className={cn('shadow-sm', className)}>
      {title && (
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn('font-semibold text-slate-700 text-base', col.className)}
                  >
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-slate-500 py-8 text-base"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={index} className="hover:bg-slate-50">
                    {columns.map((col) => (
                      <TableCell key={col.key} className="text-base py-4">
                        {col.render
                          ? col.render(item)
                          : String(getNestedValue(item, col.key) ?? '-')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// Phase badge component
export function PhaseBadge({ phase }: { phase: string }) {
  const phaseConfig: Record<string, { label: string; className: string }> = {
    boiling: { label: 'Keitto', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
    packaging: { label: 'Pakkaus', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
    separation: { label: 'Erotus', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  };

  const config = phaseConfig[phase] || { label: phase, className: '' };

  return (
    <Badge variant="secondary" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}
