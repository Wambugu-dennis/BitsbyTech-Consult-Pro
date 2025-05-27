
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Lightbulb, BarChartBig, AlertTriangle, Cpu, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, ReferenceDot, LabelList } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart";
import { handleGetBusinessInsight } from './actions';
import type { BusinessInsightOutput, BusinessInsightInput } from '@/ai/flows/generate-business-insight';
import { cn } from '@/lib/utils';
import { financialHealthData as baseFinancialHealthData } from '@/lib/mockData'; // Re-using some existing mock data for demonstration


const predictiveChartData = baseFinancialHealthData.map((d, i) => ({ ...d, month: d.month.substring(0,3) })).slice(0, 9); // Take first 9 months
const forecastMonths = ['Oct', 'Nov', 'Dec'];
forecastMonths.forEach((month, i) => {
  const lastActualRevenue = predictiveChartData[predictiveChartData.length - 1].revenue;
  const lastActualExpenses = predictiveChartData[predictiveChartData.length - 1].expenses;
  predictiveChartData.push({
    month,
    revenue: Math.round(lastActualRevenue * (1 + (Math.random() * 0.1 - 0.03 + (i * 0.02)))), // Slight random growth
    expenses: Math.round(lastActualExpenses * (1 + (Math.random() * 0.08 - 0.02 + (i*0.01)))),
    forecastedRevenue: true,
    forecastedExpenses: true,
  });
});

const predictiveChartConfig = {
  revenue: { label: "Revenue ($)", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses ($)", color: "hsl(var(--chart-5))" },
  forecastedRevenue: { label: "Forecasted Revenue ($)", color: "hsl(var(--chart-1))",
    component: ({ points, ...props }: any) => (
      <Line {...props} type="monotone" strokeDasharray="5 5" strokeWidth={2} dot={false} />
    ),
  },
  forecastedExpenses: { label: "Forecasted Expenses ($)", color: "hsl(var(--chart-5))",
    component: ({ points, ...props }: any) => (
       <Line {...props} type="monotone" strokeDasharray="5 5" strokeWidth={2} dot={false} />
    ),
  },
} satisfies ChartConfig;


const anomalyData = [
  { name: 'Project Alpha', completionTime: 60, budgetVariance: 5 },   // days, %
  { name: 'Project Beta', completionTime: 75, budgetVariance: -2 },
  { name: 'Project Gamma', completionTime: 55, budgetVariance: 3 },
  { name: 'Project Delta', completionTime: 120, budgetVariance: 15, isAnomaly: true }, // Anomaly
  { name: 'Project Epsilon', completionTime: 65, budgetVariance: -5 },
  { name: 'Project Zeta', completionTime: 80, budgetVariance: 0 },
  { name: 'Project Kappa', completionTime: 45, budgetVariance: 20, isAnomaly: true }, // Anomaly
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

  const [customVisDataSource, setCustomVisDataSource] = useState('');
  const [customVisChartType, setCustomVisChartType] = useState('');


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
          <ChartContainer config={predictiveChartConfig} className="h-[350px] w-full">
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
                
                {/* Forecasted parts */}
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
           <ChartContainer config={anomalyChartConfig} className="h-[350px] w-full">
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
            Build and save custom reports and dashboards tailored to your specific needs. (Full builder functionality coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
                <div>
                    <label htmlFor="custom-data-source" className="text-sm font-medium text-muted-foreground block mb-1.5">Data Source</label>
                    <Select value={customVisDataSource} onValueChange={setCustomVisDataSource} disabled>
                        <SelectTrigger id="custom-data-source"><SelectValue placeholder="Select data source" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="projects">Projects</SelectItem>
                            <SelectItem value="clients">Clients</SelectItem>
                            <SelectItem value="consultants">Consultants</SelectItem>
                            <SelectItem value="financials">Financials</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="custom-chart-type" className="text-sm font-medium text-muted-foreground block mb-1.5">Chart Type</label>
                    <Select value={customVisChartType} onValueChange={setCustomVisChartType} disabled>
                        <SelectTrigger id="custom-chart-type"><SelectValue placeholder="Select chart type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bar">Bar Chart</SelectItem>
                            <SelectItem value="line">Line Chart</SelectItem>
                            <SelectItem value="pie">Pie Chart</SelectItem>
                            <SelectItem value="table">Data Table</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-3">
                     <label className="text-sm font-medium text-muted-foreground block mb-1.5">Fields to Plot/Display</label>
                    <Input placeholder="e.g., Project Status, Client Tier, Revenue (Coming Soon)" disabled />
                </div>
            </div>
            <div className="text-right">
                <Button disabled>
                    <Cpu className="mr-2 h-4 w-4" />
                    Generate & Save Custom Report
                </Button>
            </div>
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
