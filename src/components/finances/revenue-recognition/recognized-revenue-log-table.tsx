
'use client';

import type { RecognizedRevenueEntry } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

interface RecognizedRevenueLogTableProps {
  entries: RecognizedRevenueEntry[];
}

export default function RecognizedRevenueLogTable({ entries }: RecognizedRevenueLogTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date Recognized</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Related Project</TableHead>
            <TableHead>Related Invoice</TableHead>
            <TableHead>Recognition Rule</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No revenue recognized yet.
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="text-sm">{format(parseISO(entry.dateRecognized), 'PPP')}</TableCell>
                <TableCell className="text-right font-medium">{entry.amountRecognized.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-xs">{entry.currency}</TableCell>
                <TableCell className="text-xs">
                  {entry.projectId && entry.projectNameCache ? (
                    <Link href={`/projects/${entry.projectId}`} className="hover:underline text-primary">
                      {entry.projectNameCache}
                    </Link>
                  ) : 'N/A'}
                </TableCell>
                <TableCell className="text-xs">
                  {entry.invoiceId && entry.invoiceNumberCache ? (
                     <Link href={`/finances/invoices/${entry.invoiceId}`} className="hover:underline text-primary">
                        {entry.invoiceNumberCache}
                     </Link>
                  ) : 'N/A'}
                </TableCell>
                 <TableCell className="text-xs">{entry.recognitionRuleNameCache || 'Manual Entry'}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-xs truncate" title={entry.notes}>
                  {entry.notes || 'N/A'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

    