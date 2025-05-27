
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Briefcase, Users, UserCog, DollarSign, Lightbulb, AlertTriangle, BarChartHorizontalBig, Brain } from "lucide-react";

interface AnalyticsCategory {
  icon: React.ElementType;
  title: string;
  description: string;
  details: string;
  dataSources: string;
}

const analyticsCategories: AnalyticsCategory[] = [
  {
    icon: Briefcase,
    title: "Project Success Metrics",
    description: "Analyze project profitability, on-time delivery, scope adherence, and resource efficiency.",
    details: "Interactive charts displaying project KPIs, burndown charts, and efficiency ratios will be available here.",
    dataSources: "Project Management, Financial Module, Resource Allocation"
  },
  {
    icon: Users,
    title: "Client Relationship Insights",
    description: "Track client satisfaction, engagement levels, retention rates, and identify growth opportunities or at-risk accounts.",
    details: "Dashboards visualizing client health scores, communication patterns, and feedback trends are under development.",
    dataSources: "Client Management, Communication Logs, Feedback Systems"
  },
  {
    icon: UserCog,
    title: "Consultant Performance & Utilization",
    description: "Monitor consultant utilization, billable hours, project contributions, skill demand, and overall team efficiency.",
    details: "Utilization heatmaps, individual performance scorecards, and skill gap analysis tools are planned.",
    dataSources: "Resource Management, Project Tracking, Timesheet Data"
  },
  {
    icon: DollarSign,
    title: "Financial Health Indicators",
    description: "Visualize revenue streams, expense structures, profit margins by service/client, and cash flow dynamics.",
    details: "Comprehensive financial dashboards, P&L visualizations, and forecasting models will be implemented.",
    dataSources: "Financial Module (Invoicing, Expenses, Budgets)"
  }
];

const advancedFeatures = [
    {
        icon: Brain,
        title: "Predictive Analytics for Trends",
        description: "Leverage historical data and AI to forecast future business trends, resource needs, and revenue projections."
    },
    {
        icon: AlertTriangle,
        title: "Anomaly Detection",
        description: "Automatically identify unusual patterns, outliers, or significant deviations in your business data, enabling proactive responses."
    },
    {
        icon: BarChartHorizontalBig,
        title: "Customizable Data Visualizations",
        description: "Build and save custom reports and dashboards with a variety of chart types and data filters tailored to your specific needs."
    },
    {
        icon: Lightbulb,
        title: "Personalized Insights & Recommendations",
        description: "Receive AI-generated insights and actionable recommendations based on your role, data patterns, and business goals."
    }
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <header className="pb-4 border-b">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Analytics Hub</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Gain deeper insights into your consultancy's performance and make data-driven decisions.
        </p>
      </header>

      <Card className="bg-primary/5 border-primary/20 shadow-md">
        <CardHeader>
            <CardTitle className="text-xl text-primary">Core Analytics Areas</CardTitle>
            <CardDescription>
                Explore key dimensions of your consultancy's operations. Detailed visualizations and interactive reports are under active development for each area.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
            {analyticsCategories.map((category) => (
            <Card key={category.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                <div className="flex items-center gap-3">
                    <category.icon className="h-7 w-7 text-muted-foreground" />
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
                <CardDescription className="text-sm pt-1">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="min-h-[80px] flex flex-col items-start justify-center bg-muted/40 rounded-md p-4 border border-dashed">
                    <p className="text-xs text-muted-foreground">{category.details}</p>
                    <p className="text-xs text-muted-foreground/70 mt-2"><em>Data sources: {category.dataSources}</em></p>
                </div>
                </CardContent>
            </Card>
            ))}
        </CardContent>
      </Card>

      <Card className="border-accent/30 bg-accent/5 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-accent-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-accent" />
            Advanced AI-Powered Analytics (Coming Soon)
          </CardTitle>
          <CardDescription>
            The future of Consult Vista analytics will be driven by cutting-edge AI to provide even deeper and more proactive insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {advancedFeatures.map(feature => (
            <div key={feature.title} className="flex items-start gap-3 p-3 border-b last:border-b-0">
              <feature.icon className="h-5 w-5 text-accent/80 mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-md text-accent-foreground/90">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
