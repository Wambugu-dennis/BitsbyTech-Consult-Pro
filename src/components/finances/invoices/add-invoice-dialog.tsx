
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Removed DialogTrigger
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle, AlertTriangle } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from '@/lib/utils';
import { format, formatISO, parseISO, addDays } from 'date-fns'; // Added addDays import
import type { Client, Project, InvoiceStatus, TaxRate, AppliedTaxInfo, Invoice } from '@/lib/types';
import { initialTaxRates } from '@/lib/mockData';

const addInvoiceFormSchema = z.object({
  clientId: z.string().min(1, 'Client is required.'),
  projectId: z.string().optional(),
  issueDate: z.date({ required_error: 'Issue date is required.' }),
  dueDate: z.date({ required_error: 'Due date is required.' }),
  subTotal: z.coerce.number().min(0.01, 'Subtotal must be greater than 0.'),
  currency: z.string().min(3, 'Currency code is required (e.g., USD).').default('USD'),
  status: z.enum(['Draft', 'Sent', 'Paid', 'Overdue', 'Void']), // Expanded status for edit mode
  notes: z.string().optional(),
  applicableTaxRateIds: z.array(z.string()).optional(),
}).refine(data => data.dueDate >= data.issueDate, {
  message: "Due date cannot be before issue date.",
  path: ["dueDate"],
});

export type AddInvoiceDialogFormData = Omit<z.infer<typeof addInvoiceFormSchema>, 'issueDate' | 'dueDate' | 'subTotal' | 'status'> & {
  issueDate: string;
  dueDate: string;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  appliedTaxes: AppliedTaxInfo[];
  status: InvoiceStatus; // Ensure this is InvoiceStatus
};

interface AddInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: AddInvoiceDialogFormData, mode: 'add' | 'edit') => void;
  clients: Client[];
  projects: Project[];
  invoiceToEdit?: Invoice;
  mode: 'add' | 'edit';
}

