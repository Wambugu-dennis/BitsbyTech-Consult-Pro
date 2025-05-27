
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ArrowLeft, FileDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Using the baseFinancialHealthData from main analytics page as inspiration
const reportTableData = [
  { period: 'Jan 2024', revenue: 50000, expenses: 30000 }, { period: 'Feb 2024', revenue: 65000, expenses: 35000 },
  { period: 'Mar 2024', revenue: 58000, expenses: 32000 }, { period: 'Apr 2024', revenue: 72000, expenses: 40000 },
  { period: 'May 2024', revenue: 68000, expenses: 38000 }, { period: 'Jun 2024', revenue: 75000, expenses: 42000 },
  { period: 'Jul 2024', revenue: 82000, expenses: 45000 }, { period: 'Aug 2024', revenue: 78000, expenses: 43000 },
  { period: 'Sep 2024', revenue: 85000, expenses: 48000 }, { period: 'Oct 2024', revenue: 92000, expenses: 50000 },
  { period: 'Nov 2024', revenue: 88000, expenses: 47000 }, { period: 'Dec 2024', revenue: 95000, expenses: 52000 },
].map(item => {
  const netProfit = item.revenue - item.expenses;
  const profitMargin = item.revenue > 0 ? (netProfit / item.revenue) * 100 : 0;
  return {
    ...item,
    netProfit: parseFloat(netProfit.toFixed(2)),
    profitMargin: parseFloat(profitMargin.toFixed(1)),
    cashFlowStatus: netProfit > 10000 ? 'Positive' : netProfit > 0 ? 'Neutral' : 'Negative', // Mock cash flow
  };
});

export default function FinancialHealthReportPage() {
  const router = useRouter();

  const handleDownloadPdf = () => {
    alert("PDF download functionality for Financial Health Report is under development. For now, please use your browser's 'Print to PDF' feature.");
  };
  
  const getProfitMarginColor = (margin: number) => {
    if (margin >= 20) return 'text-green-600';
    if (margin >= 5) return 'text-yellow-600';
    return 'text-red-600';
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
          <CardTitle>Comprehensive Financial Performance Analysis</CardTitle>
          <CardDescription>
            This table provides a detailed monthly breakdown of your consultancy's financial health, integrating data from the Financial Module (Invoicing, Expenses, Budgets).
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Revenue ($)</TableHead>
                  <TableHead className="text-right">Expenses ($)</TableHead>
                  <TableHead className="text-right">Net Profit ($)</TableHead>
                  <TableHead className="text-right">Profit Margin (%)</TableHead>
                  <TableHead className="text-center">Cash Flow Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportTableData.map((item) => (
                  <TableRow key={item.period}>
                    <TableCell className="font-medium">{item.period}</TableCell>
                    <TableCell className="text-right">{item.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.expenses.toLocaleString()}</TableCell>
                    <TableCell className={cn("text-right font-semibold", item.netProfit >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {item.netProfit.toLocaleString()}
                    </TableCell>
                    <TableCell className={cn("text-right font-semibold", getProfitMarginColor(item.profitMargin))}>
                      {item.profitMargin}%
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant={item.cashFlowStatus === 'Positive' ? 'default' : item.cashFlowStatus === 'Negative' ? 'destructive' : 'secondary'}
                               className={cn(item.cashFlowStatus === 'Positive' ? 'bg-green-100 text-green-700' : item.cashFlowStatus === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700')}>
                           {item.cashFlowStatus === 'Positive' && <TrendingUp className="mr-1 h-3 w-3"/>}
                           {item.cashFlowStatus === 'Negative' && <TrendingDown className="mr-1 h-3 w-3"/>}
                           {item.cashFlowStatus === 'Neutral' && <Minus className="mr-1 h-3 w-3"/>}
                           {item.cashFlowStatus}
                        </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {reportTableData.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">No financial data available for this report period.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    