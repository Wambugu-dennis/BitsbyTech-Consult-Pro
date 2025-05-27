
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Lightbulb, BarChartBig, AlertTriangle, Cpu, HelpCircle, TrendingUp, TableIcon, PieChartIcon as RechartsPieChartIcon, BarChartIcon as LucideBarChartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, ReferenceDot, LabelList, Cell, Pie, PieChart as RechartsPieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { handleGetBusinessInsight } from './actions';
import type { BusinessInsightOutput, BusinessInsightInput } from '@/ai/flows/generate-business-insight';
import { cn } from '@/lib/utils';
import { financialHealthData as baseFinancialHealthData, initialProjects, initialClients } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Project, Client } from '@/lib/types';

const predictiveChartData = baseFinancialHealthData.map((d, i) => ({ ...d, month: d.month.substring(0,3) })).slice(0, 9);
const forecastMonths = ['Oct', 'Nov', 'Dec'];
forecastMonths.forEach((month, i) => {
  const lastActualRevenue = predictiveChartData[predictiveChartData.length - 1].revenue;
  const lastActualExpenses = predictiveChartData[predictiveChartData.length - 1].expenses;
  predictiveChartData.push({
    month,
    revenue: Math.round(lastActualRevenue * (1 + (Math.random() * 0.1 - 0.03 + (i * 0.02)))),
    expenses: Math.round(lastActualExpenses * (1 + (Math.random() * 0.08 - 0.02 + (i*0.01)))),
    forecastedRevenue: true,
    forecastedExpenses: true,
  });
});

