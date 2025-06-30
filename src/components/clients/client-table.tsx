
'use client';

import Link from 'next/link';
import type { Client } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Edit2, Trash2, Eye, Building } from "lucide-react";
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

interface ClientTableProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

export default function ClientTable({ clients, onEditClient, onDeleteClient }: ClientTableProps) {
  const getStatusVariant = (status?: Client['status']): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Prospect': return 'outline';
      default: return 'secondary';
    }
  };
  
  const getStatusColor = (status?: Client['status']): string => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-700 border-green-500 dark:bg-green-500/30 dark:text-green-300 dark:border-green-500/70';
      case 'Inactive': return 'bg-gray-500/20 text-gray-700 border-gray-500 dark:bg-gray-500/30 dark:text-gray-300 dark:border-gray-500/70';
      case 'Prospect': return 'bg-blue-500/20 text-blue-700 border-blue-500 dark:bg-blue-500/30 dark:text-blue-300 dark:border-blue-500/70';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Primary Contact</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No clients found. Add a new client to get started.
              </TableCell>
            </TableRow>
          )}
          {clients.map((client) => {
            const primaryContact = client.keyContacts && client.keyContacts.length > 0 ? client.keyContacts[0] : null;
            return (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      {client.logoUrl ? (
                        <AvatarImage src={client.logoUrl} alt={client.companyName} data-ai-hint="company logo" />
                      ) : (
                        <Building className="h-5 w-5 text-muted-foreground" />
                      )}
                      <AvatarFallback>{client.companyName.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Link href={`/clients/${client.id}`} className="hover:underline text-primary">
                      {client.companyName}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  {primaryContact ? (
                    <div>
                      <p className="font-medium">{primaryContact.name}</p>
                      <p className="text-xs text-muted-foreground">{primaryContact.email}</p>
                    </div>
                  ) : 'N/A'}
                </TableCell>
                <TableCell>{client.industry || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(client.status)} className={cn(getStatusColor(client.status))}>
                    {client.status || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Client Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/clients/${client.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditClient(client)}>
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Client
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                             <Trash2 className="mr-2 h-4 w-4" /> Delete Client
                           </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the client
                                "{client.companyName}".
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteClient(client.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
