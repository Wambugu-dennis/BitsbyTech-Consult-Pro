
'use client';

import Link from 'next/link';
import type { Invoice, InvoiceStatus, AppliedTaxInfo } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Send, Printer, FileText, Trash2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, parseISO } from 'date-fns';

interface InvoiceTableProps {
  invoices: Invoice[];
}

export default function InvoiceTable({ invoices }: InvoiceTableProps) {

  const getStatusBadgeVariant = (status: InvoiceStatus): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Sent': return 'outline';
      case 'Draft': return 'secondary';
      case 'Overdue': return 'destructive';
      case 'Void': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusBadgeClass = (status: InvoiceStatus): string => {
    switch (status) {
      case 'Paid': return 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300';
      case 'Sent': return 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300';
      case 'Draft': return 'bg-gray-500/20 border-gray-500 text-gray-700 dark:text-gray-300';
      case 'Overdue': return 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300';
      case 'Void': return 'bg-yellow-600/20 border-yellow-600 text-yellow-800 dark:text-yellow-400';
      default: return 'border-border';
    }
  };

  const renderAppliedTaxes = (appliedTaxes?: AppliedTaxInfo[]) => {
    if (!appliedTaxes || appliedTaxes.length === 0) return 'N/A';
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs underline decoration-dotted cursor-help">
              {appliedTaxes.length} tax(es)
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">
            <ul className="space-y-1">
              {appliedTaxes.map(tax => (
                <li key={tax.taxRateId}>
                  <strong>{tax.name} ({tax.rateValue}%):</strong> {tax.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };


  return (
    <div className="rounded-lg border overflow-hidden shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Invoice ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
            <TableHead className="text-right">Tax Amount</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead className="text-center w-[100px]">Status</TableHead>
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                No invoices found. Add a new invoice to get started.
              </TableCell>
            </TableRow>
          )}
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-muted/50">
              <TableCell className="font-mono">
                <Link href={`/finances/invoices/${invoice.id}`} className="hover:underline text-primary font-medium">
                  {invoice.id}
                </Link>
              </TableCell>
              <TableCell>{invoice.clientNameCache}</TableCell>
              <TableCell>{invoice.projectNameCache || 'N/A'}</TableCell>
              <TableCell>{format(parseISO(invoice.issueDate), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{format(parseISO(invoice.dueDate), 'MMM dd, yyyy')}</TableCell>
              <TableCell className="text-right">
                {invoice.currency} {invoice.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="text-right">
                {invoice.taxAmount ? `${invoice.currency} ${invoice.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                {invoice.appliedTaxes && invoice.appliedTaxes.length > 0 && (
                  <div className="text-xs text-muted-foreground">{renderAppliedTaxes(invoice.appliedTaxes)}</div>
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {invoice.currency} {invoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getStatusBadgeVariant(invoice.status)} className={cn("capitalize text-xs", getStatusBadgeClass(invoice.status))}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Invoice Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/finances/invoices/${invoice.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => alert(`Editing ${invoice.id}`)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => alert(`Sending ${invoice.id}`)} disabled={invoice.status === 'Sent' || invoice.status === 'Paid'}>
                      <Send className="mr-2 h-4 w-4" /> Mark as Sent
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => alert(`Printing ${invoice.id}`)}>
                      <Printer className="mr-2 h-4 w-4" /> Print / PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => alert(`Record payment for ${invoice.id}`)} disabled={invoice.status === 'Paid'}>
                      <FileText className="mr-2 h-4 w-4" /> Record Payment
                    </DropdownMenuItem>
                     <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => alert(`Voiding ${invoice.id}`)} disabled={invoice.status === 'Void' || invoice.status === 'Paid'}>
                      <Trash2 className="mr-2 h-4 w-4" /> Void Invoice
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

    