
'use client';

import { useState, useEffect } from 'react';
import type { Expense, ExpenseStatus, Client, Project, Consultant } from "@/lib/types";
import { initialExpenses, initialClients, initialProjects, initialConsultants } from "@/lib/mockData";
import AddExpenseDialog from "@/components/finances/expenses/add-expense-dialog";
import ExpenseTable from "@/components/finances/expenses/expense-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    setExpenses(initialExpenses);
    setIsMounted(true);
  }, []);

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
  };

  const handleUpdateExpenseStatus = (expenseId: string, newStatus: ExpenseStatus) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(exp => 
        exp.id === expenseId ? { ...exp, status: newStatus, updatedAt: new Date().toISOString() } : exp
      )
    );
  };

  if (!isMounted) {
    // Basic skeleton or loading state
    return (
      <div className="space-y-6 animate-pulse">
        <header className="flex items-center justify-between">
            <div className="h-10 bg-muted rounded-md w-1/2"></div>
            <div className="h-10 bg-muted rounded-md w-32"></div>
        </header>
        <div className="h-12 bg-muted rounded-md w-1/4"></div>
        <div className="h-64 bg-muted rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => router.push('/finances')} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <Receipt className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Expense Management</h1>
                <p className="text-muted-foreground">
                Record, categorize, and manage all business expenses.
                </p>
            </div>
        </div>
        <AddExpenseDialog 
          onAddExpense={handleAddExpense}
          clients={initialClients}
          projects={initialProjects}
          consultants={initialConsultants}
        />
      </header>
      
      {/* Future: Add summary cards for expense dashboard (e.g., total pending, total approved this month) */}
      {/* 
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234.50</div>
            <p className="text-xs text-muted-foreground">from 15 expenses</p>
          </CardContent>
        </Card>
        // Add more KPI cards
      </div>
      */}

      <Card>
        <CardHeader>
          <CardTitle>All Logged Expenses</CardTitle>
          <CardDescription>
            View, manage, and approve/reject submitted expenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseTable 
            expenses={expenses} 
            clients={initialClients}
            projects={initialProjects}
            consultants={initialConsultants}
            onUpdateExpenseStatus={handleUpdateExpenseStatus}
          />
        </CardContent>
      </Card>

      <Card className="mt-6 border-t pt-6 bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl">Future Enhancements</CardTitle>
          <CardDescription>
             Key upcoming features for robust expense management:
          </CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground columns-1 md:columns-2">
              <li>Advanced Expense Logging Form (with receipt file upload)</li>
              <li>Multi-step Approval Workflows & Notifications</li>
              <li>Detailed Expense Reporting & Analytics (by category, project, client)</li>
              <li>Bulk Actions (e.g., approve multiple)</li>
              <li>Integration with Accounting Software</li>
              <li>Policy Enforcement (e.g., spending limits)</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
