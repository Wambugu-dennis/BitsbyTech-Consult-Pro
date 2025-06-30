
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Client, KeyContact, ClientCreditRating } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

const clientFormSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters.'),
  industry: z.string().optional(),
  website: z.string().url('Invalid URL. Include http(s)://').optional().or(z.literal('')),
  
  // Primary Contact
  primaryContactName: z.string().min(2, 'Contact name must be at least 2 characters.'),
  primaryContactEmail: z.string().email('Invalid email address.'),
  primaryContactPhone: z.string().optional(),
  primaryContactRole: z.string().optional(),

  // Status & Tier
  status: z.enum(['Active', 'Inactive', 'Prospect']),
  clientTier: z.enum(['Strategic', 'Key', 'Standard', 'Other']),
  creditRating: z.enum(['Excellent', 'Good', 'Fair', 'Poor']),

  // Address
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),

  // Notes
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters.").optional(),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface AddClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Partial<Client>, id?: string) => void;
  clientToEdit?: Client;
  mode: 'add' | 'edit';
}

export default function AddClientDialog({ isOpen, onClose, onSave, clientToEdit, mode }: AddClientDialogProps) {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
  });

  useEffect(() => {
    if (mode === 'edit' && clientToEdit) {
      const primaryContact = clientToEdit.keyContacts?.[0];
      form.reset({
        companyName: clientToEdit.companyName,
        industry: clientToEdit.industry || '',
        website: clientToEdit.website || '',
        primaryContactName: primaryContact?.name || '',
        primaryContactEmail: primaryContact?.email || '',
        primaryContactPhone: primaryContact?.phone || '',
        primaryContactRole: primaryContact?.role || '',
        status: clientToEdit.status,
        clientTier: clientToEdit.clientTier || 'Standard',
        creditRating: clientToEdit.creditRating || 'Good',
        street: clientToEdit.address?.street || '',
        city: clientToEdit.address?.city || '',
        state: clientToEdit.address?.state || '',
        zip: clientToEdit.address?.zip || '',
        country: clientToEdit.address?.country || '',
        notes: clientToEdit.notes || '',
      });
    } else {
      form.reset({
        companyName: '', industry: '', website: '',
        primaryContactName: '', primaryContactEmail: '', primaryContactPhone: '', primaryContactRole: '',
        status: 'Prospect', clientTier: 'Standard', creditRating: 'Good',
        street: '', city: '', state: '', zip: '', country: '',
        notes: '',
      });
    }
  }, [isOpen, mode, clientToEdit, form]);

  const handleSubmit = (data: ClientFormData) => {
    const primaryContact: KeyContact = {
      id: clientToEdit?.keyContacts?.[0]?.id || `kc-${Date.now()}`,
      name: data.primaryContactName,
      email: data.primaryContactEmail,
      phone: data.primaryContactPhone,
      role: data.primaryContactRole || 'Primary Contact',
    };

    const submissionData: Partial<Client> = {
      companyName: data.companyName,
      industry: data.industry,
      website: data.website,
      keyContacts: [primaryContact],
      status: data.status,
      clientTier: data.clientTier,
      creditRating: data.creditRating,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
      },
      notes: data.notes,
    };

    onSave(submissionData, clientToEdit?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Client' : `Edit Client: ${clientToEdit?.companyName}`}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Enter core details for the new client. More details can be added later.' : 'Update the client\'s information.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-3">
            <h4 className="text-md font-semibold text-primary border-b pb-1">Company Information</h4>
            <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Company Name *</FormLabel><FormControl><Input placeholder="e.g. Innovatech Ltd." {...field} /></FormControl><FormMessage /></FormItem>)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="industry" render={({ field }) => (<FormItem><FormLabel>Industry</FormLabel><FormControl><Input placeholder="e.g. Technology" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input placeholder="e.g. https://example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <h4 className="text-md font-semibold text-primary border-b pb-1 pt-4">Primary Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="primaryContactName" render={({ field }) => (<FormItem><FormLabel>Contact Name *</FormLabel><FormControl><Input placeholder="e.g. Sarah Connor" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="primaryContactRole" render={({ field }) => (<FormItem><FormLabel>Contact Role</FormLabel><FormControl><Input placeholder="e.g. CEO" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="primaryContactEmail" render={({ field }) => (<FormItem><FormLabel>Contact Email *</FormLabel><FormControl><Input type="email" placeholder="e.g. s.connor@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="primaryContactPhone" render={({ field }) => (<FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input type="tel" placeholder="e.g. (555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            
            <h4 className="text-md font-semibold text-primary border-b pb-1 pt-4">Client Status &amp; Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="status" render={({ field }) => ( <FormItem><FormLabel>Status *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem><SelectItem value="Prospect">Prospect</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                <FormField control={form.control} name="clientTier" render={({ field }) => ( <FormItem><FormLabel>Tier *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Strategic">Strategic</SelectItem><SelectItem value="Key">Key</SelectItem><SelectItem value="Standard">Standard</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                <FormField control={form.control} name="creditRating" render={({ field }) => ( <FormItem><FormLabel>Internal Credit Rating *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Excellent">Excellent</SelectItem><SelectItem value="Good">Good</SelectItem><SelectItem value="Fair">Fair</SelectItem><SelectItem value="Poor">Poor</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
            </div>

            <h4 className="text-md font-semibold text-primary border-b pb-1 pt-4">Address Information</h4>
             <FormField control={form.control} name="street" render={({ field }) => (<FormItem><FormLabel>Street</FormLabel><FormControl><Input placeholder="e.g. 123 Tech Park" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State/Province</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="zip" render={({ field }) => (<FormItem><FormLabel>Zip/Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <h4 className="text-md font-semibold text-primary border-b pb-1 pt-4">Notes</h4>
             <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Internal Notes</FormLabel><FormControl><Textarea placeholder="Add any relevant notes about the client..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{mode === 'add' ? 'Add Client' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
