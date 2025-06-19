
'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, PlusCircle, CircleDollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatISO, parseISO } from 'date-fns';
import type { Client, Project, Consultant, ExpenseCategory, Expense, Budget, AppliedTaxInfo, TaxRate } from '@/lib/types';
import { expenseCategories } from '@/lib/types';

const NONE_VALUE_PLACEHOLDER = "--none--";

const addExpenseFormSchema = z.object({
  date: z.date({ required_error: 'Expense date is required.' }),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  currency: z.string().min(3, 'Currency code is required (e.g., USD).').default('USD'),
  category: z.string().min(1, "Category is required."),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  budgetId: z.string().optional(),
  submittedByConsultantId: z.string().optional(),
  receiptUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  notes: z.string().optional(),
  applicableTaxRateIds: z.array(z.string()).optional(),
});

export type AddExpenseFormData = Omit<z.infer<typeof addExpenseFormSchema>, 'date'> & {
  date: string;
  taxAmount?: number;
  totalAmountIncludingTax?: number;
  appliedTaxes?: AppliedTaxInfo[];
};

interface AddExpenseDialogProps {
  onAddExpense: (expenseData: Expense) => void;
  clients: Client[];
  projects: Project[];
  consultants: Consultant[];
  budgets: Budget[];
  allTaxRates: TaxRate[];
}

