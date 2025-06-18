
'use client';

import type { TaxType } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { format } from 'date-fns';

interface TaxTypeTableProps {
  taxTypes: TaxType[];
}

export default function TaxTypeTable({ taxTypes }: TaxTypeTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Abbreviation</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taxTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No tax types defined yet.
              </TableCell>
            </TableRow>
          ) : (
            taxTypes.map((taxType) => (
              <TableRow key={taxType.id}>
                <TableCell className="font-medium">{taxType.name}</TableCell>
                <TableCell>{taxType.abbreviation || 'N/A'}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate" title={taxType.description}>
                  {taxType.description || 'N/A'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(taxType.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert(`Editing ${taxType.name} (to be implemented)`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => alert(`Deleting ${taxType.name} (to be implemented)`)}>
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
