
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
  // DialogTrigger, // Trigger managed by parent
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { TaxType } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, 'Tax type name must be at least 2 characters.'),
  abbreviation: z.string().max(10, 'Abbreviation too long.').optional(),
  description: z.string().max(200, 'Description too long.').optional(),
});

export type AddTaxTypeFormData = z.infer<typeof formSchema>;

interface AddTaxTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: AddTaxTypeFormData, mode: 'add' | 'edit') => void;
  taxTypeToEdit?: TaxType;
  mode: 'add' | 'edit';
}

export default function AddTaxTypeDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  taxTypeToEdit, 
  mode 
}: AddTaxTypeDialogProps) {
  const form = useForm<AddTaxTypeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      abbreviation: '',
      description: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && taxTypeToEdit) {
      form.reset({
        name: taxTypeToEdit.name,
        abbreviation: taxTypeToEdit.abbreviation || '',
        description: taxTypeToEdit.description || '',
      });
    } else {
      form.reset({ name: '', abbreviation: '', description: '' });
    }
  }, [isOpen, mode, taxTypeToEdit, form]);

  const handleSubmit = (data: AddTaxTypeFormData) => {
    onSave(data, mode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Tax Type' : `Edit Tax Type: ${taxTypeToEdit?.name}`}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Define a new category of tax (e.g., VAT, Sales Tax).' : 'Update the details for this tax type.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Type Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Value Added Tax" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abbreviation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abbreviation (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., VAT, WHT" {...field} />
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
                    <Textarea placeholder="Brief explanation of this tax type..." {...field} rows={3}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{mode === 'add' ? 'Add Tax Type' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    