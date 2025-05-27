
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileDown, ArrowRight, Briefcase, Users, UserCog, DollarSign } from "lucide-react";

interface StandardReportLink {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const standardReports: StandardReportLink[] = [
  {
    title: "Project Success Metrics Report",
    description: "Analyze project profitability, on-time delivery, scope adherence, and resource efficiency.",
    href: "/analytics/project-success-report",
    icon: Briefcase,
  },
  {
    title: "Client Relationship Insights Report",
    description: "Track client satisfaction, engagement levels, retention rates, and identify growth opportunities.",
    href: "/analytics/client-relationship-report",
    icon: Users,
  },
  {
    title: "Consultant Performance & Utilization Report",
    description: "Monitor consultant utilization, billable hours, project contributions, and skill demand.",
    href: "/analytics/consultant-performance-report",
    icon: UserCog,
  },
  {
    title: "Financial Health Indicators Report",
    description: "Visualize revenue streams, expense structures, profit margins, and cash flow dynamics.",
    href: "/analytics/financial-health-report",
    icon: DollarSign,
  },
];

export default function ReportsPage() {

  const handleDownloadPdf = (reportName: string) => {
    alert(`PDF download functionality for ${reportName} is under development. For now, please use your browser's 'Print to PDF' feature on the detailed report page.`);
  };

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Reporting Hub</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Access standard reports, and look forward to tools for custom report building and data export.
        </p>
      </header>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Standard Business Reports</CardTitle>
          <CardDescription>
            Access pre-defined reports covering key areas of your consultancy's operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {standardReports.map((report) => (
            <Card key={report.href} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <report.icon className="h-7 w-7 text-primary" />
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
                <CardDescription className="text-sm min-h-[40px]">{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <div className="mt-auto space-y-2">
                  <Button asChild className="w-full">
                    <Link href={report.href}>
                      View Report <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleDownloadPdf(report.title)}>
                    <FileDown className="mr-2 h-4 w-4" /> Download Sample PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="border-accent/30 bg-accent/5 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-accent-foreground flex items-center gap-2">
             Advanced Reporting Capabilities
          </CardTitle>
          <CardDescription>
            Future enhancements to provide deeper insights and more flexible reporting options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Custom Report Builder:</strong> Design and save tailored reports selecting specific data points, filters, and visualizations.
            </li>
            <li>
              <strong>Advanced Data Visualization Tools:</strong> Access a wider range of chart types and interactive elements within the custom report builder.
            </li>
            <li>
              <strong>Scheduled Reporting:</strong> Automate the generation and email delivery of key reports on a recurring basis.
            </li>
            <li>
              <strong>Flexible Export Options:</strong> Export report data in various formats including PDF, CSV, and Excel for further analysis or external use.
            </li>
             <li>
              <strong>Natural Language Report Generation (AI):</strong> Future capability to generate narrative summaries explaining data trends and insights.
            </li>
          </ul>
           <div className="mt-4 p-3 bg-muted/50 rounded-md border text-center">
            <p className="text-sm text-muted-foreground">These advanced features are currently under development and will be rolled out in future updates.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
