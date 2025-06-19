
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, PlusCircle, Trash2, AlertTriangle, CircleDollarSign } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';
import { format, formatISO, parseISO, addDays } from 'date-fns';
import type { Client, Project, InvoiceStatus, TaxRate, AppliedTaxInfo, Invoice, InvoiceItem } from '@/lib/types';
import { initialTaxRates } from '@/lib/mockData'; // For tax rate selection
import { useToast } from '@/hooks/use-toast';

const invoiceItemSchema = z.object({
  id: z.string().optional(), // For existing items during edit
  description: z.string().min(1, 'Description is required.'),
  quantity: z.coerce.number().min(0.01, 'Quantity must be positive.'),
  unitPrice: z.coerce.number().min(0, 'Unit price must be non-negative.'),
  applicableTaxRateIds: z.array(z.string()).optional(),
});

const addInvoiceFormSchema = z.object({
  clientId: z.string().min(1, 'Client is required.'),
  projectId: z.string().optional(),
  issueDate: z.date({ required_error: 'Issue date is required.' }),
  dueDate: z.date({ required_error: 'Due date is required.' }),
  currency: z.string().min(3, 'Currency code is required (e.g., USD).').default('USD'),
  status: z.enum(['Draft', 'Sent', 'Paid', 'Overdue', 'Void']),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one line item is required.'),
}).refine(data => data.dueDate >= data.issueDate, {
  message: "Due date cannot be before issue date.",
  path: ["dueDate"],
});

export type AddInvoiceDialogFormData = Omit<z.infer<typeof addInvoiceFormSchema>, 'issueDate' | 'dueDate' | 'items'> & {
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[]; // This will carry the calculated tax details per item
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  appliedTaxes: AppliedTaxInfo[]; // Overall unique taxes applied
};

interface AddInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: AddInvoiceDialogFormData, mode: 'add' | 'edit') => void;
  clients: Client[];
  projects: Project[];
  invoiceToEdit?: Invoice;
  mode: 'add' | 'edit';
  allTaxRates: TaxRate[]; // Pass all configured tax rates
}

