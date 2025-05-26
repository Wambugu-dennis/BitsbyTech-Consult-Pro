
'use client';

import { useState, useEffect } from 'react';
import type { Invoice } from "@/lib/types";
import { initialInvoices, initialClients, initialProjects } from "@/lib/mockData";
import AddInvoiceDialog, { type AddInvoiceFormData } from "@/components/finances/invoices/add-invoice-dialog";
import InvoiceTable from "@/components/finances/invoices/invoice-table";
import { FileText } from 'lucide-react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setInvoices(initialInvoices);
    setIsMounted(true);
  }, []);

  const handleAddInvoice = (formData: AddInvoiceFormData) => {
    const client = initialClients.find(c => c.id === formData.clientId);
    const project = formData.projectId ? initialProjects.find(p => p.id === formData.projectId) : undefined;

    const newInvoice: Invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`, // Simple ID
      clientId: formData.clientId,
      clientNameCache: client?.companyName || 'N/A',
      projectId: formData.projectId,
      projectNameCache: project?.name,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      items: [{ // Simplified: one item based on total amount for now
        id: `item-${Date.now()}`,
        description: `Consulting Services for ${project?.name || client?.companyName || 'Selected Client'}`,
        quantity: 1,
        unitPrice: formData.totalAmount,
        totalPrice: formData.totalAmount,
      }],
      subTotal: formData.totalAmount, // Assuming no tax for this simplified version
      totalAmount: formData.totalAmount,
      status: formData.status,
      currency: formData.currency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoices(prevInvoices => [...prevInvoices, newInvoice]);
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
                Create, track, and manage all client invoices.
                </p>
            </div>
        </div>
        <AddInvoiceDialog 
          onAddInvoice={handleAddInvoice} 
          clients={initialClients} 
          projects={initialProjects} 
        />
      </header>
      <InvoiceTable invoices={invoices} />
    </div>
  );
}
