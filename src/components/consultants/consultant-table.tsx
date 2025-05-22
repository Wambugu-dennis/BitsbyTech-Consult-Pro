// src/components/consultants/consultant-table.tsx
import type { Consultant, ConsultantStatus } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, Edit2, Trash2, Eye, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONSULTANT_STATUS_COLORS, CONSULTANT_STATUS_VARIANTS } from "@/lib/constants";

interface ConsultantTableProps {
  consultants: Consultant[];
}

export default function ConsultantTable({ consultants }: ConsultantTableProps) {
  
  const getStatusVariant = (status: ConsultantStatus): "default" | "secondary" | "outline" | "destructive" => {
    return CONSULTANT_STATUS_VARIANTS[status] || 'secondary';
  };
  
  const getStatusColorClass = (status: ConsultantStatus): string => {
    return CONSULTANT_STATUS_COLORS[status] || 'bg-muted text-muted-foreground border-border';
  };

  const getUtilizationColor = (utilization: number): string => {
    if (utilization >= 85) return 'bg-green-500';
    if (utilization >= 60) return 'bg-yellow-500';
    if (utilization > 0) return 'bg-orange-500';
    return 'bg-primary'; // Default or for 0%
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead className="w-[150px]">Utilization</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultants.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No consultants found. Add a new consultant to get started.
              </TableCell>
            </TableRow>
          )}
          {consultants.map((consultant) => (
            <TableRow key={consultant.id}>
              <TableCell className="font-medium">{consultant.name}</TableCell>
              <TableCell>{consultant.role}</TableCell>
              <TableCell>{consultant.email}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {consultant.skills.slice(0, 3).map(skill => ( // Show up to 3 skills initially
                    <Badge key={skill} variant="secondary" className="font-normal">{skill}</Badge>
                  ))}
                  {consultant.skills.length > 3 && (
                    <Badge variant="outline" className="font-normal">+{consultant.skills.length - 3} more</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={consultant.utilization} className="h-2 flex-1" indicatorClassName={getUtilizationColor(consultant.utilization)} />
                  <span className="text-xs text-muted-foreground w-[35px] text-right">{consultant.utilization}%</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(consultant.status)} className={cn("capitalize", getStatusColorClass(consultant.status))}>
                  {consultant.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Consultant Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit2 className="mr-2 h-4 w-4" /> Edit Consultant
                    </DropdownMenuItem>
                     <DropdownMenuItem>
                      <UserCog className="mr-2 h-4 w-4" /> Manage Skills/Availability
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive_legacy_danger_do_not_use"> {/* Use a class that maps to destructive color */}
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Consultant
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
