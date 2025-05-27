
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Briefcase, Users, UserCog, DollarSign, Lightbulb, AlertTriangle, BarChartHorizontalBig, Brain, ArrowRight, FileDown, Filter } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import React, { useState, useMemo } from 'react';
import { initialProjects, initialClients, initialConsultants } from '@/lib/mockData'; // Import master data lists

interface AnalyticsCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  reportLink: string;
  dataSources: string;
  chartComponent: React.FC<{ data: any[] }>; // Expect data prop
}

// Base Mock Data for Charts (will be filtered)
const baseProjectProfitabilityData = [
  { id: 'proj101', name: 'Project Alpha (Innovatech)', profitMargin: 25, budget: 50000, actualCost: 37500 },
  { id: 'proj202', name: 'Project Beta (Alpha Solutions)', profitMargin: 18, budget: 120000, actualCost: 98400 },
  { id: 'proj301', name: 'Project Gamma (Beta Corp)', profitMargin: 32, budget: 75000, actualCost: 51000 },
  { id: 'proj105', name: 'Project Delta (Innovatech Cloud)', profitMargin: 15, budget: 200000, actualCost: 170000 },
  { id: 'projNew1', name: 'Project Epsilon (New Client Co)', profitMargin: 22, budget: 90000, actualCost: 70200 },
  { id: 'projNew2', name: 'Project Zeta (Another Client)', profitMargin: 28, budget: 60000, actualCost: 43200 },
  { id: 'projNew3', name: 'Project Kappa (Third Client LLC)', profitMargin: 12, budget: 150000, actualCost: 132000 },
];
const projectProfitabilityChartConfig = {
  profitMargin: { label: 'Profit Margin (%)', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const ProjectProfitabilityChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ChartContainer config={projectProfitabilityChartConfig} className="h-[300px] w-full overflow-x-auto [aspect-ratio:auto]">
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 70, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
        <XAxis 
          dataKey="name" 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
          angle={-45} 
          textAnchor="end"
          interval={0}
          height={70} 
        />
        <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value}%`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar yAxisId="left" dataKey="profitMargin" fill="var(--color-profitMargin)" radius={4} name="Profit Margin (%)" />
      </BarChart>
    </ResponsiveContainer>
  </ChartContainer>
);

const baseClientSatisfactionData = [
  { id: '1', client: 'Innovatech Ltd.', score: 92, segment: 'Strategic' },
  { id: '2', client: 'Alpha Solutions', score: 78, segment: 'Key' },
  { id: '3', client: 'Beta Corp', score: 65, segment: 'Standard' },
  { id: 'clientNew1', client: 'Gamma Industries Global Logistics', score: 88, segment: 'Key' },
  { id: 'clientNew2', client: 'Omega Services & Tech Partnerships', score: 72, segment: 'Standard' },
  { id: 'clientNew3', client: 'Delta Corp Innovations', score: 95, segment: 'Strategic' },
  { id: 'clientNew4', client: 'Epsilon Dynamics Ltd', score: 81, segment: 'Key' },
];
const clientSatisfactionChartConfig = {
  score: { label: 'Satisfaction Score (%)', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const ClientSatisfactionChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ChartContainer config={clientSatisfactionChartConfig} className="h-[300px] w-full overflow-x-auto [aspect-ratio:auto]">
    <ResponsiveContainer>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 180 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" domain={[0, 100]} fontSize={12} tickFormatter={(value) => `${value}%`} />
        <YAxis dataKey="client" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={180} interval={0} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="score" fill="var(--color-score)" radius={4} name="Satisfaction Score (%)" />
      </BarChart>
    </ResponsiveContainer>
  </ChartContainer>
);

const baseConsultantUtilizationData = [
  { month: 'Jan', utilization: 75 }, { month: 'Feb', utilization: 80 }, { month: 'Mar', utilization: 78 },
  { month: 'Apr', utilization: 82 }, { month: 'May', utilization: 70 }, { month: 'Jun', utilization: 85 },
  { month: 'Jul', utilization: 88 }, { month: 'Aug', utilization: 76 }, { month: 'Sep', utilization: 81 },
  { month: 'Oct', utilization: 79 }, { month: 'Nov', utilization: 83 }, { month: 'Dec', utilization: 72 },
];
const consultantUtilizationChartConfig = {
  utilization: { label: 'Avg. Utilization (%)', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

const ConsultantUtilizationChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ChartContainer config={consultantUtilizationChartConfig} className="h-[300px] w-full overflow-x-auto [aspect-ratio:auto]">
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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

const baseFinancialHealthData = [
  { month: 'Jan', revenue: 50000, expenses: 30000 }, { month: 'Feb', revenue: 65000, expenses: 35000 },
  { month: 'Mar', revenue: 58000, expenses: 32000 }, { month: 'Apr', revenue: 72000, expenses: 40000 },
  { month: 'May', revenue: 68000, expenses: 38000 }, { month: 'Jun', revenue: 75000, expenses: 42000 },
  { month: 'Jul', revenue: 82000, expenses: 45000 }, { month: 'Aug', revenue: 78000, expenses: 43000 },
  { month: 'Sep', revenue: 85000, expenses: 48000 }, { month: 'Oct', revenue: 92000, expenses: 50000 },
  { month: 'Nov', revenue: 88000, expenses: 47000 }, { month: 'Dec', revenue: 95000, expenses: 52000 },
];
const financialHealthChartConfig = {
  revenue: { label: 'Revenue ($)', color: 'hsl(var(--chart-1))' },
  expenses: { label: 'Expenses ($)', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

const FinancialHealthChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ChartContainer config={financialHealthChartConfig} className="h-[300px] w-full overflow-x-auto [aspect-ratio:auto]">
    <ResponsiveContainer>
      <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
  const [selectedPeriod, setSelectedPeriod] = useState<string>("last12Months");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [selectedClientId, setSelectedClientId] = useState<string>("all");
  const [selectedConsultantId, setSelectedConsultantId] = useState<string>("all");

  const handleDownloadPdf = (reportName: string) => {
    alert(`PDF download functionality for ${reportName} is under development. For now, you can use your browser's 'Print to PDF' feature on the full report page.`);
  };

  // Memoized and Filtered Data
  const projectProfitabilityFilteredData = useMemo(() => {
    if (selectedProjectId === "all") return baseProjectProfitabilityData;
    return baseProjectProfitabilityData.filter(p => p.id === selectedProjectId);
  }, [selectedProjectId]);

  const clientSatisfactionFilteredData = useMemo(() => {
    if (selectedClientId === "all") return baseClientSatisfactionData;
    return baseClientSatisfactionData.filter(c => c.id === selectedClientId);
  }, [selectedClientId]);

  const consultantUtilizationFilteredData = useMemo(() => {
    let data = baseConsultantUtilizationData;
    if (selectedPeriod === "last3Months") data = data.slice(-3);
    else if (selectedPeriod === "last6Months") data = data.slice(-6);
    // "last12Months" or "all" uses the full 12 months of mock data
    return data;
  }, [selectedPeriod, selectedConsultantId]);

  const financialHealthFilteredData = useMemo(() => {
    let data = baseFinancialHealthData;
    if (selectedPeriod === "last3Months") data = data.slice(-3);
    else if (selectedPeriod === "last6Months") data = data.slice(-6);
    return data;
  }, [selectedPeriod, selectedProjectId, selectedClientId]);


  const getChartData = (categoryId: string) => {
    switch (categoryId) {
      case 'project-success': return projectProfitabilityFilteredData;
      case 'client-relationship': return clientSatisfactionFilteredData;
      case 'consultant-performance': return consultantUtilizationFilteredData;
      case 'financial-health': return financialHealthFilteredData;
      default: return [];
    }
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

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Global Analytics Filters</CardTitle>
          </div>
          <CardDescription>Apply filters to refine the data displayed in the charts below.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="period-filter" className="text-sm font-medium text-muted-foreground block mb-1.5">Period</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger id="period-filter">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last3Months">Last 3 Months</SelectItem>
                <SelectItem value="last6Months">Last 6 Months</SelectItem>
                <SelectItem value="last12Months">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="project-filter" className="text-sm font-medium text-muted-foreground block mb-1.5">Focus Project</label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger id="project-filter">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {initialProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="client-filter" className="text-sm font-medium text-muted-foreground block mb-1.5">Focus Client</label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger id="client-filter">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {initialClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>{client.companyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="consultant-filter" className="text-sm font-medium text-muted-foreground block mb-1.5">Focus Consultant</label>
            <Select value={selectedConsultantId} onValueChange={setSelectedConsultantId} disabled>
              <SelectTrigger id="consultant-filter">
                <SelectValue placeholder="Select consultant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Consultants</SelectItem>
                {initialConsultants.map(consultant => (
                  <SelectItem key={consultant.id} value={consultant.id}>{consultant.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Consultant filter not applied to current overview charts due to aggregated mock data. Detailed consultant reports will allow individual filtering.</p>
          </div>
        </CardContent>
      </Card>

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
                    <category.chartComponent data={getChartData(category.id)} />
                    <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownloadPdf(category.title)}>
                            <FileDown className="mr-2 h-4 w-4" /> Download Sample PDF
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

    