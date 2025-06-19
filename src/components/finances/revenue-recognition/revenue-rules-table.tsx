
'use client';

import type { RevenueRecognitionRule } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye, PlayCircle, PauseCircle } from "lucide-react";
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
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface RevenueRulesTableProps {
  rules: RevenueRecognitionRule[];
  onEditRule: (rule: RevenueRecognitionRule) => void;
  onDeleteRule: (ruleId: string) => void;
  // onToggleStatus: (ruleId: string) => void; // Future
}

export default function RevenueRulesTable({ rules, onEditRule, onDeleteRule }: RevenueRulesTableProps) {
  
  const getStatusBadgeClass = (isActive: boolean): string => {
    return isActive ? 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300' 
                    : 'bg-gray-500/20 border-gray-500 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rule Name</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Criteria (Summary)</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No revenue recognition rules defined yet.
              </TableCell>
            </TableRow>
          ) : (
            rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium max-w-xs truncate" title={rule.name}>{rule.name}</TableCell>
                <TableCell>{rule.method.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-sm truncate" title={rule.description}>
                  {rule.description || 'N/A'}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-sm truncate" title={rule.criteriaDescription}>
                  {rule.criteriaDescription || 'N/A'}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={cn("text-xs", getStatusBadgeClass(rule.isActive))}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {format(new Date(rule.updatedAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditRule(rule)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Rule
                      </DropdownMenuItem>
                       {/* <DropdownMenuItem onClick={() => alert(`Toggling status for ${rule.name}`)}>
                        {rule.isActive ? <PauseCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                        {rule.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem> */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem 
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                           >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Rule
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Rule: {rule.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the rule. Ensure it's not actively used.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => onDeleteRule(rule.id)}
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

    