export default function AddExpenseDialog({
    onAddExpense,
    clients,
    projects,
    consultants,
    budgets,
    allTaxRates
}: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof addExpenseFormSchema>>({
    resolver: zodResolver(addExpenseFormSchema),
    defaultValues: {
      description: '',
      amount: 0,
      currency: 'USD',
      category: '',
      receiptUrl: '',
      notes: '',
      clientId: undefined,
      projectId: undefined,
      budgetId: undefined,
      submittedByConsultantId: undefined,
      date: new Date(),
      applicableTaxRateIds: [],
    },
  });

  const selectedClientId = form.watch('clientId');
  const selectedProjectId = form.watch('projectId');
  const preTaxAmount = form.watch("amount");
  const selectedTaxRateIds = form.watch("applicableTaxRateIds");
  const expenseDate = form.watch("date");

  const [calculatedTaxAmount, setCalculatedTaxAmount] = useState(0);
  const [calculatedTotalAmount, setCalculatedTotalAmount] = useState(0);
  const [appliedTaxesDisplay, setAppliedTaxesDisplay] = useState<AppliedTaxInfo[]>([]);

  const availableProjects = useMemo(() => {
    return selectedClientId ? projects.filter(p => p.clientId === selectedClientId) : projects;
  }, [selectedClientId, projects]);

  const availableBudgets = useMemo(() => {
    return selectedProjectId ? budgets.filter(b => b.linkedProjectId === selectedProjectId || b.type === 'General' || b.type === 'Departmental') : budgets;
  }, [selectedProjectId, budgets]);

  const availableExpenseTaxRates = useMemo(() => {
    if (!expenseDate) return [];
    return allTaxRates.filter(rate =>
      (rate.applicableTo.includes('GeneralExpense') || rate.applicableTo.includes('ProjectExpense')) &&
      (!rate.startDate || parseISO(rate.startDate) <= expenseDate) &&
      (!rate.endDate || parseISO(rate.endDate) >= expenseDate)
    );
  }, [allTaxRates, expenseDate]);

  useEffect(() => {
    if (!expenseDate) return; // Ensure expenseDate is valid

    let suggestedRateIds: string[] = [];
    if (selectedProjectId) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project?.applicableTaxRateIds) {
        suggestedRateIds = project.applicableTaxRateIds.filter(rateId =>
            availableExpenseTaxRates.some(ar => ar.id === rateId)
        );
      }
    } else if (selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      if (client?.jurisdictionId) {
        suggestedRateIds = availableExpenseTaxRates
          .filter(rate => rate.jurisdictionId === client.jurisdictionId)
          .map(r => r.id);
      }
    }
    form.setValue('applicableTaxRateIds', suggestedRateIds);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId, selectedClientId, projects, clients, form, availableExpenseTaxRates, expenseDate]);


  useEffect(() => {
    let runningSubTotalForCompound = preTaxAmount || 0;
    let totalTaxCalculated = 0;
    const taxesAppliedDetails: AppliedTaxInfo[] = [];
    const currentSelectedRateIds = selectedTaxRateIds || [];

    const activeRates = allTaxRates.filter(rate =>
      currentSelectedRateIds.includes(rate.id) &&
      (rate.applicableTo.includes('GeneralExpense') || rate.applicableTo.includes('ProjectExpense')) &&
      expenseDate && // ensure expenseDate is truthy
      (!rate.startDate || parseISO(rate.startDate) <= expenseDate) &&
      (!rate.endDate || parseISO(rate.endDate) >= expenseDate)
    );

    // Separate non-compound and compound taxes
    const nonCompoundRates = activeRates.filter(r => !r.isCompound);
    const compoundRates = activeRates.filter(r => r.isCompound);

    // Calculate non-compound taxes first
    nonCompoundRates.forEach(rate => {
      const taxForItem = parseFloat(((preTaxAmount || 0) * rate.rate / 100).toFixed(2));
      totalTaxCalculated += taxForItem;
      runningSubTotalForCompound += taxForItem; // Add to base for compound taxes
      taxesAppliedDetails.push({
        taxRateId: rate.id,
        name: rate.description,
        rateValue: rate.rate,
        amount: taxForItem,
        jurisdiction: rate.jurisdictionNameCache,
        taxTypeName: rate.taxTypeNameCache,
        isCompound: false,
      });
    });

    // Calculate compound taxes on the new subtotal (preTaxAmount + nonCompoundTaxes)
    compoundRates.forEach(rate => {
      const taxForItem = parseFloat((runningSubTotalForCompound * rate.rate / 100).toFixed(2));
      totalTaxCalculated += taxForItem;
      runningSubTotalForCompound += taxForItem; // Add to base for the *next* compound tax
      taxesAppliedDetails.push({
        taxRateId: rate.id,
        name: rate.description,
        rateValue: rate.rate,
        amount: taxForItem,
        jurisdiction: rate.jurisdictionNameCache,
        taxTypeName: rate.taxTypeNameCache,
        isCompound: true,
      });
    });

    setCalculatedTaxAmount(parseFloat(totalTaxCalculated.toFixed(2)));
    setCalculatedTotalAmount(parseFloat(((preTaxAmount || 0) + totalTaxCalculated).toFixed(2)));
    setAppliedTaxesDisplay(taxesAppliedDetails);
  }, [preTaxAmount, selectedTaxRateIds, expenseDate, allTaxRates]);


  const resetForm = () => {
    form.reset({
      date: new Date(),
      description: '',
      amount: 0,
      currency: 'USD',
      category: '',
      clientId: undefined,
      projectId: undefined,
      budgetId: undefined,
      submittedByConsultantId: undefined,
      receiptUrl: '',
      notes: '',
      applicableTaxRateIds: [],
    });
    setCalculatedTaxAmount(0);
    setCalculatedTotalAmount(0);
    setAppliedTaxesDisplay([]);
  };

  const handleSubmit = (data: z.infer<typeof addExpenseFormSchema>) => {
    const consultant = consultants.find(c => c.id === data.submittedByConsultantId);
    const client = clients.find(c => c.id === data.clientId);
    const project = projects.find(p => p.id === data.projectId);

    const newExpense: Expense = {
      ...data,
      id: `exp-${Date.now()}`,
      date: formatISO(data.date, { representation: 'date' }),
      amount: data.amount,
      taxAmount: calculatedTaxAmount,
      totalAmountIncludingTax: calculatedTotalAmount,
      appliedTaxes: appliedTaxesDisplay,
      status: 'Pending',
      submittedByConsultantNameCache: consultant?.name,
      clientNameCache: client?.companyName,
      projectNameCache: project?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicableTaxRateIds: data.applicableTaxRateIds || [],
    };
    onAddExpense(newExpense);
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Log New Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log New Expense</DialogTitle>
          <DialogDescription>
            Enter the details for the new expense. Attachments can be linked via URL. Taxes will be calculated.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 max-h-[70vh] flex flex-col">
            <div className="overflow-y-auto pr-2 space-y-4 flex-grow">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Expense *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Client dinner at Innovatech project" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (Pre-Tax) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 75.50" {...field} step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenseCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <FormLabel className="text-base">Applicable Tax Rates (Optional)</FormLabel>
                      <FormDescription>Select tax rates to apply to this expense. Filtered by expense date and applicability.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-2 rounded-md">
                      {availableExpenseTaxRates.map((rate) => (
                        <FormField
                          key={rate.id}
                          control={form.control}
                          name="applicableTaxRateIds"
                          render={({ field }) => (
                            <FormItem key={rate.id} className="flex flex-row items-start space-x-2 space-y-0 rounded-md border p-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(rate.id)}
                                  onCheckedChange={(checked) => {
                                    const currentSelection = field.value || [];
                                    return checked
                                      ? field.onChange([...currentSelection, rate.id])
                                      : field.onChange(currentSelection.filter(v => v !== rate.id));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-xs font-normal cursor-pointer">{rate.description} ({rate.rate}%)</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                      {availableExpenseTaxRates.length === 0 && <p className="col-span-full text-center text-xs text-muted-foreground">No tax rates available for selected date/criteria.</p>}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="p-3 border rounded-md bg-muted/40 mt-auto">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><CircleDollarSign className="h-5 w-5 text-primary"/>Expense Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Pre-Tax Amount:</span><span className="font-medium">{form.getValues("currency")} {(preTaxAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                  {appliedTaxesDisplay.map(tax => (
                      <div key={tax.taxRateId} className="flex justify-between text-xs text-muted-foreground">
                          <span>{tax.name} ({tax.rateValue}%){tax.isCompound ? " (Compound)" : ""}:</span>
                          <span>{form.getValues("currency")} {tax.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                  ))}
                  <div className="flex justify-between font-semibold pt-1 border-t"><span>Total Tax:</span><span>{form.getValues("currency")} {calculatedTaxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between text-lg font-bold text-primary pt-1 border-t"><span>Total Expense:</span><span>{form.getValues("currency")} {calculatedTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="submittedByConsultantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Submitted By (Consultant)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === NONE_VALUE_PLACEHOLDER ? undefined : value)} value={field.value || NONE_VALUE_PLACEHOLDER}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select consultant if applicable" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE_PLACEHOLDER}>None</SelectItem>
                        {consultants.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name} ({c.role})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client (Optional)</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === NONE_VALUE_PLACEHOLDER ? undefined : value);
                        form.setValue('projectId', undefined);
                        form.setValue('budgetId', undefined);
                      }}
                      value={field.value || NONE_VALUE_PLACEHOLDER}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Link to a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE_PLACEHOLDER}>None</SelectItem>
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
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === NONE_VALUE_PLACEHOLDER ? undefined : value);
                        form.setValue('budgetId', undefined);
                      }}
                      value={field.value || NONE_VALUE_PLACEHOLDER}
                      disabled={!selectedClientId && availableProjects.length === 0 && projects.length > 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={!selectedClientId && projects.length > 0 ? "Select client first or choose general project" : "Link to a project"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE_PLACEHOLDER}>None</SelectItem>
                        {availableProjects.map(project => (
                          <SelectItem key={project.id} value={project.id}>{project.name} ({project.clientNameCache})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budgetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link to Budget (Optional)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === NONE_VALUE_PLACEHOLDER ? undefined : value)}
                      value={field.value || NONE_VALUE_PLACEHOLDER}
                      disabled={!selectedProjectId && availableBudgets.length === 0 && budgets.length > 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={!selectedProjectId && budgets.length > 0 ? "Select project first or choose general budget" : "Select a budget"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE_PLACEHOLDER}>None</SelectItem>
                        {availableBudgets.map(budget => (
                          <SelectItem key={budget.id} value={budget.id}>{budget.name} ({budget.type === 'Project' ? budget.linkedProjectNameCache : budget.departmentName || 'General'})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiptUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt URL (Optional)</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com/receipt.pdf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any additional details about the expense..." {...field} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => {
                  resetForm();
                  setOpen(false);
              }}>Cancel</Button>
              <Button type="submit">Log Expense</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
