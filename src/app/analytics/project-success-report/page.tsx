
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ArrowLeft, FileDown, CheckCircle, XCircle, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { initialProjects, initialClients } from "@/lib/mockData"; // Assuming clients might be linked
import { cn } from "@/lib/utils";

// Adapt or reuse baseProjectProfitabilityData or initialProjects
const reportData = initialProjects.map(project => {
  const client = initialClients.find(c => c.id === project.clientId);
  const actualCost = project.financials.spentBudget || (project.financials.budget * (Math.random() * 0.4 + 0.6)); // Simulate spent if not present
  const profitMargin = project.financials.budget > 0 ? ((project.financials.budget - actualCost) / project.financials.budget) * 100 : 0;
  const variance = project.financials.budget - actualCost;
  const deliveryStatus = project.status === "Done" 
    ? (new Date(project.actualEndDate || project.endDate) <= new Date(project.endDate) ? "On Time" : "Delayed") 
    : "In Progress";
  
  return {
    id: project.id,
    name: project.name,
    clientName: client?.companyName || 'N/A',
    status: project.status,
    priority: project.priority,
    startDate: project.startDate,
    endDate: project.endDate,
    actualEndDate: project.actualEndDate,
    budget: project.financials.budget,
    actualCost: actualCost,
    profitMargin: parseFloat(profitMargin.toFixed(1)),
    variance: parseFloat(variance.toFixed(2)),
    completionPercent: project.completionPercent || 0,
    deliveryStatus,
    scopeAdherence: Math.floor(Math.random() * 30 + 70), // Mock % for scope adherence
  };
});


export default function ProjectSuccessReportPage() {
  const router = useRouter();

  const handleDownloadPdf = () => {
    alert("PDF download functionality for Project Success Report is under development. For now, please use your browser's 'Print to PDF' feature.");
  };

  const getProfitMarginColor = (margin: number) => {
    if (margin >= 25) return 'text-green-600';
    if (margin >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getStatusBadgeClass = (status: string) => {
    if (status === 'Done') return 'bg-green-100 text-green-700 border-green-300';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-700 border-blue-300';
    if (status === 'To Do') return 'bg-gray-100 text-gray-700 border-gray-300';
    return 'bg-muted text-muted-foreground';
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
          <CardTitle>Detailed Project Performance Analysis</CardTitle>
          <CardDescription>
            This table provides an in-depth look into the performance of your projects, drawing data from Project Management, Financial Modules, and Resource Allocation systems.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Budget ($)</TableHead>
                  <TableHead className="text-right">Actual Cost ($)</TableHead>
                  <TableHead className="text-right">Variance ($)</TableHead>
                  <TableHead className="text-right">Profit Margin (%)</TableHead>
                  <TableHead className="text-center">Completion (%)</TableHead>
                  <TableHead className="text-center">Delivery</TableHead>
                  <TableHead className="text-center">Scope Adherence (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.clientName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(getStatusBadgeClass(project.status))}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{project.budget.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{project.actualCost.toLocaleString()}</TableCell>
                    <TableCell className={cn("text-right font-semibold", project.variance >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {project.variance.toLocaleString()}
                    </TableCell>
                    <TableCell className={cn("text-right font-semibold", getProfitMarginColor(project.profitMargin))}>
                      {project.profitMargin}%
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Progress value={project.completionPercent} className="h-2 w-16" indicatorClassName={project.completionPercent >= 75 ? 'bg-green-500': project.completionPercent >=40 ? 'bg-blue-500': 'bg-yellow-500'} /> 
                            {project.completionPercent}%
                        </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={project.deliveryStatus === "On Time" ? "default" : project.deliveryStatus === "Delayed" ? "destructive" : "secondary"}
                             className={cn(project.deliveryStatus === "On Time" ? "bg-green-100 text-green-700" : project.deliveryStatus === "Delayed" ? "bg-red-100 text-red-700" : "")}
                      >
                        {project.deliveryStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{project.scopeAdherence}%</TableCell>
                  </TableRow>
                ))}
                 {reportData.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={10} className="text-center h-24">No project data available for this report.</TableCell>
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

    