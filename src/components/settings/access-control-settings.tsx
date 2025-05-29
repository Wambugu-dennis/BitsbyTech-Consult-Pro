
// src/components/settings/access-control-settings.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, CheckCircle2, XCircle, PlusCircle, Edit3, UserCog, FileClock, Info, FilterX } from "lucide-react";
import type { SystemRole, SystemUser } from '@/lib/types';
import { systemRoles } from '@/lib/types';
import { initialSystemUsers } from '@/lib/mockData';
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
export type RolePermissions = Partial<Record<AppModule, ModulePermissionSet>>;

const initialMockRolePermissions: Record<SystemRole, RolePermissions> = {
  Administrator: Object.fromEntries(APP_MODULES.map(module => [module, { view: true, create: true, edit: true, delete: true, approve: true, manage: true }])) as RolePermissions,
  'Project Manager': {
    Dashboard: { view: true }, Clients: { view: true, create: true, edit: true }, Projects: { view: true, create: true, edit: true, manage: true },
    Consultants: { view: true }, Finances_Expenses: { view: true, create: true, approve: true }, Finances_Budgets: { view: true, create: true, edit: true },
    Calendar: { view: true, create: true, edit: true }, Analytics: { view: true }, Reports: { view: true },
    Settings_Account: { view: true, edit: true }, Settings_UserManagement: { view: false }, Settings_AccessControl: { view: false }
  },
  Consultant: {
    Dashboard: { view: true }, Clients: { view: true }, Projects: { view: true, edit: true },
    Consultants: { view: true }, Finances_Expenses: { view: true, create: true }, Calendar: { view: true, create: true },
    Analytics: { view: true }, Settings_Account: { view: true, edit: true }
  },
  'Finance Manager': {
    Dashboard: { view: true }, Clients: { view: true }, Projects: { view: true },
    Finances_Invoices: { view: true, create: true, edit: true, delete: true, manage: true },
    Finances_Expenses: { view: true, create: true, edit: true, delete: true, approve: true, manage: true },
    Finances_Budgets: { view: true, create: true, edit: true, delete: true, manage: true },
    Settings_Billing: { view: true, manage: true }, Reports: { view: true }, Settings_Account: { view: true, edit: true },
  },
  'Client User': { Projects: { view: true }, Calendar: { view: true }, Finances_Invoices: { view: true} },
  Viewer: {
    Dashboard: { view: true }, Clients: { view: true }, Projects: { view: true }, Consultants: { view: true },
    Finances_Invoices: { view: true }, Finances_Expenses: { view: true }, Finances_Budgets: { view: true },
    Calendar: { view: true }, Analytics: { view: true }, Reports: { view: true },
  },
};

const mockAuditLogsData = [
    { timestamp: "2024-07-28 10:15:00 UTC", event: "Permissions updated for 'Project Manager' role by Alex Mercer.", user: "Alex Mercer (Admin)", details: "Enabled 'delete' on 'Projects' module." },
    { timestamp: "2024-07-27 14:30:00 UTC", event: "'Consultant' role assigned to user 'Charles Davis'.", user: "Alex Mercer (Admin)", details: "User was previously 'Viewer'." },
    { timestamp: "2024-07-26 09:00:00 UTC", event: "Login attempt failed for 'Finance Manager' role (incorrect password).", user: "System", details: "IP: 192.0.2.100" },
    { timestamp: "2024-07-25 11:00:00 UTC", event: "User override applied for 'Brenda Smith'.", user: "Alex Mercer (Admin)", details: "Granted 'create' on 'Clients' module." },
    { timestamp: "2024-07-24 16:20:00 UTC", event: "Custom role 'Intern' created.", user: "Alex Mercer (Admin)", details: "Initial permissions set to none." },
];

const NONE_ROLE_PLACEHOLDER = "--select-a-role--";
const NONE_USER_PLACEHOLDER = "--select-a-user--";


