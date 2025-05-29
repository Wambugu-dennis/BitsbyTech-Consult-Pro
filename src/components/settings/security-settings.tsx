
// src/components/settings/security-settings.tsx
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Bell, FileLock2, Fingerprint, Network, LogOut, History, UserCheck, ShieldCheck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from 'date-fns';
import type { LanguagePack } from '@/lib/i18n-config';

const mockUserData = {
  lastPasswordChange: '2024-03-15'
};

const mockActiveSessionsData = [
    { id: 'session1', device: 'Chrome on Windows', location: 'New York, USA', ipAddress: '192.168.1.101', lastActive: '2 hours ago' },
    { id: 'session2', device: 'Safari on macOS', location: 'London, UK', ipAddress: '10.0.0.5', lastActive: '1 day ago' },
    { id: 'session3', device: 'Mobile App (iOS)', location: 'San Francisco, USA', ipAddress: '172.16.0.20', lastActive: '5 minutes ago' },
];

const mockAuditLogPreviewData = [
    { id: 'log1', timestamp: '2024-07-25 10:00:00 UTC', event: 'Successful login', user: 'Alex Mercer', ipAddress: '192.168.1.101', details: 'Login via web browser' },
    { id: 'log2', timestamp: '2024-07-25 09:30:00 UTC', event: 'Password change attempt (failed)', user: 'Alex Mercer', ipAddress: '203.0.113.45', details: 'Incorrect current password' },
    { id: 'log3', timestamp: '2024-07-24 15:00:00 UTC', event: '2FA setup completed', user: 'Alex Mercer', ipAddress: '192.168.1.101', details: 'Authenticator app registered' },
];

const mockLoginHistoryData = [
    { id: 'lh1', timestamp: '2024-07-26 10:00:00 UTC', status: 'Success', ipAddress: '192.168.1.101', device: 'Chrome on Windows', location: 'New York, USA' },
    { id: 'lh2', timestamp: '2024-07-26 09:55:00 UTC', status: 'Failed', ipAddress: '203.0.113.45', device: 'Unknown Browser', location: 'Unknown (Suspicious)' },
];


interface SecuritySettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  formatDate: (date: Date) => string;
}

