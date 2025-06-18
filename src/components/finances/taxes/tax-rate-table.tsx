
'use client';

import type { TaxRate } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { cn } from "@/lib/utils";

interface TaxRateTableProps {
  taxRates: TaxRate[];
}

export default function TaxRateTable({ taxRates }: TaxRateTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Jurisdiction</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Rate (%)</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Applicable To</TableHead>
            <TableHead className="text-center">Compound</TableHead>
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taxRates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No tax rates defined yet.
              </TableCell>
            </TableRow>
          ) : (
            taxRates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell className="font-medium max-w-[200px] truncate" title={rate.description}>{rate.description}</TableCell>
                <TableCell>{rate.jurisdictionNameCache || rate.jurisdictionId}</TableCell>
                <TableCell>{rate.taxTypeNameCache || rate.taxTypeId}</TableCell>
                <TableCell className="text-right">{rate.rate.toFixed(2)}%</TableCell>
                <TableCell>{format(parseISO(rate.startDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{rate.endDate ? format(parseISO(rate.endDate), 'MMM dd, yyyy') : 'Ongoing'}</TableCell>
                <TableCell className="max-w-[150px]">
                    <div className="flex flex-wrap gap-1">
                        {rate.applicableTo.slice(0, 2).map(app => <Badge key={app} variant="secondary" className="text-xs">{app.replace(/([A-Z])/g, ' $1').trim()}</Badge>)}
                        {rate.applicableTo.length > 2 && <Badge variant="outline" className="text-xs">+{rate.applicableTo.length - 2} more</Badge>}
                    </div>
                </TableCell>
                <TableCell className="text-center">
                    <Badge variant={rate.isCompound ? "default" : "outline"} className={cn("text-xs", rate.isCompound && "bg-blue-100 text-blue-700 border-blue-300")}>
                        {rate.isCompound ? 'Yes' : 'No'}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert(`Editing ${rate.description} (to be implemented)`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => alert(`Deleting ${rate.description} (to be implemented)`)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
