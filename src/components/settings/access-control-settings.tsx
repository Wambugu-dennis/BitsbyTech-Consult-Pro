
// src/components/settings/access-control-settings.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, CheckCircle2, XCircle, PlusCircle, Edit3, Settings as SettingsIcon } from "lucide-react";
import type { SystemRole } from '@/lib/types';
import { systemRoles } from '@/lib/types';
import { cn } from "@/lib/utils";
import type { LanguagePack } from '@/lib/i18n-config';

const APP_MODULES = [
  'Dashboard', 'Clients', 'Projects', 'Consultants',
  'Finances_Invoices', 'Finances_Expenses', 'Finances_Budgets', 'Finances_RevenueRecognition', 'Finances_Profitability',
  'Calendar', 'Analytics', 'Reports', 'RiskAnalyzer',
  'Settings_Account', 'Settings_Notifications', 'Settings_Security', 'Settings_Appearance', 'Settings_Language', 'Settings_Billing', 'Settings_UserManagement', 'Settings_AccessControl', 'Settings_Integrations', 'Settings_Workflow', 'Settings_System'
] as const;
type AppModule = typeof APP_MODULES[number];

const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete', 'approve', 'manage'] as const;
type PermissionAction = typeof PERMISSION_ACTIONS[number];

type ModulePermissionSet = Partial<Record<PermissionAction, boolean>>;
type RolePermissions = Partial<Record<AppModule, ModulePermissionSet>>;

// Mock permissions - these would come from a backend in a real app
const mockRolePermissions: Record<SystemRole, RolePermissions> = {
  Administrator: Object.fromEntries(APP_MODULES.map(module => [module, { view: true, create: true, edit: true, delete: true, approve: true, manage: true }])) as RolePermissions,
  'Project Manager': {
    Dashboard: { view: true }, Clients: { view: true, create: true, edit: true }, Projects: { view: true, create: true, edit: true, manage: true },
    Consultants: { view: true }, Finances_Expenses: { view: true, create: true, approve: true }, Finances_Budgets: { view: true, create: true, edit: true },
    Calendar: { view: true, create: true, edit: true }, Analytics: { view: true }, Reports: { view: true },
  },
  Consultant: {
    Dashboard: { view: true }, Clients: { view: true }, Projects: { view: true, edit: true },
    Consultants: { view: true }, Finances_Expenses: { view: true, create: true }, Calendar: { view: true, create: true },
    Analytics: { view: true },
  },
  'Finance Manager': {
    Dashboard: { view: true }, Clients: { view: true }, Projects: { view: true },
    Finances_Invoices: { view: true, create: true, edit: true, delete: true, manage: true },
    Finances_Expenses: { view: true, create: true, edit: true, delete: true, approve: true, manage: true },
    Finances_Budgets: { view: true, create: true, edit: true, delete: true, manage: true },
    Settings_Billing: { view: true, manage: true }, Reports: { view: true },
  },
  'Client User': { Projects: { view: true }, Calendar: { view: true }, Finances_Invoices: { view: true} },
  Viewer: {
    Dashboard: { view: true }, Clients: { view: true }, Projects: { view: true }, Consultants: { view: true },
    Finances_Invoices: { view: true }, Finances_Expenses: { view: true }, Finances_Budgets: { view: true },
    Calendar: { view: true }, Analytics: { view: true }, Reports: { view: true },
  },
};