export default function AddInvoiceDialog({
  isOpen,
  onClose,
  onSubmit,
  clients,
  projects,
  invoiceToEdit,
  mode,
}: AddInvoiceDialogProps) {
  const form = useForm<z.infer<typeof addInvoiceFormSchema>>({
    resolver: zodResolver(addInvoiceFormSchema),
    defaultValues: {
      clientId: '',
      projectId: '',
      subTotal: 0,
      currency: 'USD',
      status: 'Draft',
      notes: '',
      applicableTaxRateIds: [],
      issueDate: new Date(),
      dueDate: addDays(new Date(), 30),
    },
  });

  const selectedClientId = form.watch("clientId");
  const selectedProjectId = form.watch("projectId");
  const subTotal = form.watch("subTotal");
  const selectedTaxRateIds = form.watch("applicableTaxRateIds") || [];
  const issueDate = form.watch("issueDate");

  const [calculatedTaxAmount, setCalculatedTaxAmount] = useState(0);
  const [calculatedTotalAmount, setCalculatedTotalAmount] = useState(0);
  const [appliedTaxesDisplay, setAppliedTaxesDisplay] = useState<AppliedTaxInfo[]>([]);

  useEffect(() => {
    if (mode === 'edit' && invoiceToEdit) {
      form.reset({
        clientId: invoiceToEdit.clientId,
        projectId: invoiceToEdit.projectId || '',
        issueDate: parseISO(invoiceToEdit.issueDate),
        dueDate: parseISO(invoiceToEdit.dueDate),
        subTotal: invoiceToEdit.subTotal,
        currency: invoiceToEdit.currency,
        status: invoiceToEdit.status,
        notes: invoiceToEdit.notes || '',
        applicableTaxRateIds: invoiceToEdit.appliedTaxes.map(t => t.taxRateId),
      });
    } else {
      form.reset({
        clientId: '', projectId: '', subTotal: 0, currency: 'USD', status: 'Draft', notes: '', applicableTaxRateIds: [],
        issueDate: new Date(), dueDate: addDays(new Date(), 30)
      });
    }
  }, [invoiceToEdit, mode, form]);

  useEffect(() => {
    if (mode === 'add') { // Only auto-suggest taxes in add mode or if project/client changes
        const selectedProject = projects.find(p => p.id === selectedProjectId);
        if (selectedProject && selectedProject.applicableTaxRateIds && selectedProject.applicableTaxRateIds.length > 0) {
          form.setValue('applicableTaxRateIds', selectedProject.applicableTaxRateIds);
        } else if (selectedClientId) {
            const client = clients.find(c => c.id === selectedClientId);
            if (client?.jurisdictionId) {
                const clientJurisdictionRates = initialTaxRates.filter(
                    rate => rate.jurisdictionId === client.jurisdictionId &&
                            rate.applicableTo.includes('InvoiceLineItem') &&
                            (!rate.startDate || (issueDate && parseISO(rate.startDate) <= issueDate)) &&
                            (!rate.endDate || (issueDate && parseISO(rate.endDate) >= issueDate))
                ).map(r => r.id);
                form.setValue('applicableTaxRateIds', clientJurisdictionRates);
            } else {
               // If client changes and has no jurisdiction, or project is deselected, clear taxes
               // form.setValue('applicableTaxRateIds', []);
            }
        } else {
            // If no client selected, clear taxes
            // form.setValue('applicableTaxRateIds', []);
        }
    }
  }, [selectedProjectId, selectedClientId, projects, clients, form, issueDate, mode]);


  useEffect(() => {
    let currentTaxAmount = 0;
    const currentAppliedTaxes: AppliedTaxInfo[] = [];
    const activeTaxRates = initialTaxRates.filter(rate =>
      selectedTaxRateIds.includes(rate.id) &&
      (!rate.startDate || (issueDate && parseISO(rate.startDate) <= issueDate)) &&
      (!rate.endDate || (issueDate && parseISO(rate.endDate) >= issueDate))
    );

    activeTaxRates.forEach(rate => {
      const taxForThisRate = (subTotal * rate.rate) / 100;
      currentTaxAmount += taxForThisRate;
      currentAppliedTaxes.push({
        taxRateId: rate.id,
        name: rate.description,
        rateValue: rate.rate,
        amount: parseFloat(taxForThisRate.toFixed(2)),
        jurisdiction: rate.jurisdictionNameCache,
        taxTypeName: rate.taxTypeNameCache,
      });
    });

    currentTaxAmount = parseFloat(currentTaxAmount.toFixed(2));
    setCalculatedTaxAmount(currentTaxAmount);
    setCalculatedTotalAmount(parseFloat((subTotal + currentTaxAmount).toFixed(2)));
    setAppliedTaxesDisplay(currentAppliedTaxes);
  }, [subTotal, selectedTaxRateIds, issueDate]);

  const handleSubmit = (data: z.infer<typeof addInvoiceFormSchema>) => {
    const finalFormData: AddInvoiceDialogFormData = {
      ...data,
      issueDate: formatISO(data.issueDate, { representation: 'date' }),
      dueDate: formatISO(data.dueDate, { representation: 'date' }),
      subTotal: data.subTotal,
      taxAmount: calculatedTaxAmount,
      totalAmount: calculatedTotalAmount,
      appliedTaxes: appliedTaxesDisplay,
      status: data.status as InvoiceStatus,
      applicableTaxRateIds: data.applicableTaxRateIds || [],
    };
    onSubmit(finalFormData, mode);
    form.reset(); // Reset form after submit
  };

  const filteredProjects = projects.filter(p => p.clientId === selectedClientId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Create New Invoice' : `Edit Invoice ${invoiceToEdit?.id || ''}`}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Fill in invoice details. Taxes will be calculated based on selected rates. Line items can be detailed later.' : 'Update invoice details.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client *</FormLabel>
                  <Select onValueChange={(value) => { field.onChange(value); form.setValue('projectId', ''); }} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>{client.companyName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''} disabled={!selectedClientId || filteredProjects.length === 0}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={!selectedClientId ? "Select client first" : filteredProjects.length === 0 ? "No projects for client" : "Select a project"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="">-- None --</SelectItem>
                      {filteredProjects.map(project => (
                        <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Issue Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => form.getValues("issueDate") ? date < form.getValues("issueDate") : false}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="subTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtotal (Pre-Tax Amount) *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 5000.00" {...field} step="0.01"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicableTaxRateIds"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel className="text-base">Applicable Tax Rates</FormLabel>
                    <FormDescription>
                      Select tax rates to apply. If none selected, tax will be 0. Filtered by issue date.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-2 rounded-md">
                    {initialTaxRates
                      .filter(rate => rate.applicableTo.includes('InvoiceLineItem') && (!rate.startDate || (issueDate && parseISO(rate.startDate) <= issueDate)) && (!rate.endDate || (issueDate && parseISO(rate.endDate) >= issueDate)))
                      .map((rate) => (
                      <FormField
                        key={rate.id}
                        control={form.control}
                        name="applicableTaxRateIds"
                        render={({ field }) => {
                          return (
                            <FormItem key={rate.id} className="flex flex-row items-start space-x-2 space-y-0 rounded-md border p-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(rate.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), rate.id])
                                      : field.onChange((field.value || []).filter((value) => value !== rate.id));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-xs font-normal cursor-pointer">
                                {rate.description} ({rate.rate}%)
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                     {initialTaxRates.filter(rate => rate.applicableTo.includes('InvoiceLineItem') && (!rate.startDate || (issueDate && parseISO(rate.startDate) <= issueDate)) && (!rate.endDate || (issueDate && parseISO(rate.endDate) >= issueDate))).length === 0 && (
                        <p className="text-xs text-muted-foreground col-span-full text-center py-2">No tax rates applicable for the selected issue date or criteria.</p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-1 p-3 border rounded-md bg-muted/50">
                <div className="flex justify-between text-sm"><span>Subtotal:</span><span>{form.getValues("currency")} {subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                {appliedTaxesDisplay.map(tax => (
                    <div key={tax.taxRateId} className="flex justify-between text-xs text-muted-foreground">
                        <span>{tax.name} ({tax.rateValue}%):</span>
                        <span>{form.getValues("currency")} {tax.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                ))}
                <div className="flex justify-between text-sm font-semibold pt-1 border-t"><span>Total Tax:</span><span>{form.getValues("currency")} {calculatedTaxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between text-lg font-bold text-primary"><span>Total Amount Due:</span><span>{form.getValues("currency")} {calculatedTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency *</FormLabel>
                    <FormControl>
                      <Input placeholder="USD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Sent">Sent</SelectItem>
                        {mode === 'edit' && invoiceToEdit?.status === 'Paid' && <SelectItem value="Paid" disabled>Paid</SelectItem>}
                        {mode === 'edit' && invoiceToEdit?.status === 'Overdue' && <SelectItem value="Overdue" disabled>Overdue</SelectItem>}
                        {mode === 'edit' && invoiceToEdit?.status === 'Void' && <SelectItem value="Void" disabled>Void</SelectItem>}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Payment terms, project reference" {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{mode === 'add' ? 'Create Invoice' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
