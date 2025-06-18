
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

export default function TaxManagementPage() {
  const router = useRouter();
  const [taxJurisdictions, setTaxJurisdictions] = useState<TaxJurisdiction[]>([]);
  const [taxTypes, setTaxTypes] = useState<TaxType[]>([]);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTaxJurisdictions(initialTaxJurisdictions);
    setTaxTypes(initialTaxTypes);
    setTaxRates(initialTaxRates);
    setIsMounted(true);
  }, []);

  const handleAddTaxJurisdiction = (newJurisdictionData: AddTaxJurisdictionFormData) => {
    const jurisdictionToAdd: TaxJurisdiction = {
      ...newJurisdictionData,
      id: `jur-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTaxJurisdictions(prev => [jurisdictionToAdd, ...prev]);
  };
  
  const handleAddTaxType = (newTypeData: AddTaxTypeFormData) => {
    const typeToAdd: TaxType = {
      ...newTypeData,
      id: `type-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTaxTypes(prev => [typeToAdd, ...prev]);
  };

  const handleAddTaxRate = (newRateData: AddTaxRateFormData) => {
     const jurisdiction = taxJurisdictions.find(j => j.id === newRateData.jurisdictionId);
     const taxType = taxTypes.find(t => t.id === newRateData.taxTypeId);
    const rateToAdd: TaxRate = {
      ...newRateData,
      id: `rate-${Date.now()}`,
      jurisdictionNameCache: jurisdiction?.name,
      taxTypeNameCache: taxType?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTaxRates(prev => [rateToAdd, ...prev]);
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
                Configure and manage tax jurisdictions, types, and rates.
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
          <AddTaxJurisdictionDialog onAddJurisdiction={handleAddTaxJurisdiction} />
        </CardHeader>
        <CardContent>
          <TaxJurisdictionTable jurisdictions={taxJurisdictions} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><TagIcon className="h-5 w-5 text-primary"/>Tax Types</CardTitle>
            <CardDescription>
              Manage different kinds of taxes (e.g., VAT, Sales Tax).
            </CardDescription>
          </div>
          <AddTaxTypeDialog onAddTaxType={handleAddTaxType} />
        </CardHeader>
        <CardContent>
           <TaxTypeTable taxTypes={taxTypes} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
           <div>
            <CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5 text-primary"/>Tax Rates</CardTitle>
            <CardDescription>
              Set specific tax rates for combinations of jurisdictions and types.
            </CardDescription>
          </div>
          <AddTaxRateDialog 
            onAddTaxRate={handleAddTaxRate} 
            jurisdictions={taxJurisdictions}
            taxTypes={taxTypes}
          />
        </CardHeader>
        <CardContent>
          <TaxRateTable taxRates={taxRates} />
           <p className="text-xs text-muted-foreground mt-2">
            Note: When selecting tax rates for invoices/expenses, the system should ideally filter rates based on the transaction date matching the rate's Start/End Date. This historical tracking is key for accurate calculations.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ReportIcon className="h-5 w-5 text-primary"/>Tax Reporting & Summaries (Placeholder)
          </CardTitle>
          <CardDescription>
            Future section for generating tax reports and viewing summaries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This area will provide tools to generate reports for tax filing purposes, summarizing taxes collected and paid across different jurisdictions and tax types. It will integrate with invoices and expenses.
          </p>
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
              <li>Application of configured taxes to Invoices (line items & total). (Partially Implemented)</li>
              <li>Tax calculation on Expenses. (Partially Implemented)</li>
              <li>Project-level tax applicability settings. (Partially Implemented)</li>
              <li>Automated tax lookup based on client/project jurisdiction (potential integration).</li>
              <li>More detailed historical tracking of tax rate changes and their application.</li>
              <li>Support for compound taxes and tax-on-tax scenarios in calculations.</li>
              <li>Integration with accounting software for tax filing.</li>
              <li>User interface to edit and delete existing tax jurisdictions, types, and rates.</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}

    