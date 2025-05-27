
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowLeft, FileDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FinancialHealthReportPage() {
  const router = useRouter();

  const handleDownloadPdf = () => {
    alert("PDF download functionality for Financial Health Report is under development. For now, please use your browser's 'Print to PDF' feature.");
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.push('/analytics')} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <DollarSign className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Health Indicators Report</h1>
            <p className="text-muted-foreground">
              Visualize revenue streams, expense structures, profit margins, and cash flow dynamics.
            </p>
          </div>
        </div>
        <Button onClick={handleDownloadPdf}>
          <FileDown className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Financial Performance</CardTitle>
          <CardDescription>
            This report provides a detailed analysis of your consultancy's financial health, integrating data from the Financial Module (Invoicing, Expenses, Budgets).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex flex-col items-center justify-center bg-muted/50 rounded-md p-8 text-center">
            <DollarSign className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              Detailed financial health reports and forecasting models are under development.
            </p>
            <p className="text-sm text-muted-foreground max-w-lg mb-4">
              This section will feature interactive P&L visualizations, cash flow statements, profitability breakdowns by client/project/service, and budget vs. actuals variance reports.
            </p>
            <h4 className="font-semibold text-foreground mb-2">Upcoming Visualizations:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground text-left mx-auto max-w-md">
              <li>Revenue Trend Analysis & Forecasting</li>
              <li>Expense Breakdown by Category</li>
              <li>Profit Margin Analysis (Gross & Net)</li>
              <li>Cash Flow Projections</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
