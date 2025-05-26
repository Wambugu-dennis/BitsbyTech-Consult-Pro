
'use client';

import Link from 'next/link';
import type { Budget, BudgetStatus } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, Eye, Edit, BarChart3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

interface BudgetListProps {
  budgets: Budget[];
}

export default function BudgetList({ budgets }: BudgetListProps) {
  
  const getStatusBadgeVariant = (status: BudgetStatus): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Active': return 'default';
      case 'Planning': return 'outline';
      case 'Completed': return 'secondary';
      case 'Overspent': return 'destructive';
      case 'On Hold': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusBadgeClass = (status: BudgetStatus): string => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300';
      case 'Planning': return 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300';
      case 'Completed': return 'bg-gray-500/20 border-gray-500 text-gray-700 dark:text-gray-300';
      case 'Overspent': return 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300';
      case 'On Hold': return 'bg-yellow-600/20 border-yellow-600 text-yellow-800 dark:text-yellow-400';
      default: return 'border-border';
    }
  };

  const getConsumptionIndicatorColor = (percentage: number, status: BudgetStatus): string => {
    if (status === 'Overspent' || percentage > 100) return 'bg-red-500';
    if (percentage >= 85) return 'bg-yellow-500';
    if (percentage > 0) return 'bg-green-500';
    return 'bg-primary'; // Default or for 0%
  };


  return (
    <div className="rounded-lg border overflow-hidden shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Linked To</TableHead>
            <TableHead className="text-right">Total Budget</TableHead>
            <TableHead className="text-right">Spent</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead className="w-[150px]">Consumption</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No budgets found. Create a new budget to get started.
              </TableCell>
            </TableRow>
          )}
          {budgets.map((budget) => {
            const remainingAmount = budget.totalAmount - budget.spentAmount;
            const consumptionPercentage = budget.totalAmount > 0 ? (budget.spentAmount / budget.totalAmount) * 100 : 0;
            
            return (
              <TableRow key={budget.id} className="hover:bg-muted/50">
                <TableCell className="font-medium max-w-[200px] truncate" title={budget.name}>
                  {/* TODO: Link to budget detail page: <Link href={`/finances/budgets/${budget.id}`} className="hover:underline text-primary">{budget.name}</Link> */}
                  {budget.name}
                </TableCell>
                <TableCell>{budget.type}</TableCell>
                <TableCell>
                  {budget.type === 'Project' && budget.linkedProjectNameCache ? (
                    <Link href={`/projects/${budget.linkedProjectId}`} className="hover:underline text-primary text-xs">
                      {budget.linkedProjectNameCache}
                    </Link>
                  ) : budget.type === 'Departmental' && budget.departmentName ? (
                    budget.departmentName
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {budget.currency} {budget.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  {budget.currency} {budget.spentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className={cn("text-right font-medium", remainingAmount < 0 ? "text-red-600" : "text-green-600")}>
                  {budget.currency} {remainingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={consumptionPercentage > 100 ? 100 : consumptionPercentage} className="h-2 flex-1" indicatorClassName={getConsumptionIndicatorColor(consumptionPercentage, budget.status)} />
                    <span className="text-xs text-muted-foreground w-[40px] text-right">{consumptionPercentage.toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={getStatusBadgeVariant(budget.status)} className={cn("capitalize text-xs", getStatusBadgeClass(budget.status))}>
                    {budget.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Budget Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert(`Viewing details for ${budget.name}`)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert(`Editing ${budget.name}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Budget
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert(`Viewing report for ${budget.name}`)}>
                        <BarChart3 className="mr-2 h-4 w-4" /> View Report
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => alert(`Deleting ${budget.name}`)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Budget
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
