
'use client';

import { useState, useEffect } from 'react';
import type { Expense, ExpenseStatus, Client, Project, Consultant, Budget, TaxRate } from "@/lib/types"; // Added Budget, TaxRate
import { initialExpenses, initialClients, initialProjects, initialConsultants, initialBudgets, initialTaxRates } from "@/lib/mockData"; // Added initialBudgets, initialTaxRates
import AddExpenseDialog from "@/components/finances/expenses/add-expense-dialog";
import ExpenseTable from "@/components/finances/expenses/expense-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from '@/hooks/use-toast';

export default function ExpensesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isMounted, setIsMounted] = useState(false);
  
  // Make allTaxRates available (could come from context/props in real app)
  const [allTaxRates, setAllTaxRates] = useState<TaxRate[]>(initialTaxRates);

  useEffect(() => {
    // Simulate fetching data
    setExpenses(initialExpenses);
    setAllTaxRates(initialTaxRates); // If dynamic, fetch here
    setIsMounted(true);
  }, []);

  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const consultant = initialConsultants.find(c => c.id === newExpenseData.submittedByConsultantId);
    const client = initialClients.find(c => c.id === newExpenseData.clientId);
    const project = initialProjects.find(p => p.id === newExpenseData.projectId);
    
    const newExpense: Expense = {
      ...newExpenseData, // This already includes amount, taxAmount, totalAmountIncludingTax, appliedTaxes from the dialog
      id: `exp-${Date.now()}`, 
      status: 'Pending', 
      submittedByConsultantNameCache: consultant?.name,
      clientNameCache: client?.companyName,
      projectNameCache: project?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    toast({ title: "Expense Logged", description: `Expense "${newExpense.description}" has been successfully logged.` });
  };

  const handleUpdateExpenseStatus = (expenseId: string, newStatus: ExpenseStatus) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(exp => 
        exp.id === expenseId ? { ...exp, status: newStatus, updatedAt: new Date().toISOString() } : exp
      )
    );
    toast({ title: "Expense Status Updated", description: `Expense status changed to ${newStatus}.` });
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
          budgets={initialBudgets}
          allTaxRates={allTaxRates} // Pass allTaxRates
        />
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>All Logged Expenses</CardTitle>
          <CardDescription>
            View, manage, and approve/reject submitted expenses. Expenses can be linked to clients, projects, consultants, and budgets, with applicable taxes calculated.
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
              <li>Edit and Delete existing expenses.</li>
              <li>Advanced Expense Logging Form (Current form is functional; receipt file upload is planned).</li>
              <li>Multi-step Approval Workflows & Notifications.</li>
              <li>Detailed Expense Reporting & Analytics (by category, project, client, budget, tax collected).</li>
              <li>Bulk Actions (e.g., approve multiple, export selected).</li>
              <li>Data Export to Excel/CSV (for integration with accounting software).</li>
              <li>Policy Enforcement (e.g., spending limits per category/project).</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}

    