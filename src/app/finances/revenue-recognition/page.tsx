
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Landmark, PlusCircle, Settings, BarChartHorizontalBig, FileText, AlertTriangle, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import type { RevenueRecognitionRule, RecognizedRevenueEntry, RevenueRecognitionMethod } from '@/lib/types';
import { initialRevenueRecognitionRules, initialRecognizedRevenueEntries, initialProjects, initialInvoices } from '@/lib/mockData';
import AddRevenueRuleDialog, { type AddRevenueRuleFormData } from '@/components/finances/revenue-recognition/add-revenue-rule-dialog';
import RevenueRulesTable from '@/components/finances/revenue-recognition/revenue-rules-table';
import RecognizedRevenueLogTable from '@/components/finances/revenue-recognition/recognized-revenue-log-table';
import ManualRecognizeRevenueDialog, { type ManualRecognizeRevenueFormData } from '@/components/finances/revenue-recognition/manual-recognize-revenue-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatISO } from 'date-fns';

export default function RevenueRecognitionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [rules, setRules] = useState<RevenueRecognitionRule[]>(initialRevenueRecognitionRules);
  const [recognizedEntries, setRecognizedEntries] = useState<RecognizedRevenueEntry[]>(initialRecognizedRevenueEntries);
  const [showAddRuleDialog, setShowAddRuleDialog] = useState(false);
  const [showManualRecognizeDialog, setShowManualRecognizeDialog] = useState(false);
  const [ruleToEdit, setRuleToEdit] = useState<RevenueRecognitionRule | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSaveRule = (formData: AddRevenueRuleFormData, mode: 'add' | 'edit') => {
    if (mode === 'add') {
      const newRule: RevenueRecognitionRule = {
        ...formData,
        id: `rule-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRules(prev => [newRule, ...prev]);
      toast({ title: "Revenue Rule Added", description: `${newRule.name} has been created.` });
    } else if (ruleToEdit) {
      setRules(prev => prev.map(r => r.id === ruleToEdit.id ? { ...r, ...formData, updatedAt: new Date().toISOString() } : r));
      toast({ title: "Revenue Rule Updated", description: `${formData.name} has been updated.` });
    }
    setShowAddRuleDialog(false);
    setRuleToEdit(undefined);
  };

  const handleDeleteRule = (ruleId: string) => {
    // Add check if rule is in use before deleting
    if (initialProjects.some(p => p.revenueRecognitionRuleId === ruleId) || recognizedEntries.some(e => e.recognitionRuleId === ruleId)) {
        toast({ title: "Cannot Delete Rule", description: "This rule is currently associated with projects or recognized revenue entries.", variant: "destructive" });
        return;
    }
    setRules(prev => prev.filter(r => r.id !== ruleId));
    toast({ title: "Revenue Rule Deleted", variant: "destructive" });
  };

  const handleOpenEditRuleDialog = (rule: RevenueRecognitionRule) => {
    setRuleToEdit(rule);
    setShowAddRuleDialog(true);
  };
  
  const handleManualRecognition = (formData: ManualRecognizeRevenueFormData) => {
    const project = formData.projectId ? initialProjects.find(p => p.id === formData.projectId) : undefined;
    const invoice = formData.invoiceId ? initialInvoices.find(i => i.id === formData.invoiceId) : undefined;
    const rule = formData.recognitionRuleId ? rules.find(r => r.id === formData.recognitionRuleId) : undefined;

    const newEntry: RecognizedRevenueEntry = {
      id: `rr-manual-${Date.now()}`,
      projectId: formData.projectId,
      projectNameCache: project?.name,
      invoiceId: formData.invoiceId,
      invoiceNumberCache: invoice?.id, // Assuming invoice ID is its number for this mock
      clientId: project?.clientId || invoice?.clientId,
      clientNameCache: project?.clientNameCache || invoice?.clientNameCache,
      dateRecognized: formData.dateRecognized,
      amountRecognized: formData.amountRecognized,
      currency: formData.currency,
      recognitionRuleId: formData.recognitionRuleId,
      recognitionRuleNameCache: rule?.name,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };
    setRecognizedEntries(prev => [newEntry, ...prev]);
    toast({ title: "Revenue Recognized Manually", description: `Amount ${newEntry.currency} ${newEntry.amountRecognized} recognized.` });
    setShowManualRecognizeDialog(false);
  };


  if (!isMounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <header className="h-10 bg-muted rounded-md w-1/2"></header>
        {[1,2,3].map(i => <Card key={i}><CardHeader><div className="h-8 bg-muted rounded w-1/3"></div></CardHeader><CardContent><div className="h-40 bg-muted rounded"></div></CardContent></Card>)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Landmark className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Revenue Recognition</h1>
                <p className="text-muted-foreground">
                Define rules, track recognized revenue, and manage compliance.
                </p>
            </div>
        </div>
      </header>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary"/>Revenue Recognition Rules</CardTitle>
                <CardDescription>Define and manage rules for how revenue is recognized (e.g., on payment, by milestone).</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setRuleToEdit(undefined); setShowAddRuleDialog(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Rule
            </Button>
        </CardHeader>
        <CardContent>
            <RevenueRulesTable 
                rules={rules} 
                onEditRule={handleOpenEditRuleDialog}
                onDeleteRule={handleDeleteRule}
            />
        </CardContent>
         {showAddRuleDialog && (
            <AddRevenueRuleDialog
            isOpen={showAddRuleDialog}
            onClose={() => { setShowAddRuleDialog(false); setRuleToEdit(undefined); }}
            onSave={handleSaveRule}
            ruleToEdit={ruleToEdit}
            mode={ruleToEdit ? 'edit' : 'add'}
            />
        )}
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2"><BarChartHorizontalBig className="h-5 w-5 text-primary"/>Recognized Revenue Log</CardTitle>
                <CardDescription>View recognized revenue entries across projects and invoices. This log is updated based on applied rules or manual entries.</CardDescription>
            </div>
             <Button variant="outline" size="sm" onClick={() => setShowManualRecognizeDialog(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Manually Recognize Revenue
            </Button>
        </CardHeader>
        <CardContent>
            {/* Add filters here later: Date Range, Project, Client, Rule */}
            <RecognizedRevenueLogTable entries={recognizedEntries} />
        </CardContent>
         {showManualRecognizeDialog && (
            <ManualRecognizeRevenueDialog
                isOpen={showManualRecognizeDialog}
                onClose={() => setShowManualRecognizeDialog(false)}
                onSubmit={handleManualRecognition}
                projects={initialProjects}
                invoices={initialInvoices}
                rules={rules}
            />
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>Deferred Revenue Overview</CardTitle>
          <CardDescription>Summary of deferred revenue balances and future recognition schedules.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[150px] flex flex-col items-center justify-center bg-muted/30 rounded-md p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              Deferred revenue waterfall charts and detailed balance reports are under development.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This section will visualize how deferred revenue is expected to be recognized over time based on project timelines, subscription periods, and milestone completion.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Compliance & Reporting</CardTitle>
          <CardDescription>Tools and reports for accounting standards like ASC 606 / IFRS 15.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[150px] flex flex-col items-center justify-center bg-muted/30 rounded-md p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              Compliance reporting features are currently being developed.
            </p>
             <p className="text-xs text-muted-foreground mt-1">
              Future capabilities will include generating reports to support ASC 606/IFRS 15 disclosures, tracking contract modifications, and managing performance obligations.
            </p>
          </div>
        </CardContent>
      </Card>
       <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        Note: The Revenue Recognition module is for demonstration. Full automation, complex rule engines, and detailed compliance reporting are significant undertakings planned for future iterations.
      </CardFooter>
    </div>
  );
}

    