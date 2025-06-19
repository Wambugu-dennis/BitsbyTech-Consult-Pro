
'use client';

import type { TaxRate } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format, parseISO } from 'date-fns';
import { cn } from "@/lib/utils";

interface TaxRateTableProps {
  taxRates: TaxRate[];
  onEditTaxRate: (taxRate: TaxRate) => void;
  onDeleteTaxRate: (rateId: string) => void;
}

export default function TaxRateTable({ taxRates, onEditTaxRate, onDeleteTaxRate }: TaxRateTableProps) {
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
                    <Badge variant={rate.isCompound ? "default" : "outline"} className={cn("text-xs", rate.isCompound ? "bg-blue-100 text-blue-700 border-blue-300" : "border-border")}>
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
                      <DropdownMenuItem onClick={() => onEditTaxRate(rate)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem 
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                           >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Tax Rate: {rate.description}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the tax rate. Ensure it's not actively used in calculations if possible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => onDeleteTaxRate(rate.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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

    