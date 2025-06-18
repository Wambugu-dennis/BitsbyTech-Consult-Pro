
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
import type { TaxType } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, 'Tax type name must be at least 2 characters.'),
  abbreviation: z.string().optional(),
  description: z.string().max(200, 'Description too long.').optional(),
});

export type AddTaxTypeFormData = z.infer<typeof formSchema>;

interface AddTaxTypeDialogProps {
  onAddTaxType: (formData: AddTaxTypeFormData) => void;
}

export default function AddTaxTypeDialog({ onAddTaxType }: AddTaxTypeDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<AddTaxTypeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      abbreviation: '',
      description: '',
    },
  });

  const handleSubmit = (data: AddTaxTypeFormData) => {
    onAddTaxType(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Tax Type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Tax Type</DialogTitle>
          <DialogDescription>
            Define a new category of tax (e.g., VAT, Sales Tax).
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Add Tax Type</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
