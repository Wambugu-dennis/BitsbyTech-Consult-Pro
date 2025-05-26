
'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Receipt, Target, Landmark, PieChart, Activity, ArrowRight } from "lucide-react";

export default function FinancesPage() {
  const financialKpis = [
    { title: "Total Revenue (YTD)", value: "$1.2M", trend: "+15%" },
    { title: "Total Expenses (YTD)", value: "$700K", trend: "+10%" },
    { title: "Net Profit Margin", value: "41.67%", trend: "+2.5%" },
    { title: "Avg. Invoice Value", value: "$8,500" },
  ];

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b">
        <h1 className="text-4xl font-bold tracking-tight">Financial Command Center</h1>
        <p className="text-lg text-muted-foreground mt-1">
          Oversee, manage, and analyze all financial aspects of your consultancy.
        </p>
      </header>

      {/* Financial Overview Snippet */}
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Activity className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">Financial Snapshot</CardTitle>
          </div>
          <CardDescription>A quick glance at key financial performance indicators.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {financialKpis.map(kpi => (
              <Card key={kpi.title} className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  {kpi.trend && <p className="text-xs text-green-600">{kpi.trend} from last period</p>}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Button variant="outline">View Detailed Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {/* Core Financial Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">Invoicing Hub</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Create, send, and track client invoices. Link invoices to clients and projects for streamlined accounting.
            </CardDescription>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mb-4">
              <li>Recent: INV-2024-002 - Alpha Solutions - $2,700.00 (Sent)</li>
              <li>Recent: INV-2024-001 - Innovatech Ltd. - $4,860.00 (Paid)</li>
            </ul>
             <Link href="/finances/invoices" passHref>
              <Button className="w-full">Manage Invoices <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Receipt className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">Expense Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Record, categorize, and approve project-related and operational expenses. Ensure accurate cost allocation.
            </CardDescription>
             <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mb-4">
              <li>Software Subscription - $150 (Approved)</li>
              <li>Travel for Project Alpha - $450 (Pending)</li>
            </ul>
            <Button className="w-full" variant="outline">Log & Manage Expenses <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">Budget Control</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Set, monitor, and analyze budgets for projects and departments. Maintain financial discipline and foresight.
            </CardDescription>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mb-4">
                <li>Project Alpha: $50K Budget / $35K Spent (70%)</li>
                <li>Marketing Q3: $20K Budget / $12K Spent (60%)</li>
            </ul>
            <Button className="w-full" variant="outline">View Budgets <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Landmark className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">Revenue Recognition</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Implement systematic revenue recognition based on project milestones, contract terms, or service delivery periods.
            </CardDescription>
            <p className="text-sm text-muted-foreground mb-4">Configure rules and track recognized vs. deferred revenue.</p>
            <Button className="w-full" variant="outline">Configure Recognition <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <PieChart className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">Profitability Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Analyze profitability at client, project, consultant, and service-line levels. Make data-driven strategic decisions.
            </CardDescription>
            <p className="text-sm text-muted-foreground mb-4">Integrates data from invoicing, expenses, and resource allocation.</p>
            <Button className="w-full" variant="outline">Explore Profitability <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </CardContent>
        </Card>
         <Card className="bg-primary/10 text-primary-foreground hover:shadow-md transition-shadow border-primary">
          <CardHeader>
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">Financial Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4 text-primary-foreground/80">
              Generate P&L statements, balance sheets, cash flow reports, and custom financial analyses.
            </CardDescription>
            <Button className="w-full" variant="default" onClick={() => alert("Navigate to Reports section (to be implemented)")}>
              Go to Reporting Hub <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
