
// src/components/settings/access-control-settings.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocalization } from '@/context/localization-provider';
import { ShieldCheck, CheckCircle2, XCircle, PlusCircle, Edit3, Settings as SettingsIcon } from "lucide-react";
import type { SystemRole } from '@/lib/types';
import { systemRoles } from '@/lib/types'; // Ensure systemRoles are exported from types.ts
import { cn } from "@/lib/utils";
import type { LanguagePack } from '@/lib/i18n-config'; // For t function typing

const APP_MODULES = [
  'Dashboard',
  'Clients',
  'Projects',
  'Consultants',
  'Finances_Invoices',
  'Finances_Expenses',
  'Finances_Budgets',
  'Calendar',
  'Analytics',
  'Reports',
  'RiskAnalyzer',
  'Settings_UserManagement',
  'Settings_AccessControl',
  'Settings_Billing',
  'Settings_System',
] as const;
type AppModule = typeof APP_MODULES[number];

const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete', 'approve', 'manage'] as const;
type PermissionAction = typeof PERMISSION_ACTIONS[number];

type ModulePermissionSet = Partial<Record<PermissionAction, boolean>>;
type RolePermissions = Partial<Record<AppModule, ModulePermissionSet>>;

// Comprehensive mock permissions
const mockRolePermissions: Record<SystemRole, RolePermissions> = {
  Administrator: Object.fromEntries(APP_MODULES.map(module => [module, { view: true, create: true, edit: true, delete: true, approve: true, manage: true }])) as RolePermissions,
  'Project Manager': {
    Dashboard: { view: true },
    Clients: { view: true, create: true, edit: true },
    Projects: { view: true, create: true, edit: true, manage: true }, // manage might imply task assignment, status updates
    Consultants: { view: true },
    Finances_Expenses: { view: true, create: true, approve: true }, // Approve project expenses
    Finances_Budgets: { view: true, create: true, edit: true }, // Manage project budgets
    Calendar: { view: true, create: true, edit: true },
    Analytics: { view: true },
    Reports: { view: true },
  },
  Consultant: {
    Dashboard: { view: true },
    Clients: { view: true }, // View clients they are associated with
    Projects: { view: true, edit: true }, // Edit tasks assigned to them, update progress
    Consultants: { view: true }, // View their own profile
    Finances_Expenses: { view: true, create: true }, // Log their own expenses
    Calendar: { view: true, create: true }, // Manage their own calendar
    Analytics: { view: true }, // View relevant project analytics
  },
  'Finance Manager': {
    Dashboard: { view: true },
    Clients: { view: true },
    Projects: { view: true }, // View project financial details
    Finances_Invoices: { view: true, create: true, edit: true, delete: true, manage: true },
    Finances_Expenses: { view: true, create: true, edit: true, delete: true, approve: true, manage: true },
    Finances_Budgets: { view: true, create: true, edit: true, delete: true, manage: true },
    Settings_Billing: { view: true, manage: true }, // Manage company's subscription to Consult Vista
    Reports: { view: true }, // Generate financial reports
  },
  'Client User': { // Hypothetical external client role
    Projects: { view: true }, // View projects they are part of
    Calendar: { view: true }, // View relevant project timelines/meetings
  },
  Viewer: { // Read-only role
    Dashboard: { view: true },
    Clients: { view: true },
    Projects: { view: true },
    Consultants: { view: true },
    Finances_Invoices: { view: true },
    Finances_Expenses: { view: true },
    Finances_Budgets: { view: true },
    Calendar: { view: true },
    Analytics: { view: true },
    Reports: { view: true },
  },
};


