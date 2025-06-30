
'use client';

import { useState, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, LabelList, ReferenceDot } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart";
import { financialHealthData as baseFinancialHealthData } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import type { RevenueData } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { format, addMonths, parseISO, formatISO } from 'date-fns';

const predictiveChartBaseConfig = {
  actualRevenue: { label: "Actual Revenue ($)", color: "hsl(var(--chart-2))" }, 
  actualExpenses: { label: "Actual Expenses ($)", color: "hsl(var(--chart-5))" }, 
  forecastedRevenueValue: { label: "Forecasted Revenue ($)", color: "hsl(var(--chart-2))" }, 
  forecastedExpensesValue: { label: "Forecasted Expenses ($)", color: "hsl(var(--chart-5))" }, 
} satisfies ChartConfig;

export default function PredictiveAnalyticsCard() {
  const [assumedAnnualGrowthRate, setAssumedAnnualGrowthRate] = useState<number>(5);

  const predictiveChartData = useMemo(() => {
    const historicalData = baseFinancialHealthData.map(d => ({
      month: format(parseISO(d.date), 'MMM'), // Display month abbreviation
      fullDate: d.date, // Keep full date for sorting/reference
      actualRevenue: d.actualRevenue,
      actualExpenses: d.actualExpenses,
      isRevenueForecasted: false,
      isExpensesForecasted: false,
    }));

    // Sort historical data to be sure
    historicalData.sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
    
    const lastActualEntry = historicalData[historicalData.length - 1];
    let lastRevenue = lastActualEntry?.actualRevenue || 0;
    let lastExpenses = lastActualEntry?.actualExpenses || 0;
    let lastDate = lastActualEntry ? parseISO(lastActualEntry.fullDate) : new Date();

    const forecast: RevenueData[] = [];
    const monthlyGrowthRate = assumedAnnualGrowthRate / 100 / 12;

    for (let i = 1; i <= 12; i++) {
      const forecastDate = addMonths(lastDate, i);
      lastRevenue = lastRevenue * (1 + monthlyGrowthRate);
      lastExpenses = lastExpenses * (1 + monthlyGrowthRate);
      
      forecast.push({
        date: formatISO(forecastDate, {representation: 'date'}), // Keep full date for internal use
        month: format(forecastDate, 'MMM'), // For X-axis label
        forecastedRevenueValue: Math.round(lastRevenue),
        forecastedExpensesValue: Math.round(lastExpenses),
        isRevenueForecasted: true,
        isExpensesForecasted: true,
      });
    }
    const displayHistorical = historicalData.slice(-12);
    return [...displayHistorical, ...forecast];
  }, [assumedAnnualGrowthRate]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary" />
          <CardTitle>Predictive Analytics for Trends</CardTitle>
        </div>
        <CardDescription>
          Leverage historical data and AI to forecast future business trends. Adjust the assumed annual growth rate to see different projections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="growth-rate-filter" className="text-sm font-medium text-muted-foreground shrink-0">
            Assumed Annual Growth Rate (%):
          </Label>
          <Input
            id="growth-rate-filter"
            type="number"
            value={assumedAnnualGrowthRate}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setAssumedAnnualGrowthRate(isNaN(val) ? 0 : val);
            }}
            className="w-full sm:w-[120px]"
            min="0"
            max="100"
            step="0.5"
          />
        </div>
        <ChartContainer config={predictiveChartBaseConfig} className="h-[350px] w-full [aspect-ratio:auto]">
          <ResponsiveContainer>
            <ComposedChart data={predictiveChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              
              <Bar dataKey="actualRevenue" fill="var(--color-actualRevenue)" radius={4} name="Actual Revenue">
                 <LabelList dataKey="actualRevenue" position="top" formatter={(value: number) => value ? `$${(value/1000).toFixed(0)}k` : ''} fontSize={10} fill="hsl(var(--foreground))"/>
              </Bar>
              <Line type="monotone" dataKey="actualExpenses" stroke="var(--color-actualExpenses)" strokeWidth={2} name="Actual Expenses" dot={{r:3}}/>
              
              <Line dataKey="forecastedRevenueValue" name="Forecasted Revenue" stroke="var(--color-forecastedRevenueValue)" strokeDasharray="5 5" type="monotone" connectNulls={true}
                  dot={(props: any) => {
                      if (predictiveChartData[props.index]?.isRevenueForecasted) return <ReferenceDot {...props} r={3} fill="var(--color-forecastedRevenueValue)" stroke="var(--color-forecastedRevenueValue)" />;
                      return null;
                  }}
                  activeDot={(props: any) => {
                       if (predictiveChartData[props.index]?.isRevenueForecasted) return <ReferenceDot {...props} r={5} fill="var(--color-forecastedRevenueValue)" stroke="var(--color-forecastedRevenueValue)" />;
                       return null;
                  }}
              />
               <Line dataKey="forecastedExpensesValue" name="Forecasted Expenses" stroke="var(--color-forecastedExpensesValue)" strokeDasharray="5 5" type="monotone" connectNulls={true}
                  dot={(props: any) => {
                      if (predictiveChartData[props.index]?.isExpensesForecasted) return <ReferenceDot {...props} r={3} fill="var(--color-forecastedExpensesValue)" stroke="var(--color-forecastedExpensesValue)" />;
                      return null;
                  }}
                   activeDot={(props: any) => {
                       if (predictiveChartData[props.index]?.isExpensesForecasted) return <ReferenceDot {...props} r={5} fill="var(--color-forecastedExpensesValue)" stroke="var(--color-forecastedExpensesValue)" />;
                       return null;
                  }}
               />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
