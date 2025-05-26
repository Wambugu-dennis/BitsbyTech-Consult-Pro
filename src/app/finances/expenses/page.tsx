
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, PlusCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExpensesPage() {
  const router = useRouter();

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
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" />
          Log New Expense
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Expenses Dashboard</CardTitle>
          <CardDescription>
            Track and analyze project-related and operational expenditures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] flex flex-col items-center justify-center bg-muted/50 rounded-md p-8 text-center">
            <Receipt className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              Expense tracking features are currently under development.
            </p>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              This section will allow you to log new expenses, view existing ones in a sortable table, categorize them, attach receipts, and manage approval workflows.
            </p>
            <h4 className="font-semibold text-foreground mb-2">Key Upcoming Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground text-left mx-auto max-w-sm">
              <li>Expense Logging Form (with receipt upload)</li>
              <li>Categorization & Tagging</li>
              <li>Approval Workflows</li>
              <li>Link Expenses to Projects & Clients</li>
              <li>Expense Reporting & Analytics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
