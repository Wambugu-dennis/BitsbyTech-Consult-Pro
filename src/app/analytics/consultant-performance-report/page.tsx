
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, ArrowLeft, FileDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConsultantPerformanceReportPage() {
  const router = useRouter();

  const handleDownloadPdf = () => {
    alert("PDF download functionality for Consultant Performance Report is under development. For now, please use your browser's 'Print to PDF' feature.");
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.push('/analytics')} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <UserCog className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Consultant Performance & Utilization Report</h1>
            <p className="text-muted-foreground">
              Detailed monitoring of consultant utilization, billable hours, project contributions, and skill demand.
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
          <CardTitle>In-Depth Consultant Analytics</CardTitle>
          <CardDescription>
            This report provides comprehensive insights into consultant performance, using data from Resource Management, Project Tracking, and Timesheet Data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex flex-col items-center justify-center bg-muted/50 rounded-md p-8 text-center">
            <UserCog className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              Detailed consultant performance reports and visualizations are under development.
            </p>
            <p className="text-sm text-muted-foreground max-w-lg mb-4">
              This area will include utilization heatmaps, individual performance scorecards, skill gap analysis, and billable vs. non-billable hour breakdowns. You'll be able to compare performance across teams and roles.
            </p>
            <h4 className="font-semibold text-foreground mb-2">Upcoming Visualizations:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground text-left mx-auto max-w-md">
              <li>Utilization Rate Trends (Individual & Team)</li>
              <li>Billable Hours vs. Targets</li>
              <li>Skill Demand and Supply Analysis</li>
              <li>Project Contribution Effectiveness</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
