
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Client, KeyContact, TaxJurisdiction } from '@/lib/types';
import { initialTaxJurisdictions } from '@/lib/mockData';
import { PlusCircle } from 'lucide-react';

const clientFormSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters.'),
  primaryContactName: z.string().min(2, 'Contact name must be at least 2 characters.'),
  primaryContactEmail: z.string().email('Invalid email address.'),
  primaryContactPhone: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url('Invalid URL. Include http(s)://').optional().or(z.literal('')),
  jurisdictionId: z.string().optional(), // For tax jurisdiction
});

export type AddClientFormData = z.infer<typeof clientFormSchema>;

interface AddClientDialogProps {
  onAddClient: (clientData: Omit<Client, 'id' | 'keyContacts' | 'status' | 'lastContact'> & { keyContacts: Pick<KeyContact, 'name' | 'email' | 'phone' | 'role'>[] }) => void;
}

const NONE_VALUE_PLACEHOLDER = "--none--";

export default function AddClientDialog({ onAddClient }: AddClientDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<AddClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      companyName: '',
      primaryContactName: '',
      primaryContactEmail: '',
      primaryContactPhone: '',
      industry: '',
      website: '',
      jurisdictionId: undefined,
    },
  });

  const handleSubmit = (data: AddClientFormData) => {
    const newClientData = {
      companyName: data.companyName,
      industry: data.industry,
      website: data.website,
      jurisdictionId: data.jurisdictionId,
      keyContacts: [
        {
          name: data.primaryContactName,
          email: data.primaryContactEmail,
          phone: data.primaryContactPhone,
          role: 'Primary Contact',
        }
      ],
    };
    onAddClient(newClientData as any);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add New Client Company</DialogTitle>
          <DialogDescription>
            Enter core details for the new client company. More details can be added later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Innovatech Ltd." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Contact Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sarah Connor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryContactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Contact Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g. s.connor@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryContactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Contact Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g. (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Technology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jurisdictionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Jurisdiction (Optional)</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === NONE_VALUE_PLACEHOLDER ? undefined : value)} 
                    value={field.value || NONE_VALUE_PLACEHOLDER}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client's primary tax jurisdiction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE_PLACEHOLDER}>-- None --</SelectItem>
                      {initialTaxJurisdictions.map(jurisdiction => (
                        <SelectItem key={jurisdiction.id} value={jurisdiction.id}>
                          {jurisdiction.name} {jurisdiction.countryCode ? `(${jurisdiction.countryCode})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save Client</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
