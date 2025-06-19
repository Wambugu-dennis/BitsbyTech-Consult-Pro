
// src/app/finances/profitability/page.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, BarChart3, ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, Briefcase, Filter, Percent } from "lucide-react";
import { useRouter } from "next/navigation";
import { initialProjects, initialInvoices, initialExpenses, initialClients } from '@/lib/mockData';
import type { Project, Invoice, Expense, Client } from '@/lib/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { cn } from '@/lib/utils';
import { format, parseISO, startOfYear, endOfYear } from 'date-fns';

interface ProfitabilityData {
  id: string;
  name: string;
  revenue: number;
  directCosts: number;
  grossProfit: number;
  grossProfitMargin: number; // as percentage
  clientName?: string; // For project profitability
}

export default function ProfitabilityPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("allTime"); // Example filter state

  const {
    projectsProfitability,
    clientsProfitability,
    overallMetrics,
  } = useMemo(() => {
    const projectsData: Record<string, { revenue: number; costs: number; name: string; clientName?: string }> = {};
    const clientsData: Record<string, { revenue: number; costs: number; name: string }> = {};

    initialProjects.forEach(p => {
      projectsData[p.id] = { revenue: 0, costs: 0, name: p.name, clientName: p.clientNameCache || initialClients.find(c=>c.id === p.clientId)?.companyName || 'N/A' };
    });
    initialClients.forEach(c => {
      clientsData[c.id] = { revenue: 0, costs: 0, name: c.companyName };
    });

    let totalRevenue = 0;
    let totalDirectCosts = 0;

    initialInvoices.forEach(invoice => {
      if (invoice.projectId && projectsData[invoice.projectId]) {
        projectsData[invoice.projectId].revenue += invoice.totalAmount;
      }
      if (clientsData[invoice.clientId]) {
        clientsData[invoice.clientId].revenue += invoice.totalAmount;
      }
      totalRevenue += invoice.totalAmount;
    });

    initialExpenses.forEach(expense => {
      if (expense.projectId && projectsData[expense.projectId]) {
        projectsData[expense.projectId].costs += (expense.totalAmountIncludingTax ?? expense.amount);
      }
      // For client costs, sum expenses from projects linked to that client
      const projectForExpense = initialProjects.find(p => p.id === expense.projectId);
      if (projectForExpense && clientsData[projectForExpense.clientId]) {
        clientsData[projectForExpense.clientId].costs += (expense.totalAmountIncludingTax ?? expense.amount);
      }
      totalDirectCosts += (expense.totalAmountIncludingTax ?? expense.amount);
    });

    const calculatedProjectsProfitability: ProfitabilityData[] = Object.entries(projectsData)
      .map(([id, data]) => {
        const grossProfit = data.revenue - data.costs;
        const grossProfitMargin = data.revenue > 0 ? parseFloat(((grossProfit / data.revenue) * 100).toFixed(1)) : 0;
        return { id, ...data, grossProfit, grossProfitMargin };
      }).sort((a,b) => b.grossProfitMargin - a.grossProfitMargin); // Sort by margin desc

    const calculatedClientsProfitability: ProfitabilityData[] = Object.entries(clientsData)
      .map(([id, data]) => {
        const grossProfit = data.revenue - data.costs;
        const grossProfitMargin = data.revenue > 0 ? parseFloat(((grossProfit / data.revenue) * 100).toFixed(1)) : 0;
        return { id, ...data, grossProfit, grossProfitMargin };
      }).sort((a,b) => b.grossProfitMargin - a.grossProfitMargin);

    const overallGrossProfit = totalRevenue - totalDirectCosts;
    const overallGrossProfitMargin = totalRevenue > 0 ? parseFloat(((overallGrossProfit / totalRevenue) * 100).toFixed(1)) : 0;

    return {
      projectsProfitability: calculatedProjectsProfitability,
      clientsProfitability: calculatedClientsProfitability,
      overallMetrics: { totalRevenue, totalDirectCosts, overallGrossProfit, overallGrossProfitMargin }
    };
  }, [selectedPeriod]); // Add filters if they affect data fetching/processing

  const projectChartConfig = {
    grossProfitMargin: { label: "Profit Margin (%)", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;
  
  const clientChartConfig = {
    grossProfitMargin: { label: "Avg. Profit Margin (%)", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  const getMarginColorClass = (margin: number) => {
    if (margin >= 50) return 'text-green-600 dark:text-green-400';
    if (margin >= 25) return 'text-yellow-600 dark:text-yellow-400';
    if (margin > 0) return 'text-orange-500 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between pb-4 border-b">
         <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => router.push('/finances')} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <PieChart className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profitability Analysis</h1>
                <p className="text-muted-foreground">
                Analyze gross profit margins across projects and clients.
                </p>
            </div>
        </div>
        {/* Placeholder for future "Generate Report" button */}
         <Button disabled variant="outline">
          <BarChart3 className="mr-2 h-4 w-4" />
          Generate Full Report
        </Button>
      </header>

      {/* Overall Metrics */}
      <Card>
        <CardHeader>
            <CardTitle className="text-xl">Overall Performance Snapshot</CardTitle>
            <CardDescription>Key gross profitability metrics for the selected period (currently all-time).</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-muted/30"><CardHeader className="pb-1"><CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">${overallMetrics.totalRevenue.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</p></CardContent></Card>
            <Card className="bg-muted/30"><CardHeader className="pb-1"><CardTitle className="text-sm font-medium text-muted-foreground">Total Direct Costs</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">${overallMetrics.totalDirectCosts.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</p></CardContent></Card>
            <Card className="bg-muted/30"><CardHeader className="pb-1"><CardTitle className="text-sm font-medium text-muted-foreground">Overall Gross Profit</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">${overallMetrics.overallGrossProfit.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</p></CardContent></Card>
            <Card className="bg-muted/30"><CardHeader className="pb-1"><CardTitle className="text-sm font-medium text-muted-foreground">Overall Gross Profit Margin</CardTitle></CardHeader><CardContent><p className={cn("text-2xl font-bold", getMarginColorClass(overallMetrics.overallGrossProfitMargin))}>{overallMetrics.overallGrossProfitMargin}%</p></CardContent></Card>
        </CardContent>
      </Card>
      
      {/* Profitability by Project */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Briefcase className="h-6 w-6 text-primary"/><CardTitle className="text-xl">Profitability by Project</CardTitle></div>
          <CardDescription>Detailed gross profit breakdown for each project.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Project Name</TableHead><TableHead>Client</TableHead><TableHead className="text-right">Revenue</TableHead><TableHead className="text-right">Direct Costs</TableHead><TableHead className="text-right">Gross Profit</TableHead><TableHead className="text-right w-[150px]">Gross Profit Margin</TableHead></TableRow></TableHeader>
              <TableBody>
                {projectsProfitability.length === 0 && <TableRow><TableCell colSpan={6} className="text-center h-24">No project data available.</TableCell></TableRow>}
                {projectsProfitability.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.clientName}</TableCell>
                    <TableCell className="text-right">${p.revenue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</TableCell>
                    <TableCell className="text-right">${p.directCosts.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</TableCell>
                    <TableCell className="text-right font-semibold">${p.grossProfit.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</TableCell>
                    <TableCell className={cn("text-right font-semibold", getMarginColorClass(p.grossProfitMargin))}>
                        <div className="flex items-center justify-end gap-2">
                            {p.grossProfitMargin > 0 && p.grossProfitMargin < 100 && <TrendingUp className="h-4 w-4"/>}
                            {p.grossProfitMargin < 0 && <TrendingDown className="h-4 w-4"/>}
                            {p.grossProfitMargin}%
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {projectsProfitability.length > 0 && (
            <ChartContainer config={projectChartConfig} className="h-[350px] w-full [aspect-ratio:auto]">
                 <ResponsiveContainer>
                    <RechartsBarChart data={projectsProfitability.slice(0,15)} layout="vertical" margin={{ left: 100, right: 30 }}>
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="grossProfitMargin" tickFormatter={(value) => `${value}%`} fontSize={10}/>
                        <YAxis type="category" dataKey="name" width={150} interval={0} fontSize={10} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="grossProfitMargin" name="Gross Profit Margin" radius={4}>
                            {projectsProfitability.slice(0,15).map((entry) => (
                                <Cell key={`cell-${entry.id}`} fill={entry.grossProfitMargin >= 50 ? 'hsl(var(--chart-2))' : entry.grossProfitMargin >= 25 ? 'hsl(var(--chart-4))' : entry.grossProfitMargin > 0 ? 'hsl(var(--chart-5))' : 'hsl(var(--destructive))'} />
                            ))}
                            <LabelList dataKey="grossProfitMargin" position="right" formatter={(value:number) => `${value}%`} fontSize={10}/>
                        </Bar>
                    </RechartsBarChart>
                </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Profitability by Client */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Users className="h-6 w-6 text-primary"/><CardTitle className="text-xl">Profitability by Client</CardTitle></div>
          <CardDescription>Aggregated gross profit metrics for each client.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Client Name</TableHead><TableHead className="text-right">Total Revenue</TableHead><TableHead className="text-right">Total Direct Costs</TableHead><TableHead className="text-right">Total Gross Profit</TableHead><TableHead className="text-right w-[150px]">Avg. Gross Profit Margin</TableHead></TableRow></TableHeader>
              <TableBody>
                {clientsProfitability.length === 0 && <TableRow><TableCell colSpan={5} className="text-center h-24">No client data available.</TableCell></TableRow>}
                {clientsProfitability.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-right">${c.revenue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</TableCell>
                    <TableCell className="text-right">${c.directCosts.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</TableCell>
                    <TableCell className="text-right font-semibold">${c.grossProfit.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</TableCell>
                     <TableCell className={cn("text-right font-semibold", getMarginColorClass(c.grossProfitMargin))}>
                        <div className="flex items-center justify-end gap-2">
                             {c.grossProfitMargin > 0 && c.grossProfitMargin < 100 && <TrendingUp className="h-4 w-4"/>}
                             {c.grossProfitMargin < 0 && <TrendingDown className="h-4 w-4"/>}
                            {c.grossProfitMargin}%
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {clientsProfitability.length > 0 && (
             <ChartContainer config={clientChartConfig} className="h-[350px] w-full [aspect-ratio:auto]">
                <ResponsiveContainer>
                    <RechartsBarChart data={clientsProfitability.filter(c => c.revenue > 0).slice(0,10)} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} interval={0} fontSize={10}/>
                        <YAxis tickFormatter={(value) => `${value}%`} fontSize={10}/>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="grossProfitMargin" name="Gross Profit Margin" radius={4}>
                             {clientsProfitability.filter(c => c.revenue > 0).slice(0,10).map((entry) => (
                                <Cell key={`cell-client-${entry.id}`} fill={entry.grossProfitMargin >= 50 ? 'hsl(var(--chart-2))' : entry.grossProfitMargin >= 25 ? 'hsl(var(--chart-4))' : entry.grossProfitMargin > 0 ? 'hsl(var(--chart-5))' : 'hsl(var(--destructive))'} />
                            ))}
                        </Bar>
                    </RechartsBarChart>
                </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Placeholder for Consultant/Service Line Profitability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-dashed">
            <CardHeader><CardTitle className="text-lg text-muted-foreground">Profitability by Consultant/Team</CardTitle><CardDescription className="text-xs">Under Development</CardDescription></CardHeader>
            <CardContent className="text-center min-h-[150px] flex flex-col items-center justify-center"><Users className="h-10 w-10 text-muted-foreground/30 mb-2"/><p className="text-sm text-muted-foreground">Analysis of consultant and team profitability based on billable hours, costs, and project contributions coming soon.</p></CardContent>
        </Card>
        <Card className="border-dashed">
            <CardHeader><CardTitle className="text-lg text-muted-foreground">Profitability by Service Line</CardTitle><CardDescription className="text-xs">Under Development</CardDescription></CardHeader>
            <CardContent className="text-center min-h-[150px] flex flex-col items-center justify-center"><Percent className="h-10 w-10 text-muted-foreground/30 mb-2"/><p className="text-sm text-muted-foreground">Breakdown of profitability for different service offerings or practice areas coming soon.</p></CardContent>
        </Card>
      </div>
      
      <CardFooter className="border-t pt-6">
        <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Note on Current Analysis:</strong> The profitability figures presented are based on Gross Profit (Revenue minus Direct Project-Related Expenses). For a complete picture, Net Profit would also consider operational overhead and other indirect costs, which are not factored in this current view.</p>
            <p><strong>COGS for Services:</strong> True Cost of Goods Sold for a consultancy involves detailed tracking of consultant time and associated labor costs per project. The current "Direct Costs" primarily reflect explicit project expenses logged. More granular labor cost allocation is a planned enhancement.</p>
            <p><strong>Future Enhancements:</strong> Customizable dashboards, drill-down capabilities, Net Profit analysis, and detailed COGS calculations are planned for future updates to this module.</p>
        </div>
      </CardFooter>
    </div>
  );
}
