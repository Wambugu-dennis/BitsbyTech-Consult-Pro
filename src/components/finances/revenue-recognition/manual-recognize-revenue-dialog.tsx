
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
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatISO } from 'date-fns';
import type { Project, Invoice, RevenueRecognitionRule } from '@/lib/types';

const NONE_VALUE_PLACEHOLDER = "--none--";

const formSchema = z.object({
  dateRecognized: z.date({ required_error: 'Recognition date is required.' }),
  amountRecognized: z.coerce.number().positive('Amount must be positive.'),
  currency: z.string().min(3, 'Currency code is required.').default('USD'),
  projectId: z.string().optional(),
  invoiceId: z.string().optional(),
  recognitionRuleId: z.string().optional().describe("Optional: Link to a rule for reference if manually applying part of it."),
  notes: z.string().max(500, "Notes too long.").optional(),
}).refine(data => data.projectId || data.invoiceId, {
    message: "Either a Project or Invoice must be selected.",
    path: ["projectId"], // Or path: ["invoiceId"], or a general path if preferred
});

export type ManualRecognizeRevenueFormData = Omit<z.infer<typeof formSchema>, 'dateRecognized'> & {
  dateRecognized: string; // Store as ISO string
};

interface ManualRecognizeRevenueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ManualRecognizeRevenueFormData) => void;
  projects: Project[];
  invoices: Invoice[];
  rules: RevenueRecognitionRule[];
}

export default function ManualRecognizeRevenueDialog({
  isOpen,
  onClose,
  onSubmit,
  projects,
  invoices,
  rules
}: ManualRecognizeRevenueDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRecognized: new Date(),
      amountRecognized: 0,
      currency: 'USD',
      notes: '',
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const submissionData: ManualRecognizeRevenueFormData = {
        ...data,
        dateRecognized: formatISO(data.dateRecognized, { representation: 'date' }),
        projectId: data.projectId === NONE_VALUE_PLACEHOLDER ? undefined : data.projectId,
        invoiceId: data.invoiceId === NONE_VALUE_PLACEHOLDER ? undefined : data.invoiceId,
        recognitionRuleId: data.recognitionRuleId === NONE_VALUE_PLACEHOLDER ? undefined : data.recognitionRuleId,
    };
    onSubmit(submissionData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => { if(!openState) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manually Recognize Revenue</DialogTitle>
          <DialogDescription>
            Record a specific amount of revenue as recognized for a project or invoice.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="dateRecognized"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Recognized *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn(!field.value && "text-muted-foreground", "w-full justify-start text-left font-normal")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="amountRecognized" render={({ field }) => ( <FormItem><FormLabel>Amount Recognized *</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} step="0.01" /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="currency" render={({ field }) => ( <FormItem><FormLabel>Currency *</FormLabel><FormControl><Input placeholder="USD" {...field} /></FormControl><FormMessage /></FormItem> )} />
            </div>
             <FormField control={form.control} name="projectId" render={({ field }) => (
                <FormItem>
                    <FormLabel>Related Project (Optional)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === NONE_VALUE_PLACEHOLDER ? undefined : value)} value={field.value || NONE_VALUE_PLACEHOLDER}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value={NONE_VALUE_PLACEHOLDER}>-- None --</SelectItem>
                            {projects.map(p => (<SelectItem key={p.id} value={p.id}>{p.name} ({p.clientNameCache})</SelectItem>))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
             )} />
            <FormField control={form.control} name="invoiceId" render={({ field }) => (
                <FormItem>
                    <FormLabel>Related Invoice (Optional)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === NONE_VALUE_PLACEHOLDER ? undefined : value)} value={field.value || NONE_VALUE_PLACEHOLDER}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select invoice" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value={NONE_VALUE_PLACEHOLDER}>-- None --</SelectItem>
                            {invoices.map(inv => (<SelectItem key={inv.id} value={inv.id}>{inv.id} - {inv.clientNameCache} ({inv.currency} {inv.totalAmount.toFixed(2)})</SelectItem>))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={form.control} name="recognitionRuleId" render={({ field }) => (
                <FormItem>
                    <FormLabel>Recognition Rule Reference (Optional)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === NONE_VALUE_PLACEHOLDER ? undefined : value)} value={field.value || NONE_VALUE_PLACEHOLDER}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select rule if applicable" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value={NONE_VALUE_PLACEHOLDER}>-- None / Manual --</SelectItem>
                            {rules.filter(r => r.isActive).map(rule => (<SelectItem key={rule.id} value={rule.id}>{rule.name}</SelectItem>))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="notes" render={({ field }) => ( <FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Textarea placeholder="Reason for manual recognition, reference details, etc." {...field} rows={3}/></FormControl><FormMessage /></FormItem> )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Recognize Revenue</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


    