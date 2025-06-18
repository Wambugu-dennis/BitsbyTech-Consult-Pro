
'use client';

import Link from 'next/link';
import type { Invoice, InvoiceStatus, AppliedTaxInfo } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Send, Printer, FileText, Trash2, Info, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { format, parseISO, formatISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';


interface InvoiceTableProps {
  invoices: Invoice[];
  onEditInvoice: (invoiceId: string) => void;
  onUpdateStatus: (invoiceId: string, newStatus: InvoiceStatus, paymentDate?: string) => void;
  onDeleteInvoice: (invoiceId: string) => void;
}

export default function InvoiceTable({ invoices, onEditInvoice, onUpdateStatus, onDeleteInvoice }: InvoiceTableProps) {
  const { toast } = useToast();

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
    if (!appliedTaxes || appliedTaxes.length === 0) return null; // Return null instead of N/A for cleaner UI
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs underline decoration-dotted cursor-help ml-1">
              ({appliedTaxes.length} tax{appliedTaxes.length > 1 ? 'es' : ''})
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs bg-popover text-popover-foreground p-2 rounded-md shadow-lg border">
            <p className="font-semibold mb-1">Applied Taxes:</p>
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

  const handlePrint = (invoiceId: string) => {
    toast({
      title: "Print/PDF Action",
      description: `Printing/Generating PDF for invoice ${invoiceId} (Simulated). This feature is under development.`,
      duration: 3000,
    });
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
                {invoice.currency} {(invoice.taxAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {renderAppliedTaxes(invoice.appliedTaxes)}
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
                    <DropdownMenuItem onClick={() => onEditInvoice(invoice.id)} disabled={invoice.status === 'Paid' || invoice.status === 'Void'}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus(invoice.id, 'Sent')} disabled={invoice.status === 'Sent' || invoice.status === 'Paid' || invoice.status === 'Void'}>
                      <Send className="mr-2 h-4 w-4" /> Mark as Sent
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handlePrint(invoice.id)}>
                      <Printer className="mr-2 h-4 w-4" /> Print / PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          onSelect={(e) => e.preventDefault()} 
                          disabled={invoice.status === 'Paid' || invoice.status === 'Void'}
                          className={cn((invoice.status === 'Paid' || invoice.status === 'Void') && "text-muted-foreground")}
                        >
                          <FileText className="mr-2 h-4 w-4" /> Record Payment
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Record Payment for Invoice {invoice.id}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will mark the invoice as 'Paid' and set the payment date to today. This action can be reveresed if needed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onUpdateStatus(invoice.id, 'Paid', formatISO(new Date(), { representation: 'date' }))}>
                            Confirm Payment
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                     <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <DropdownMenuItem 
                            onSelect={(e) => e.preventDefault()} 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10" 
                            disabled={invoice.status === 'Void' || invoice.status === 'Paid'}>
                          <AlertCircle className="mr-2 h-4 w-4" /> Void Invoice
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Void Invoice {invoice.id}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will mark the invoice as 'Void'. This is typically used for invoices issued in error and should not be paid. This action cannot be easily undone for accounting purposes.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => onUpdateStatus(invoice.id, 'Void')}>
                            Confirm Void
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                     <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => onDeleteInvoice(invoice.id)} disabled={invoice.status === 'Paid'}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Invoice
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
