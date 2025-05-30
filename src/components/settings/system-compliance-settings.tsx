
// src/components/settings/system-compliance-settings.tsx
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { Server, DatabaseBackup, FileLock2, ShieldCheck, History, Settings as SettingsIcon, CalendarClock, Info, DownloadCloud, Construction } from "lucide-react";
import type { LanguagePack } from '@/lib/i18n-config';
import { format, subDays, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

const mockSystemInfo = {
  appVersion: '2.5.1',
  lastMaintenance: format(subDays(new Date(), 15), 'PPpp'),
  serverStatus: 'Online',
  nextMaintenanceWindow: format(addDays(new Date(), 20), 'PPpp'),
};

const mockBackupData = {
  lastSuccessfulBackup: format(subDays(new Date(), 1), 'PPpp'),
  availableRestorePoints: [
    { id: 'bp1', date: subDays(new Date(), 1), description: 'Daily Backup' },
    { id: 'bp2', date: subDays(new Date(), 7), description: 'Weekly Snapshot' },
    { id: 'bp3', date: subDays(new Date(), 30), description: 'Monthly Archive' },
  ],
};

const mockAuditLogsPreview = [
  { id: 'log1', timestamp: format(subDays(new Date(), 0.5), 'PPpp'), event: 'Admin login successful', user: 'Alex Mercer', details: 'IP: 192.168.1.101' },
  { id: 'log2', timestamp: format(subDays(new Date(), 1.2), 'PPpp'), event: 'Password Policy Updated', user: 'Alex Mercer', details: 'Min length set to 12' },
  { id: 'log3', timestamp: format(subDays(new Date(), 2.0), 'PPpp'), event: 'Manual Backup Initiated', user: 'Alex Mercer', details: 'Full system backup' },
  { id: 'log4', timestamp: format(subDays(new Date(), 2.5), 'PPpp'), event: 'User Role Changed', user: 'Alex Mercer', details: "User 'bsmith' to 'Project Manager'" },
  { id: 'log5', timestamp: format(subDays(new Date(), 3.1), 'PPpp'), event: 'API Key Generated', user: 'System (IntegrationX)', details: "Key for 'Salesforce Sync'" },
];

interface SystemComplianceSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export default function SystemComplianceSettingsSection({ t }: SystemComplianceSettingsProps) {
  const { toast } = useToast();
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [backupRetention, setBackupRetention] = useState('30days');
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedRestorePoint, setSelectedRestorePoint] = useState<string | null>(null);

  const [retentionPolicy, setRetentionPolicy] = useState({
    default: '365',
    projectData: '1825', // 5 years
    auditLogs: '730',   // 2 years
  });

  const handleCreateManualBackup = () => {
    toast({
      title: t("Manual Backup Initiated"),
      description: t("A full system backup has been started. This may take some time. You will be notified upon completion. (Simulated)"),
      duration: 4000,
    });
  };

  const handleInitiateRestore = () => {
    if (!selectedRestorePoint) return;
    const point = mockBackupData.availableRestorePoints.find(p => p.id === selectedRestorePoint);
    toast({
      title: t("System Restore Initiated"),
      description: t("Restore from backup point '{restoreDesc}' dated {restoreDate} has started. The system may be temporarily unavailable. (Simulated)", { restoreDesc: point?.description || 'Unknown', restoreDate: point ? format(point.date, 'PP') : 'N/A' }),
      duration: 5000,
      variant: "destructive"
    });
    setShowRestoreDialog(false);
    setSelectedRestorePoint(null);
  };

  const handleSaveRetentionPolicies = () => {
     toast({
      title: t("Data Retention Policies Saved"),
      description: t("Your data retention policies have been updated. These changes will apply to new data moving forward. (Simulated)"),
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Server className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">{t('System Information & Health')}</CardTitle>
          </div>
          <CardDescription className="pt-1 text-base">
            {t('Overview of system status, version, and maintenance schedules.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><strong>{t('Application Version')}:</strong> {mockSystemInfo.appVersion}</p>
          <p><strong>{t('Server Status')}:</strong> <Badge variant={mockSystemInfo.serverStatus === 'Online' ? 'default' : 'destructive'} className={cn(mockSystemInfo.serverStatus === 'Online' ? 'bg-green-500/20 text-green-700' : '')}>{t(mockSystemInfo.serverStatus)}</Badge></p>
          <p><strong>{t('Last Scheduled Maintenance')}:</strong> {mockSystemInfo.lastMaintenance}</p>
          <p><strong>{t('Next Scheduled Maintenance Window')}:</strong> {mockSystemInfo.nextMaintenanceWindow}</p>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" onClick={() => toast({ title: t("System Check Triggered (Simulated)"), description: t("Running diagnostics... System nominal.") })}>{t('Perform System Check')}</Button>
            <Button variant="outline" disabled onClick={() => toast({ title: t("Placeholder Action")})}>{t('View Performance Metrics')}</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3"><DatabaseBackup className="h-7 w-7 text-primary" /><CardTitle className="text-2xl">{t('Data Backup & Restoration')}</CardTitle></div>
          <CardDescription>{t('Manage system backups and restore procedures.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm"><strong>{t('Last Successful Backup')}:</strong> {mockBackupData.lastSuccessfulBackup}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="backupFrequency" className="text-sm font-medium">{t('Backup Frequency')}</Label>
              <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                <SelectTrigger id="backupFrequency" className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t('Daily')}</SelectItem>
                  <SelectItem value="weekly">{t('Weekly')}</SelectItem>
                  <SelectItem value="monthly">{t('Monthly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="backupRetention" className="text-sm font-medium">{t('Backup Retention Period')}</Label>
              <Select value={backupRetention} onValueChange={setBackupRetention}>
                <SelectTrigger id="backupRetention" className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">{t('30 Days')}</SelectItem>
                  <SelectItem value="90days">{t('90 Days')}</SelectItem>
                  <SelectItem value="180days">{t('180 Days')}</SelectItem>
                  <SelectItem value="1year">{t('1 Year')}</SelectItem>
                  <SelectItem value="custom">{t('Custom (Not Implemented)')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleCreateManualBackup}>{t('Initiate Manual Backup Now')}</Button>
            <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
                <DialogTrigger asChild>
                    <Button variant="outline">{t('Restore from Backup...')}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{t('Restore System from Backup')}</DialogTitle>
                        <DialogDescription>{t('Select a backup point to restore from. This is a critical operation and may cause temporary system downtime.')}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3 max-h-60 overflow-y-auto">
                        <Label>{t('Available Restore Points')}</Label>
                        {mockBackupData.availableRestorePoints.map(point => (
                            <div key={point.id} 
                                 className={cn("p-3 border rounded-md cursor-pointer hover:bg-muted/80", selectedRestorePoint === point.id && "bg-primary/10 border-primary ring-1 ring-primary")}
                                 onClick={() => setSelectedRestorePoint(point.id)}
                            >
                                <p className="font-medium">{format(point.date, 'PPP EEEE p')}</p>
                                <p className="text-xs text-muted-foreground">{point.description}</p>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                         <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>{t('Cancel')}</Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button variant="destructive" disabled={!selectedRestorePoint}>{t('Initiate Restore')}</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('Confirm System Restore')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('Are you absolutely sure you want to restore the system to {restorePointDesc} from {restorePointDate}? This action cannot be undone and will overwrite current data with the backup state.', {
                                            restorePointDesc: mockBackupData.availableRestorePoints.find(p=>p.id===selectedRestorePoint)?.description || 'the selected point',
                                            restorePointDate: mockBackupData.availableRestorePoints.find(p=>p.id===selectedRestorePoint) ? format(mockBackupData.availableRestorePoints.find(p=>p.id===selectedRestorePoint)!.date, 'PP') : 'N/A'
                                        })}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleInitiateRestore}>{t('Confirm & Restore')}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3"><History className="h-7 w-7 text-primary" /><CardTitle className="text-2xl">{t('System Audit Logs')}</CardTitle></div>
          <CardDescription>{t('Comprehensive tracking of all significant system events, configuration changes, and user actions for security and compliance.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            <div className="max-h-72 overflow-y-auto rounded-md border">
                <Table>
                    <TableHeader><TableRow><TableHead>{t('Timestamp')}</TableHead><TableHead>{t('Event')}</TableHead><TableHead>{t('Actor')}</TableHead><TableHead>{t('Details')}</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {mockAuditLogsPreview.map(log => (
                            <TableRow key={log.id}>
                                <TableCell className="text-xs">{log.timestamp}</TableCell>
                                <TableCell className="text-xs font-medium">{t(log.event as keyof LanguagePack['translations'])}</TableCell>
                                <TableCell className="text-xs">{log.user}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{t(log.details as keyof LanguagePack['translations'])}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Button variant="outline" disabled onClick={() => toast({ title: t("Placeholder Action")})}>{t('Access Full Audit Log Viewer (Filterable & Searchable)')}</Button>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3"><ShieldCheck className="h-7 w-7 text-primary" /><CardTitle className="text-2xl">{t('Compliance Management')}</CardTitle></div>
          <CardDescription>{t('Configure settings related to industry standards and regulations (e.g., GDPR, HIPAA, SOC 2).')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Select disabled>
                <SelectTrigger className="w-full md:w-[300px]"><SelectValue placeholder={t("Select Compliance Standard (e.g., GDPR)")} /></SelectTrigger>
                <SelectContent><SelectItem value="gdpr">GDPR</SelectItem><SelectItem value="hipaa">HIPAA</SelectItem><SelectItem value="soc2">SOC 2</SelectItem></SelectContent>
            </Select>
            <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2"><Checkbox id="comp-pii" disabled /><Label htmlFor="comp-pii" className="text-sm font-normal">{t('PII Data Anonymization/Pseudonymization Active')}</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="comp-consent" disabled /><Label htmlFor="comp-consent" className="text-sm font-normal">{t('Consent Management for Data Processing Enabled')}</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="comp-breach" disabled /><Label htmlFor="comp-breach" className="text-sm font-normal">{t('Data Breach Notification Protocols Configured')}</Label></div>
            </div>
            <Button variant="outline" disabled className="mt-3" onClick={() => toast({ title: t("Placeholder Action")})}><DownloadCloud className="mr-2 h-4 w-4" />{t('Download Compliance Reports')}</Button>
             <p className="text-xs text-muted-foreground mt-2">{t('Detailed compliance controls and report generation are key upcoming features.')}</p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3"><FileLock2 className="h-7 w-7 text-primary" /><CardTitle className="text-2xl">{t('Data Retention Policies')}</CardTitle></div>
          <CardDescription>{t('Define how long different types of data are stored within the system to meet business and regulatory requirements.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="retDefault" className="text-sm font-medium">{t('Default Data Retention (days)')}</Label>
                    <Input id="retDefault" type="number" value={retentionPolicy.default} onChange={e => setRetentionPolicy(p => ({...p, default: e.target.value}))} className="mt-1"/>
                </div>
                <div>
                    <Label htmlFor="retProject" className="text-sm font-medium">{t('Project Data (after completion, days)')}</Label>
                    <Input id="retProject" type="number" value={retentionPolicy.projectData} onChange={e => setRetentionPolicy(p => ({...p, projectData: e.target.value}))} className="mt-1"/>
                </div>
                <div>
                    <Label htmlFor="retAudit" className="text-sm font-medium">{t('Audit Log Retention (days)')}</Label>
                    <Input id="retAudit" type="number" value={retentionPolicy.auditLogs} onChange={e => setRetentionPolicy(p => ({...p, auditLogs: e.target.value}))} className="mt-1"/>
                </div>
            </div>
            <Button onClick={handleSaveRetentionPolicies} className="mt-3">{t('Save Retention Policies')}</Button>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
            <div className="flex items-center gap-3"><Info className="h-7 w-7 text-primary" /><CardTitle className="text-2xl">{t('Terms of Service & Privacy Policy')}</CardTitle></div>
            <CardDescription>{t('Manage and review the system\'s legal documents. (Admin)')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-3">
                <Button variant="link" className="p-0 h-auto" onClick={() => toast({title: t("Viewing Terms of Service (Placeholder)")})}>{t('View Current Terms of Service')}</Button>
                <Button variant="link" className="p-0 h-auto" onClick={() => toast({title: t("Viewing Privacy Policy (Placeholder)")})}>{t('View Current Privacy Policy')}</Button>
            </div>
            <Button variant="outline" disabled onClick={() => toast({ title: t("Placeholder Action")})}>{t('Upload/Update Policies (Admin Interface)')}</Button>
            <p className="text-xs text-muted-foreground">{t('Ensure these documents are up-to-date and reflect your organization\'s practices.')}</p>
        </CardContent>
      </Card>

      <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground border-t pt-6 mt-6">
         <div className="flex items-center gap-2"> <Construction className="h-5 w-5 text-primary"/> <h4 className="font-semibold text-foreground">{t('Ongoing Development Note')}</h4></div>
        <p>{t('The System & Compliance module is actively being developed to provide a comprehensive suite of tools for administrators. Many features presented here are interactive representations of planned functionality. Full backend integration and advanced automation will be rolled out in subsequent updates.')}</p>
      </CardFooter>
    </div>
  );
}

