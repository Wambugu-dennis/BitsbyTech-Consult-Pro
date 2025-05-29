
// src/components/settings/user-management-settings.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { Users as UsersIcon, PlusCircle, Edit3, KeyRound, UserCheck, UserX, Trash2, MoreHorizontal, ShieldCheck, Users2 as HierarchyIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, formatISO } from 'date-fns';
import type { SystemUser, SystemUserStatus, SystemRole, Consultant } from '@/lib/types';
import { systemRoles } from '@/lib/types';
import type { LanguagePack } from '@/lib/i18n-config';

const NONE_VALUE_PLACEHOLDER = "--none--"; // Define placeholder for "None" select option

interface UserManagementSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  formatDate: (date: Date) => string;
  systemUsers: SystemUser[];
  setSystemUsers: React.Dispatch<React.SetStateAction<SystemUser[]>>;
  initialConsultants: Consultant[]; // Can be removed if not directly used for user creation
  setActiveSection: (sectionId: string) => void;
}

export default function UserManagementSettingsSection({
  t,
  formatDate,
  systemUsers,
  setSystemUsers,
  initialConsultants,
  setActiveSection,
}: UserManagementSettingsProps) {
  const { toast } = useToast();
  const [showInviteUserDialog, setShowInviteUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState<SystemUser | null>(null);

  const [inviteUserFormData, setInviteUserFormData] = useState<{ name: string; email: string; role: SystemRole }>({ name: '', email: '', role: systemRoles.find(r => r === 'Consultant') || systemRoles[0] });
  const [editUserFormData, setEditUserFormData] = useState<{ name: string; email: string; role: SystemRole; reportsToUserId?: string }>({ name: '', email: '', role: systemRoles.find(r => r === 'Consultant') || systemRoles[0], reportsToUserId: undefined });

  const handleInviteUser = () => {
    if (!inviteUserFormData.name.trim() || !inviteUserFormData.email.trim()) {
        toast({ title: t("Validation Error"), description: t("Name and Email are required."), variant: "destructive" });
        return;
    }
    const newUser: SystemUser = {
      id: `user-${Date.now()}`,
      name: inviteUserFormData.name,
      email: inviteUserFormData.email,
      role: inviteUserFormData.role,
      status: 'Invited',
      avatarUrl: `https://placehold.co/100x100/90A4AE/FFFFFF.png?text=${inviteUserFormData.name.substring(0,2).toUpperCase()}`,
      dateJoined: formatISO(new Date()),
    };
    setSystemUsers(prev => [newUser, ...prev]);
    setShowInviteUserDialog(false);
    setInviteUserFormData({ name: '', email: '', role: systemRoles.find(r => r === 'Consultant') || systemRoles[0] });
    toast({ title: t("User Invited"), description: t("{name} has been invited as a {role}.", { name: newUser.name, role: t(newUser.role as keyof LanguagePack['translations']) }) });
  };

  const handleOpenEditUserDialog = (user: SystemUser) => {
    setUserToEdit(user);
    setEditUserFormData({ 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        reportsToUserId: user.reportsToUserId // Keep as undefined if it is
    });
    setShowEditUserDialog(true);
  };

  const handleEditUser = () => {
    if (!userToEdit) return;
    if (!editUserFormData.name.trim()) {
        toast({ title: t("Validation Error"), description: t("Name cannot be empty."), variant: "destructive" });
        return;
    }
    const reportsToUser = systemUsers.find(u => u.id === editUserFormData.reportsToUserId);
    setSystemUsers(prev => prev.map(u =>
      u.id === userToEdit.id
        ? { ...u,
            name: editUserFormData.name,
            role: editUserFormData.role,
            reportsToUserId: editUserFormData.reportsToUserId, // Can be undefined
            reportsToUserNameCache: reportsToUser?.name
          }
        : u
    ));
    setShowEditUserDialog(false);
    setUserToEdit(null);
    toast({ title: t("User Updated"), description: t("{name}'s details have been updated.", { name: editUserFormData.name }) });
  };

  const handleToggleUserStatus = (userId: string, currentStatus: SystemUserStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setSystemUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    toast({ title: t("User Status Updated"), description: t("User status changed to {newStatus}.", { newStatus: t(newStatus as keyof LanguagePack['translations']) }) });
  };

  const handleDeleteUser = (userId: string) => {
    setSystemUsers(prev => prev.filter(u => u.id !== userId));
    toast({ title: t("User Deleted"), description: t("User {userId} has been deleted (simulated).", { userId: userId }), variant: "destructive" });
  };

  const getStatusBadgeClass = (status: SystemUserStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-700 border-green-500 dark:text-green-300 dark:border-green-400';
      case 'Inactive': return 'bg-gray-500/20 text-gray-700 border-gray-500 dark:text-gray-300 dark:border-gray-400';
      case 'Invited': return 'bg-blue-500/20 text-blue-700 border-blue-500 dark:text-blue-300 dark:border-blue-400';
      case 'Suspended': return 'bg-red-500/20 text-red-700 border-red-500 dark:text-red-300 dark:border-red-400';
      default: return 'border-border';
    }
  };

  const managersAndReports = useMemo(() => {
    const managersMap = new Map<string, { manager: SystemUser; reports: SystemUser[] }>();
    systemUsers.forEach(user => {
      if (user.reportsToUserId) {
        const manager = systemUsers.find(m => m.id === user.reportsToUserId);
        if (manager) {
          if (!managersMap.has(manager.id)) {
            managersMap.set(manager.id, { manager, reports: [] });
          }
          managersMap.get(manager.id)?.reports.push(user);
        }
      }
    });

    // Add managers who might not have direct reports from the first pass, but are listed as managers
    systemUsers.forEach(user => {
      const isDesignatedManager = systemUsers.some(u => u.reportsToUserId === user.id);
      if (isDesignatedManager && !managersMap.has(user.id)) {
        managersMap.set(user.id, { manager: user, reports: systemUsers.filter(u => u.reportsToUserId === user.id) });
      }
    });
    
    const finalManagers = Array.from(managersMap.values()).sort((a,b) => a.manager.name.localeCompare(b.manager.name));
    
    const topLevelIndividuals = systemUsers.filter(user => 
        !user.reportsToUserId && !finalManagers.some(m => m.manager.id === user.id)
    ).sort((a,b) => a.name.localeCompare(b.name));

    return { managers: finalManagers, topLevelIndividuals };
  }, [systemUsers]);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
                <UsersIcon className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{t('Manage System Users')}</CardTitle>
            </div>
            <CardDescription>{t('Administer user accounts, assign roles, and manage access.')}</CardDescription>
          </div>
          <Dialog open={showInviteUserDialog} onOpenChange={setShowInviteUserDialog}>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" />{t('Invite New User')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('Invite New User')}</DialogTitle>
                <DialogDescription>{t('Enter user details and assign a role.')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div><Label htmlFor="inviteName">{t('Full Name')}</Label><Input id="inviteName" value={inviteUserFormData.name} onChange={(e) => setInviteUserFormData(prev => ({...prev, name: e.target.value}))} /></div>
                <div><Label htmlFor="inviteEmail">{t('Email Address')}</Label><Input id="inviteEmail" type="email" value={inviteUserFormData.email} onChange={(e) => setInviteUserFormData(prev => ({...prev, email: e.target.value}))} /></div>
                <div>
                  <Label htmlFor="inviteRole">{t('Role')}</Label>
                  <Select value={inviteUserFormData.role} onValueChange={(value: SystemRole) => setInviteUserFormData(prev => ({...prev, role: value}))}>
                    <SelectTrigger id="inviteRole"><SelectValue /></SelectTrigger>
                    <SelectContent>{systemRoles.map(role => <SelectItem key={role} value={role}>{t(role as keyof LanguagePack['translations'])}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowInviteUserDialog(false)}>{t('Cancel')}</Button>
                <Button onClick={handleInviteUser}>{t('Send Invitation')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="max-h-[60vh] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('User')}</TableHead>
                  <TableHead>{t('Email')}</TableHead>
                  <TableHead>{t('Role')}</TableHead>
                  <TableHead>{t('Reports To')}</TableHead>
                  <TableHead>{t('Status')}</TableHead>
                  <TableHead>{t('Last Login')}</TableHead>
                  <TableHead className="text-right">{t('Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8"><AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person avatar"/><AvatarFallback>{user.name.substring(0,1)}</AvatarFallback></Avatar>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge variant="outline" className="font-normal">{t(user.role as keyof LanguagePack['translations'])}</Badge></TableCell>
                    <TableCell>{user.reportsToUserNameCache || t('N/A')}</TableCell>
                    <TableCell><Badge variant="outline" className={cn("font-normal capitalize", getStatusBadgeClass(user.status))}>{t(user.status as keyof LanguagePack['translations'])}</Badge></TableCell>
                    <TableCell className="text-xs">{user.lastLogin ? formatDate(parseISO(user.lastLogin)) : t('Never')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEditUserDialog(user)}><Edit3 className="mr-2 h-4 w-4" />{t('Edit User')}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast({ title: t("Reset Password"), description: t("Password reset link would be sent to the user's email.") })}><KeyRound className="mr-2 h-4 w-4" />{t('Reset Password')}</DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className={cn("focus:text-white", user.status === 'Active' ? "text-orange-600 focus:bg-orange-500" : "text-green-600 focus:bg-green-500")}>
                                        {user.status === 'Active' ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                                        {user.status === 'Active' ? t('Deactivate User') : t('Activate User')}
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{user.status === 'Active' ? t('Deactivate User?') : t('Activate User?')}</AlertDialogTitle>
                                        <AlertDialogDescription>{t('Are you sure you want to {action} the user {userName}?', { action: user.status === 'Active' ? t('deactivate') : t('activate'), userName: user.name })}</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleToggleUserStatus(user.id, user.status)}>{user.status === 'Active' ? t('Deactivate') : t('Activate')}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" />{t('Delete User')}</DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>{t('Delete User?')}</AlertDialogTitle><AlertDialogDescription>{t('This action cannot be undone. Are you sure you want to permanently delete {userName}?', { userName: user.name })}</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>{t('Cancel')}</AlertDialogCancel><AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => handleDeleteUser(user.id)}>{t('Delete User')}</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {userToEdit && (
            <Dialog open={showEditUserDialog} onOpenChange={(isOpen) => { if(!isOpen) setUserToEdit(null); setShowEditUserDialog(isOpen); }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('Edit User')}: {userToEdit.name}</DialogTitle>
                  <DialogDescription>{t('Modify user details and role assignments.')}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div><Label htmlFor="editName">{t('Full Name')}</Label><Input id="editName" value={editUserFormData.name} onChange={(e) => setEditUserFormData(prev => ({...prev, name: e.target.value}))} /></div>
                  <div><Label htmlFor="editEmail">{t('Email Address')}</Label><Input id="editEmail" type="email" value={editUserFormData.email} disabled /></div>
                  <div>
                    <Label htmlFor="editRole">{t('Role')}</Label>
                    <Select value={editUserFormData.role} onValueChange={(value: SystemRole) => setEditUserFormData(prev => ({...prev, role: value}))}>
                      <SelectTrigger id="editRole"><SelectValue /></SelectTrigger>
                      <SelectContent>{systemRoles.map(role => <SelectItem key={role} value={role}>{t(role as keyof LanguagePack['translations'])}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editReportsTo">{t('Reports To (Optional)')}</Label>
                    <Select 
                      value={editUserFormData.reportsToUserId || NONE_VALUE_PLACEHOLDER} 
                      onValueChange={(value) => setEditUserFormData(prev => ({...prev, reportsToUserId: value === NONE_VALUE_PLACEHOLDER ? undefined : value}))
                    }>
                      <SelectTrigger id="editReportsTo"><SelectValue placeholder={t("Select manager")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE_PLACEHOLDER}>{t('-- None --')}</SelectItem>
                        {systemUsers.filter(u => u.id !== userToEdit.id).map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setShowEditUserDialog(false); setUserToEdit(null); }}>{t('Cancel')}</Button>
                  <Button onClick={handleEditUser}>{t('Save Changes')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3"><HierarchyIcon className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('Team Structure & Hierarchy')}</CardTitle></div>
          <CardDescription>{t('Visualize organizational structure and reporting lines.')}</CardDescription>
        </CardHeader>
        <CardContent>
          {(managersAndReports.managers.length > 0 || managersAndReports.topLevelIndividuals.length > 0) ? (
            <div className="space-y-4">
              {managersAndReports.managers.map(({ manager, reports }) => (
                <div key={manager.id} className="p-3 border rounded-md bg-muted/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-10 w-10 border-2 border-primary/30">
                      <AvatarImage src={manager.avatarUrl} alt={manager.name} data-ai-hint="person avatar"/>
                      <AvatarFallback>{manager.name.substring(0,1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{manager.name} <span className="text-xs text-muted-foreground">({t(manager.role as keyof LanguagePack['translations'])})</span></p>
                      {reports.length > 0 && <p className="text-xs text-muted-foreground">{t('Manages {count} direct report(s)', { count: reports.length })}</p>}
                      {reports.length === 0 && manager.role !== 'Consultant' && <p className="text-xs text-muted-foreground">{t('Designated Manager (0 direct reports)')}</p>}
                    </div>
                  </div>
                  {reports.length > 0 && (
                    <ul className="ml-6 space-y-1 list-disc list-inside">
                      {reports.map(report => (
                        <li key={report.id} className="text-sm flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={report.avatarUrl} alt={report.name} data-ai-hint="person avatar"/>
                            <AvatarFallback className="text-xs">{report.name.substring(0,1)}</AvatarFallback>
                          </Avatar>
                          {report.name} <span className="text-xs text-muted-foreground">({t(report.role as keyof LanguagePack['translations'])})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {managersAndReports.topLevelIndividuals.length > 0 && (
                 <div className="mt-4 pt-3 border-t">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">{t('Individuals without direct reports / not managing')}</h4>
                     {managersAndReports.topLevelIndividuals.map(user => (
                        <div key={user.id} className="p-2 border rounded-md bg-muted/10 mb-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8"><AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person avatar"/><AvatarFallback>{user.name.substring(0,1)}</AvatarFallback></Avatar>
                                <div>
                                    <p className="font-medium text-sm">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{t(user.role as keyof LanguagePack['translations'])}</p>
                                </div>
                            </div>
                        </div>
                     ))}
                 </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t('No reporting structures defined yet. Edit users to assign who they report to.')}</p>
          )}
          <div className="mt-3 p-3 border border-blue-500/30 bg-blue-500/5 rounded-md text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
            <Info size={20} className="shrink-0 mt-0.5"/>
            <div>
              <p>
                {t('The Team Structure is defined by setting the "Reports To" field for each user in the table above. This visualization is a reflection of those settings.')}
              </p>
              <p className="mt-1">
                {t('A user\'s role (e.g., Administrator, Project Manager) defines their permissions and capabilities within the system, which is managed separately under Access Control. Often, leadership roles in the hierarchy align with roles granting broader system permissions.')}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">{t('More advanced tools for team and department management, including visual org chart builders, are planned for future development.')}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3"><ShieldCheck className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('Role & Permission Management')}</CardTitle></div>
          <CardDescription>{t('Define user roles and their granular permissions across different system modules.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => setActiveSection('accessControl') }>{t('Configure Roles & Permissions')}</Button>
          <p className="text-xs text-muted-foreground mt-2">{t('Access control ensures users only see and interact with appropriate data and features. System roles (like Administrator, Project Manager) define a user\'s capabilities. The actual permissions for these roles are managed in the "Access Control" section.')}</p>
        </CardContent>
      </Card>
    </div>
  );
}

    
