
'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend as RechartsLegend, LabelList, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { Project } from '@/lib/types';
import { initialProjects } from '@/lib/mockData';
import { format, parseISO, differenceInDays, startOfDay } from 'date-fns';
import { PROJECT_STATUS } from '@/lib/constants';

// Prepare data for the chart
const today = startOfDay(new Date());

const pipelineProjects = initialProjects
  .filter(p => p.status === PROJECT_STATUS.IN_PROGRESS || p.status === PROJECT_STATUS.TODO)
  .map(p => ({
    ...p,
    startDateObj: parseISO(p.startDate),
    endDateObj: parseISO(p.endDate),
  }));

const chartConfig = {
  [PROJECT_STATUS.IN_PROGRESS]: { label: PROJECT_STATUS.IN_PROGRESS, color: "hsl(var(--chart-2))" },
  [PROJECT_STATUS.TODO]: { label: PROJECT_STATUS.TODO, color: "hsl(var(--chart-4))" },
  duration: { label: "Duration" }
} satisfies ChartConfig;

// SIMPLIFIED APPROACH FOR THIS ITERATION (Duration Chart)
const simplifiedChartData = pipelineProjects.map(p => ({
  name: p.name,
  duration: differenceInDays(p.endDateObj, p.startDateObj) + 1,
  status: p.status,
  startDate: format(p.startDateObj, 'MMM dd'),
  endDate: format(p.endDateObj, 'MMM dd'),
}));

export default function SimplifiedProjectPipelineChart() {
   if (pipelineProjects.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">No active or upcoming projects in the pipeline.</p>;
  }
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={simplifiedChartData} margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" dataKey="duration" stroke="hsl(var(--muted-foreground))" fontSize={10} label={{ value: 'Duration (Days)', position: 'insideBottom', offset: -5, fontSize:10 }}/>
          <YAxis type="category" dataKey="name" width={150} stroke="hsl(var(--muted-foreground))" fontSize={10} interval={0} />
          <Tooltip content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-background border shadow-sm rounded-md p-2 text-xs">
                  <p className="font-bold mb-0.5">{data.name}</p>
                  <p>Status: {data.status}</p>
                  <p>Duration: {data.duration} days</p>
                  <p>Start: {data.startDate} | End: {data.endDate}</p>
                </div>
              );
            }
            return null;
          }} />
          <RechartsLegend content={<ChartLegendContent />} />
          <Bar dataKey="duration" name="Duration">
            {simplifiedChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartConfig[entry.status as keyof typeof chartConfig]?.color || "hsl(var(--muted))"} />
            ))}
             <LabelList dataKey="duration" position="right" formatter={(value:number) => `${value}d`} fontSize={10} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
