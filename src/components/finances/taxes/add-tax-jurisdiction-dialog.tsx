
'use client';

import { useState, useEffect } from 'react';
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
  // DialogTrigger, // Trigger is now managed by parent page
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { TaxJurisdiction } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, 'Jurisdiction name must be at least 2 characters.'),
  countryCode: z.string().max(3, 'Country code should be 2-3 chars (e.g., US, KEN).').optional(),
  description: z.string().max(200, 'Description too long.').optional(),
});

export type AddTaxJurisdictionFormData = z.infer<typeof formSchema>;

interface AddTaxJurisdictionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: AddTaxJurisdictionFormData, mode: 'add' | 'edit') => void;
  jurisdictionToEdit?: TaxJurisdiction;
  mode: 'add' | 'edit';
}

export default function AddTaxJurisdictionDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  jurisdictionToEdit, 
  mode 
}: AddTaxJurisdictionDialogProps) {
  const form = useForm<AddTaxJurisdictionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      countryCode: '',
      description: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && jurisdictionToEdit) {
      form.reset({
        name: jurisdictionToEdit.name,
        countryCode: jurisdictionToEdit.countryCode || '',
        description: jurisdictionToEdit.description || '',
      });
    } else {
      form.reset({ name: '', countryCode: '', description: '' });
    }
  }, [isOpen, mode, jurisdictionToEdit, form]);

  const handleSubmit = (data: AddTaxJurisdictionFormData) => {
    onSave(data, mode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Tax Jurisdiction' : `Edit Tax Jurisdiction: ${jurisdictionToEdit?.name}`}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Define a new country or region for tax purposes.' : 'Update the details for this tax jurisdiction.'}
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
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{mode === 'add' ? 'Add Jurisdiction' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    