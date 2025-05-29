
'use client'; 

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import KpiCard from "@/components/dashboard/kpi-card";
import RevenueChart from "@/components/dashboard/revenue-chart";
import ProjectStatusChart from "@/components/dashboard/project-status-chart";
import ClientRelationshipWidget from "@/components/dashboard/client-relationship-widget";
import { DollarSign, Briefcase, Users, TrendingUp } from "lucide-react";
import type { Kpi } from "@/lib/types";
import { useLocalization } from "@/context/localization-provider"; // Import for translation (client component needed)

// This component needs to be a client component to use hooks like useLocalization
// For now, we'll hardcode keys for translation demonstration if this remains a server component,
// or make it client and use the hook. Let's assume we make it client for full i18n.

// To use useLocalization, this page must be a Client Component
// If it's a Server Component, you'd pass translated text as props or handle i18n differently.
// For demonstration, I'm converting it to a client component.

export default function DashboardPage() {
  const { t } = useLocalization(); // Use the hook

  const kpis: Kpi[] = [
    { title: t("Total Revenue"), value: "$1.2M", change: "+15.2%", changeType: "positive", description: t("Compared to last month") },
    { title: t("Active Projects"), value: "24", change: "-2", changeType: "negative", description: t("Compared to last month") },
    { title: t("Client Satisfaction"), value: "92%", change: "+1.8%", changeType: "positive", description: t("Average score") },
    { title: t("New Leads"), value: "18", change: "+5", changeType: "positive", description: t("This month") },
  ];


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('Dashboard')}</h1>
        <p className="text-muted-foreground">{t('Welcome back, get an overview of your consultancy.')}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} icon={
            index === 0 ? DollarSign : 
            index === 1 ? Briefcase : 
            index === 2 ? Users : TrendingUp
          } />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('Monthly Revenue')}</CardTitle>
            <CardDescription>{t('Track your revenue trends over the past year.')}</CardDescription>
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
      
      <Card>
        <CardHeader>
          <CardTitle>{t('Client Relationship Health')}</CardTitle>
          <CardDescription>{t('Overview of key client relationship scores and activities.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientRelationshipWidget />
        </CardContent>
      </Card>
    </div>
  );
}

    
