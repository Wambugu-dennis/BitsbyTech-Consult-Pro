
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format, formatISO, parseISO } from 'date-fns';
import type { Client, Project, Consultant, ExpenseCategory, Expense, Budget, AppliedTaxInfo, TaxRate } from '@/lib/types';
import { expenseCategories } from '@/lib/types';
import { initialTaxRates } from '@/lib/mockData'; // For tax rate selection

const NONE_VALUE_PLACEHOLDER = "--none--";

const addExpenseFormSchema = z.object({
  date: z.date({ required_error: 'Expense date is required.' }),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'), // This will be pre-tax amount
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

export type AddExpenseFormData = Omit<z.infer<typeof addExpenseFormSchema>, 'date' | 'amount'> & {
  date: string; // Store as ISO string
  amount: number; // Pre-tax
  taxAmount?: number;
  totalAmountIncludingTax?: number;
  appliedTaxes?: AppliedTaxInfo[];
};

interface AddExpenseDialogProps {
  onAddExpense: (expenseData: AddExpenseFormData) => void; // Changed to AddExpenseFormData
  clients: Client[];
  projects: Project[];
  consultants: Consultant[];
  budgets: Budget[];
}

export default function AddExpenseDialog({ onAddExpense, clients, projects, consultants, budgets }: AddExpenseDialogProps) {
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
  const selectedTaxRateIds = form.watch("applicableTaxRateIds") || [];
  const expenseDate = form.watch("date");

  const [calculatedTaxAmount, setCalculatedTaxAmount] = useState(0);
  const [calculatedTotalAmount, setCalculatedTotalAmount] = useState(0);
  const [appliedTaxesDisplay, setAppliedTaxesDisplay] = useState<AppliedTaxInfo[]>([]);

  const availableProjects = selectedClientId ? projects.filter(p => p.clientId === selectedClientId) : projects;
  const availableBudgets = selectedProjectId ? budgets.filter(b => b.linkedProjectId === selectedProjectId || b.type === 'General' || b.type === 'Departmental') : budgets;


  useEffect(() => {
    const selectedProject = projects.find(p => p.id === selectedProjectId);
    if (selectedProject && selectedProject.applicableTaxRateIds) {
      form.setValue('applicableTaxRateIds', selectedProject.applicableTaxRateIds);
    } else if (selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      if (client?.jurisdictionId) {
        const clientJurisdictionRates = initialTaxRates.filter(
            rate => rate.jurisdictionId === client.jurisdictionId &&
                    rate.applicableTo.includes('GeneralExpense') && // Or ProjectExpense
                    (!rate.startDate || (expenseDate && parseISO(rate.startDate) <= expenseDate)) &&
                    (!rate.endDate || (expenseDate && parseISO(rate.endDate) >= expenseDate))
        ).map(r => r.id);
        form.setValue('applicableTaxRateIds', clientJurisdictionRates);
      }
    }
  }, [selectedProjectId, selectedClientId, projects, clients, form, expenseDate]);


  useEffect(() => {
    let currentTaxAmount = 0;
    const currentAppliedTaxes: AppliedTaxInfo[] = [];
    const activeTaxRates = initialTaxRates.filter(rate =>
      selectedTaxRateIds.includes(rate.id) &&
      (!rate.startDate || (expenseDate && parseISO(rate.startDate) <= expenseDate)) &&
      (!rate.endDate || (expenseDate && parseISO(rate.endDate) >= expenseDate))
    );

    activeTaxRates.forEach(rate => {
      const taxForThisRate = (preTaxAmount * rate.rate) / 100;
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
    setCalculatedTotalAmount(parseFloat((preTaxAmount + currentTaxAmount).toFixed(2)));
    setAppliedTaxesDisplay(currentAppliedTaxes);
  }, [preTaxAmount, selectedTaxRateIds, expenseDate]);

  const handleSubmit = (data: z.infer<typeof addExpenseFormSchema>) => {
    const newExpenseData: AddExpenseFormData = {
      ...data,
      date: formatISO(data.date, { representation: 'date' }),
      amount: data.amount, // Pre-tax amount
      taxAmount: calculatedTaxAmount,
      totalAmountIncludingTax: calculatedTotalAmount,
      appliedTaxes: appliedTaxesDisplay,
      applicableTaxRateIds: data.applicableTaxRateIds || [],
    };
    onAddExpense(newExpenseData as Expense); // Pass as Expense, parent page will complete it
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    form.reset({
      currency: 'USD', category: '', description: '', amount: 0, receiptUrl: '', notes: '',
      clientId: undefined, projectId: undefined, budgetId: undefined, submittedByConsultantId: undefined, date: new Date(),
      applicableTaxRateIds: []
    });
    setCalculatedTaxAmount(0);
    setCalculatedTotalAmount(0);
    setAppliedTaxesDisplay([]);
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
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
                    <FormDescription>Select tax rates to apply to this expense. Active rates for expense date shown.</FormDescription>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-2 rounded-md">
                    {initialTaxRates
                      .filter(rate => rate.applicableTo.includes('GeneralExpense') && (!rate.startDate || (expenseDate && parseISO(rate.startDate) <= expenseDate)) && (!rate.endDate || (expenseDate && parseISO(rate.endDate) >= expenseDate)))
                      .map((rate) => (
                      <FormField
                        key={rate.id}
                        control={form.control}
                        name="applicableTaxRateIds"
                        render={({ field }) => (
                          <FormItem key={rate.id} className="flex flex-row items-start space-x-2 space-y-0 rounded-md border p-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(rate.id)}
                                onCheckedChange={(checked) => checked
                                  ? field.onChange([...(field.value || []), rate.id])
                                  : field.onChange((field.value || []).filter(v => v !== rate.id))}
                              />
                            </FormControl>
                            <FormLabel className="text-xs font-normal cursor-pointer">{rate.description} ({rate.rate}%)</FormLabel>
                          </FormItem>
                        ))}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-1 p-3 border rounded-md bg-muted/50">
                <div className="flex justify-between text-sm"><span>Pre-Tax Amount:</span><span>{form.getValues("currency")} {preTaxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                {appliedTaxesDisplay.map(tax => (
                    <div key={tax.taxRateId} className="flex justify-between text-xs text-muted-foreground">
                        <span>{tax.name} ({tax.rateValue}%):</span>
                        <span>{form.getValues("currency")} {tax.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                ))}
                <div className="flex justify-between text-sm font-semibold pt-1 border-t"><span>Total Tax:</span><span>{form.getValues("currency")} {calculatedTaxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between text-lg font-bold text-primary"><span>Total Expense:</span><span>{form.getValues("currency")} {calculatedTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
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
                    onValueChange={(value) => field.onChange(value === NONE_VALUE_PLACEHOLDER ? undefined : value)}
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
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a budget to link this expense" />
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
            <DialogFooter>
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

    