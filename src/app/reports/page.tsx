
'use client';

import Link from 'next/link';
import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  FileDown, 
  ArrowRight, 
  Briefcase, 
  Users, 
  UserCog, 
  DollarSign,
  Percent, // Import the Percent icon
} from "lucide-react";


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
  {
    title: "Tax Implications Report",
    description: "A comprehensive overview of taxes collected (Output Tax) and paid (Input Tax) across projects.",
    href: "/analytics/tax-implications-report",
    icon: Percent,
  },
];

const AdvancedReportingCard = dynamic(() => import('@/components/reports/advanced-reporting'), {
  loading: () => (
    <Card className="shadow-md">
      <CardHeader>
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-background/50">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
        <div className="flex justify-end">
            <Skeleton className="h-10 w-48" />
        </div>
        <div className="mt-4 p-6 border-2 border-dashed rounded-lg">
            <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  ),
  ssr: false, // Don't server-side render this component as it's client-interactive
});


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
          Access standard reports, and leverage tools for custom report building and data export.
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

      <AdvancedReportingCard />
    </div>
  );
}
