
'use client'; 

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import KpiCard from "@/components/dashboard/kpi-card";
import RevenueChart from "@/components/dashboard/revenue-chart";
import ProjectStatusChart from "@/components/dashboard/project-status-chart";
import ClientRelationshipWidget from "@/components/dashboard/client-relationship-widget";
import ProjectPipelineChart from "@/components/dashboard/project-pipeline-chart"; // New Import
import { DollarSign, Briefcase, Users, TrendingUp, ListChecks, PieChart as PieChartIcon } from "lucide-react"; // Added ListChecks, PieChartIcon
import type { Kpi, Project, ProjectTask, Consultant } from "@/lib/types"; // Added Project, ProjectTask, Consultant
import { useLocalization } from "@/context/localization-provider";
import { initialConsultants, initialProjects } from "@/lib/mockData"; // Import mock data
import { PROJECT_STATUS } from "@/lib/constants";
import { useMemo } from "react";


export default function DashboardPage() {
  const { t } = useLocalization(); 

  // Calculate new KPIs
  const averageConsultantUtilization = useMemo(() => {
    if (initialConsultants.length === 0) return 0;
    const totalUtilization = initialConsultants.reduce((sum, c) => sum + c.utilization, 0);
    return Math.round(totalUtilization / initialConsultants.length);
  }, []);

  const openTasksCount = useMemo(() => {
    return initialProjects.reduce((count, project) => {
      return count + (project.tasks?.filter(task => task.status !== PROJECT_STATUS.DONE).length || 0);
    }, 0);
  }, []);

  const kpis: Kpi[] = [
    { title: t("Total Revenue"), value: "$1.2M", change: "+15.2%", changeType: "positive", description: t("Compared to last month") },
    { title: t("Active Projects"), value: String(initialProjects.filter(p=>p.status === PROJECT_STATUS.IN_PROGRESS).length), change: `+${String(initialProjects.filter(p=>p.status === PROJECT_STATUS.TODO).length)} planned`, changeType: "positive", description: t("Across all clients") },
    { title: t("Client Satisfaction"), value: "92%", change: "+1.8%", changeType: "positive", description: t("Average score") },
    { title: t("Consultant Utilization"), value: `${averageConsultantUtilization}%`, description: t("Average across team") },
    { title: t("Open Tasks"), value: String(openTasksCount), description: t("Across all active projects") },
    // Example for another KPI, can be expanded
    // { title: t("New Leads"), value: "18", change: "+5", changeType: "positive", description: t("This month") },
  ];


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('Dashboard')}</h1>
        <p className="text-muted-foreground">{t('Welcome back, get an overview of your consultancy.')}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"> {/* Adjusted for 5 KPIs */}
        {kpis.map((kpi, index) => (
          <KpiCard 
            key={kpi.title} // Use a more stable key if available, like an ID
            {...kpi} 
            icon={
              kpi.title === t("Total Revenue") ? DollarSign :
              kpi.title === t("Active Projects") ? Briefcase :
              kpi.title === t("Client Satisfaction") ? Users :
              kpi.title === t("Consultant Utilization") ? PieChartIcon : // Or UserCog
              kpi.title === t("Open Tasks") ? ListChecks :
              TrendingUp // Default icon
            } 
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3"> {/* Adjusted for 3 charts in this row */}
        <Card className="lg:col-span-2"> {/* Revenue chart takes more space */}
          <CardHeader>
            <CardTitle>{t('Monthly Revenue & Forecast')}</CardTitle>
            <CardDescription>{t('Track your revenue trends and a 3-month forecast.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('Project Status Overview')}</CardTitle>
            <CardDescription>{t('Current distribution of projects by status.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectStatusChart />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>{t('Project Pipeline & Upcoming Completions')}</CardTitle>
                <CardDescription>{t('Timeline of active and planned projects.')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ProjectPipelineChart />
            </CardContent>
        </Card>
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>{t('Client Relationship Health')}</CardTitle>
                <CardDescription>{t('Overview of key client relationship scores.')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ClientRelationshipWidget />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
