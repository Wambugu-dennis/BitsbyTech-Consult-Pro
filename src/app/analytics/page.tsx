
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TrendingUp, Briefcase, Users, UserCog, DollarSign, Lightbulb, AlertTriangle, BarChartHorizontalBig, Brain, ArrowRight, FileDown } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface AnalyticsCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  reportLink: string;
  dataSources: string;
  chartComponent: React.FC;
}

// Mock Data for Charts

// 1. Project Success Metrics: Profitability
const projectProfitabilityData = [
  { name: 'Project Alpha', profitMargin: 25, budget: 50000, actualCost: 37500 },
  { name: 'Project Beta', profitMargin: 18, budget: 120000, actualCost: 98400 },
  { name: 'Project Gamma', profitMargin: 32, budget: 75000, actualCost: 51000 },
  { name: 'Project Delta', profitMargin: 15, budget: 200000, actualCost: 170000 },
  { name: 'Project Epsilon', profitMargin: 22, budget: 90000, actualCost: 70200 },
];
const projectProfitabilityChartConfig = {
  profitMargin: { label: 'Profit Margin (%)', color: 'hsl(var(--chart-1))' },
  budget: { label: 'Budget ($)', color: 'hsl(var(--chart-2))' },
  actualCost: { label: 'Actual Cost ($)', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

const ProjectProfitabilityChart = () => (
  <ChartContainer config={projectProfitabilityChartConfig} className="h-[300px] w-full">
    <ResponsiveContainer>
      <BarChart data={projectProfitabilityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value}%`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar yAxisId="left" dataKey="profitMargin" fill="var(--color-profitMargin)" radius={4} name="Profit Margin (%)" />
      </BarChart>
    </ResponsiveContainer>
  </ChartContainer>
);

// 2. Client Relationship Insights: Satisfaction Scores
const clientSatisfactionData = [
  { client: 'Innovatech Ltd.', score: 92, segment: 'Strategic' },
  { client: 'Alpha Solutions', score: 78, segment: 'Key' },
  { client: 'Beta Corp', score: 65, segment: 'Standard' },
  { client: 'Gamma Industries', score: 88, segment: 'Key' },
  { client: 'Omega Services', score: 72, segment: 'Standard' },
];
const clientSatisfactionChartConfig = {
  score: { label: 'Satisfaction Score (%)', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const ClientSatisfactionChart = () => (
  <ChartContainer config={clientSatisfactionChartConfig} className="h-[300px] w-full">
    <ResponsiveContainer>
      <BarChart data={clientSatisfactionData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 50 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" domain={[0, 100]} fontSize={12} tickFormatter={(value) => `${value}%`} />
        <YAxis dataKey="client" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="score" fill="var(--color-score)" radius={4} name="Satisfaction Score (%)" />
      </BarChart>
    </ResponsiveContainer>
  </ChartContainer>
);

// 3. Consultant Performance & Utilization: Average Utilization
const consultantUtilizationData = [
  { month: 'Jan', utilization: 75 }, { month: 'Feb', utilization: 80 }, { month: 'Mar', utilization: 78 },
  { month: 'Apr', utilization: 82 }, { month: 'May', utilization: 70 }, { month: 'Jun', utilization: 85 },
  { month: 'Jul', utilization: 88 },
];
const consultantUtilizationChartConfig = {
  utilization: { label: 'Avg. Utilization (%)', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

const ConsultantUtilizationChart = () => (
  <ChartContainer config={consultantUtilizationChartConfig} className="h-[300px] w-full">
    <ResponsiveContainer>
      <LineChart data={consultantUtilizationData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} fontSize={12} tickFormatter={(value) => `${value}%`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line type="monotone" dataKey="utilization" stroke="var(--color-utilization)" strokeWidth={2} dot={false} name="Avg. Utilization (%)" />
      </LineChart>
    </ResponsiveContainer>
  </ChartContainer>
);

// 4. Financial Health Indicators: Revenue vs. Expenses
const financialHealthData = [
  { month: 'Jan', revenue: 50000, expenses: 30000 }, { month: 'Feb', revenue: 65000, expenses: 35000 },
  { month: 'Mar', revenue: 58000, expenses: 32000 }, { month: 'Apr', revenue: 72000, expenses: 40000 },
  { month: 'May', revenue: 68000, expenses: 38000 }, { month: 'Jun', revenue: 75000, expenses: 42000 },
];
const financialHealthChartConfig = {
  revenue: { label: 'Revenue ($)', color: 'hsl(var(--chart-1))' },
  expenses: { label: 'Expenses ($)', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

const FinancialHealthChart = () => (
  <ChartContainer config={financialHealthChartConfig} className="h-[300px] w-full">
    <ResponsiveContainer>
      <ComposedChart data={financialHealthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} name="Revenue" />
        <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} name="Expenses" />
      </ComposedChart>
    </ResponsiveContainer>
  </ChartContainer>
);


const analyticsCategories: AnalyticsCategory[] = [
  {
    id: "project-success",
    icon: Briefcase,
    title: "Project Success Metrics",
    description: "Analyze project profitability, on-time delivery, scope adherence, and resource efficiency.",
    reportLink: "/analytics/project-success-report",
    dataSources: "Project Management, Financial Module, Resource Allocation",
    chartComponent: ProjectProfitabilityChart,
  },
  {
    id: "client-relationship",
    icon: Users,
    title: "Client Relationship Insights",
    description: "Track client satisfaction, engagement levels, retention rates, and identify growth opportunities or at-risk accounts.",
    reportLink: "/analytics/client-relationship-report",
    dataSources: "Client Management, Communication Logs, Feedback Systems",
    chartComponent: ClientSatisfactionChart,
  },
  {
    id: "consultant-performance",
    icon: UserCog,
    title: "Consultant Performance & Utilization",
    description: "Monitor consultant utilization, billable hours, project contributions, skill demand, and overall team efficiency.",
    reportLink: "/analytics/consultant-performance-report",
    dataSources: "Resource Management, Project Tracking, Timesheet Data",
    chartComponent: ConsultantUtilizationChart,
  },
  {
    id: "financial-health",
    icon: DollarSign,
    title: "Financial Health Indicators",
    description: "Visualize revenue streams, expense structures, profit margins by service/client, and cash flow dynamics.",
    reportLink: "/analytics/financial-health-report",
    dataSources: "Financial Module (Invoicing, Expenses, Budgets)",
    chartComponent: FinancialHealthChart,
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

  const handleDownloadPdf = (reportName: string) => {
    alert(`PDF download functionality for ${reportName} is under development. For now, you can use your browser's 'Print to PDF' feature on the full report page.`);
  };

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
                Explore key dimensions of your consultancy's operations. Expand each section to view sample charts and access detailed reports.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-4">
            {analyticsCategories.map((category) => (
              <AccordionItem value={category.id} key={category.id} className="border rounded-lg bg-card hover:shadow-lg transition-shadow">
                <AccordionTrigger className="p-4 hover:no-underline">
                  <div className="flex items-start gap-4 text-left">
                    <category.icon className="h-8 w-8 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="border-t pt-4">
                    <category.chartComponent />
                    <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownloadPdf(category.title)}>
                            <FileDown className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                        <Button asChild variant="default" size="sm">
                          <Link href={category.reportLink}>
                            View Full Report <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground/70 mt-2 text-right"><em>Data sources: {category.dataSources}</em></p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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

