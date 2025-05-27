
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCog, ArrowLeft, FileDown, Star, Briefcase, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { initialConsultants, initialProjects } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const reportData = initialConsultants.map(consultant => {
    const projectsContributedCount = initialProjects.filter(p => p.projectManagerId === consultant.id || p.teamMemberIds?.includes(consultant.id)).length;
    const billableHours = Math.floor(consultant.utilization * 1.6); // Mock: 160 hours max billable, util % of that
    const nonBillableHours = Math.floor((100 - consultant.utilization) * 0.4); // Mock: 40 hours max non-billable
    const avgClientFeedback = parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)); // Random score between 3.5 and 5.0

    return {
        id: consultant.id,
        name: consultant.name,
        avatarUrl: consultant.avatarUrl,
        role: consultant.role,
        status: consultant.status,
        utilizationRate: consultant.utilization,
        billableHours,
        nonBillableHours,
        projectsContributed: projectsContributedCount,
        avgClientFeedback,
        skills: consultant.skills.slice(0,3).join(', ') + (consultant.skills.length > 3 ? '...' : ''),
    };
});

export default function ConsultantPerformanceReportPage() {
  const router = useRouter();

  const handleDownloadPdf = () => {
    alert("PDF download functionality for Consultant Performance Report is under development. For now, please use your browser's 'Print to PDF' feature.");
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 85) return 'bg-green-500';
    if (utilization >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
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
           <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consultant</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Utilization (%)</TableHead>
                  <TableHead className="text-right">Billable Hours</TableHead>
                  <TableHead className="text-right">Non-Billable</TableHead>
                  <TableHead className="text-center">Projects</TableHead>
                  <TableHead className="text-center">Avg. Feedback</TableHead>
                  <TableHead>Top Skills</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((consultant) => (
                  <TableRow key={consultant.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={consultant.avatarUrl} alt={consultant.name} data-ai-hint="person avatar"/>
                                <AvatarFallback>{consultant.name.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {consultant.name}
                        </div>
                    </TableCell>
                    <TableCell>{consultant.role}</TableCell>
                    <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Progress value={consultant.utilizationRate} className="h-2 w-16" indicatorClassName={getUtilizationColor(consultant.utilizationRate)} /> 
                            {consultant.utilizationRate}%
                        </div>
                    </TableCell>
                    <TableCell className="text-right">{consultant.billableHours}</TableCell>
                    <TableCell className="text-right">{consultant.nonBillableHours}</TableCell>
                    <TableCell className="text-center">{consultant.projectsContributed}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={consultant.avgClientFeedback >= 4.5 ? "default" : consultant.avgClientFeedback >= 3.5 ? "secondary" : "outline"}
                               className={cn(consultant.avgClientFeedback >= 4.5 ? "bg-green-100 text-green-700" : consultant.avgClientFeedback >= 3.5 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700")}>
                            <Star className="mr-1 h-3 w-3 fill-current" /> {consultant.avgClientFeedback.toFixed(1)}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{consultant.skills}</TableCell>
                  </TableRow>
                ))}
                {reportData.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center h-24">No consultant data available for this report.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    