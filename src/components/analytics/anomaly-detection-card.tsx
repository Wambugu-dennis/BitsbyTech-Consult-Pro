
'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart";
import { Label } from '@/components/ui/label';

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

export default function AnomalyDetectionCard() {
  const [selectedAnomalyProjectName, setSelectedAnomalyProjectName] = useState<string>("all");
  
  const filteredAnomalyData = useMemo(() => {
    if (selectedAnomalyProjectName === "all") {
      return anomalyData;
    }
    return anomalyData.filter(p => p.name === selectedAnomalyProjectName);
  }, [selectedAnomalyProjectName]);

  return (
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
         <div className="mb-4">
          <Label htmlFor="anomaly-project-filter" className="text-sm font-medium text-muted-foreground">Filter by Project:</Label>
          <Select value={selectedAnomalyProjectName} onValueChange={setSelectedAnomalyProjectName}>
            <SelectTrigger id="anomaly-project-filter" className="w-full md:w-[250px] mt-1">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {anomalyData.map((project) => (
                <SelectItem key={project.name} value={project.name}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
         <ChartContainer config={anomalyChartConfig} className="h-[350px] w-full [aspect-ratio:auto]">
          <ResponsiveContainer>
              <BarChart data={filteredAnomalyData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={0} angle={filteredAnomalyData.length > 1 ? -30 : 0} textAnchor="end" height={50}/>
                  <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: 'Completion Time (Days)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: 'Budget Variance (%)', angle: 90, position: 'insideRight' }} tickFormatter={(value) => `${value}%`}/>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Bar yAxisId="left" dataKey="completionTime" name="Completion Time (Days)" radius={4}>
                       {filteredAnomalyData.map((entry, index) => (
                          <Cell key={`cell-ct-${index}`} fill={entry.isAnomaly ? "hsl(var(--destructive))" : "var(--color-completionTime)"} />
                      ))}
                  </Bar>
                  <Bar yAxisId="right" dataKey="budgetVariance" name="Budget Variance (%)" radius={4}>
                       {filteredAnomalyData.map((entry, index) => (
                          <Cell key={`cell-bv-${index}`} fill={entry.isAnomaly ? "hsl(var(--destructive))" : "var(--color-budgetVariance)"} />
                      ))}
                      <LabelList dataKey="budgetVariance" position="top" formatter={(value:number) => `${value}%`} fontSize={10}/>
                  </Bar>
              </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
