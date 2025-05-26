
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatISO } from 'date-fns';
import type { Client, Project, Consultant, ExpenseCategory, ExpenseStatus, Expense } from '@/lib/types';
import { expenseCategories } from '@/lib/types'; // Assuming expenseCategories is exported from types or constants

const NONE_VALUE_PLACEHOLDER = "--none--";

const addExpenseFormSchema = z.object({
  date: z.date({ required_error: 'Expense date is required.' }),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  currency: z.string().min(3, 'Currency code is required (e.g., USD).').default('USD'),
  category: z.string().min(1, "Category is required."), // Using string to allow custom or predefined
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  submittedByConsultantId: z.string().optional(),
  receiptUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  notes: z.string().optional(),
});

export type AddExpenseFormData = Omit<z.infer<typeof addExpenseFormSchema>, 'date'> & {
  date: string; // Store as ISO string
};

interface AddExpenseDialogProps {
  onAddExpense: (expenseData: Expense) => void;
  clients: Client[];
  projects: Project[];
  consultants: Consultant[];
}

export default function AddExpenseDialog({ onAddExpense, clients, projects, consultants }: AddExpenseDialogProps) {
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
      // date, clientId, projectId, submittedByConsultantId will be set by inputs
    },
  });

  const selectedClientId = form.watch('clientId');
  const availableProjects = selectedClientId ? projects.filter(p => p.clientId === selectedClientId) : projects;

  const handleSubmit = (data: z.infer<typeof addExpenseFormSchema>) => {
    const consultant = consultants.find(c => c.id === data.submittedByConsultantId);
    const client = clients.find(c => c.id === data.clientId);
    const project = projects.find(p => p.id === data.projectId);

    const newExpense: Expense = {
      id: `exp-${Date.now()}`, // Simple ID
      ...data,
      date: formatISO(data.date, { representation: 'date' }),
      status: 'Pending', // Default status for new expenses
      submittedByConsultantNameCache: consultant?.name,
      clientNameCache: client?.companyName,
      projectNameCache: project?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onAddExpense(newExpense);
    form.reset({ currency: 'USD', category: '', description: '', amount: 0, receiptUrl: '', notes: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) form.reset({ currency: 'USD', category: '', description: '', amount: 0, receiptUrl: '', notes: '' });
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Log New Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Log New Expense</DialogTitle>
          <DialogDescription>
            Enter the details for the new expense. Attachments can be linked via URL.
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
                    <FormLabel>Amount *</FormLabel>
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
                       {/* Allow custom category, or ensure 'Other' is an option if form.value might be something not in the list */}
                    </SelectContent>
                  </Select>
                   <FormMessage />
                </FormItem>
              )}
            />

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
                    disabled={!selectedClientId && availableProjects.length === 0}
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
                  form.reset({ currency: 'USD', category: '', description: '', amount: 0, receiptUrl: '', notes: '' }); 
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

    