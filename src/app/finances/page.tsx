
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function FinancesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Finances</h1>
        <p className="text-muted-foreground">
          Manage and track your financial data, budgets, and profitability.
        </p>
      </header>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Financial Management</CardTitle>
          </div>
          <CardDescription>
            Oversee project budgets, manage expenses, generate invoices, and analyze overall financial health.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] flex items-center justify-center bg-muted/50 rounded-md p-8">
            <p className="text-center text-muted-foreground">
              Financial management features are under development. <br />
              This section will include tools for:
              <ul className="list-disc list-inside mt-2 text-left mx-auto max-w-md">
                <li>Budget Tracking</li>
                <li>Expense Management</li>
                <li>Invoice Generation</li>
                <li>Revenue Recognition</li>
                <li>Profitability Analysis</li>
              </ul>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
