
'use client';

import { useState, useEffect } from 'react';
import type { Invoice, InvoiceStatus, Client, Project, AppliedTaxInfo, TaxRate } from "@/lib/types";
import { initialInvoices, initialClients, initialProjects, initialTaxRates } from "@/lib/mockData";
import AddInvoiceDialog, { type AddInvoiceDialogFormData } from "@/components/finances/invoices/add-invoice-dialog";
import InvoiceTable from "@/components/finances/invoices/invoice-table";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle } from 'lucide-react';
import { formatISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isMounted, setIsMounted] = useState(false);
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | undefined>(undefined);
  const { toast } = useToast();

  // Make allTaxRates available from mockData or potentially a context/prop in a real app
  const allTaxRates: TaxRate[] = initialTaxRates; 

  useEffect(() => {
    // Simulate fetching initial data
    // In a real app, you might fetch invoices and tax rates here
    setInvoices(initialInvoices); 
    setIsMounted(true);
  }, []);

  const handleOpenAddDialog = () => {
    setInvoiceToEdit(undefined);
    setShowAddEditDialog(true);
  };

  const handleOpenEditDialog = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setInvoiceToEdit(invoice);
      setShowAddEditDialog(true);
    }
  };

  const handleSaveInvoice = (formData: AddInvoiceDialogFormData, mode: 'add' | 'edit') => {
    if (mode === 'add') {
      const newInvoice: Invoice = {
        id: `INV-${Date.now().toString().slice(-6)}`,
        clientId: formData.clientId,
        clientNameCache: initialClients.find(c => c.id === formData.clientId)?.companyName || 'N/A',
        projectId: formData.projectId,
        projectNameCache: formData.projectId ? initialProjects.find(p => p.id === formData.projectId)?.name : undefined,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        items: formData.items, // items from form now include calculated tax details
        subTotal: formData.subTotal,
        taxAmount: formData.taxAmount,
        appliedTaxes: formData.appliedTaxes,
        totalAmount: formData.totalAmount,
        status: formData.status as InvoiceStatus,
        currency: formData.currency,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setInvoices(prevInvoices => [newInvoice, ...prevInvoices]);
      toast({ title: "Invoice Created", description: `Invoice ${newInvoice.id} has been successfully created.` });
    } else if (mode === 'edit' && invoiceToEdit) {
      setInvoices(prevInvoices =>
        prevInvoices.map(inv =>
          inv.id === invoiceToEdit.id
            ? {
                ...inv,
                clientId: formData.clientId,
                clientNameCache: initialClients.find(c => c.id === formData.clientId)?.companyName || 'N/A',
                projectId: formData.projectId,
                projectNameCache: formData.projectId ? initialProjects.find(p => p.id === formData.projectId)?.name : undefined,
                issueDate: formData.issueDate,
                dueDate: formData.dueDate,
                items: formData.items, // Use processed items
                subTotal: formData.subTotal,
                taxAmount: formData.taxAmount,
                appliedTaxes: formData.appliedTaxes,
                totalAmount: formData.totalAmount,
                status: formData.status as InvoiceStatus,
                currency: formData.currency,
                notes: formData.notes,
                updatedAt: new Date().toISOString(),
              }
            : inv
        )
      );
      toast({ title: "Invoice Updated", description: `Invoice ${invoiceToEdit.id} has been successfully updated.` });
    }
    setShowAddEditDialog(false);
    setInvoiceToEdit(undefined);
  };
  
  const handleUpdateInvoiceStatus = (invoiceId: string, newStatus: InvoiceStatus, paymentDate?: string) => {
    setInvoices(prevInvoices =>
      prevInvoices.map(inv =>
        inv.id === invoiceId
          ? { ...inv, status: newStatus, paymentDate: paymentDate || inv.paymentDate, updatedAt: new Date().toISOString() }
          : inv
      )
    );
    toast({ title: "Invoice Status Updated", description: `Invoice ${invoiceId} status changed to ${newStatus}.` });
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(prevInvoices => prevInvoices.filter(inv => inv.id !== invoiceId));
    toast({ title: "Invoice Deleted", description: `Invoice ${invoiceId} has been deleted (simulated).`, variant: "destructive" });
  };


  if (!isMounted) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
              <p className="text-muted-foreground">Manage all client invoices.</p>
            </div>
          </div>
        </header>
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded-md w-1/4 mb-4"></div>
          <div className="h-64 bg-muted rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                <p className="text-muted-foreground">
                Create, track, and manage all client invoices. Taxes are applied per line item.
                </p>
            </div>
        </div>
        <Button onClick={handleOpenAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Invoice
        </Button>
      </header>
      <InvoiceTable 
        invoices={invoices} 
        onEditInvoice={handleOpenEditDialog}
        onUpdateStatus={handleUpdateInvoiceStatus}
        onDeleteInvoice={handleDeleteInvoice}
      />
      {showAddEditDialog && (
        <AddInvoiceDialog
          isOpen={showAddEditDialog}
          onClose={() => { setShowAddEditDialog(false); setInvoiceToEdit(undefined); }}
          onSubmit={handleSaveInvoice}
          clients={initialClients}
          projects={initialProjects}
          invoiceToEdit={invoiceToEdit}
          mode={invoiceToEdit ? 'edit' : 'add'}
          allTaxRates={allTaxRates} // Pass allTaxRates
        />
      )}
    </div>
  );
}

    