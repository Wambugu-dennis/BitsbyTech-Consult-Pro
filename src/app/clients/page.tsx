'use client';

import { useState, useEffect } from 'react';
import ClientTable from "@/components/clients/client-table";
import AddClientDialog from "@/components/clients/add-client-dialog";
import type { Client } from "@/lib/types";

// Mock data - in a real app, this would come from a database/API
const initialClients: Client[] = [
  { id: '1', name: 'Innovatech Ltd.', email: 'contact@innovatech.com', company: 'Innovatech Ltd.', lastContact: '2024-07-15', status: 'Active' },
  { id: '2', name: 'Alpha Solutions', email: 'info@alphasolutions.io', company: 'Alpha Solutions', lastContact: '2024-06-20', status: 'Active' },
  { id: '3', name: 'Beta Corp', email: 'support@betacorp.dev', company: 'Beta Corp', lastContact: '2024-05-10', status: 'Inactive' },
  { id: '4', name: 'Gamma Industries', email: 'sales@gammaind.net', company: 'Gamma Industries', lastContact: '2024-07-01', status: 'Prospect' },
];


export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Simulate fetching data and prevent hydration mismatch
    setClients(initialClients);
    setIsMounted(true);
  }, []);


  const handleAddClient = (newClient: Omit<Client, 'id' | 'lastContact' | 'status'>) => {
    setClients(prevClients => [
      ...prevClients,
      { 
        ...newClient, 
        id: String(Date.now()), // Simple ID generation for mock
        lastContact: new Date().toISOString().split('T')[0],
        status: 'Prospect'
      }
    ]);
  };

  if (!isMounted) {
    // Optional: show a loading state or skeleton
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Repository</h1>
            <p className="text-muted-foreground">
              Manage your client information and communication logs.
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
          <h1 className="text-3xl font-bold tracking-tight">Client Repository</h1>
          <p className="text-muted-foreground">
            Manage your client information and communication logs.
          </p>
        </div>
        <AddClientDialog onAddClient={handleAddClient} />
      </header>
      <ClientTable clients={clients} />
    </div>
  );
}
