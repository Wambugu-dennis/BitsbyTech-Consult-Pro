
'use client';

import { useState, useEffect } from 'react';
import ClientTable from "@/components/clients/client-table";
import AddClientDialog from "@/components/clients/add-client-dialog";
import type { AddClientFormData } from '@/components/clients/add-client-dialog';
import type { Client, KeyContact } from "@/lib/types";
import { initialClients } from '@/lib/mockData'; 

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setClients(initialClients);
    setIsMounted(true);
  }, []);

  const handleAddClient = (
    newClientDialogData: Omit<Client, 'id' | 'keyContacts' | 'status' | 'lastContact' | 'communicationLogs' | 'linkedProjectIds' | 'financialSummary' | 'engagementDetails' | 'address' | 'clientTier' | 'satisfactionScore' | 'logoUrl' | 'notes'> & { keyContacts: Pick<KeyContact, 'name' | 'email' | 'phone'| 'role'>[] }
  ) => {
    setClients(prevClients => [
      ...prevClients,
      { 
        ...newClientDialogData, // Spread data from dialog (companyName, industry, website)
        id: String(Date.now()), // Simple ID generation
        status: 'Prospect', // Default status for new clients
        logoUrl: `https://placehold.co/100x100.png?text=${newClientDialogData.companyName.substring(0,2).toUpperCase()}`,
        keyContacts: newClientDialogData.keyContacts.map(kc => ({...kc, id: String(Date.now() + Math.random())})), // Add IDs to keyContacts
        lastContact: new Date().toISOString().split('T')[0],
        // Initialize other complex fields with defaults or empty states
        address: {},
        communicationLogs: [],
        engagementDetails: { startDate: new Date().toISOString().split('T')[0]},
        financialSummary: { totalBilled: 0, totalPaid: 0, outstandingAmount: 0, currency: 'USD'},
        linkedProjectIds: [],
        satisfactionScore: 0, // Neutral initial score
        clientTier: 'Standard',
      }
    ]);
  };

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground">
              Manage your client companies and their engagement details.
            </p>
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client companies and their engagement details.
          </p>
        </div>
        <AddClientDialog onAddClient={handleAddClient} />
      </header>
      <ClientTable clients={clients} />
    </div>
  );
}
