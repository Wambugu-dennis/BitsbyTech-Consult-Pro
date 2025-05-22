'use client';

import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ProjectStatusData } from '@/lib/types';

const chartData: ProjectStatusData[] = [
  { status: 'On Track', count: 15, fill: 'hsl(var(--chart-1))' },
  { status: 'At Risk', count: 5, fill: 'hsl(var(--chart-4))' },
  { status: 'Delayed', count: 2, fill: 'hsl(var(--chart-5))' },
  { status: 'Completed', count: 30, fill: 'hsl(var(--chart-2))' },
];

const chartConfig = {
  count: {
    label: 'Projects',
  },
  'On Track': { label: 'On Track', color: 'hsl(var(--chart-1))' },
  'At Risk': { label: 'At Risk', color: 'hsl(var(--chart-4))' },
  'Delayed': { label: 'Delayed', color: 'hsl(var(--chart-5))' },
  'Completed': { label: 'Completed', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

export default function ProjectStatusChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
          <Pie data={chartData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({payload, percent}) => `${(percent * 100).toFixed(0)}%`}>
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.status}`} fill={entry.fill} />
            ))}
          </Pie>
           <ChartLegend
            content={<ChartLegendContent nameKey="status" />}
            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
