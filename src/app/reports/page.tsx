
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  FileDown, 
  ArrowRight, 
  Briefcase, 
  Users, 
  UserCog, 
  DollarSign,
  Settings2, 
  CalendarClock, 
  DownloadCloud, 
  Brain 
} from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


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
        <CardContent className="space-y-6">
          
          {/* Custom Report Builder & Visualization Tools */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings2 className="h-5 w-5 text-accent" />
              <h4 className="font-semibold text-md">Custom Report Builder & Visualization Tools</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Design and save tailored reports by selecting specific data points, applying filters, and choosing from a variety of advanced chart types and interactive visualizations.
            </p>
            <div className="p-4 border rounded-lg bg-background/50 space-y-3">
              <p className="text-xs text-center text-muted-foreground italic">Interface Preview (Functionality Coming Soon)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select disabled>
                  <SelectTrigger><SelectValue placeholder="Select Data Source (e.g., Projects)" /></SelectTrigger>
                  <SelectContent><SelectItem value="projects">Projects</SelectItem></SelectContent>
                </Select>
                <Select disabled>
                  <SelectTrigger><SelectValue placeholder="Select Chart Type (e.g., Bar)" /></SelectTrigger>
                  <SelectContent><SelectItem value="bar">Bar Chart</SelectItem></SelectContent>
                </Select>
              </div>
              <Input disabled placeholder="Select Fields to Display (e.g., Status, Budget, Client)" />
              <Button disabled className="w-full sm:w-auto">Launch Report Builder</Button>
            </div>
          </div>

          <Separator />

          {/* Scheduled Reporting */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarClock className="h-5 w-5 text-accent" />
              <h4 className="font-semibold text-md">Scheduled Reporting</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Automate the generation and email delivery of key reports on a recurring basis (daily, weekly, monthly) to stay informed without manual effort.
            </p>
             <div className="p-4 border rounded-lg bg-background/50 space-y-3">
                <p className="text-xs text-center text-muted-foreground italic">Configuration Preview (Planned Feature)</p>
                <Select disabled>
                    <SelectTrigger><SelectValue placeholder="Select Report to Schedule" /></SelectTrigger>
                </Select>
                <Input disabled placeholder="Recipient Emails (comma-separated)" />
                <Select disabled>
                  <SelectTrigger><SelectValue placeholder="Select Frequency (e.g., Weekly)" /></SelectTrigger>
                </Select>
                <Button disabled className="w-full sm:w-auto">Save Schedule</Button>
            </div>
          </div>

          <Separator />

          {/* Flexible Export Options */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DownloadCloud className="h-5 w-5 text-accent" />
              <h4 className="font-semibold text-md">Flexible Export Options</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Export report data and visualizations in various formats including PDF for presentation, CSV and Excel for further data analysis or integration with other tools.
            </p>
            <div className="p-4 border rounded-lg bg-background/50 text-center">
                <p className="text-xs text-muted-foreground italic mb-2">Export options will be available on generated reports.</p>
                <div className="flex justify-center gap-2">
                    <Button variant="outline" disabled size="sm"><FileDown className="mr-1 h-4 w-4"/>Export as PDF</Button>
                    <Button variant="outline" disabled size="sm"><FileDown className="mr-1 h-4 w-4"/>Export as CSV</Button>
                    <Button variant="outline" disabled size="sm"><FileDown className="mr-1 h-4 w-4"/>Export as Excel</Button>
                </div>
            </div>
          </div>
          
          <Separator />

          {/* Natural Language Report Generation (AI) */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-5 w-5 text-accent" />
              <h4 className="font-semibold text-md">Natural Language Report Generation (AI)</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              A future capability to leverage AI for generating narrative summaries that explain key data trends, insights, and anomalies found in your reports, making complex data easier to understand.
            </p>
          </div>

           <div className="mt-4 p-3 bg-muted/50 rounded-md border text-center">
            <p className="text-sm text-muted-foreground">These advanced reporting features are part of our ongoing development roadmap and will be rolled out in future updates.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

