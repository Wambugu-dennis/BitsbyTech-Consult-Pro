
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, PlusCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Budget, Project } from '@/lib/types';
import { initialBudgets, initialProjects } from '@/lib/mockData';
import AddBudgetDialog, { type AddBudgetFormData } from '@/components/finances/budgets/add-budget-dialog';
import BudgetList from '@/components/finances/budgets/budget-list';

export default function BudgetsPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setBudgets(initialBudgets);
    setIsMounted(true);
  }, []);

  const handleAddBudget = (formData: AddBudgetFormData) => {
    const project = formData.linkedProjectId ? initialProjects.find(p => p.id === formData.linkedProjectId) : undefined;
    const newBudget: Budget = {
      id: `bud-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      linkedProjectId: formData.linkedProjectId,
      linkedProjectNameCache: project?.name,
      departmentName: formData.departmentName,
      totalAmount: formData.totalAmount,
      spentAmount: 0, // New budgets start with 0 spent
      currency: formData.currency,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'Planning', // Default status for new budgets
      description: formData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBudgets(prevBudgets => [newBudget, ...prevBudgets]);
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
            <Target className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
                <p className="text-muted-foreground">
                Set, monitor, and analyze project and departmental budgets.
                </p>
            </div>
        </div>
        <AddBudgetDialog 
            onAddBudget={handleAddBudget} 
            projects={initialProjects} 
        />
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Budgets Overview</CardTitle>
          <CardDescription>
            Manage financial plans and track spending against allocated budgets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetList budgets={budgets} />
        </CardContent>
      </Card>

       <Card className="mt-6 border-t pt-6 bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl">Future Enhancements</CardTitle>
          <CardDescription>
             Key upcoming features for robust budget management:
          </CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground columns-1 md:columns-2">
              <li>Detailed Budget vs. Actuals Tracking (linking to actual expenses)</li>
              <li>Variance Analysis Charts & Alerts</li>
              <li>Budget Versioning & History</li>
              <li>Departmental & Project Budget Roll-ups</li>
              <li>Forecasting and Scenario Planning Tools</li>
              <li>Integration with Project Financials</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
