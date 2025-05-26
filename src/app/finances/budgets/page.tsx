
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, PlusCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BudgetsPage() {
  const router = useRouter();

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
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Budget
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Budgets Overview</CardTitle>
          <CardDescription>
            Manage financial plans and track spending against allocated budgets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] flex flex-col items-center justify-center bg-muted/50 rounded-md p-8 text-center">
            <Target className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              Budget control features are currently under development.
            </p>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              This section will enable you to create budgets for projects or departments, track actual spending against these budgets, visualize variances, and generate budget reports.
            </p>
            <h4 className="font-semibold text-foreground mb-2">Key Upcoming Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground text-left mx-auto max-w-sm">
              <li>Budget Creation & Allocation</li>
              <li>Budget vs. Actuals Tracking</li>
              <li>Variance Analysis & Alerts</li>
              <li>Departmental & Project Budgets</li>
              <li>Forecasting and Scenario Planning</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
