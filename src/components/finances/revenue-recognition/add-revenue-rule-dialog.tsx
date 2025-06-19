
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { RevenueRecognitionRule, RevenueRecognitionMethod } from '@/lib/types';
import { revenueRecognitionMethods } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(3, 'Rule name must be at least 3 characters.'),
  description: z.string().max(500, 'Description too long.').optional(),
  method: z.enum(revenueRecognitionMethods as [RevenueRecognitionMethod, ...RevenueRecognitionMethod[]]),
  criteriaDescription: z.string().optional().describe("Describe how this rule is applied, e.g., 'Monthly for 12 months', 'Upon completion of Milestones A (30%), B (70%)'"),
  isActive: z.boolean().default(true),
});

export type AddRevenueRuleFormData = z.infer<typeof formSchema>;

interface AddRevenueRuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: AddRevenueRuleFormData, mode: 'add' | 'edit') => void;
  ruleToEdit?: RevenueRecognitionRule;
  mode: 'add' | 'edit';
}

export default function AddRevenueRuleDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  ruleToEdit, 
  mode 
}: AddRevenueRuleDialogProps) {
  const form = useForm<AddRevenueRuleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      method: undefined,
      criteriaDescription: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (mode === 'edit' && ruleToEdit) {
      form.reset({
        name: ruleToEdit.name,
        description: ruleToEdit.description || '',
        method: ruleToEdit.method,
        criteriaDescription: ruleToEdit.criteriaDescription || '',
        isActive: ruleToEdit.isActive,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        method: undefined,
        criteriaDescription: '',
        isActive: true,
      });
    }
  }, [isOpen, mode, ruleToEdit, form]);

  const handleSubmit = (data: AddRevenueRuleFormData) => {
    onSave(data, mode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => { if (!openState) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Revenue Recognition Rule' : `Edit Rule: ${ruleToEdit?.name}`}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Define a new rule for how revenue is recognized.' : 'Update the details for this rule.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name *</FormLabel>
                  <FormControl><Input placeholder="e.g., Standard Milestone Billing" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recognition Method *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select recognition method" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {revenueRecognitionMethods.map(method => (
                        <SelectItem key={method} value={method}>{method.replace(/([A-Z])/g, ' $1').trim()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="criteriaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criteria Description (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="Explain criteria, e.g., specific milestones, PoC % triggers, or subscription schedule details." {...field} rows={3} /></FormControl>
                  <FormDescription>This text helps understand how the rule applies. Actual automation based on complex criteria is a future enhancement.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>General Description (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="Further notes or context for this rule." {...field} rows={2} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Active Rule</FormLabel>
                            <FormDescription>Inactive rules cannot be applied to new projects/invoices.</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{mode === 'add' ? 'Add Rule' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    