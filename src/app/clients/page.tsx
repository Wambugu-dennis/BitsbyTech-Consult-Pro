
'use client';

import { useState, useEffect } from 'react';
import ClientTable from "@/components/clients/client-table";
import AddClientDialog from "@/components/clients/add-client-dialog";
import type { Client, KeyContact } from "@/lib/types";
import { initialClients } from '@/lib/mockData'; 
import { useLocalization } from '@/context/localization-provider';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLocalization();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | undefined>(undefined);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    setClients(initialClients);
    setIsMounted(true);
  }, []);

  const handleOpenAddDialog = () => {
    setClientToEdit(undefined);
    setDialogMode('add');
    setIsDialogOpen(true);
  };
  
  const handleOpenEditDialog = (client: Client) => {
    setClientToEdit(client);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleSaveClient = (clientData: Partial<Client>, id?: string) => {
    if (dialogMode === 'add') {
      const newClient: Client = {
        id: String(Date.now()),
        status: 'Prospect',
        logoUrl: `https://placehold.co/100x100.png?text=${clientData.companyName?.substring(0,2).toUpperCase()}`,
        lastContact: new Date().toISOString().split('T')[0],
        address: clientData.address || {},
        communicationLogs: [],
        engagementDetails: { startDate: new Date().toISOString().split('T')[0]},
        financialSummary: { totalBilled: 0, totalPaid: 0, outstandingAmount: 0, currency: 'USD'},
        linkedProjectIds: [],
        satisfactionScore: 0,
        ...clientData,
        keyContacts: clientData.keyContacts || [], // Ensure keyContacts is not undefined
      } as Client;
      setClients(prev => [newClient, ...prev]);
      toast({ title: t("Client Added"), description: t("{clientName} has been successfully added.", { clientName: newClient.companyName }) });
    } else if (dialogMode === 'edit' && id) {
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...clientData, keyContacts: clientData.keyContacts || c.keyContacts } : c));
      toast({ title: t("Client Updated"), description: t("{clientName}'s details have been successfully updated.", { clientName: clientData.companyName || '' }) });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    toast({ title: t("Client Deleted"), description: t("The client has been deleted."), variant: "destructive" });
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
        <Button onClick={handleOpenAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('Add Client')}
        </Button>
      </header>
      <ClientTable 
        clients={clients} 
        onEditClient={handleOpenEditDialog}
        onDeleteClient={handleDeleteClient}
      />
      
      {isDialogOpen && (
        <AddClientDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveClient}
          mode={dialogMode}
          clientToEdit={clientToEdit}
        />
      )}
    </div>
  );
}