const predictiveChartConfig = {
  revenue: { label: "Revenue ($)", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses ($)", color: "hsl(var(--chart-5))" },
  forecastedRevenue: { label: "Forecasted Revenue ($)", color: "hsl(var(--chart-1))" },
  forecastedExpenses: { label: "Forecasted Expenses ($)", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;


const anomalyData = [
  { name: 'Project Alpha', completionTime: 60, budgetVariance: 5 },
  { name: 'Project Beta', completionTime: 75, budgetVariance: -2 },
  { name: 'Project Gamma', completionTime: 55, budgetVariance: 3 },
  { name: 'Project Delta', completionTime: 120, budgetVariance: 15, isAnomaly: true },
  { name: 'Project Epsilon', completionTime: 65, budgetVariance: -5 },
  { name: 'Project Zeta', completionTime: 80, budgetVariance: 0 },
  { name: 'Project Kappa', completionTime: 45, budgetVariance: 20, isAnomaly: true },
];
const anomalyChartConfig = {
  completionTime: { label: "Completion Time (Days)", color: "hsl(var(--chart-2))" },
  budgetVariance: { label: "Budget Variance (%)", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;


export default function AiInsightsPage() {
  const [insightContext, setInsightContext] = useState('');
  const [insightResult, setInsightResult] = useState<BusinessInsightOutput | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  const [customVisDataSource, setCustomVisDataSource] = useState<string>('');
  const [customVisChartType, setCustomVisChartType] = useState<string>('');
  const [generatedCustomChart, setGeneratedCustomChart] = useState<React.ReactNode | null>(null);
  const [isGeneratingCustomChart, setIsGeneratingCustomChart] = useState(false);

  const onGetInsight = async () => {
    if (!insightContext.trim()) {
      setInsightError('Please enter a question or scenario.');
      return;
    }
    setIsInsightLoading(true);
    setInsightResult(null);
    setInsightError(null);
    const result = await handleGetBusinessInsight({ context: insightContext });
    if ('error' in result) {
      setInsightError(result.error);
    } else {
      setInsightResult(result);
    }
    setIsInsightLoading(false);
  };

  const handleGenerateCustomVisualization = () => {
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
            const data = baseFinancialHealthData.slice(0, 6).map(d => ({ month: d.month.substring(0,3), revenue: d.revenue }));
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
            } else if (!chartNode || (chartNode as JSX.Element).type === 'p') { // if chartNode is still the default error or an empty data message
                 // Keep the existing specific error message if it was set
            }
        }
      } catch (err) {
        console.error("Error generating custom visualization:", err);
        // chartNode will remain the default error message defined at the start of the function
      }
      
      setGeneratedCustomChart(chartNode);
      setIsGeneratingCustomChart(false);
    }, 1000);
  };


  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/analytics">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI-Powered Analytics & Insights</h1>
                <p className="text-muted-foreground">
                Explore advanced analytics capabilities driven by Artificial Intelligence.
                </p>
            </div>
        </div>
      </header>

      {/* Section 1: Predictive Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <CardTitle>Predictive Analytics for Trends</CardTitle>
          </div>
          <CardDescription>
            Leverage historical data and AI to forecast future business trends, resource needs, and revenue projections. This chart shows a simulated revenue and expense forecast.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={predictiveChartConfig} className="h-[350px] w-full [aspect-ratio:auto]">
            <ResponsiveContainer>
              <ComposedChart data={predictiveChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} name="Actual Revenue">
                   <LabelList dataKey="revenue" position="top" formatter={(value: number) => value ? `$${(value/1000).toFixed(0)}k` : ''} fontSize={10} fill="hsl(var(--foreground))"/>
                </Bar>
                <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} name="Actual Expenses" dot={{r:3}}/>
                
                <Line dataKey="revenue" name="Forecasted Revenue" stroke="var(--color-revenue)" strokeDasharray="5 5" type="monotone" connectNulls={true}
                    dot={(props: any) => {
                        if (predictiveChartData[props.index]?.forecastedRevenue) return <ReferenceDot {...props} r={3} fill="var(--color-revenue)" stroke="var(--color-revenue)" />;
                        return null;
                    }}
                    activeDot={(props: any) => {
                         if (predictiveChartData[props.index]?.forecastedRevenue) return <ReferenceDot {...props} r={5} fill="var(--color-revenue)" stroke="var(--color-revenue)" />;
                         return null;
                    }}
                />
                 <Line dataKey="expenses" name="Forecasted Expenses" stroke="var(--color-expenses)" strokeDasharray="5 5" type="monotone" connectNulls={true}
                    dot={(props: any) => {
                        if (predictiveChartData[props.index]?.forecastedExpenses) return <ReferenceDot {...props} r={3} fill="var(--color-expenses)" stroke="var(--color-expenses)" />;
                        return null;
                    }}
                     activeDot={(props: any) => {
                         if (predictiveChartData[props.index]?.forecastedExpenses) return <ReferenceDot {...props} r={5} fill="var(--color-expenses)" stroke="var(--color-expenses)" />;
                         return null;
                    }}
                 />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Section 2: Anomaly Detection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <CardTitle>Anomaly Detection</CardTitle>
          </div>
          <CardDescription>
            Automatically identify unusual patterns or significant deviations in your business data. This chart highlights simulated project anomalies.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <ChartContainer config={anomalyChartConfig} className="h-[350px] w-full [aspect-ratio:auto]">
            <ResponsiveContainer>
                <BarChart data={anomalyData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={0} angle={-30} textAnchor="end" height={50}/>
                    <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: 'Completion Time (Days)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: 'Budget Variance (%)', angle: 90, position: 'insideRight' }} tickFormatter={(value) => `${value}%`}/>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend content={<ChartLegendContent />} />
                    <Bar yAxisId="left" dataKey="completionTime" name="Completion Time (Days)" radius={4}>
                         {anomalyData.map((entry, index) => (
                            <Cell key={`cell-ct-${index}`} fill={entry.isAnomaly ? "hsl(var(--destructive))" : "var(--color-completionTime)"} />
                        ))}
                    </Bar>
                    <Bar yAxisId="right" dataKey="budgetVariance" name="Budget Variance (%)" radius={4}>
                         {anomalyData.map((entry, index) => (
                            <Cell key={`cell-bv-${index}`} fill={entry.isAnomaly ? "hsl(var(--destructive))" : "var(--color-budgetVariance)"} />
                        ))}
                        <LabelList dataKey="budgetVariance" position="top" formatter={(value:number) => `${value}%`} fontSize={10}/>
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Section 3: Customizable Data Visualizations */}
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
                    <label htmlFor="custom-data-source" className="text-sm font-medium text-muted-foreground block mb-1.5">Data Source</label>
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
                    <label htmlFor="custom-chart-type" className="text-sm font-medium text-muted-foreground block mb-1.5">Chart Type</label>
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
                     <label className="text-sm font-medium text-muted-foreground block mb-1.5">Fields to Plot/Display</label>
                    <Input placeholder="e.g., Project Status, Client Tier (Advanced field selection coming soon)" disabled />
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

      {/* Section 4: Personalized Insights & Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-primary" />
            <CardTitle>Personalized Insights & Recommendations</CardTitle>
          </div>
          <CardDescription>
            Receive AI-generated insights and actionable recommendations based on your role, data patterns, and business goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your business question or scenario here... (e.g., 'How can we improve client retention in the tech sector?', 'What are the key risks for upcoming Project Zeta?')"
            value={insightContext}
            onChange={(e) => setInsightContext(e.target.value)}
            rows={4}
            className="text-sm"
          />
          <Button onClick={onGetInsight} disabled={isInsightLoading} className="w-full sm:w-auto">
            {isInsightLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Insight...
              </>
            ) : (
              <> <Cpu className="mr-2 h-4 w-4"/> Get AI Insight</>
            )}
          </Button>

          {insightError && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive">
              <p className="text-sm font-medium flex items-center gap-2"><AlertTriangle size={16}/> Error: {insightError}</p>
            </div>
          )}

          {insightResult && (
            <Card className="bg-muted/30 p-4">
              <CardTitle className="text-lg mb-2">AI Generated Insight:</CardTitle>
              <p className="text-sm mb-3 whitespace-pre-wrap">{insightResult.insight}</p>
              
              <h4 className="font-semibold text-md mt-3 mb-1.5">Actionable Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {insightResult.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
              
              {insightResult.confidenceScore && (
                <p className="text-xs text-muted-foreground mt-3">
                  AI Confidence: {(insightResult.confidenceScore * 100).toFixed(0)}%
                </p>
              )}
              {insightResult.relatedDataPoints && insightResult.relatedDataPoints.length > 0 && (
                 <div className="mt-3">
                    <p className="text-xs text-muted-foreground font-medium">Theoretical Data Points Considered:</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                        {insightResult.relatedDataPoints.map((dp, i) => (
                            <Badge variant="secondary" key={i} className="text-xs">{dp}</Badge>
                        ))}
                    </div>
                 </div>
              )}
            </Card>
          )}
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground flex items-start gap-1.5 pt-4 border-t">
            <HelpCircle size={16} className="shrink-0 mt-0.5"/>
            <span>AI insights are generated based on the provided context and general business knowledge. Always cross-reference with specific company data and expert judgment.</span>
        </CardFooter>
      </Card>
    </div>
  );
}

    