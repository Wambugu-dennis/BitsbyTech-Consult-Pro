
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings2, 
  Cpu,
  CalendarClock,
  DownloadCloud,
  Brain,
} from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initialProjects, initialClients, financialHealthData as baseFinancialHealthData } from '@/lib/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from 'date-fns';

export default function AdvancedReporting() {
  const [customVisDataSource, setCustomVisDataSource] = useState<string>('');
  const [customVisChartType, setCustomVisChartType] = useState<string>('');
  const [generatedCustomChart, setGeneratedCustomChart] = useState<React.ReactNode | null>(null);
  const [isGeneratingCustomChart, setIsGeneratingCustomChart] = useState(false);

  const handleGenerateCustomReportVisualization = () => {
    if (!customVisDataSource || !customVisChartType) {
      alert("Please select a data source and chart type.");
      return;
    }
    setIsGeneratingCustomChart(true);
    setGeneratedCustomChart(null); 

    // Simulate generation delay
    setTimeout(() => {
      let chartNode: React.ReactNode = (
        <div className="p-4 text-center text-destructive border border-destructive/50 rounded-md bg-destructive/10">
          <p className="font-semibold">Visualization Not Generated</p>
          <p className="text-sm">The selected combination of data source ({customVisDataSource}) and chart type ({customVisChartType}) is not yet supported or an error occurred.</p>
        </div>
      );

      try {
        if (customVisDataSource === 'projects' && customVisChartType === 'bar') {
           if (initialProjects.length === 0) {
            chartNode = <p className="text-muted-foreground text-center p-4">No project data available to generate a bar chart.</p>;
          } else {
            const projectStatusCounts = initialProjects.reduce((acc, project) => {
              acc[project.status] = (acc[project.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
            const data = Object.entries(projectStatusCounts).map(([status, count]) => ({ status, count }));
            const chartConfig = { count: { label: "Projects", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;
            chartNode = (
              <ChartContainer config={chartConfig} className="h-[300px] w-full [aspect-ratio:auto]">
                <BarChart data={data} layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" dataKey="count" />
                  <YAxis type="category" dataKey="status" width={100} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="count" name="Project Count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ChartContainer>
            );
          }
        } else if (customVisDataSource === 'clients' && customVisChartType === 'pie') {
          if (initialClients.length === 0) {
            chartNode = <p className="text-muted-foreground text-center p-4">No client data available to generate a pie chart.</p>;
          } else {
            const clientTierCounts = initialClients.reduce((acc, client) => {
              const tier = client.clientTier || 'Other';
              acc[tier] = (acc[tier] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
            const data = Object.entries(clientTierCounts).map(([name, value]) => ({ name, value }));
            const chartConfig = data.reduce((acc, entry, index) => {
                acc[entry.name] = { label: entry.name, color: `hsl(var(--chart-${(index % 5) + 1}))`}; // Cycle through 5 chart colors
                return acc;
            }, {} as ChartConfig);

            chartNode = (
              <ChartContainer config={chartConfig} className="h-[300px] w-full [aspect-ratio:auto]">
                <RechartsPieChart>
                  <Tooltip content={<ChartTooltipContent nameKey="value" />} />
                  <Legend content={<ChartLegendContent nameKey="name"/>} />
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                     {data.map((entry) => ( // Removed index, key is cell-<name>
                        <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />
                      ))}
                  </Pie>
                </RechartsPieChart>
              </ChartContainer>
            );
          }
        } else if (customVisDataSource === 'financials' && customVisChartType === 'line') {
          if (baseFinancialHealthData.length === 0) {
            chartNode = <p className="text-muted-foreground text-center p-4">No financial data available to generate a line chart.</p>;
          } else {
            const data = baseFinancialHealthData.slice(0, 6).map(d => ({ month: format(parseISO(d.date), 'MMM'), revenue: d.actualRevenue }));
            const chartConfig = { revenue: { label: "Revenue", color: "hsl(var(--chart-2))" } } satisfies ChartConfig;
            chartNode = (
              <ChartContainer config={chartConfig} className="h-[300px] w-full [aspect-ratio:auto]">
                <LineChart data={data}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{r:4}} />
                </LineChart>
              </ChartContainer>
            );
          }
        } else if (customVisChartType === 'table') {
            let tableData: any[] = [];
            let headers: string[] = [];
            if (customVisDataSource === 'projects') {
                if (initialProjects.length === 0) {
                    chartNode = <p className="text-muted-foreground text-center p-4">No project data for table.</p>;
                } else {
                    headers = ["Project Name", "Status", "Client", "Start Date", "End Date"];
                    tableData = initialProjects.slice(0, 5).map(p => ({
                        name: p.name,
                        status: p.status,
                        client: p.clientNameCache,
                        startDate: p.startDate,
                        endDate: p.endDate,
                    }));
                }
            } else if (customVisDataSource === 'clients') {
                 if (initialClients.length === 0) {
                    chartNode = <p className="text-muted-foreground text-center p-4">No client data for table.</p>;
                } else {
                    headers = ["Company Name", "Tier", "Primary Contact", "Industry"];
                    tableData = initialClients.slice(0, 5).map(c => ({
                        companyName: c.companyName,
                        tier: c.clientTier || 'N/A',
                        contact: c.keyContacts[0]?.name || 'N/A',
                        industry: c.industry || 'N/A',
                    }));
                }
            } else if (customVisDataSource === 'financials') {
                if (baseFinancialHealthData.length === 0) {
                     chartNode = <p className="text-muted-foreground text-center p-4">No financial data for table.</p>;
                } else {
                    headers = ["Period", "Revenue", "Expenses"];
                    tableData = baseFinancialHealthData.slice(0,5).map(f => ({
                        period: format(parseISO(f.date), 'MMM yyyy'),
                        revenue: f.actualRevenue?.toLocaleString() || 'N/A',
                        expenses: f.actualExpenses?.toLocaleString() || 'N/A'
                    }));
                }
            }

            if (tableData.length > 0) {
                 chartNode = (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>{headers.map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {headers.map(header => (
                              <TableCell key={`${rowIndex}-${header}`}>
                                {row[header.toLowerCase().replace(/\s+/g, '')] || row[Object.keys(row)[headers.indexOf(header)]] }
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
            } else if (!chartNode || (chartNode as JSX.Element).type === 'p') { 
                 // Keep the existing specific error message if it was set
            }
        }
      } catch (err) {
        console.error("Error generating custom report visualization:", err);
        // The generic error message in chartNode will be used
      }
      
      setGeneratedCustomChart(chartNode);
      setIsGeneratingCustomChart(false);
    }, 1000); // Simulate delay
  };

  return (
    <Card className="border-accent/30 bg-accent/5 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-accent-foreground flex items-center gap-2">
          Advanced Reporting Capabilities
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Future enhancements to provide deeper insights and more flexible reporting options.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Custom Report Builder & Visualization Tools */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings2 className="h-5 w-5 text-accent" />
            <h4 className="font-semibold text-md">Custom Report Builder & Visualization Tools</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Design and save tailored reports by selecting specific data points, applying filters, and choosing from a variety of advanced chart types and interactive visualizations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-background/50">
              <div>
                  <Label htmlFor="custom-report-data-source" className="text-sm font-medium text-muted-foreground block mb-1.5">Data Source</Label>
                  <Select value={customVisDataSource} onValueChange={setCustomVisDataSource}>
                      <SelectTrigger id="custom-report-data-source"><SelectValue placeholder="Select data source" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="projects">Projects</SelectItem>
                          <SelectItem value="clients">Clients</SelectItem>
                          <SelectItem value="financials">Financials (Revenue/Expense)</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div>
                  <Label htmlFor="custom-report-chart-type" className="text-sm font-medium text-muted-foreground block mb-1.5">Chart/Output Type</Label>
                  <Select value={customVisChartType} onValueChange={setCustomVisChartType}>
                      <SelectTrigger id="custom-report-chart-type"><SelectValue placeholder="Select chart type" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="pie">Pie Chart</SelectItem>
                          <SelectItem value="table">Data Table</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div className="md:col-span-2">
                  <Label htmlFor="report-fields-to-plot" className="text-sm font-medium text-muted-foreground block mb-1.5">Fields to Plot/Display</Label>
                  <Input id="report-fields-to-plot" placeholder="e.g., Project Status, Client Tier (Advanced field selection coming soon)" disabled />
                  <p className="text-xs text-muted-foreground mt-1">Note: Dynamic field selection for plotting is a planned future enhancement for a more advanced report builder.</p>
              </div>
          </div>
          <div className="text-right mt-3">
              <Button onClick={handleGenerateCustomReportVisualization} disabled={isGeneratingCustomChart || !customVisDataSource || !customVisChartType}>
                  {isGeneratingCustomChart ? (
                      <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                      </>
                  ) : (
                      <> <Cpu className="mr-2 h-4 w-4" /> Generate Visualization </>
                  )}
              </Button>
          </div>
          {generatedCustomChart && (
            <div className="mt-4 p-4 border rounded-lg bg-card shadow-sm w-full">
              <h5 className="text-md font-semibold mb-3 text-center text-primary">Generated Custom Visualization:</h5>
              {generatedCustomChart}
            </div>
          )}
          {!generatedCustomChart && !isGeneratingCustomChart && (
              <div className="mt-4 p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground bg-muted/30">
                  <p className="text-sm">Your custom visualization will appear here. Select a data source and chart type, then click "Generate Visualization".</p>
              </div>
          )}
        </div>

        <Separator />

        {/* Scheduled Reporting */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock className="h-5 w-5 text-accent" />
            <h4 className="font-semibold text-md">Scheduled Reporting</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Automate the generation and email delivery of key reports on a recurring basis (daily, weekly, monthly) to stay informed without manual effort.
          </p>
           <div className="p-4 border rounded-lg bg-background/50 space-y-3">
              <p className="text-xs text-center text-muted-foreground italic">Configuration Preview (Planned Feature)</p>
              <Select disabled>
                  <SelectTrigger><SelectValue placeholder="Select Report to Schedule" /></SelectTrigger>
              </Select>
              <Input disabled placeholder="Recipient Emails (comma-separated)" />
              <Select disabled>
                <SelectTrigger><SelectValue placeholder="Select Frequency (e.g., Weekly)" /></SelectTrigger>
              </Select>
              <Button disabled className="w-full sm:w-auto">Save Schedule</Button>
          </div>
        </div>

        <Separator />

        {/* Flexible Export Options */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DownloadCloud className="h-5 w-5 text-accent" />
            <h4 className="font-semibold text-md">Flexible Export Options</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Export report data and visualizations in various formats including PDF for presentation, CSV and Excel for further data analysis or integration with other tools.
          </p>
          <div className="p-4 border rounded-lg bg-background/50 text-center">
              <p className="text-xs text-muted-foreground italic mb-2">Export options will be available on generated reports.</p>
              <div className="flex justify-center gap-2">
                  <Button variant="outline" disabled size="sm"><FileDown className="mr-1 h-4 w-4"/>Export as PDF</Button>
                  <Button variant="outline" disabled size="sm"><FileDown className="mr-1 h-4 w-4"/>Export as CSV</Button>
                  <Button variant="outline" disabled size="sm"><FileDown className="mr-1 h-4 w-4"/>Export as Excel</Button>
              </div>
          </div>
        </div>
        
        <Separator />

        {/* Natural Language Report Generation (AI) */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-5 w-5 text-accent" />
            <h4 className="font-semibold text-md">Natural Language Report Generation (AI)</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            A future capability to leverage AI for generating narrative summaries that explain key data trends, insights, and anomalies found in your reports, making complex data easier to understand.
          </p>
        </div>

         <div className="mt-4 p-3 bg-muted/50 rounded-md border text-center">
          <p className="text-sm text-muted-foreground">These advanced reporting features are part of our ongoing development roadmap and will be rolled out in future updates.</p>
        </div>
      </CardContent>
    </Card>
  );
}
