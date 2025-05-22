import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import KpiCard from "@/components/dashboard/kpi-card";
import RevenueChart from "@/components/dashboard/revenue-chart";
import ProjectStatusChart from "@/components/dashboard/project-status-chart";
import ClientRelationshipWidget from "@/components/dashboard/client-relationship-widget";
import { DollarSign, Briefcase, Users, TrendingUp } from "lucide-react";
import type { Kpi } from "@/lib/types";

const kpis: Kpi[] = [
  { title: "Total Revenue", value: "$1.2M", change: "+15.2%", changeType: "positive", description: "Compared to last month" },
  { title: "Active Projects", value: "24", change: "-2", changeType: "negative", description: "Compared to last month" },
  { title: "Client Satisfaction", value: "92%", change: "+1.8%", changeType: "positive", description: "Average score" },
  { title: "New Leads", value: "18", change: "+5", changeType: "positive", description: "This month" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, get an overview of your consultancy.</p>
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
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Track your revenue trends over the past year.</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project Status Overview</CardTitle>
            <CardDescription>Current distribution of projects by status.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectStatusChart />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Client Relationship Health</CardTitle>
          <CardDescription>Overview of key client relationship scores and activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientRelationshipWidget />
        </CardContent>
      </Card>
    </div>
  );
}