interface AccessControlSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export default function AccessControlSettingsSection({ t }: AccessControlSettingsProps) {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null);

  const handlePlaceholderAction = (actionMessageKey: string) => {
    toast({
      title: t(actionMessageKey),
      description: t("This functionality is for demonstration and is planned for future development."),
      duration: 3000,
    });
  };

  const currentPermissions = selectedRole ? mockRolePermissions[selectedRole] : null;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <CardTitle className="text-2xl">{t('Access Control (RBAC)')}</CardTitle>
        </div>
        <CardDescription className="pt-1 text-base">
          {t('Define and manage role-based access control policies. This section allows administrators to view permissions for each user role, controlling access to modules and features.')}
          <br />
          {t('System roles determine what a user can *do* and *see*. This is distinct from the organizational hierarchy, though leadership roles often have broader system permissions.')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg bg-muted/30">
          <div>
            <Label htmlFor="role-select" className="text-base font-medium">{t('Select Role to View Permissions')}</Label>
            <Select
              value={selectedRole || ""}
              onValueChange={(value) => setSelectedRole(value as SystemRole)}
            >
              <SelectTrigger id="role-select" className="w-full sm:w-[280px] mt-1">
                <SelectValue placeholder={t('Select a role...')} />
              </SelectTrigger>
              <SelectContent>
                {systemRoles.map(role => (
                  <SelectItem key={role} value={role}>{t(role as keyof LanguagePack['translations'])}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
            <Button
              onClick={() => handlePlaceholderAction("Edit Permissions for Role Triggered")}
              disabled={!selectedRole}
            >
              <Edit3 className="mr-2 h-4 w-4" />{t('Edit Permissions for {role}', {role: selectedRole ? t(selectedRole as keyof LanguagePack['translations']) : ''})}
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePlaceholderAction("Add New Custom Role Triggered")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />{t('Add New Custom Role')}
            </Button>
          </div>
        </div>

        {selectedRole && currentPermissions && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">{t('Permissions for {role}', {role: t(selectedRole as keyof LanguagePack['translations'])})}</h3>
            <div className="rounded-md border overflow-x-auto max-h-[500px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <TableRow>
                    <TableHead className="w-[200px]">{t('Module / Feature')}</TableHead>
                    {PERMISSION_ACTIONS.map(action => (
                      <TableHead key={action} className="text-center capitalize">{t(action)}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {APP_MODULES.map(module => {
                    const modulePermissions = currentPermissions[module] || {};
                    // Only render row if there's any permission defined for this module for the role
                    if (Object.keys(modulePermissions).length > 0) {
                        return (
                            <TableRow key={module}>
                            <TableCell className="font-medium text-sm">{t(module.replace(/_/g, ' ') as keyof LanguagePack['translations'])}</TableCell>
                            {PERMISSION_ACTIONS.map(action => {
                                const isAllowed = modulePermissions[action] === true;
                                return (
                                <TableCell key={action} className="text-center">
                                    <Badge
                                    variant={isAllowed ? "default" : "secondary"}
                                    className={cn(
                                        "text-xs px-2 py-0.5",
                                        isAllowed ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"
                                    )}
                                    >
                                    {isAllowed ? <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> : <XCircle className="h-3.5 w-3.5 mr-1" />}
                                    {isAllowed ? t('Allowed') : t('Denied')}
                                    </Badge>
                                </TableCell>
                                );
                            })}
                            </TableRow>
                        );
                    }
                    return null; // Don't render row if no permissions for this module/role
                  })}
                   {Object.keys(currentPermissions).length === 0 && (
                     <TableRow>
                        <TableCell colSpan={PERMISSION_ACTIONS.length + 1} className="text-center text-muted-foreground h-24">
                            {t('No specific permissions configured for the "{role}" role. It may have default deny or rely on inherited permissions not shown here.', {role: t(selectedRole as keyof LanguagePack['translations'])})}
                        </TableCell>
                     </TableRow>
                   )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
         {!selectedRole && (
            <div className="mt-6 p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground bg-muted/30">
                 <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-base">{t('Please select a role from the dropdown above to view its specific permissions.')}</p>
            </div>
         )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground border-t pt-4">
         <div className="flex items-center gap-2"> <SettingsIcon className="h-5 w-5 text-primary"/> <h4 className="font-semibold text-foreground">{t('Future Capabilities')}</h4></div>
        <ul className="list-disc list-inside space-y-1 pl-2">
            <li>{t('Granular permission editor (e.g., view/create/edit/delete per specific data field or action).')}</li>
            <li>{t('Ability to create custom roles beyond the predefined system roles.')}</li>
            <li>{t('View and manage permission overrides for individual users.')}</li>
            <li>{t('Audit logs for changes to roles and permissions.')}</li>
        </ul>
        <p className="mt-2">{t('This ensures that Consult Vista adheres to the principle of least privilege and provides flexible access control tailored to your organization\'s needs.')}</p>
      </CardFooter>
    </Card>
  );
}
