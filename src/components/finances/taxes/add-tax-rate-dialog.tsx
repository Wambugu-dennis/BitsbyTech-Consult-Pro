
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatISO, parseISO } from 'date-fns';
import type { TaxJurisdiction, TaxType, TaxRate, TaxApplicableEntity } from '@/lib/types';
import { taxApplicableEntities } from '@/lib/types';


const formSchema = z.object({
  jurisdictionId: z.string().min(1, 'Jurisdiction is required.'),
  taxTypeId: z.string().min(1, 'Tax type is required.'),
  rate: z.coerce.number().min(0, 'Rate must be non-negative.').max(100, 'Rate cannot exceed 100%.'),
  description: z.string().min(2, 'Description is required.'),
  startDate: z.date({ required_error: 'Start date is required.' }),
  endDate: z.date().optional(),
  isCompound: z.boolean().default(false),
  applicableTo: z.array(z.string()).min(1, "At least one applicability must be selected."),
  notes: z.string().optional(),
}).refine(data => data.endDate ? data.endDate >= data.startDate : true, {
  message: "End date cannot be before start date.",
  path: ["endDate"],
});

export type AddTaxRateFormData = Omit<z.infer<typeof formSchema>, 'startDate' | 'endDate' | 'applicableTo'> & {
  startDate: string;
  endDate?: string;
  applicableTo: TaxApplicableEntity[];
  isCompound: boolean;
};

interface AddTaxRateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: AddTaxRateFormData, mode: 'add' | 'edit') => void;
  jurisdictions: TaxJurisdiction[];
  taxTypes: TaxType[];
  taxRateToEdit?: TaxRate;
  mode: 'add' | 'edit';
}

export default function AddTaxRateDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  jurisdictions, 
  taxTypes, 
  taxRateToEdit, 
  mode 
}: AddTaxRateDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jurisdictionId: '',
      taxTypeId: '',
      rate: 0,
      description: '',
      startDate: new Date(),
      endDate: undefined,
      isCompound: false,
      applicableTo: [],
      notes: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && taxRateToEdit) {
      form.reset({
        jurisdictionId: taxRateToEdit.jurisdictionId,
        taxTypeId: taxRateToEdit.taxTypeId,
        rate: taxRateToEdit.rate,
        description: taxRateToEdit.description,
        startDate: parseISO(taxRateToEdit.startDate),
        endDate: taxRateToEdit.endDate ? parseISO(taxRateToEdit.endDate) : undefined,
        isCompound: taxRateToEdit.isCompound || false,
        applicableTo: taxRateToEdit.applicableTo || [],
        notes: taxRateToEdit.notes || '',
      });
    } else {
      form.reset({
        jurisdictionId: '', taxTypeId: '', rate: 0, description: '', startDate: new Date(),
        endDate: undefined, isCompound: false, applicableTo: [], notes: ''
      });
    }
  }, [isOpen, mode, taxRateToEdit, form]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const formData: AddTaxRateFormData = {
      ...data,
      startDate: formatISO(data.startDate, { representation: 'date' }),
      endDate: data.endDate ? formatISO(data.endDate, { representation: 'date' }) : undefined,
      applicableTo: data.applicableTo as TaxApplicableEntity[],
      isCompound: data.isCompound,
    };
    onSave(formData, mode);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) onClose(); }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Tax Rate' : `Edit Tax Rate: ${taxRateToEdit?.description}`}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Define a specific tax rate for a jurisdiction and tax type.' : 'Update the details for this tax rate.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jurisdictionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdiction *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select jurisdiction" /></SelectTrigger></FormControl>
                      <SelectContent>{jurisdictions.map(j => <SelectItem key={j.id} value={j.id}>{j.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select tax type" /></SelectTrigger></FormControl>
                      <SelectContent>{taxTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name} ({t.abbreviation || t.name})</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate Description *</FormLabel>
                  <FormControl><Input placeholder="e.g., Standard VAT for services" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate (%) *</FormLabel>
                  <FormControl><Input type="number" placeholder="e.g., 16 for 16%" {...field} step="0.01" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>Start Date *</FormLabel>
                    <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button></FormControl></PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                    </Popover><FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>End Date (Optional)</FormLabel>
                    <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                          {field.value ? format(field.value, 'PPP') : <span>Pick an end date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button></FormControl></PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange}
                                  disabled={(date) => form.getValues("startDate") ? date < form.getValues("startDate") : false}
                        /></PopoverContent>
                    </Popover><FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="applicableTo"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel className="text-base">Applicable To *</FormLabel>
                    <FormDescription>Select where this tax rate can be applied.</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {taxApplicableEntities.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="applicableTo"
                      render={({ field }) => {
                        return (
                          <FormItem key={item} className="flex flex-row items-start space-x-2 space-y-0 rounded-md border p-2.5">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (value) => value !== item
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">{item.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="isCompound"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Compound Tax</FormLabel>
                            <FormDescription>Is this tax calculated on amounts that already include other taxes?</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="Additional notes about this tax rate..." {...field} rows={2}/></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{mode === 'add' ? 'Add Tax Rate' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    