
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Percent, MapPin, Tag as TagIcon, PlusCircle, ArrowLeft, FileText as ReportIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { TaxJurisdiction, TaxType, TaxRate } from '@/lib/types';
import { initialTaxJurisdictions, initialTaxTypes, initialTaxRates } from '@/lib/mockData';

import AddTaxJurisdictionDialog, { type AddTaxJurisdictionFormData } from '@/components/finances/taxes/add-tax-jurisdiction-dialog';
import TaxJurisdictionTable from '@/components/finances/taxes/tax-jurisdiction-table';
import AddTaxTypeDialog, { type AddTaxTypeFormData } from '@/components/finances/taxes/add-tax-type-dialog';
import TaxTypeTable from '@/components/finances/taxes/tax-type-table';
import AddTaxRateDialog, { type AddTaxRateFormData } from '@/components/finances/taxes/add-tax-rate-dialog';
import TaxRateTable from '@/components/finances/taxes/tax-rate-table';
import { useToast } from '@/hooks/use-toast';

export default function TaxManagementPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [taxJurisdictions, setTaxJurisdictions] = useState<TaxJurisdiction[]>(initialTaxJurisdictions);
  const [taxTypes, setTaxTypes] = useState<TaxType[]>(initialTaxTypes);
  const [taxRates, setTaxRates] = useState<TaxRate[]>(initialTaxRates);
  const [isMounted, setIsMounted] = useState(false);

  const [showJurisdictionDialog, setShowJurisdictionDialog] = useState(false);
  const [jurisdictionToEdit, setJurisdictionToEdit] = useState<TaxJurisdiction | undefined>(undefined);
  
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const [typeToEdit, setTypeToEdit] = useState<TaxType | undefined>(undefined);

  const [showRateDialog, setShowRateDialog] = useState(false);
  const [rateToEdit, setRateToEdit] = useState<TaxRate | undefined>(undefined);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Jurisdiction Handlers
  const handleOpenJurisdictionDialog = (jurisdiction?: TaxJurisdiction) => {
    setJurisdictionToEdit(jurisdiction);
    setShowJurisdictionDialog(true);
  };

  const handleSaveJurisdiction = (formData: AddTaxJurisdictionFormData, mode: 'add' | 'edit') => {
    if (mode === 'add') {
      const newJurisdiction: TaxJurisdiction = {
        ...formData,
        id: `jur-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTaxJurisdictions(prev => [newJurisdiction, ...prev]);
      toast({ title: "Tax Jurisdiction Added", description: `${newJurisdiction.name} has been added.` });
    } else if (jurisdictionToEdit) {
      setTaxJurisdictions(prev => prev.map(j => j.id === jurisdictionToEdit.id ? { ...j, ...formData, updatedAt: new Date().toISOString() } : j));
      toast({ title: "Tax Jurisdiction Updated", description: `${formData.name} has been updated.` });
    }
    setShowJurisdictionDialog(false);
    setJurisdictionToEdit(undefined);
  };

  const handleDeleteJurisdiction = (jurisdictionId: string) => {
    // Check if used in tax rates
    if (taxRates.some(rate => rate.jurisdictionId === jurisdictionId)) {
      toast({ title: "Cannot Delete Jurisdiction", description: "This jurisdiction is used in one or more tax rates. Please remove those rates first.", variant: "destructive" });
      return;
    }
    setTaxJurisdictions(prev => prev.filter(j => j.id !== jurisdictionId));
    toast({ title: "Tax Jurisdiction Deleted", variant: "destructive" });
  };

  // Tax Type Handlers
  const handleOpenTypeDialog = (type?: TaxType) => {
    setTypeToEdit(type);
    setShowTypeDialog(true);
  };
  
  const handleSaveTaxType = (formData: AddTaxTypeFormData, mode: 'add' | 'edit') => {
    if (mode === 'add') {
      const newType: TaxType = {
        ...formData,
        id: `type-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTaxTypes(prev => [newType, ...prev]);
      toast({ title: "Tax Type Added", description: `${newType.name} has been added.` });
    } else if (typeToEdit) {
      setTaxTypes(prev => prev.map(t => t.id === typeToEdit.id ? { ...t, ...formData, updatedAt: new Date().toISOString() } : t));
      toast({ title: "Tax Type Updated", description: `${formData.name} has been updated.` });
    }
    setShowTypeDialog(false);
    setTypeToEdit(undefined);
  };

  const handleDeleteTaxType = (typeId: string) => {
     if (taxRates.some(rate => rate.taxTypeId === typeId)) {
      toast({ title: "Cannot Delete Tax Type", description: "This tax type is used in one or more tax rates. Please remove those rates first.", variant: "destructive" });
      return;
    }
    setTaxTypes(prev => prev.filter(t => t.id !== typeId));
    toast({ title: "Tax Type Deleted", variant: "destructive" });
  };

  // Tax Rate Handlers
  const handleOpenRateDialog = (rate?: TaxRate) => {
    setRateToEdit(rate);
    setShowRateDialog(true);
  };

  const handleSaveTaxRate = (formData: AddTaxRateFormData, mode: 'add' | 'edit') => {
     const jurisdiction = taxJurisdictions.find(j => j.id === formData.jurisdictionId);
     const taxType = taxTypes.find(t => t.id === formData.taxTypeId);

    if (mode === 'add') {
      const newRate: TaxRate = {
        ...formData,
        id: `rate-${Date.now()}`,
        jurisdictionNameCache: jurisdiction?.name,
        taxTypeNameCache: taxType?.name,
        isCompound: formData.isCompound || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTaxRates(prev => [newRate, ...prev]);
      toast({ title: "Tax Rate Added", description: `${newRate.description} has been added.` });
    } else if (rateToEdit) {
      setTaxRates(prev => prev.map(r => r.id === rateToEdit.id ? { 
        ...r, 
        ...formData,
        jurisdictionNameCache: jurisdiction?.name,
        taxTypeNameCache: taxType?.name,
        isCompound: formData.isCompound || false,
        updatedAt: new Date().toISOString() 
      } : r));
      toast({ title: "Tax Rate Updated", description: `${formData.description} has been updated.` });
    }
    setShowRateDialog(false);
    setRateToEdit(undefined);
  };
  
  const handleDeleteTaxRate = (rateId: string) => {
    // Add checks if rate is used in active invoices/expenses later if needed.
    setTaxRates(prev => prev.filter(r => r.id !== rateId));
    toast({ title: "Tax Rate Deleted", variant: "destructive" });
  };


  if (!isMounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <header className="h-10 bg-muted rounded-md w-1/2"></header>
        <Card><CardHeader><div className="h-8 bg-muted rounded w-1/3"></div></CardHeader><CardContent><div className="h-40 bg-muted rounded"></div></CardContent></Card>
        <Card><CardHeader><div className="h-8 bg-muted rounded w-1/3"></div></CardHeader><CardContent><div className="h-40 bg-muted rounded"></div></CardContent></Card>
        <Card><CardHeader><div className="h-8 bg-muted rounded w-1/3"></div></CardHeader><CardContent><div className="h-40 bg-muted rounded"></div></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => router.push('/finances')} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <Percent className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tax Management</h1>
                <p className="text-muted-foreground">
                Configure and manage tax jurisdictions, types, and rates. Ensure these are accurate for system-wide calculations.
                </p>
            </div>
        </div>
      </header>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/>Tax Jurisdictions</CardTitle>
            <CardDescription>
              Define countries or regions where taxes apply.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleOpenJurisdictionDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Jurisdiction
          </Button>
        </CardHeader>
        <CardContent>
          <TaxJurisdictionTable 
            jurisdictions={taxJurisdictions} 
            onEditJurisdiction={handleOpenJurisdictionDialog}
            onDeleteJurisdiction={handleDeleteJurisdiction}
          />
        </CardContent>
      </Card>
      {showJurisdictionDialog && (
        <AddTaxJurisdictionDialog
          isOpen={showJurisdictionDialog}
          onClose={() => { setShowJurisdictionDialog(false); setJurisdictionToEdit(undefined); }}
          onSave={handleSaveJurisdiction}
          jurisdictionToEdit={jurisdictionToEdit}
          mode={jurisdictionToEdit ? 'edit' : 'add'}
        />
      )}


      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><TagIcon className="h-5 w-5 text-primary"/>Tax Types</CardTitle>
            <CardDescription>
              Manage different kinds of taxes (e.g., VAT, Sales Tax).
            </CardDescription>
          </div>
           <Button variant="outline" size="sm" onClick={() => handleOpenTypeDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Tax Type
          </Button>
        </CardHeader>
        <CardContent>
           <TaxTypeTable 
            taxTypes={taxTypes} 
            onEditTaxType={handleOpenTypeDialog}
            onDeleteTaxType={handleDeleteTaxType}
           />
        </CardContent>
      </Card>
      {showTypeDialog && (
        <AddTaxTypeDialog
            isOpen={showTypeDialog}
            onClose={() => { setShowTypeDialog(false); setTypeToEdit(undefined);}}
            onSave={handleSaveTaxType}
            taxTypeToEdit={typeToEdit}
            mode={typeToEdit ? 'edit' : 'add'}
        />
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
           <div>
            <CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5 text-primary"/>Tax Rates</CardTitle>
            <CardDescription>
              Set specific tax rates for combinations of jurisdictions and types. These rates are used for invoice and expense calculations.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleOpenRateDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Tax Rate
          </Button>
        </CardHeader>
        <CardContent>
          <TaxRateTable 
            taxRates={taxRates} 
            onEditTaxRate={handleOpenRateDialog}
            onDeleteTaxRate={handleDeleteTaxRate}
          />
           <p className="text-xs text-muted-foreground mt-2">
            Note: When applying tax rates to invoices/expenses, the system will filter available rates based on the transaction date matching the rate's Start/End Date to ensure historical accuracy.
          </p>
        </CardContent>
      </Card>
      {showRateDialog && (
        <AddTaxRateDialog 
            isOpen={showRateDialog}
            onClose={() => { setShowRateDialog(false); setRateToEdit(undefined);}}
            onSave={handleSaveTaxRate} 
            jurisdictions={taxJurisdictions}
            taxTypes={taxTypes}
            taxRateToEdit={rateToEdit}
            mode={rateToEdit ? 'edit' : 'add'}
          />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ReportIcon className="h-5 w-5 text-primary"/>Tax Reporting & Summaries (Placeholder)
          </CardTitle>
          <CardDescription>
            Future section for generating tax reports (e.g., VAT summary, Sales Tax collected) and viewing summaries based on applied taxes from invoices and expenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This area will provide tools to generate reports for tax filing purposes, summarizing taxes collected and paid across different jurisdictions and tax types. It will integrate with invoices and expenses.
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 pl-4">
            <li>Summary of taxes collected per jurisdiction.</li>
            <li>Breakdown of taxes by type (VAT, Sales Tax, etc.).</li>
            <li>Exportable reports for accounting and compliance.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6 border-t pt-6 bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl">Future Enhancements for Tax Management</CardTitle>
          <CardDescription>
             Key upcoming features for a more robust tax module:
          </CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground columns-1 md:columns-2">
              <li>Advanced tax reporting and analytics.</li>
              <li>Automated tax lookup based on client/project jurisdiction and service type (potential integration).</li>
              <li>More detailed historical tracking views for tax rate changes and their application.</li>
              <li>Support for more complex compound tax scenarios and tax-on-tax rules.</li>
              <li>Integration with accounting software for tax filing automation.</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}

    