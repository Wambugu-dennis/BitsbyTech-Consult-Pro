
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import type { TaxJurisdiction } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, 'Jurisdiction name must be at least 2 characters.'),
  countryCode: z.string().optional(),
  description: z.string().max(200, 'Description too long.').optional(),
});

export type AddTaxJurisdictionFormData = z.infer<typeof formSchema>;

interface AddTaxJurisdictionDialogProps {
  onAddJurisdiction: (formData: AddTaxJurisdictionFormData) => void;
}

export default function AddTaxJurisdictionDialog({ onAddJurisdiction }: AddTaxJurisdictionDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<AddTaxJurisdictionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      countryCode: '',
      description: '',
    },
  });

  const handleSubmit = (data: AddTaxJurisdictionFormData) => {
    onAddJurisdiction(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Jurisdiction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Tax Jurisdiction</DialogTitle>
          <DialogDescription>
            Define a new country or region for tax purposes.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jurisdiction Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Kenya, USA - California" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Code (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., KE, US (ISO 3166-1 alpha-2)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief notes about this jurisdiction..." {...field} rows={3}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Add Jurisdiction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
