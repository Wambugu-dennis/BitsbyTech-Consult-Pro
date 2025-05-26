
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
import type { Project, BudgetType } from '@/lib/types';
import { budgetTypes } from '@/lib/types';

const budgetFormSchema = z.object({
  name: z.string().min(3, 'Budget name must be at least 3 characters.'),
  type: z.enum(budgetTypes as [BudgetType, ...BudgetType[]], { // Cast for Zod enum
    required_error: "Budget type is required."
  }),
  linkedProjectId: z.string().optional(),
  departmentName: z.string().optional(),
  totalAmount: z.coerce.number().positive('Total amount must be a positive number.'),
  currency: z.string().min(3, 'Currency code is required (e.g., USD).').default('USD'),
  startDate: z.date({ required_error: 'Start date is required.' }),
  endDate: z.date({ required_error: 'End date is required.' }),
  description: z.string().max(500, 'Description too long.').optional(),
}).refine(data => {
  if (data.type === 'Project' && !data.linkedProjectId) {
    return false;
  }
  return true;
}, {
  message: "Project ID is required for Project type budgets.",
  path: ["linkedProjectId"],
}).refine(data => {
  if (data.type === 'Departmental' && (!data.departmentName || data.departmentName.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Department name is required for Departmental type budgets.",
  path: ["departmentName"],
}).refine(data => data.endDate >= data.startDate, {
  message: "End date cannot be before start date.",
  path: ["endDate"],
});


export type AddBudgetFormData = Omit<z.infer<typeof budgetFormSchema>, 'startDate' | 'endDate'> & {
  startDate: string; // Store as ISO string
  endDate: string;   // Store as ISO string
};

interface AddBudgetDialogProps {
  onAddBudget: (formData: AddBudgetFormData) => void;
  projects: Project[];
}

export default function AddBudgetDialog({ onAddBudget, projects }: AddBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof budgetFormSchema>>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: '',
      totalAmount: 0,
      currency: 'USD',
      type: undefined, // Let user select
      // dates, linkedProjectId, departmentName set by inputs
    },
  });

  const budgetType = form.watch("type");

  const handleSubmit = (data: z.infer<typeof budgetFormSchema>) => {
    const formData: AddBudgetFormData = {
      ...data,
      startDate: formatISO(data.startDate, { representation: 'date' }),
      endDate: formatISO(data.endDate, { representation: 'date' }),
    };
    onAddBudget(formData);
    form.reset({ currency: 'USD', totalAmount: 0, name: '', description: '', type: undefined, linkedProjectId: '', departmentName: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) form.reset({ currency: 'USD', totalAmount: 0, name: '', description: '', type: undefined, linkedProjectId: '', departmentName: '' });
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription>
            Fill in the details for the new budget.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Q4 Marketing Campaign Budget" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {budgetTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {budgetType === 'Project' && (
              <FormField
                control={form.control}
                name="linkedProjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link to Project *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>{project.name} ({project.clientNameCache})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {budgetType === 'Departmental' && (
              <FormField
                control={form.control}
                name="departmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Marketing, R&D" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Budget Amount *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50000" {...field} step="0.01" />
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date *</FormLabel>
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
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date *</FormLabel>
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
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => form.getValues("startDate") ? date < form.getValues("startDate") : false}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief details about the budget's purpose..." {...field} rows={3}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                form.reset({ currency: 'USD', totalAmount: 0, name: '', description: '', type: undefined, linkedProjectId: '', departmentName: '' });
                setOpen(false);
              }}>Cancel</Button>
              <Button type="submit">Create Budget</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