interface AccessControlSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export default function AccessControlSettingsSection({ t }: AccessControlSettingsProps) {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null);
  const [activeRolePermissions, setActiveRolePermissions] = useState<Record<SystemRole, RolePermissions>>(
    () => JSON.parse(JSON.stringify(initialMockRolePermissions))
  );

  const [showEditPermissionsDialog, setShowEditPermissionsDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<SystemRole | null>(null);
  const [editablePermissions, setEditablePermissions] = useState<RolePermissions | null>(null);

  const [showAddCustomRoleDialog, setShowAddCustomRoleDialog] = useState(false);
  const [newCustomRoleName, setNewCustomRoleName] = useState('');

  const [selectedUserForOverride, setSelectedUserForOverride] = useState<SystemUser | null>(null);
  const [showUserOverrideDialog, setShowUserOverrideDialog] = useState(false);
  const [editingUserOverrides, setEditingUserOverrides] = useState<RolePermissions | null>(null);
  const [userOverrides, setUserOverrides] = useState<Record<string, RolePermissions>>({});


  const handleOpenEditPermissionsDialog = (role: SystemRole) => {
    setEditingRole(role);
    setEditablePermissions(JSON.parse(JSON.stringify(activeRolePermissions[role] || {})));
    setShowEditPermissionsDialog(true);
  };

  const handlePermissionToggle = (module: AppModule, action: PermissionAction) => {
    setEditablePermissions(currentPermissions => {
      if (!currentPermissions) return null;
      const newPermissionsState = JSON.parse(JSON.stringify(currentPermissions));
      if (!newPermissionsState[module]) {
        newPermissionsState[module] = {};
      }
      newPermissionsState[module][action] = !newPermissionsState[module][action];
      return newPermissionsState;
    });
  };
  
  const handleSavePermissions = () => {
    if (!editingRole || !editablePermissions) return;
    setActiveRolePermissions(prevActivePermissions => {
        const updatedPermissions = JSON.parse(JSON.stringify(prevActivePermissions));
        updatedPermissions[editingRole] = editablePermissions;
        return updatedPermissions;
    });
    toast({
      title: t("Permissions Updated (Session)"),
      description: t("Permissions for role '{role}' have been updated for this session. In a real system, this would save to the backend.", { role: t(editingRole as keyof LanguagePack['translations']) }),
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
      description: t("Custom role '{roleName}' created (simulated). You would now typically proceed to assign detailed permissions to this role using the 'Edit Permissions' functionality.", { roleName: newCustomRoleName }),
      duration: 5000,
    });
    setShowAddCustomRoleDialog(false);
    setNewCustomRoleName('');
  };
  
  const handleOpenUserOverrideDialog = () => {
    if (!selectedUserForOverride) return;
    const baseRolePermissions = activeRolePermissions[selectedUserForOverride.role] || {};
    const specificUserOverrides = userOverrides[selectedUserForOverride.id] || {};
    
    const effectivePermissionsForDialog: RolePermissions = JSON.parse(JSON.stringify(baseRolePermissions));
    for (const moduleKey in specificUserOverrides) {
        const module = moduleKey as AppModule;
        if (!effectivePermissionsForDialog[module]) {
            effectivePermissionsForDialog[module] = {};
        }
        for (const actionKey in specificUserOverrides[module]) {
            const action = actionKey as PermissionAction;
            effectivePermissionsForDialog[module]![action] = specificUserOverrides[module]![action];
        }
    }
    setEditingUserOverrides(effectivePermissionsForDialog);
    setShowUserOverrideDialog(true);
  };

  const handleUserOverridePermissionToggle = (module: AppModule, action: PermissionAction) => {
    setEditingUserOverrides(currentOverrides => {
      if (!currentOverrides || !selectedUserForOverride) return null;
      const newOverrides = JSON.parse(JSON.stringify(currentOverrides));
      if (!newOverrides[module]) newOverrides[module] = {};
      newOverrides[module][action] = !newOverrides[module][action];
      return newOverrides;
    });
  };

  const handleSaveUserOverrides = () => {
    if (!selectedUserForOverride || !editingUserOverrides) return;
    const baseRolePermissions = activeRolePermissions[selectedUserForOverride.role] || {};
    const finalOverridesToSave: RolePermissions = {};

    for (const module of APP_MODULES) {
        const moduleOverrides: ModulePermissionSet = {};
        let moduleHasOverrides = false;
        for (const action of PERMISSION_ACTIONS) {
            const userPermission = editingUserOverrides[module]?.[action];
            const rolePermission = baseRolePermissions[module]?.[action] || false;
            if (userPermission !== undefined && userPermission !== rolePermission) {
                moduleOverrides[action] = userPermission;
                moduleHasOverrides = true;
            }
        }
        if (moduleHasOverrides) {
            finalOverridesToSave[module] = moduleOverrides;
        }
    }

    setUserOverrides(prev => ({ ...prev, [selectedUserForOverride.id]: finalOverridesToSave }));
    toast({
      title: t("User Overrides Updated (Session)"),
      description: t("Permission overrides for {userName} have been updated for this session.", { userName: selectedUserForOverride.name }),
      duration: 4000,
    });
    setShowUserOverrideDialog(false);
  };
  
  const handleClearUserOverrides = () => {
    if (!selectedUserForOverride) return;
    setUserOverrides(prev => {
      const newOverrides = { ...prev };
      delete newOverrides[selectedUserForOverride.id];
      return newOverrides;
    });
    const userBasePermissions = activeRolePermissions[selectedUserForOverride.role] || {};
    setEditingUserOverrides(JSON.parse(JSON.stringify(userBasePermissions))); // Reset dialog to role defaults
    toast({
      title: t("User Overrides Cleared (Session)"),
      description: t("All specific permission overrides for {userName} have been cleared for this session. Permissions now revert to their role defaults.", {userName: selectedUserForOverride.name}),
      duration: 4000,
    });
  };

  const currentRolePermissionsToDisplay = selectedRole ? activeRolePermissions[selectedRole] : null;

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">{t('Access Control (RBAC)')}</CardTitle>
          </div>
          <CardDescription className="pt-1 text-base">
            {t('Define and manage role-based access control policies. This section allows administrators to view and simulate editing permissions for each user role.')}
            <br />
            {t('System roles determine what a user can *do* and *see*. This is distinct from the organizational hierarchy, though leadership roles often have broader system permissions.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg bg-muted/30">
            <div>
              <Label htmlFor="role-select" className="text-base font-medium">{t('Select Role to View/Edit Permissions')}</Label>
              <Select
                value={selectedRole || NONE_ROLE_PLACEHOLDER}
                onValueChange={(value) => {
                    if (value === NONE_ROLE_PLACEHOLDER) {
                        setSelectedRole(null);
                    } else {
                        setSelectedRole(value as SystemRole);
                    }
                }}
              >
                <SelectTrigger id="role-select" className="w-full sm:w-[280px] mt-1">
                  <SelectValue placeholder={t('Select a role...')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_ROLE_PLACEHOLDER}>{t('-- Select a Role --')}</SelectItem>
                  {systemRoles.filter(role => role && role.trim() !== "").map(role => (
                    <SelectItem key={role} value={role}>{t(role as keyof LanguagePack['translations'])}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
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
          <p className="text-xs text-muted-foreground">
            {t('Note: "Add New Custom Role" is a simulation. New roles added here are not persisted. Managing (editing names/deleting) custom roles is a planned future enhancement.')}
          </p>

          {selectedRole && currentRolePermissionsToDisplay && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">{t('Current Permissions for {role}', {role: t(selectedRole as keyof LanguagePack['translations'])})}</h3>
              <div className="rounded-md border overflow-x-auto max-h-[500px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
                    <TableRow>
                      <TableHead className="w-[200px]">{t('Module / Feature')}</TableHead>
                      {PERMISSION_ACTIONS.map(action => (
                        <TableHead key={action} className="text-center capitalize w-[120px]">{t(action)}</TableHead>
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
                                          "text-xs px-2 py-0.5 w-[80px] justify-center",
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
      </Card>

      <Card className="shadow-md mt-6">
        <CardHeader>
            <div className="flex items-center gap-3">
                <UserCog className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">{t('User Permission Overrides')}</CardTitle>
            </div>
            <CardDescription>
                {t('Grant or revoke specific permissions for individual users, overriding their assigned role\'s default permissions for exceptional cases. This provides flexibility while maintaining a clear role-based foundation.')}
                 <br />
                <span className="text-xs text-muted-foreground">{t('Note: Role permissions (above) show defaults. User overrides provide exceptions.')}</span>
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="override-user-select">{t('Select User to Manage Overrides')}</Label>
                <Select
                    value={selectedUserForOverride?.id || NONE_USER_PLACEHOLDER}
                    onValueChange={(userId) => {
                        if (userId === NONE_USER_PLACEHOLDER) {
                            setSelectedUserForOverride(null);
                        } else {
                            const user = initialSystemUsers.find(u => u.id === userId);
                            setSelectedUserForOverride(user || null);
                        }
                    }}
                >
                    <SelectTrigger id="override-user-select" className="w-full sm:w-[280px] mt-1">
                        <SelectValue placeholder={t('Select a user...')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={NONE_USER_PLACEHOLDER}>{t('-- Select User --')}</SelectItem>
                        {initialSystemUsers.filter(user => user.id && user.id.trim() !== "").map(user => (
                           <SelectItem key={user.id} value={user.id}>{user.name} ({t(user.role as keyof LanguagePack['translations'])})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button 
                variant="outline" 
                disabled={!selectedUserForOverride} 
                onClick={handleOpenUserOverrideDialog}
            >
                {t('View/Edit Overrides for {userName}', { userName: selectedUserForOverride?.name || t('selected user')})}
            </Button>
             {selectedUserForOverride && Object.keys(userOverrides[selectedUserForOverride.id] || {}).length > 0 && (
                <div className="mt-2 text-xs p-2 border border-amber-500/50 bg-amber-500/10 rounded-md">
                    <p className="font-medium text-amber-700 dark:text-amber-300">{t('{userName} has {count} specific permission override(s) in place.', { userName: selectedUserForOverride.name, count: Object.keys(userOverrides[selectedUserForOverride.id]).length })}</p>
                </div>
            )}
        </CardContent>
      </Card>

      <Card className="shadow-md mt-6">
        <CardHeader>
            <div className="flex items-center gap-3">
                <FileClock className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">{t('Access Control Audit Logs')}</CardTitle>
            </div>
            <CardDescription>
                {t('Track all changes made to roles, permissions, and user assignments for security, compliance, and troubleshooting purposes. Logs include who made the change, what was changed, and when.')}
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="max-h-60 overflow-y-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('Timestamp')}</TableHead>
                            <TableHead>{t('Event')}</TableHead>
                            <TableHead>{t('Actor')}</TableHead>
                            <TableHead>{t('Details')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockAuditLogsData.map((log, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-xs">{log.timestamp}</TableCell>
                                <TableCell className="text-xs">{t(log.event as keyof LanguagePack['translations'], {role: "'Project Manager'", user:"'Charles Davis'"})}</TableCell>
                                <TableCell className="text-xs">{log.user}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{log.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Button variant="outline" onClick={() => toast({title: t("View Full Audit Log Clicked (Placeholder)"), description: t("A comprehensive, filterable audit log viewer is planned.")})} disabled>
                {t('View Full Audit Log')}
            </Button>
        </CardContent>
      </Card>

      <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground border-t pt-6 mt-6">
         <div className="flex items-center gap-2"> <Info className="h-5 w-5 text-primary"/> <h4 className="font-semibold text-foreground">{t('RBAC Principles & Future Capabilities')}</h4></div>
        <ul className="list-disc list-inside space-y-1 pl-2">
            <li>{t('Granular permission editor (e.g., view/create/edit/delete per specific data field or action).')}</li>
            <li>{t('Ability to create and manage fully custom roles with fine-grained permissions (current Add Role is a simulation).')}</li>
            <li>{t('Assigning permissions directly to roles through an interactive UI (current Edit Permissions is a simulation).')}</li>
            <li>{t('View and manage permission overrides for individual users.')}</li>
            <li>{t('Comprehensive audit logs for changes to roles and permissions.')}</li>
        </ul>
        <p className="mt-2">{t('This ensures that Consult Vista adheres to the principle of least privilege and provides flexible access control tailored to your organization\'s needs.')}</p>
      </CardFooter>

      {/* Edit Role Permissions Dialog */}
      <Dialog open={showEditPermissionsDialog} onOpenChange={setShowEditPermissionsDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('Edit Permissions for Role: {roleName}', { roleName: editingRole ? t(editingRole as keyof LanguagePack['translations']) : '' })}</DialogTitle>
            <DialogDescription>
                {t('Toggle permissions for each module and action. Changes are applied for the current session only.')}
                <br/>
                <span className="text-xs text-muted-foreground">{t('(Future: More granular controls, like field-level permissions, will be available.)')}</span>
            </DialogDescription>
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
            <Button onClick={handleSavePermissions}>{t('Save Permissions (Current Session)')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Custom Role Dialog */}
      <Dialog open={showAddCustomRoleDialog} onOpenChange={setShowAddCustomRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('Add New Custom Role')}</DialogTitle>
            <DialogDescription>{t('Enter the name for the new custom role. You can assign permissions after creation using the "Edit Permissions" feature.')}</DialogDescription>
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

      {/* User Permission Overrides Dialog */}
      <Dialog open={showUserOverrideDialog} onOpenChange={setShowUserOverrideDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('Edit Permission Overrides for: {userName}', { userName: selectedUserForOverride?.name || ''})}</DialogTitle>
            <DialogDescription>
                {t('User Role')}: <Badge variant="outline" className="font-normal">{selectedUserForOverride ? t(selectedUserForOverride.role as keyof LanguagePack['translations']) : ''}</Badge>
                <br/>
                {t("Toggle specific permissions for this user. These will override their role's default permissions. Changes are applied for the current session.")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex-grow overflow-y-auto">
             {editingUserOverrides && selectedUserForOverride ? (
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
                      {PERMISSION_ACTIONS.map(action => {
                        const hasOverride = userOverrides[selectedUserForOverride.id]?.[module]?.[action] !== undefined;
                        const effectivePermission = editingUserOverrides[module]?.[action] ?? (activeRolePermissions[selectedUserForOverride.role]?.[module]?.[action] || false);
                        
                        return (
                        <TableCell key={action} className="text-center">
                          <div className="flex flex-col items-center">
                            <Switch
                                checked={effectivePermission}
                                onCheckedChange={() => handleUserOverridePermissionToggle(module, action)}
                                aria-label={`${t(module.replace(/_/g, ' ') as keyof LanguagePack['translations'])} - ${t(action)}`}
                            />
                            {hasOverride && (
                                <span className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">({t('Override')})</span>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>{t('Loading user override permissions...')}</p>
            )}
          </div>
          <DialogFooter className="justify-between">
            <Button variant="destructive" onClick={handleClearUserOverrides} className="mr-auto">
                 <FilterX className="mr-2 h-4 w-4" /> {t('Clear All Overrides for this User')}
            </Button>
            <div>
                <Button variant="outline" onClick={() => setShowUserOverrideDialog(false)} className="mr-2">{t('Cancel')}</Button>
                <Button onClick={handleSaveUserOverrides}>{t('Save Overrides (Current Session)')}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
