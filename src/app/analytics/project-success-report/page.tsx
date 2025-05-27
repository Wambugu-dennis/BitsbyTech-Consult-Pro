
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowLeft, FileDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectSuccessReportPage() {
  const router = useRouter();

  const handleDownloadPdf = () => {
    alert("PDF download functionality for Project Success Report is under development. For now, please use your browser's 'Print to PDF' feature.");
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.push('/analytics')} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Briefcase className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Project Success Metrics Report</h1>
            <p className="text-muted-foreground">
              Detailed analysis of project profitability, on-time delivery, scope adherence, and resource efficiency.
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
          <CardTitle>Detailed Project Performance</CardTitle>
          <CardDescription>
            This report provides an in-depth look into the performance of your projects, drawing data from Project Management, Financial Modules, and Resource Allocation systems.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex flex-col items-center justify-center bg-muted/50 rounded-md p-8 text-center">
            <Briefcase className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              Detailed project success reports and visualizations are under development.
            </p>
            <p className="text-sm text-muted-foreground max-w-lg mb-4">
              This area will feature interactive charts for KPIs like project budget vs. actuals, burndown charts, task completion rates, and resource efficiency ratios per project. You'll be able to filter by client, project manager, and date ranges.
            </p>
            <h4 className="font-semibold text-foreground mb-2">Upcoming Visualizations:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground text-left mx-auto max-w-md">
              <li>Project Profitability Deep Dive</li>
              <li>Timeline Adherence & Delay Analysis</li>
              <li>Scope Creep Monitoring</li>
              <li>Resource Cost vs. Budget</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
