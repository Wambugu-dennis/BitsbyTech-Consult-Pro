
'use client';

import { useState, useEffect } from 'react';
import ClientTable from "@/components/clients/client-table";
import AddClientDialog from "@/components/clients/add-client-dialog";
import type { AddClientFormData } from '@/components/clients/add-client-dialog';
import type { Client, KeyContact } from "@/lib/types";
import { initialClients } from '@/lib/mockData'; 
import { useLocalization } from '@/context/localization-provider'; // Import for translation

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLocalization(); // Use the hook

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
        ...newClientDialogData, 
        id: String(Date.now()), 
        status: 'Prospect', 
        logoUrl: `https://placehold.co/100x100.png?text=${newClientDialogData.companyName.substring(0,2).toUpperCase()}`,
        keyContacts: newClientDialogData.keyContacts.map(kc => ({...kc, id: String(Date.now() + Math.random())})), 
        lastContact: new Date().toISOString().split('T')[0],
        address: {},
        communicationLogs: [],
        engagementDetails: { startDate: new Date().toISOString().split('T')[0]},
        financialSummary: { totalBilled: 0, totalPaid: 0, outstandingAmount: 0, currency: 'USD'},
        linkedProjectIds: [],
        satisfactionScore: 0,
        clientTier: 'Standard',
      }
    ]);
  };

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('Clients')}</h1>
            <p className="text-muted-foreground">
              {t('Manage your client companies and their engagement details.')}
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
          <h1 className="text-3xl font-bold tracking-tight">{t('Clients')}</h1>
          <p className="text-muted-foreground">
            {t('Manage your client companies and their engagement details.')}
          </p>
        </div>
        <AddClientDialog onAddClient={handleAddClient} />
      </header>
      <ClientTable clients={clients} />
    </div>
  );
}

    