interface AccessControlSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export default function AccessControlSettingsSection({ t }: AccessControlSettingsProps) {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null);
  const [showEditPermissionsDialog, setShowEditPermissionsDialog] = useState(false);
  const [showAddCustomRoleDialog, setShowAddCustomRoleDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<SystemRole | null>(null);
  const [editablePermissions, setEditablePermissions] = useState<RolePermissions | null>(null);
  const [newCustomRoleName, setNewCustomRoleName] = useState('');

  const handleOpenEditPermissionsDialog = (role: SystemRole) => {
    setEditingRole(role);
    const permissionsToEdit = JSON.parse(JSON.stringify(mockRolePermissions[role] || {}));
    setEditablePermissions(permissionsToEdit);
    setShowEditPermissionsDialog(true);
  };

  const handlePermissionToggle = (module: AppModule, action: PermissionAction) => {
    setEditablePermissions(currentPermissions => {
      if (!currentPermissions) return null;
      const newPermissionsState = JSON.parse(JSON.stringify(currentPermissions)); // Deep copy
      if (!newPermissionsState[module]) {
        newPermissionsState[module] = {};
      }
      newPermissionsState[module][action] = !newPermissionsState[module][action];
      return newPermissionsState;
    });
  };
  
  const handleSavePermissions = () => {
    if (!editingRole) return;
    toast({
      title: t("Permissions Updated (Simulated)"),
      description: t("Permissions for role '{role}' have been updated in this session. In a real system, this would save to the backend.", { role: t(editingRole as keyof LanguagePack['translations']) }),
      duration: 4000,
    });
    setShowEditPermissionsDialog(false);
    setEditingRole(null);
    setEditablePermissions(null);
  };

  const handleAddCustomRole = () => {
    if (!newCustomRoleName.trim()) {
      toast({ title: t("Error"), description: t("Role name cannot be empty."), variant: "destructive" });
      return;
    }
    toast({
      title: t("Custom Role Added (Simulated)"),
      description: t("The custom role '{roleName}' has been created. You would now typically define its permissions.", { roleName: newCustomRoleName }),
      duration: 4000,
    });
    setShowAddCustomRoleDialog(false);
    setNewCustomRoleName('');
  };

  const currentRolePermissionsToDisplay = selectedRole ? mockRolePermissions[selectedRole] : null;

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
              onClick={() => selectedRole && handleOpenEditPermissionsDialog(selectedRole)}
              disabled={!selectedRole}
            >
              <Edit3 className="mr-2 h-4 w-4" />{t('Edit Permissions for {role}', {role: selectedRole ? t(selectedRole as keyof LanguagePack['translations']) : ''})}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddCustomRoleDialog(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />{t('Add New Custom Role')}
            </Button>
          </div>
        </div>

        {selectedRole && currentRolePermissionsToDisplay && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">{t('Permissions for {role}', {role: t(selectedRole as keyof LanguagePack['translations'])})}</h3>
            <div className="rounded-md border overflow-x-auto max-h-[500px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
                  <TableRow>
                    <TableHead className="w-[200px]">{t('Module / Feature')}</TableHead>
                    {PERMISSION_ACTIONS.map(action => (
                      <TableHead key={action} className="text-center capitalize">{t(action)}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {APP_MODULES.map(module => {
                    const modulePermissions = currentRolePermissionsToDisplay[module] || {};
                    if (Object.keys(modulePermissions).length > 0 || selectedRole === 'Administrator') { 
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
                    return null;
                  })}
                   {Object.keys(currentRolePermissionsToDisplay).length === 0 && selectedRole !== 'Administrator' && (
                     <TableRow>
                        <TableCell colSpan={PERMISSION_ACTIONS.length + 1} className="text-center text-muted-foreground h-24">
                            {t('No specific permissions configured for the "{role}" role.', {role: t(selectedRole as keyof LanguagePack['translations'])})}
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
            <li>{t('Ability to create and manage fully custom roles with fine-grained permissions.')}</li>
            <li>{t('Assigning permissions directly to roles through an interactive UI.')}</li>
            <li>{t('View and manage permission overrides for individual users.')}</li>
            <li>{t('Audit logs for changes to roles and permissions.')}</li>
        </ul>
        <p className="mt-2">{t('This ensures that Consult Vista adheres to the principle of least privilege and provides flexible access control tailored to your organization\'s needs.')}</p>
      </CardFooter>

      {/* Edit Permissions Dialog */}
      <Dialog open={showEditPermissionsDialog} onOpenChange={setShowEditPermissionsDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('Edit Permissions for Role: {roleName}', { roleName: editingRole ? t(editingRole as keyof LanguagePack['translations']) : '' })}</DialogTitle>
            <DialogDescription>{t('Toggle permissions for each module and action. Changes are simulated for this demo.')}</DialogDescription>
          </DialogHeader>
          <div className="py-4 flex-grow overflow-y-auto">
            {editablePermissions && editingRole ? (
              <Table>
                <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
                  <TableRow>
                    <TableHead className="w-[250px]">{t('Module / Feature')}</TableHead>
                    {PERMISSION_ACTIONS.map(action => (
                      <TableHead key={action} className="text-center capitalize w-[100px]">{t(action)}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {APP_MODULES.map(module => (
                    <TableRow key={module}>
                      <TableCell className="font-medium text-sm">{t(module.replace(/_/g, ' ') as keyof LanguagePack['translations'])}</TableCell>
                      {PERMISSION_ACTIONS.map(action => (
                        <TableCell key={action} className="text-center">
                          <Switch
                            checked={editablePermissions?.[module]?.[action] || false}
                            onCheckedChange={() => handlePermissionToggle(module, action)}
                            aria-label={`${t(module.replace(/_/g, ' ') as keyof LanguagePack['translations'])} - ${t(action)}`}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>{t('Loading permissions...')}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditPermissionsDialog(false)}>{t('Cancel')}</Button>
            <Button onClick={handleSavePermissions}>{t('Save Permissions (Simulated)')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Custom Role Dialog */}
      <Dialog open={showAddCustomRoleDialog} onOpenChange={setShowAddCustomRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('Add New Custom Role')}</DialogTitle>
            <DialogDescription>{t('Enter the name for the new custom role.')}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="newCustomRoleName">{t('Role Name')}</Label>
            <Input
              id="newCustomRoleName"
              value={newCustomRoleName}
              onChange={(e) => setNewCustomRoleName(e.target.value)}
              placeholder={t('e.g., Marketing Lead, Junior Consultant')}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCustomRoleDialog(false)}>{t('Cancel')}</Button>
            <Button onClick={handleAddCustomRole}>{t('Create Role (Simulated)')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
