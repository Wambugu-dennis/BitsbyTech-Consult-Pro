
'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Line, ComposedChart, Legend as RechartsLegend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { RevenueData } from '@/lib/types';
import { historicalRevenueData } from '@/lib/mockData'; // Import historical data
import { addMonths, format } from 'date-fns';

// Calculate projected data
const lastHistoricalEntry = historicalRevenueData[historicalRevenueData.length - 1];
const projectedMonthsCount = 3; // Project for 3 months
const projectedData: RevenueData[] = [];
let lastActualRevenue = lastHistoricalEntry.actualRevenue || 0;
let lastDate = new Date(lastHistoricalEntry.date);

for (let i = 1; i <= projectedMonthsCount; i++) {
  lastDate = addMonths(lastDate, 1);
  // Simple projection: 5% growth on last actual revenue for demo
  lastActualRevenue = lastActualRevenue * 1.02; 
  projectedData.push({
    date: format(lastDate, 'yyyy-MM-dd'),
    month: format(lastDate, 'MMM'),
    forecastedRevenue: Math.round(lastActualRevenue),
  });
}

const chartData: RevenueData[] = [...historicalRevenueData, ...projectedData];

const chartConfig = {
  actualRevenue: {
    label: 'Actual Revenue',
    color: 'hsl(var(--chart-1))',
  },
  forecastedRevenue: {
    label: 'Forecasted Revenue',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="actualRevenue" fill="var(--color-actualRevenue)" radius={4} name="Actual Revenue" />
          <Line 
            type="monotone" 
            dataKey="forecastedRevenue" 
            stroke="var(--color-forecastedRevenue)" 
            strokeWidth={2} 
            name="Forecasted Revenue" 
            dot={{ r: 4 }} 
            strokeDasharray="5 5"
            connectNulls // Important for connecting the last actual point to the first forecast point if desired, or manage data to ensure smooth transition
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
