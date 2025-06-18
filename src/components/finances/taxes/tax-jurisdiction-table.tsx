
'use client';

import type { TaxJurisdiction } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { format } from 'date-fns';

interface TaxJurisdictionTableProps {
  jurisdictions: TaxJurisdiction[];
  // onEditJurisdiction: (jurisdiction: TaxJurisdiction) => void; // Future
  // onDeleteJurisdiction: (jurisdictionId: string) => void; // Future
}

export default function TaxJurisdictionTable({ jurisdictions }: TaxJurisdictionTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Country Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jurisdictions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No tax jurisdictions defined yet.
              </TableCell>
            </TableRow>
          ) : (
            jurisdictions.map((jurisdiction) => (
              <TableRow key={jurisdiction.id}>
                <TableCell className="font-medium">{jurisdiction.name}</TableCell>
                <TableCell>{jurisdiction.countryCode || 'N/A'}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate" title={jurisdiction.description}>
                  {jurisdiction.description || 'N/A'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(jurisdiction.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert(`Editing ${jurisdiction.name} (to be implemented)`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => alert(`Deleting ${jurisdiction.name} (to be implemented)`)}>
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