export default function SecuritySettingsSection({ t, formatDate }: SecuritySettingsProps) {
  const { toast } = useToast();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [currentActiveSessions, setCurrentActiveSessions] = useState(mockActiveSessionsData);
  const [activityAlerts, setActivityAlerts] = useState({
    newDeviceLogin: true,
    failedLogins: true,
    passwordChanged: true,
    twoFactorChanged: false,
  });

  const handlePlaceholderAction = (actionMessageKey: string, descriptionKey?: string) => {
    toast({
      title: t(actionMessageKey as keyof LanguagePack['translations']),
      description: descriptionKey ? t(descriptionKey as keyof LanguagePack['translations']) : t("This functionality is for demonstration."),
      duration: 3000,
    });
  };

  const handleChangePassword = () => {
    setShowPasswordDialog(false);
    toast({
      title: t("Password Changed Successfully"),
      description: t("Your password has been updated (simulated)."),
      duration: 3000,
    });
  };

  const handleToggle2FA = () => {
    if (is2FAEnabled) {
        setIs2FAEnabled(false);
        toast({ title: t("Two-Factor Authentication Disabled (Simulated)") });
    } else {
        setIs2FAEnabled(true);
        handlePlaceholderAction("2FA Setup Process", "The 2FA setup process (QR code, app pairing) would begin here.");
    }
  };

  const handleSignOutSession = (sessionId: string) => {
    setCurrentActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    toast({ title: t("Session Signed Out"), description: t("Session {sessionId} has been remotely signed out (simulated).", {sessionId: sessionId})});
  };

  const handleSignOutAllOtherSessions = () => {
    if (currentActiveSessions.length > 1) {
        setCurrentActiveSessions(prev => prev.slice(0, 1)); // Keep only the first (current) session
    }
    toast({ title: t("All Other Sessions Signed Out"), description: t("All other active sessions have been remotely signed out (simulated).")});
  };

  const handleSaveActivityAlerts = () => {
    toast({ title: t("Activity Alert Preferences Saved"), description: t("Your preferences for account activity alerts have been updated (simulated).") });
  };

  return (
    <div className="space-y-6">
        <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
            <KeyRound className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl">{t('Password Management')}</CardTitle>
            </div>
            <CardDescription>{t('Manage your account password.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogTrigger asChild>
                <Button variant="outline">{t('Change Password')}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{t('Change Your Password')}</DialogTitle>
                <DialogDescription>
                    {t('Enter your current password and choose a new one. Ensure your new password meets the policy requirements.')}
                </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                <div className="space-y-1">
                    <Label htmlFor="currentPassword">{t('Current Password')}</Label>
                    <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="newPassword">{t('New Password')}</Label>
                    <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="confirmNewPassword">{t('Confirm New Password')}</Label>
                    <Input id="confirmNewPassword" type="password" />
                </div>
                </div>
                <DialogFooter>
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>{t('Cancel')}</Button>
                <Button onClick={handleChangePassword}>{t('Save Changes')}</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
            <p className="text-xs text-muted-foreground">{t('Last password change')}: {formatDate(parseISO(mockUserData.lastPasswordChange))}</p>
        </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <div className="flex items-center gap-3">
                <FileLock2 className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{t('Password Policy Configuration (Admin)')}</CardTitle>
            </div>
            <CardDescription>{t('Define and enforce password requirements across the organization.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                <Label>{t('Minimum Length')}:</Label>
                <Input type="number" defaultValue="12" disabled className="mt-1" />
                </div>
                <div>
                <Label>{t('Password Expiry (days)')}:</Label>
                <Input type="number" defaultValue="90" disabled className="mt-1" />
                </div>
                <div className="md:col-span-2 space-y-2">
                <Label>{t('Required Character Types')}:</Label>
                <div className="flex items-center space-x-2"><Switch id="reqUppercaseSec" defaultChecked disabled /><Label htmlFor="reqUppercaseSec" className="font-normal">{t('Uppercase')}</Label></div>
                <div className="flex items-center space-x-2"><Switch id="reqLowercaseSec" defaultChecked disabled /><Label htmlFor="reqLowercaseSec" className="font-normal">{t('Lowercase')}</Label></div>
                <div className="flex items-center space-x-2"><Switch id="reqNumberSec" defaultChecked disabled /><Label htmlFor="reqNumberSec" className="font-normal">{t('Number')}</Label></div>
                <div className="flex items-center space-x-2"><Switch id="reqSpecialSec" defaultChecked disabled /><Label htmlFor="reqSpecialSec" className="font-normal">{t('Special Character')}</Label></div>
                </div>
                <div><Label>{t('Account Lockout Threshold (attempts)')}:</Label><Input type="number" defaultValue="5" disabled className="mt-1" /></div>
                <div><Label>{t('Lockout Duration (minutes)')}:</Label><Input type="number" defaultValue="30" disabled className="mt-1" /></div>
            </div>
            <Button onClick={() => handlePlaceholderAction("Save Password Policy", "Password policy settings would be saved.")} className="mt-3">{t('Save Password Policy')}</Button>
            <p className="text-xs text-muted-foreground mt-2">{t('These settings apply system-wide and affect all users.')}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <div className="flex items-center gap-3">
                <Fingerprint className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{t('Two-Factor Authentication (2FA)')}</CardTitle>
            </div>
            <CardDescription>{t('Enhance your account security with an additional verification step.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
                <p>{t('Status')}: <span className={cn("font-semibold", is2FAEnabled ? "text-green-600" : "text-red-600")}>{is2FAEnabled ? t("Enabled") : t("Disabled")}</span></p>
                <Button variant={is2FAEnabled ? "destructive" : "default"} onClick={handleToggle2FA}>
                {is2FAEnabled ? t("Disable 2FA") : t("Enable 2FA")}
                </Button>
            </div>
            {is2FAEnabled && (
                <Button variant="outline" size="sm" onClick={() => handlePlaceholderAction("Manage 2FA Settings", "Options like viewing recovery codes or changing 2FA method would be here.")}>
                {t('Manage 2FA Settings')}
                </Button>
            )}
            <p className="text-xs text-muted-foreground">
                {is2FAEnabled
                ? t("2FA adds an extra layer of security to your account during login.")
                : t("It is highly recommended to enable 2FA for enhanced security.")}
            </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><div className="flex items-center gap-3"><Network className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('Active Sessions')}</CardTitle></div>
            <CardDescription>{t('View and manage devices currently logged into your account.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="max-h-60 overflow-y-auto rounded-md border">
                <Table>
                <TableHeader><TableRow><TableHead>{t('Device/Browser')}</TableHead><TableHead>{t('Location')}</TableHead><TableHead>{t('Last Active')}</TableHead><TableHead className="text-right">{t('Action')}</TableHead></TableRow></TableHeader>
                <TableBody>
                    {currentActiveSessions.map(session => (
                    <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.device}</TableCell>
                        <TableCell>{session.location} ({session.ipAddress})</TableCell>
                        <TableCell>{session.lastActive}</TableCell>
                        <TableCell className="text-right">
                            <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><LogOut className="mr-1 h-3 w-3" /> {t('Sign Out')}</Button></AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>{t('Sign out this session?')}</AlertDialogTitle><AlertDialogDescription>{t('This will sign out the session on {device} from {location}.', { device: session.device, location: session.location })}</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>{t('Cancel')}</AlertDialogCancel><AlertDialogAction onClick={() => handleSignOutSession(session.id)}>{t('Sign Out')}</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            {currentActiveSessions.length > 1 && (
                <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="outline" className="w-full sm:w-auto">{t('Sign Out All Other Sessions')}</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>{t('Sign out all other sessions?')}</AlertDialogTitle><AlertDialogDescription>{t('This will sign you out of Consult Vista on all devices except this one. You will need to sign in again on other devices.')}</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>{t('Cancel')}</AlertDialogCancel><AlertDialogAction onClick={handleSignOutAllOtherSessions}>{t('Sign Out Others')}</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            <p className="text-xs text-muted-foreground">{t('If you see any unrecognized sessions, sign them out immediately and consider changing your password.')}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><div className="flex items-center gap-3"><UserCheck className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('Recent Login History')}</CardTitle></div><CardDescription>{t('Review recent login attempts to your account.')}</CardDescription></CardHeader>
            <CardContent className="space-y-3">
            <div className="max-h-60 overflow-y-auto rounded-md border">
                <Table><TableHeader><TableRow><TableHead>{t('Date/Time')}</TableHead><TableHead>{t('Status')}</TableHead><TableHead>{t('IP Address')}</TableHead><TableHead>{t('Device/Browser')}</TableHead><TableHead>{t('Location')}</TableHead></TableRow></TableHeader>
                <TableBody>
                    {mockLoginHistoryData.slice(0, 5).map(log => (
                    <TableRow key={log.id}>
                        <TableCell className="text-xs">{log.timestamp}</TableCell>
                        <TableCell>
                        <Badge variant={log.status === 'Success' || log.status.includes('2FA') ? 'default' : 'destructive'}
                                className={cn(log.status === 'Success' || log.status.includes('2FA') ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700')}>
                            {t(log.status as keyof LanguagePack['translations'])}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{log.ipAddress}</TableCell><TableCell className="text-xs">{log.device}</TableCell><TableCell className="text-xs">{log.location}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            <Button variant="outline" onClick={() => handlePlaceholderAction("View Full Login History")} disabled>{t('View Full Login History (Coming Soon)')}</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><div className="flex items-center gap-3"><Bell className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('Account Activity Alerts')}</CardTitle></div><CardDescription>{t('Configure alerts for specific security-sensitive account activities. These are in addition to general notifications.')}</CardDescription></CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-md"><Label htmlFor="alertNewDevice" className="flex-1">{t('Notify on login from new device/location')}</Label><Switch id="alertNewDevice" checked={activityAlerts.newDeviceLogin} onCheckedChange={(checked) => setActivityAlerts(prev => ({ ...prev, newDeviceLogin: checked }))}/></div>
                <div className="flex items-center justify-between p-3 border rounded-md"><Label htmlFor="alertFailedLogins" className="flex-1">{t('Notify on multiple failed login attempts')}</Label><Switch id="alertFailedLogins" checked={activityAlerts.failedLogins} onCheckedChange={(checked) => setActivityAlerts(prev => ({ ...prev, failedLogins: checked }))}/></div>
                <div className="flex items-center justify-between p-3 border rounded-md"><Label htmlFor="alertPasswordChanged" className="flex-1">{t('Notify when password is changed')}</Label><Switch id="alertPasswordChanged" checked={activityAlerts.passwordChanged} onCheckedChange={(checked) => setActivityAlerts(prev => ({ ...prev, passwordChanged: checked }))}/></div>
                <div className="flex items-center justify-between p-3 border rounded-md"><Label htmlFor="alert2FAChanged" className="flex-1">{t('Notify when 2FA settings are changed')}</Label><Switch id="alert2FAChanged" checked={activityAlerts.twoFactorChanged} onCheckedChange={(checked) => setActivityAlerts(prev => ({ ...prev, twoFactorChanged: checked }))}/></div>
                <Button onClick={handleSaveActivityAlerts} className="mt-2">{t('Save Alert Preferences')}</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><div className="flex items-center gap-3"><History className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('System Security & Audit Logs (Preview)')}</CardTitle></div><CardDescription>{t('Review important security events and account activity across the system (Admin view).')}</CardDescription></CardHeader>
            <CardContent className="space-y-3">
                <div className="max-h-60 overflow-y-auto rounded-md border">
                    <Table><TableHeader><TableRow><TableHead>{t('Timestamp')}</TableHead><TableHead>{t('Event')}</TableHead><TableHead>{t('User')}</TableHead><TableHead>{t('IP Address')}</TableHead><TableHead>{t('Details')}</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {mockAuditLogPreviewData.map(log => (<TableRow key={log.id}><TableCell className="text-xs">{log.timestamp}</TableCell><TableCell className="text-xs font-medium">{t(log.event as keyof LanguagePack['translations'])}</TableCell><TableCell className="text-xs">{log.user}</TableCell><TableCell className="text-xs">{log.ipAddress}</TableCell><TableCell className="text-xs text-muted-foreground">{t(log.details as keyof LanguagePack['translations'])}</TableCell></TableRow>))}
                        </TableBody>
                    </Table>
                </div>
                <Button variant="outline" onClick={() => handlePlaceholderAction("View Full Audit Log", "A dedicated page with comprehensive, filterable audit logs would be shown here.")} disabled>{t('View Full Audit Log (Coming Soon)')}</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><div className="flex items-center gap-3"><ShieldCheck className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('API Key Management (Admin)')}</CardTitle></div><CardDescription>{t('Manage API keys for integrations and external services.')}</CardDescription></CardHeader>
            <CardContent>
                <Button variant="outline" onClick={() => handlePlaceholderAction("Manage API Keys", "Redirecting to API Key Management section (Admin only).")}>{t('Manage API Keys')}</Button>
                <p className="text-xs text-muted-foreground mt-2">{t('Create, revoke, and set permissions for API keys used by third-party applications or custom scripts.')}</p>
            </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
            <CardHeader><div className="flex items-center gap-3"><Shield className="h-7 w-7 text-primary" /><CardTitle className="text-xl text-primary">{t('Data Encryption & Security Posture')}</CardTitle></div></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>{t('Consult Vista is committed to the highest standards of data security.')}</p>
            <p>{t('All sensitive data is encrypted in transit (using TLS/SSL) and at rest (using AES-256 or equivalent).')}</p>
            <p>{t('We conduct regular security audits and vulnerability assessments to ensure the integrity of our platform.')}</p>
            <p>{t('Your data privacy and security are our top priorities.')}</p>
            </CardContent>
        </Card>
    </div>
  );
}

    