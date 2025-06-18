
// src/app/finances/invoices/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Printer, Mail, DollarSign, Briefcase, User, FileText, CalendarDays } from 'lucide-react';
import type { Invoice, InvoiceItem, AppliedTaxInfo } from '@/lib/types';
import { initialInvoices, initialClients, initialProjects } from '@/lib/mockData'; // For fetching invoice data
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// In a real app, this data would be fetched from an API based on the ID
const getInvoiceById = (id: string): Invoice | undefined => {
  return initialInvoices.find(invoice => invoice.id === id);
};

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (id) {
      const foundInvoice = getInvoiceById(id);
      setInvoice(foundInvoice || null);
    }
    setIsMounted(true);
  }, [id]);

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
  
  const handlePrint = () => {
    toast({
      title: "Print/PDF Action",
      description: `Preparing invoice ${invoice?.id} for printing/PDF generation (Simulated).`,
      duration: 3000,
    });
    // In a real app, this would trigger window.print() or a PDF generation service.
  };

  const handleSendEmail = () => {
     toast({
      title: "Send Email Action",
      description: `Preparing to email invoice ${invoice?.id} to ${invoice?.clientNameCache} (Simulated).`,
      duration: 3000,
    });
  };

  if (!isMounted) {
    return ( // Skeleton loader
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <Card><CardHeader><div className="h-10 bg-muted rounded w-full"></div></CardHeader><CardContent><div className="h-60 bg-muted rounded"></div></CardContent></Card>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-10">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold">Invoice Not Found</h1>
        <p className="text-muted-foreground mb-4">The invoice you are looking for does not exist.</p>
        <Button onClick={() => router.push('/finances/invoices')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Button>
      </div>
    );
  }
  
  const client = initialClients.find(c => c.id === invoice.clientId);
  const project = invoice.projectId ? initialProjects.find(p => p.id === invoice.projectId) : undefined;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm" onClick={() => router.push('/finances/invoices')} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Invoice {invoice.id}</h1>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4"/> Print / PDF</Button>
            <Button variant="outline" onClick={handleSendEmail}><Mail className="mr-2 h-4 w-4"/> Email Invoice</Button>
        </div>
      </header>

      <Card className="shadow-lg">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <p className="text-sm text-muted-foreground">Invoice Number</p>
                <p className="text-xl font-semibold text-primary">{invoice.id}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground text-right">Status</p>
                <Badge className={cn("text-lg px-3 py-1 capitalize", getStatusBadgeClass(invoice.status))}>
                    {invoice.status}
                </Badge>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-1 text-muted-foreground flex items-center gap-1.5"><User className="h-4 w-4"/> Bill To:</h3>
              <p className="font-medium text-foreground">{invoice.clientNameCache}</p>
              {client?.address && (
                <>
                  <p>{client.address.street}</p>
                  <p>{client.address.city}, {client.address.state} {client.address.zip}</p>
                  <p>{client.address.country}</p>
                </>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-muted-foreground flex items-center gap-1.5"><CalendarDays className="h-4 w-4"/> Dates:</h3>
              <p><span className="font-medium text-foreground">Issue Date:</span> {format(parseISO(invoice.issueDate), 'PPP')}</p>
              <p><span className="font-medium text-foreground">Due Date:</span> {format(parseISO(invoice.dueDate), 'PPP')}</p>
              {invoice.paymentDate && <p><span className="font-medium text-green-600">Payment Date:</span> {format(parseISO(invoice.paymentDate), 'PPP')}</p>}
            </div>
             {project && (
                <div>
                    <h3 className="font-semibold mb-1 text-muted-foreground flex items-center gap-1.5"><Briefcase className="h-4 w-4"/> Related Project:</h3>
                    <Link href={`/projects/${project.id}`} className="text-primary hover:underline font-medium">
                        {invoice.projectNameCache}
                    </Link>
                </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Invoice Items</h3>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Line Total (Pre-Tax)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{invoice.currency} {item.unitPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    <TableCell className="text-right">{invoice.currency} {item.totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Separator className="my-6"/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                {invoice.notes && (
                    <div>
                        <h4 className="font-semibold mb-1">Notes:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p>
                    </div>
                )}
                 {invoice.paymentDetails && (
                    <div>
                        <h4 className="font-semibold mt-3 mb-1">Payment Details:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.paymentDetails}</p>
                    </div>
                )}
            </div>
            <div className="space-y-2 text-right text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{invoice.currency} {invoice.subTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                {invoice.appliedTaxes.map(tax => (
                     <div key={tax.taxRateId} className="flex justify-between">
                        <span className="text-muted-foreground">{tax.name} ({tax.rateValue}%):</span>
                        <span className="font-medium">{invoice.currency} {tax.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                ))}
                 <div className="flex justify-between font-semibold border-t pt-2 mt-1">
                    <span className="text-muted-foreground">Total Tax:</span>
                    <span>{invoice.currency} {invoice.taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <Separator className="my-2"/>
                <div className="flex justify-between text-xl font-bold text-primary">
                    <span>Total Amount Due:</span>
                    <span>{invoice.currency} {invoice.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 border-t text-xs text-muted-foreground">
            <p>Thank you for your business! If you have any questions regarding this invoice, please contact us at finance@consultvista.example.com.</p>
        </CardFooter>
      </Card>
    </div>
  );
}

