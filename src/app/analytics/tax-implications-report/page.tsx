
'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Percent, ArrowLeft, FileDown, TrendingUp, TrendingDown, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { initialInvoices, initialExpenses, initialProjects, initialTaxTypes, initialTaxJurisdictions } from '@/lib/mockData';
import type { Invoice, Expense, Project, TaxType, TaxJurisdiction, AppliedTaxInfo } from '@/lib/types';
import { cn } from "@/lib/utils";
import { format, parseISO } from 'date-fns';

interface AggregatedTaxData {
  id: string; // From invoice/expense id
  date: string;
  sourceType: 'Invoice' | 'Expense';
  sourceId: string;
  clientName: string;
  projectName?: string;
  taxInfo: AppliedTaxInfo;
}

export default function TaxImplicationsReportPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    projectId: 'all',
    taxTypeId: 'all',
    jurisdictionId: 'all',
  });

  const { taxFromInvoices, taxFromExpenses, summary } = useMemo(() => {
    let collectedTax = 0;
    let paidTax = 0;
    
    const allTaxData: AggregatedTaxData[] = [];

    initialInvoices.forEach(invoice => {
      invoice.appliedTaxes?.forEach(tax => {
        allTaxData.push({
          id: `${invoice.id}-${tax.taxRateId}`,
          date: invoice.issueDate,
          sourceType: 'Invoice',
          sourceId: invoice.id,
          clientName: invoice.clientNameCache || 'N/A',
          projectName: invoice.projectNameCache,
          taxInfo: tax
        });
        collectedTax += tax.amount;
      });
    });

    initialExpenses.forEach(expense => {
      expense.appliedTaxes?.forEach(tax => {
        allTaxData.push({
          id: `${expense.id}-${tax.taxRateId}`,
          date: expense.date,
          sourceType: 'Expense',
          sourceId: expense.id,
          clientName: expense.clientNameCache || 'N/A',
          projectName: expense.projectNameCache,
          taxInfo: tax
        });
        paidTax += tax.amount;
      });
    });

    const filteredData = allTaxData.filter(item => {
        const project = initialProjects.find(p => p.name === item.projectName);
        const projectMatch = filters.projectId === 'all' || (project && project.id === filters.projectId);
        const taxTypeMatch = filters.taxTypeId === 'all' || item.taxInfo.taxTypeName === initialTaxTypes.find(t => t.id === filters.taxTypeId)?.name;
        const jurisdictionMatch = filters.jurisdictionId === 'all' || item.taxInfo.jurisdiction === initialTaxJurisdictions.find(j => j.id === filters.jurisdictionId)?.name;
        return projectMatch && taxTypeMatch && jurisdictionMatch;
    });

    return {
      taxFromInvoices: filteredData.filter(d => d.sourceType === 'Invoice').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      taxFromExpenses: filteredData.filter(d => d.sourceType === 'Expense').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      summary: {
        collectedTax,
        paidTax,
        netTaxPosition: collectedTax - paidTax,
      }
    };
  }, [filters]);
  
  const handleDownloadPdf = () => {
    alert("PDF download functionality for Tax Implications Report is under development. For now, please use your browser's 'Print to PDF' feature.");
  };

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({...prev, [filterName]: value}));
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.push('/reports')} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Percent className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tax Implications Report</h1>
            <p className="text-muted-foreground">
              A comprehensive overview of taxes collected and paid across projects.
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
          <CardTitle>Overall Tax Summary (All-Time)</CardTitle>
          <CardDescription>This summary reflects all tax data currently in the system.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-500/10"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-700">Total Tax Collected (Output Tax)</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">${summary.collectedTax.toLocaleString(undefined, {minimumFractionDigits:2})}</p></CardContent></Card>
          <Card className="bg-red-500/10"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-red-700">Total Tax Paid (Input Tax)</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">${summary.paidTax.toLocaleString(undefined, {minimumFractionDigits:2})}</p></CardContent></Card>
          <Card className="bg-primary/10"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-primary">Net Tax Position</CardTitle></CardHeader><CardContent><p className={cn("text-2xl font-bold", summary.netTaxPosition >= 0 ? 'text-primary' : 'text-destructive')}>{summary.netTaxPosition >= 0 ? '$' : '-$'}{Math.abs(summary.netTaxPosition).toLocaleString(undefined, {minimumFractionDigits:2})}</p><p className="text-xs text-muted-foreground">{summary.netTaxPosition >= 0 ? 'Payable to authority' : 'Claimable from authority'}</p></CardContent></Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle>Report Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select value={filters.projectId} onValueChange={(v) => handleFilterChange('projectId', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Projects</SelectItem>{initialProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filters.taxTypeId} onValueChange={(v) => handleFilterChange('taxTypeId', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Tax Types</SelectItem>{initialTaxTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filters.jurisdictionId} onValueChange={(v) => handleFilterChange('jurisdictionId', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Jurisdictions</SelectItem>{initialTaxJurisdictions.map(j => <SelectItem key={j.id} value={j.id}>{j.name}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-600"/><CardTitle>Taxes from Invoices (Output Tax)</CardTitle></div>
          </CardHeader>
          <CardContent>
             <div className="overflow-x-auto rounded-md border">
              <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Source</TableHead><TableHead>Client</TableHead><TableHead>Project</TableHead><TableHead>Tax Name</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                  {taxFromInvoices.length === 0 && <TableRow><TableCell colSpan={6} className="h-24 text-center">No invoice tax data for current filter.</TableCell></TableRow>}
                  {taxFromInvoices.map((item) => <TableRow key={item.id}><TableCell>{format(parseISO(item.date), 'PPP')}</TableCell><TableCell>{item.sourceId}</TableCell><TableCell>{item.clientName}</TableCell><TableCell>{item.projectName || 'N/A'}</TableCell><TableCell>{item.taxInfo.name}</TableCell><TableCell className="text-right font-medium text-green-600">${item.taxInfo.amount.toLocaleString(undefined, {minimumFractionDigits:2})}</TableCell></TableRow>)}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><TrendingDown className="h-5 w-5 text-red-600"/><CardTitle>Taxes from Expenses (Input Tax)</CardTitle></div>
          </CardHeader>
          <CardContent>
             <div className="overflow-x-auto rounded-md border">
              <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Source</TableHead><TableHead>Client</TableHead><TableHead>Project</TableHead><TableHead>Tax Name</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                  {taxFromExpenses.length === 0 && <TableRow><TableCell colSpan={6} className="h-24 text-center">No expense tax data for current filter.</TableCell></TableRow>}
                  {taxFromExpenses.map((item) => <TableRow key={item.id}><TableCell>{format(parseISO(item.date), 'PPP')}</TableCell><TableCell>{item.sourceId}</TableCell><TableCell>{item.clientName}</TableCell><TableCell>{item.projectName || 'N/A'}</TableCell><TableCell>{item.taxInfo.name}</TableCell><TableCell className="text-right font-medium text-red-600">${item.taxInfo.amount.toLocaleString(undefined, {minimumFractionDigits:2})}</TableCell></TableRow>)}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
