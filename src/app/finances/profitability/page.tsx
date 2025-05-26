
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, BarChart3, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfitabilityPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => router.push('/finances')} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <PieChart className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profitability Analysis</h1>
                <p className="text-muted-foreground">
                Analyze profitability across various dimensions of your business.
                </p>
            </div>
        </div>
         <Button disabled>
          <BarChart3 className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Profitability Insights Dashboard</CardTitle>
          <CardDescription>
            Gain deep insights into the financial performance of clients, projects, consultants, and service lines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] flex flex-col items-center justify-center bg-muted/50 rounded-md p-8 text-center">
            <PieChart className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              Profitability analysis tools are currently under development.
            </p>
            <p className="text-sm text-muted-foreground max-w-lg mb-4">
              This section will provide interactive charts and tables to analyze gross and net profit margins. It will integrate data from invoicing (revenue), expense tracking (direct costs), and resource allocation (consultant costs) to provide a holistic view of profitability.
            </p>
            <h4 className="font-semibold text-foreground mb-2">Key Upcoming Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground text-left mx-auto max-w-md">
              <li>Profitability by Client</li>
              <li>Profitability by Project</li>
              <li>Profitability by Consultant/Team</li>
              <li>Profitability by Service Line</li>
              <li>Customizable Dashboards & Drill-Downs</li>
              <li>Cost of Goods Sold (COGS) Calculation for Services</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
