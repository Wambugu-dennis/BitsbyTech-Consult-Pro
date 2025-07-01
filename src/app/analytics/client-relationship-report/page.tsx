
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowLeft, FileDown, TrendingUp, Mail, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { initialClients } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { format, differenceInDays, parseISO } from 'date-fns';

export default function ClientRelationshipReportPage() {
  const router = useRouter();
  const [reportData, setReportData] = useState<any[]>([]);

  useEffect(() => {
    const data = initialClients.map(client => {
      const lastContactDate = client.lastContact ? parseISO(client.lastContact) : new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
      const daysSinceLastContact = differenceInDays(new Date(), lastContactDate);
      let engagementLevel: 'High' | 'Medium' | 'Low' = 'Medium';
      if (daysSinceLastContact <= 30 && (client.communicationLogs?.length || 0) >= 2) engagementLevel = 'High';
      else if (daysSinceLastContact > 90 || (client.communicationLogs?.length || 0) < 1) engagementLevel = 'Low';

      return {
          id: client.id,
          companyName: client.companyName,
          clientTier: client.clientTier || 'Standard',
          status: client.status,
          satisfactionScore: client.satisfactionScore || Math.floor(Math.random() * 40 + 60),
          lastContactDate: format(lastContactDate, 'MMM dd, yyyy'),
          daysSinceLastContact,
          engagementLevel,
          totalBilled: client.financialSummary?.totalBilled || 0,
          growthOpportunity: (client.satisfactionScore || 0) > 80 && client.status === 'Active' ? 'High' : (client.satisfactionScore || 0) > 70 ? 'Medium' : 'Low',
      };
    });
    setReportData(data);
  }, []);

  const handleDownloadPdf = () => {
    alert("PDF download functionality for Client Relationship Report is under development. For now, please use your browser's 'Print to PDF' feature.");
  };

  const getSatisfactionColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTierBadgeClass = (tier: string) => {
    if (tier === 'Strategic') return 'bg-purple-100 text-purple-700 border-purple-300';
    if (tier === 'Key') return 'bg-indigo-100 text-indigo-700 border-indigo-300';
    return 'bg-sky-100 text-sky-700 border-sky-300';
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.push('/analytics')} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Relationship Insights Report</h1>
            <p className="text-muted-foreground">
              In-depth tracking of client satisfaction, engagement levels, retention, and growth opportunities.
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
          <CardTitle>Comprehensive Client Health Analysis</CardTitle>
          <CardDescription>
            This report offers a detailed view of client relationships, utilizing data from Client Management, Communication Logs, and Feedback Systems.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Satisfaction (%)</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-center">Engagement Level</TableHead>
                  <TableHead className="text-right">Total Billed ($)</TableHead>
                  <TableHead className="text-center">Growth Opportunity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.length > 0 ? reportData.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.companyName}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn(getTierBadgeClass(client.clientTier))}>{client.clientTier}</Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}
                               className={cn(client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700')}>
                            {client.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                           <Progress value={client.satisfactionScore} className="h-2 w-16" indicatorClassName={getSatisfactionColor(client.satisfactionScore)} />
                           {client.satisfactionScore}%
                        </div>
                    </TableCell>
                    <TableCell>{client.lastContactDate} ({client.daysSinceLastContact} days ago)</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={client.engagementLevel === 'High' ? 'default' : client.engagementLevel === 'Medium' ? 'secondary' : 'outline'}
                               className={cn(client.engagementLevel === 'High' ? 'bg-primary/20 text-primary-foreground' : client.engagementLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}>
                           {client.engagementLevel}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">{client.totalBilled.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={client.growthOpportunity === 'High' ? 'default' : client.growthOpportunity === 'Medium' ? 'secondary' : 'outline'}
                               className={cn(client.growthOpportunity === 'High' ? 'bg-green-500/20 text-green-700' : client.growthOpportunity === 'Medium' ? 'bg-yellow-500/20 text-yellow-700' : 'bg-gray-100 text-gray-700')}>
                            {client.growthOpportunity}
                        </Badge>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center h-24">Generating report data...</TableCell>
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
