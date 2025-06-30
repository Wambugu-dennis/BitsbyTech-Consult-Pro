
'use client';

import { useState } from 'react';
import { BarChartBig, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Pie, PieChart as RechartsPieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { financialHealthData as baseFinancialHealthData, initialProjects, initialClients } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, parseISO } from 'date-fns';

export default function CustomVisualizationCard() {
  const [customVisDataSource, setCustomVisDataSource] = useState<string>('');
  const [customVisChartType, setCustomVisChartType] = useState<string>('');
  const [generatedCustomChart, setGeneratedCustomChart] = useState<React.ReactNode | null>(null);
  const [isGeneratingCustomChart, setIsGeneratingCustomChart] = useState(false);

  const handleGenerateCustomVisualization = () => {
    if (!customVisDataSource || !customVisChartType) {
      alert("Please select a data source and chart type.");
      return;
    }
    setIsGeneratingCustomChart(true);
    setGeneratedCustomChart(null); 

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
                acc[entry.name] = { label: entry.name, color: `hsl(var(--chart-${(index % 5) + 1}))`};
                return acc;
            }, {} as ChartConfig);

            chartNode = (
              <ChartContainer config={chartConfig} className="h-[300px] w-full [aspect-ratio:auto]">
                <RechartsPieChart>
                  <Tooltip content={<ChartTooltipContent nameKey="value" />} />
                  <Legend content={<ChartLegendContent nameKey="name"/>} />
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                     {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
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
            const data = baseFinancialHealthData.slice(0, 6).map(d => ({ month: format(parseISO(d.date), 'MMM') , revenue: d.actualRevenue }));
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
                    chartNode = <p className="text-muted-foreground text-center p-4">No project data available for table view.</p>;
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
                    chartNode = <p className="text-muted-foreground text-center p-4">No client data available for table view.</p>;
                } else {
                    headers = ["Company Name", "Tier", "Primary Contact", "Industry"];
                    tableData = initialClients.slice(0, 5).map(c => ({
                        companyName: c.companyName,
                        tier: c.clientTier || 'N/A',
                        contact: c.keyContacts[0]?.name || 'N/A',
                        industry: c.industry || 'N/A',
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
        console.error("Error generating custom visualization:", err);
      }
      
      setGeneratedCustomChart(chartNode);
      setIsGeneratingCustomChart(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
           <BarChartBig className="h-6 w-6 text-primary" />
          <CardTitle>Customizable Data Visualizations</CardTitle>
        </div>
        <CardDescription>
          Select a data source and chart type to generate a sample visualization. (This is a simplified demonstration.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/10">
              <div>
                  <Label htmlFor="custom-data-source" className="text-sm font-medium text-muted-foreground block mb-1.5">Data Source</Label>
                  <Select value={customVisDataSource} onValueChange={setCustomVisDataSource}>
                      <SelectTrigger id="custom-data-source"><SelectValue placeholder="Select data source" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="projects">Projects</SelectItem>
                          <SelectItem value="clients">Clients</SelectItem>
                          <SelectItem value="financials">Financials</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div>
                  <Label htmlFor="custom-chart-type" className="text-sm font-medium text-muted-foreground block mb-1.5">Chart Type</Label>
                  <Select value={customVisChartType} onValueChange={setCustomVisChartType}>
                      <SelectTrigger id="custom-chart-type"><SelectValue placeholder="Select chart type" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="pie">Pie Chart</SelectItem>
                          <SelectItem value="table">Data Table</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div className="md:col-span-2">
                  <Label htmlFor="fields-to-plot" className="text-sm font-medium text-muted-foreground block mb-1.5">Fields to Plot/Display</Label>
                  <Input id="fields-to-plot" placeholder="e.g., Project Status, Client Tier (Advanced field selection coming soon)" disabled />
                  <p className="text-xs text-muted-foreground mt-1">Note: Dynamic field selection for plotting is a planned future enhancement for a more advanced report builder.</p>
              </div>
          </div>
          <div className="text-right">
              <Button onClick={handleGenerateCustomVisualization} disabled={isGeneratingCustomChart || !customVisDataSource || !customVisChartType}>
                  {isGeneratingCustomChart ? (
                      <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                      </>
                  ) : (
                      <> <Cpu className="mr-2 h-4 w-4" /> Generate Custom Visualization </>
                  )}
              </Button>
          </div>
           {generatedCustomChart && (
            <div className="mt-6 p-4 border rounded-lg bg-card shadow-md w-full">
              <h4 className="text-md font-semibold mb-3 text-center text-primary">Generated Visualization:</h4>
              {generatedCustomChart}
            </div>
          )}
          {!generatedCustomChart && !isGeneratingCustomChart && (
              <div className="mt-6 p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground bg-muted/30">
                  <p className="text-base">Your custom visualization will appear here.</p>
                  <p className="text-sm">Select a data source and chart type, then click "Generate Custom Visualization" to see a sample.</p>
              </div>
          )}
      </CardContent>
    </Card>
  );
}
