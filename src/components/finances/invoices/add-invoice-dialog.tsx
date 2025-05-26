
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatISO } from 'date-fns';
import type { Client, Project, InvoiceStatus } from '@/lib/types';

const addInvoiceFormSchema = z.object({
  clientId: z.string().min(1, 'Client is required.'),
  projectId: z.string().optional(),
  issueDate: z.date({ required_error: 'Issue date is required.' }),
  dueDate: z.date({ required_error: 'Due date is required.' }),
  totalAmount: z.coerce.number().min(0.01, 'Total amount must be greater than 0.'),
  currency: z.string().min(3, 'Currency code is required (e.g., USD).').default('USD'),
  status: z.enum(['Draft', 'Sent']),
}).refine(data => data.dueDate >= data.issueDate, {
  message: "Due date cannot be before issue date.",
  path: ["dueDate"],
});

export type AddInvoiceFormData = Omit<z.infer<typeof addInvoiceFormSchema>, 'issueDate' | 'dueDate'> & {
  issueDate: string; // Store as ISO string
  dueDate: string;   // Store as ISO string
};

interface AddInvoiceDialogProps {
  onAddInvoice: (formData: AddInvoiceFormData) => void;
  clients: Client[];
  projects: Project[];
}

export default function AddInvoiceDialog({ onAddInvoice, clients, projects }: AddInvoiceDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof addInvoiceFormSchema>>({
    resolver: zodResolver(addInvoiceFormSchema),
    defaultValues: {
      clientId: '',
      projectId: '',
      totalAmount: 0,
      currency: 'USD',
      status: 'Draft',
      // issueDate and dueDate are set by pickers
    },
  });

  const handleSubmit = (data: z.infer<typeof addInvoiceFormSchema>) => {
    const formData: AddInvoiceFormData = {
      ...data,
      issueDate: formatISO(data.issueDate, { representation: 'date' }),
      dueDate: formatISO(data.dueDate, { representation: 'date' }),
    };
    onAddInvoice(formData);
    form.reset({ currency: 'USD', status: 'Draft' }); // Reset with defaults
    setOpen(false);
  };

  const selectedClientId = form.watch("clientId");
  const filteredProjects = projects.filter(p => p.clientId === selectedClientId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create New Invoice (Simplified)</DialogTitle>
          <DialogDescription>
            Fill in the basic details for the new invoice. Line items can be added later.
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedClientId || filteredProjects.length === 0}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={!selectedClientId ? "Select client first" : filteredProjects.length === 0 ? "No projects for client" : "Select a project"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 5000.00" {...field} step="0.01"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Sent">Sent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Create Invoice</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