export default function AddInvoiceDialog({
  isOpen,
  onClose,
  onSubmit,
  clients,
  projects,
  invoiceToEdit,
  mode,
  allTaxRates,
}: AddInvoiceDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof addInvoiceFormSchema>>({
    resolver: zodResolver(addInvoiceFormSchema),
    defaultValues: {
      clientId: '',
      projectId: '',
      currency: 'USD',
      status: 'Draft',
      notes: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, applicableTaxRateIds: [] }],
      issueDate: new Date(),
      dueDate: addDays(new Date(), 30),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const selectedClientId = form.watch("clientId");
  const selectedProjectId = form.watch("projectId");
  const issueDate = form.watch("issueDate");
  const formItems = form.watch("items");

  // Calculate totals and taxes
  const { subTotal, totalTaxAmount, totalAmount, uniqueAppliedTaxes } = useMemo(() => {
    let currentSubTotal = 0;
    let currentTotalTaxAmount = 0;
    const currentUniqueAppliedTaxesMap = new Map<string, AppliedTaxInfo>();

    formItems.forEach(item => {
      const itemPreTaxTotal = (item.quantity || 0) * (item.unitPrice || 0);
      currentSubTotal += itemPreTaxTotal;
      let itemTaxAmount = 0;

      const activeTaxRatesForItem = (item.applicableTaxRateIds || [])
        .map(rateId => allTaxRates.find(r => r.id === rateId && r.applicableTo.includes('InvoiceLineItem')))
        .filter(Boolean) as TaxRate[];
      
      // Sort by non-compound then compound
      activeTaxRatesForItem.sort((a, b) => (a.isCompound ? 1 : 0) - (b.isCompound ? 1 : 0));

      let baseForItemTaxCalculation = itemPreTaxTotal;
      activeTaxRatesForItem.forEach(rate => {
        let taxForThisRateOnItem: number;
        if (rate.isCompound) {
          taxForThisRateOnItem = (baseForItemTaxCalculation * rate.rate) / 100;
        } else {
          taxForThisRateOnItem = (itemPreTaxTotal * rate.rate) / 100;
        }
        taxForThisRateOnItem = parseFloat(taxForThisRateOnItem.toFixed(2));
        itemTaxAmount += taxForThisRateOnItem;

        // Update base for next compound tax
        if (rate.isCompound) {
          baseForItemTaxCalculation += taxForThisRateOnItem;
        }
        
        // Aggregate unique taxes for invoice summary
        if (currentUniqueAppliedTaxesMap.has(rate.id)) {
            const existing = currentUniqueAppliedTaxesMap.get(rate.id)!;
            existing.amount += taxForThisRateOnItem;
        } else {
            currentUniqueAppliedTaxesMap.set(rate.id, {
                taxRateId: rate.id,
                name: rate.description,
                rateValue: rate.rate,
                amount: taxForThisRateOnItem,
                jurisdiction: rate.jurisdictionNameCache,
                taxTypeName: rate.taxTypeNameCache,
                isCompound: rate.isCompound
            });
        }

      });
      currentTotalTaxAmount += itemTaxAmount;
    });
    
    currentSubTotal = parseFloat(currentSubTotal.toFixed(2));
    currentTotalTaxAmount = parseFloat(currentTotalTaxAmount.toFixed(2));

    return {
      subTotal: currentSubTotal,
      totalTaxAmount: currentTotalTaxAmount,
      totalAmount: parseFloat((currentSubTotal + currentTotalTaxAmount).toFixed(2)),
      uniqueAppliedTaxes: Array.from(currentUniqueAppliedTaxesMap.values()),
    };
  }, [formItems, allTaxRates]);


  useEffect(() => {
    if (mode === 'edit' && invoiceToEdit) {
      form.reset({
        clientId: invoiceToEdit.clientId,
        projectId: invoiceToEdit.projectId || '',
        issueDate: parseISO(invoiceToEdit.issueDate),
        dueDate: parseISO(invoiceToEdit.dueDate),
        currency: invoiceToEdit.currency,
        status: invoiceToEdit.status,
        notes: invoiceToEdit.notes || '',
        items: invoiceToEdit.items.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          applicableTaxRateIds: item.applicableTaxRateIds || item.appliedTaxes?.map(t => t.taxRateId) || [],
        })),
      });
    } else { // Add mode or no invoiceToEdit
      form.reset({
        clientId: '', projectId: '', currency: 'USD', status: 'Draft', notes: '',
        items: [{ description: '', quantity: 1, unitPrice: 0, applicableTaxRateIds: [] }],
        issueDate: new Date(), dueDate: addDays(new Date(), 30)
      });
    }
  }, [invoiceToEdit, mode, form, isOpen]); // Depend on isOpen to reset when dialog reopens for 'add'

  // Auto-suggest tax rates when client/project changes in ADD mode
  useEffect(() => {
    if (mode === 'add' && (selectedClientId || selectedProjectId)) {
      const project = projects.find(p => p.id === selectedProjectId);
      let suggestedRateIds: string[] = [];

      if (project?.applicableTaxRateIds && project.applicableTaxRateIds.length > 0) {
        suggestedRateIds = project.applicableTaxRateIds;
      } else if (selectedClientId) {
        const client = clients.find(c => c.id === selectedClientId);
        if (client?.jurisdictionId) {
          suggestedRateIds = allTaxRates
            .filter(rate => 
              rate.jurisdictionId === client.jurisdictionId &&
              rate.applicableTo.includes('InvoiceLineItem') &&
              (!rate.startDate || (issueDate && parseISO(rate.startDate) <= issueDate)) &&
              (!rate.endDate || (issueDate && parseISO(rate.endDate) >= issueDate))
            )
            .map(r => r.id);
        }
      }
      // Apply to all items if in add mode and items is default
       if (formItems.length === 1 && formItems[0].description === '' && formItems[0].unitPrice === 0) {
           form.setValue(`items.0.applicableTaxRateIds`, suggestedRateIds);
       }
    }
  }, [selectedClientId, selectedProjectId, projects, clients, allTaxRates, issueDate, mode, form, formItems]);


  const handleSubmit = (data: z.infer<typeof addInvoiceFormSchema>) => {
    const processedItems: InvoiceItem[] = data.items.map(item => {
      const itemPreTaxTotal = (item.quantity || 0) * (item.unitPrice || 0);
      let itemTaxAmount = 0;
      const itemAppliedTaxes: AppliedTaxInfo[] = [];
      
      const activeTaxRatesForItem = (item.applicableTaxRateIds || [])
        .map(rateId => allTaxRates.find(r => r.id === rateId && r.applicableTo.includes('InvoiceLineItem')))
        .filter(Boolean) as TaxRate[];
      activeTaxRatesForItem.sort((a, b) => (a.isCompound ? 1 : 0) - (b.isCompound ? 1 : 0));

      let baseForItemTaxCalc = itemPreTaxTotal;
      activeTaxRatesForItem.forEach(rate => {
        let taxForThisRate: number;
        if (rate.isCompound) {
            taxForThisRate = (baseForItemTaxCalc * rate.rate) / 100;
        } else {
            taxForThisRate = (itemPreTaxTotal * rate.rate) / 100;
        }
        taxForThisRate = parseFloat(taxForThisRate.toFixed(2));
        itemTaxAmount += taxForThisRate;
        itemAppliedTaxes.push({
            taxRateId: rate.id, name: rate.description, rateValue: rate.rate, amount: taxForThisRate,
            jurisdiction: rate.jurisdictionNameCache, taxTypeName: rate.taxTypeNameCache, isCompound: rate.isCompound
        });
        if (rate.isCompound) {
            baseForItemTaxCalc += taxForThisRate;
        }
      });
      
      return {
        id: item.id || `new-${Date.now()}-${Math.random()}`,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: parseFloat(itemPreTaxTotal.toFixed(2)),
        applicableTaxRateIds: item.applicableTaxRateIds,
        appliedTaxes: itemAppliedTaxes,
        taxAmountForItem: parseFloat(itemTaxAmount.toFixed(2)),
        totalPriceIncludingTax: parseFloat((itemPreTaxTotal + itemTaxAmount).toFixed(2)),
      };
    });

    const finalFormData: AddInvoiceDialogFormData = {
      clientId: data.clientId,
      projectId: data.projectId,
      issueDate: formatISO(data.issueDate, { representation: 'date' }),
      dueDate: formatISO(data.dueDate, { representation: 'date' }),
      currency: data.currency,
      status: data.status as InvoiceStatus,
      notes: data.notes,
      items: processedItems,
      subTotal: subTotal,
      taxAmount: totalTaxAmount,
      totalAmount: totalAmount,
      appliedTaxes: uniqueAppliedTaxes,
    };
    onSubmit(finalFormData, mode);
  };

  const filteredProjects = projects.filter(p => p.clientId === selectedClientId);
  const availableTaxRates = allTaxRates.filter(rate => 
    rate.applicableTo.includes('InvoiceLineItem') &&
    (!rate.startDate || (issueDate && parseISO(rate.startDate) <= issueDate)) &&
    (!rate.endDate || (issueDate && parseISO(rate.endDate) >= issueDate))
  );


  return (
    <Dialog open={isOpen} onOpenChange={(openState) => { if (!openState) onClose(); }}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Create New Invoice' : `Edit Invoice ${invoiceToEdit?.id || ''}`}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Fill in invoice details. Taxes are calculated per line item.' : 'Update invoice details.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 max-h-[80vh] flex flex-col">
            <div className="overflow-y-auto pr-2 space-y-4 flex-grow">
              <FormField
                control={form.control} name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client *</FormLabel>
                    <Select onValueChange={(value) => { field.onChange(value); form.setValue('projectId', ''); }} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger></FormControl>
                      <SelectContent>{clients.map(client => (<SelectItem key={client.id} value={client.id}>{client.companyName}</SelectItem>))}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control} name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''} disabled={!selectedClientId || filteredProjects.length === 0}>
                      <FormControl><SelectTrigger><SelectValue placeholder={!selectedClientId ? "Select client first" : filteredProjects.length === 0 ? "No projects for client" : "Select a project"} /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="">-- None --</SelectItem>{filteredProjects.map(project => (<SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>))}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="issueDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Issue Date *</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="dueDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Due Date *</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => form.getValues("issueDate") ? date < form.getValues("issueDate") : false} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              </div>

              <Separator className="my-6" />
              <h3 className="text-lg font-semibold">Line Items</h3>
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 space-y-3 relative bg-muted/20">
                   {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                   )}
                  <FormField control={form.control} name={`items.${index}.description`} render={({ field: itemField }) => (<FormItem><FormLabel>Description *</FormLabel><FormControl><Input placeholder="Service description" {...itemField} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name={`items.${index}.quantity`} render={({ field: itemField }) => (<FormItem><FormLabel>Quantity *</FormLabel><FormControl><Input type="number" placeholder="1" {...itemField} step="any" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field: itemField }) => (<FormItem><FormLabel>Unit Price *</FormLabel><FormControl><Input type="number" placeholder="0.00" {...itemField} step="0.01" /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <FormField
                    control={form.control} name={`items.${index}.applicableTaxRateIds`}
                    render={() => (
                        <FormItem>
                        <div className="mb-1"><FormLabel className="text-sm">Item Taxes</FormLabel><FormDescription className="text-xs">Select taxes for this line item.</FormDescription></div>
                        <div className="grid grid-cols-2 gap-2 max-h-28 overflow-y-auto border p-1.5 rounded-md">
                            {availableTaxRates.length === 0 && <p className="text-xs text-muted-foreground col-span-full text-center py-1">No tax rates available for issue date.</p>}
                            {availableTaxRates.map(rate => (
                            <FormField key={rate.id} control={form.control} name={`items.${index}.applicableTaxRateIds`}
                                render={({ field: itemField }) => (
                                <FormItem className="flex flex-row items-start space-x-1.5 space-y-0 rounded-md border p-1.5">
                                    <FormControl><Checkbox checked={itemField.value?.includes(rate.id)} onCheckedChange={checked => checked ? itemField.onChange([...(itemField.value || []), rate.id]) : itemField.onChange((itemField.value || []).filter(v => v !== rate.id))} /></FormControl>
                                    <FormLabel className="text-xs font-normal cursor-pointer">{rate.description} ({rate.rate}%)</FormLabel>
                                </FormItem>
                                )}
                            />
                            ))}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                  />
                   <p className="text-xs text-right text-muted-foreground mt-1">Item Subtotal (Pre-tax): {form.getValues("currency")} {((formItems[index]?.quantity || 0) * (formItems[index]?.unitPrice || 0)).toFixed(2)}</p>
                </Card>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', quantity: 1, unitPrice: 0, applicableTaxRateIds: [] })} className="mt-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Line Item
              </Button>

              <Separator className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="currency" render={({ field }) => (<FormItem><FormLabel>Currency *</FormLabel><FormControl><Input placeholder="USD" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Sent">Sent</SelectItem>{mode === 'edit' && invoiceToEdit?.status === 'Paid' && <SelectItem value="Paid" disabled>Paid</SelectItem>}{mode === 'edit' && invoiceToEdit?.status === 'Overdue' && <SelectItem value="Overdue" disabled>Overdue</SelectItem>}{mode === 'edit' && invoiceToEdit?.status === 'Void' && <SelectItem value="Void" disabled>Void</SelectItem>}</SelectContent></Select><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., Payment terms, project reference" {...field} rows={2} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <Separator />
            <div className="p-4 border rounded-lg bg-muted/40 mt-auto">
              <h4 className="font-semibold mb-2 flex items-center gap-2"><CircleDollarSign className="h-5 w-5 text-primary"/>Invoice Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span><span className="font-medium">{form.getValues("currency")} {subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                {uniqueAppliedTaxes.map(tax => (
                  <div key={tax.taxRateId} className="flex justify-between text-xs text-muted-foreground">
                    <span>{tax.name} ({tax.rateValue}%){tax.isCompound ? " (Compound)" : ""}:</span>
                    <span>{form.getValues("currency")} {tax.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-1 border-t"><span>Total Tax:</span><span>{form.getValues("currency")} {totalTaxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between text-lg font-bold text-primary pt-1 border-t"><span>Total Amount Due:</span><span>{form.getValues("currency")} {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={formItems.length === 0}>{mode === 'add' ? 'Create Invoice' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    