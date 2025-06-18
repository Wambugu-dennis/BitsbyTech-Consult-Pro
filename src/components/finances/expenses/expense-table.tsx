
'use client';

import Link from 'next/link';
import type { Expense, ExpenseStatus, Client, Project, Consultant, AppliedTaxInfo } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, CheckCircle, XCircle, LinkIcon, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, parseISO } from 'date-fns';

interface ExpenseTableProps {
  expenses: Expense[];
  clients: Client[];
  projects: Project[];
  consultants: Consultant[];
  onUpdateExpenseStatus: (expenseId: string, newStatus: ExpenseStatus) => void;
}

export default function ExpenseTable({ expenses, clients, projects, consultants, onUpdateExpenseStatus }: ExpenseTableProps) {

  const getStatusBadgeVariant = (status: ExpenseStatus): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'outline';
      case 'Rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusBadgeClass = (status: ExpenseStatus): string => {
    switch (status) {
      case 'Approved': return 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300';
      case 'Pending': return 'bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-300';
      case 'Rejected': return 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300';
      default: return 'border-border';
    }
  };

  const getConsultantName = (consultantId?: string) => consultants.find(c => c.id === consultantId)?.name || 'N/A';
  const getClientName = (clientId?: string) => clients.find(c => c.id === clientId)?.companyName || 'N/A';
  const getProjectName = (projectId?: string) => projects.find(p => p.id === projectId)?.name || 'N/A';

  const renderAppliedTaxes = (appliedTaxes?: AppliedTaxInfo[]) => {
    if (!appliedTaxes || appliedTaxes.length === 0) return null;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs underline decoration-dotted cursor-help ml-1">
              (incl. tax)
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">
            <p className="font-semibold mb-1">Applied Taxes:</p>
            <ul className="space-y-1">
              {appliedTaxes.map(tax => (
                <li key={tax.taxRateId}>
                  {tax.name} ({tax.rateValue}%): {tax.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="rounded-lg border overflow-hidden shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Pre-Tax Amt.</TableHead>
            <TableHead className="text-right">Tax Amt.</TableHead>
            <TableHead className="text-right">Total Amt.</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Project</TableHead>
            <TableHead className="text-center w-[100px]">Status</TableHead>
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                No expenses logged yet.
              </TableCell>
            </TableRow>
          )}
          {expenses.map((expense) => (
            <TableRow key={expense.id} className="hover:bg-muted/50">
              <TableCell>{format(parseISO(expense.date), 'MMM dd, yyyy')}</TableCell>
              <TableCell className="font-medium max-w-[200px] truncate" title={expense.description}>
                {expense.description}
              </TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell className="text-right">
                {expense.currency} {expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="text-right">
                {expense.taxAmount ? `${expense.currency} ${expense.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {expense.currency} {(expense.totalAmountIncludingTax ?? expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {renderAppliedTaxes(expense.appliedTaxes)}
              </TableCell>
              <TableCell>{expense.submittedByConsultantNameCache || getConsultantName(expense.submittedByConsultantId)}</TableCell>
              <TableCell>{expense.clientNameCache || getClientName(expense.clientId)}</TableCell>
              <TableCell>{expense.projectNameCache || getProjectName(expense.projectId)}</TableCell>
              <TableCell className="text-center">
                <Badge variant={getStatusBadgeVariant(expense.status)} className={cn("capitalize text-xs", getStatusBadgeClass(expense.status))}>
                  {expense.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Expense Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => alert(`Viewing details for ${expense.id} (to be implemented)`)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => alert(`Editing ${expense.id} (to be implemented)`)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Expense
                    </DropdownMenuItem>
                    {expense.receiptUrl && (
                      <DropdownMenuItem asChild>
                        <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="mr-2 h-4 w-4" /> View Receipt
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {expense.status === 'Pending' && (
                      <>
                        <DropdownMenuItem onClick={() => onUpdateExpenseStatus(expense.id, 'Approved')}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateExpenseStatus(expense.id, 'Rejected')} className="text-destructive focus:text-destructive">
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    {expense.status !== 'Pending' && (
                       <DropdownMenuItem onClick={() => onUpdateExpenseStatus(expense.id, 'Pending')}>
                          <FileText className="mr-2 h-4 w-4" /> Revert to Pending
                        </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

    