'use client';

import type { ClientRelationshipData } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RISK_LEVEL_COLORS } from '@/lib/constants';

const clientData: ClientRelationshipData[] = [
  { client: 'Innovatech Ltd.', healthScore: 92 },
  { client: 'Alpha Solutions', healthScore: 78 },
  { client: 'Beta Corp', healthScore: 65 },
  { client: 'Gamma Industries', healthScore: 95 },
  { client: 'Omega Services', healthScore: 45 },
];

const getHealthStatus = (score: number): { label: string; colorClass: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
  if (score >= 85) return { label: 'Excellent', colorClass: RISK_LEVEL_COLORS['Low'], variant: "default" };
  if (score >= 65) return { label: 'Good', colorClass: RISK_LEVEL_COLORS['Medium'], variant: "secondary" };
  return { label: 'Needs Attention', colorClass: RISK_LEVEL_COLORS['High'], variant: "destructive" };
};

export default function ClientRelationshipWidget() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead className="w-[200px]">Health Score</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientData.map((client) => {
            const health = getHealthStatus(client.healthScore);
            return (
              <TableRow key={client.client}>
                <TableCell className="font-medium">{client.client}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={client.healthScore} className="h-2 w-full" indicatorClassName={
                      client.healthScore >= 85 ? 'bg-green-500' : client.healthScore >= 65 ? 'bg-yellow-500' : 'bg-red-500'
                    } />
                    <span className="text-sm text-muted-foreground">{client.healthScore}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={health.variant} className={cn(health.colorClass, health.variant === 'default' ? 'bg-green-500/20 border-green-500' : health.variant === 'secondary' ? 'bg-yellow-500/20 border-yellow-500' : 'bg-red-500/20 border-red-500')}>{health.label}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
