
'use client';

import React, { useState, useEffect } from 'react'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  UserCircle, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  CreditCard, 
  Users as UsersIcon,
  Shield,
  Link2,
  Workflow,
  Server,
  Edit3,
  Trash2,
  KeyRound,
  BellRing,
  Languages,
  Paintbrush,
  Briefcase,
  MessageSquare,
  DollarSign as FinancialIcon,
  LogOut,
  ShieldCheck,
  History,
  ScanText,
  Fingerprint,
  ClipboardList,
  Network,
  FileLock2,
  UserCheck,
  UserX,
  Sun,
  Moon,
  Laptop,
  LayoutDashboard,
  ImageIcon,
  Type,
  CalendarIcon,
  Download,
  Activity,
  FileText as BillingHistoryIcon,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/context/theme-provider';
import { useLocalization } from '@/context/localization-provider';
import { languagePacks, supportedLanguages, supportedRegions, type SupportedLanguage, type SupportedRegion } from '@/lib/i18n-config';
import { Progress } from '@/components/ui/progress';

type SettingsSectionId = 
  | 'account' 
  | 'notifications' 
  | 'security' 
  | 'appearance' 
  | 'language' 
  | 'billing' 
  | 'userManagement' 
  | 'accessControl'
  | 'integrations'
  | 'workflow'
  | 'system';

interface SettingsMenuItem {
  id: SettingsSectionId;
  labelKey: keyof typeof languagePacks.en.translations;
  icon: React.ElementType;
  description: string; 
}

const settingsMenuItems: SettingsMenuItem[] = [
  { id: 'account', labelKey: 'Account', icon: UserCircle, description: 'Manage your personal account details and profile information.' },
  { id: 'notifications', labelKey: 'Notifications', icon: BellRing, description: 'Configure how and when you receive notifications from the system.' },
  { id: 'security', labelKey: 'Security', icon: Lock, description: 'Manage your password, two-factor authentication, and view active sessions.' },
  { id: 'appearance', labelKey: 'Appearance', icon: Paintbrush, description: 'Customize the look and feel of the application, including theme.' },
  { id: 'language', labelKey: 'Language & Region', icon: Languages, description: 'Set your preferred language and region for the application interface.' },
  { id: 'billing', labelKey: 'Billing', icon: CreditCard, description: 'View your subscription details, payment history, and manage billing information.' },
  { id: 'userManagement', labelKey: 'User Management', icon: UsersIcon, description: 'Administer user accounts, roles, and permissions. (Admins)' },
  { id: 'accessControl', labelKey: 'Access Control', icon: ShieldCheck, description: 'Define and manage role-based access control (RBAC) policies. (Admins)' },
  { id: 'integrations', labelKey: 'Integrations', icon: Link2, description: 'Connect and manage third-party application integrations.' },
  { id: 'workflow', labelKey: 'Workflow Customization', icon: Workflow, description: 'Customize business workflows and approval processes.' },
  { id: 'system', labelKey: 'System & Compliance', icon: Server, description: 'Configure system-wide settings, view audit logs, and manage compliance.' },
];

const mockUserData = {
  name: 'Alex Mercer (Super Admin)',
  email: 'alex.mercer@consult.com',
  role: 'Lead Strategist & System Administrator',
  avatarUrl: 'https://placehold.co/128x128/64B5F6/FFFFFF.png?text=AM',
  phone: '(555) 123-4567',
  lastPasswordChange: '2024-03-15'
};

interface NotificationPreference {
  email: boolean;
  inApp: boolean;
}

interface NotificationSettings {
  masterEnable: boolean;
  channels: {
    email: boolean;
    inApp: boolean;
    push: boolean; 
  };
  preferences: {
    projectUpdates: NotificationPreference;
    clientCommunications: NotificationPreference;
    taskManagement: NotificationPreference;
    financialAlerts: NotificationPreference;
    systemAnnouncements: NotificationPreference;
  };
  digestFrequency: 'instant' | 'daily' | 'weekly';
}

const mockActiveSessions = [
    { id: 'session1', device: 'Chrome on Windows', location: 'New York, USA', ipAddress: '192.168.1.101', lastActive: '2 hours ago' },
    { id: 'session2', device: 'Safari on macOS', location: 'London, UK', ipAddress: '10.0.0.5', lastActive: '1 day ago' },
    { id: 'session3', device: 'Mobile App (iOS)', location: 'San Francisco, USA', ipAddress: '172.16.0.20', lastActive: '5 minutes ago' },
];

const mockAuditLogPreview = [
    { id: 'log1', timestamp: '2024-07-25 10:00:00 UTC', event: 'Successful login', user: 'Alex Mercer', ipAddress: '192.168.1.101', details: 'Login via web browser' },
    { id: 'log2', timestamp: '2024-07-25 09:30:00 UTC', event: 'Password change attempt (failed)', user: 'Alex Mercer', ipAddress: '203.0.113.45', details: 'Incorrect current password' },
    { id: 'log3', timestamp: '2024-07-24 15:00:00 UTC', event: '2FA setup completed', user: 'Alex Mercer', ipAddress: '192.168.1.101', details: 'Authenticator app registered' },
];

const mockLoginHistory = [
    { id: 'lh1', timestamp: '2024-07-26 10:00:00 UTC', status: 'Success', ipAddress: '192.168.1.101', device: 'Chrome on Windows', location: 'New York, USA' },
    { id: 'lh2', timestamp: '2024-07-26 09:55:00 UTC', status: 'Failed', ipAddress: '203.0.113.45', device: 'Unknown Browser', location: 'Unknown (Suspicious)' },
];

const mockBillingData = {
  currentPlan: {
    name: 'Pro Plan',
    price: 99, // per month
    currency: 'USD',
    features: ['Up to 50 Users', 'Unlimited Projects', 'Advanced Analytics', 'Priority Support'],
    nextBillingDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toLocaleDateString(),
  },
  paymentMethod: {
    type: 'Visa',
    last4: '1234',
    expiry: '12/2025',
  },
  billingHistory: [
    { id: 'INV-SUB-003', date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString(), amount: 99, status: 'Paid' },
    { id: 'INV-SUB-002', date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toLocaleDateString(), amount: 99, status: 'Paid' },
    { id: 'INV-SUB-001', date: new Date(new Date().setMonth(new Date().getMonth() - 3)).toLocaleDateString(), amount: 99, status: 'Paid' },
  ],
  usage: {
    users: { current: 27, limit: 50 },
    projects: { current: 187, limit: Infinity }, // Infinity for unlimited
    storage: { current: 68, limit: 100, unit: 'GB' },
  },
  billingAddress: {
    company: 'Mercer Consulting Inc.',
    line1: '123 Innovation Drive',
    city: 'Techville',
    state: 'CA',
    zip: '90210',
    country: 'USA',
    taxId: 'US-TAX-123456789',
  }
};


export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('account');
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { language, region, setLanguage, setRegion, t, formatDate } = useLocalization();


  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    masterEnable: true,
    channels: { email: true, inApp: true, push: false },
    preferences: {
      projectUpdates: { email: true, inApp: true },
      clientCommunications: { email: true, inApp: false },
      taskManagement: { email: false, inApp: true },
      financialAlerts: { email: true, inApp: true },
      systemAnnouncements: { email: true, inApp: true },
    },
    digestFrequency: 'daily',
  });

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showUpdatePaymentDialog, setShowUpdatePaymentDialog] = useState(false);
  const [showEditBillingAddressDialog, setShowEditBillingAddressDialog] = useState(false);
  const [currentActiveSessions, setCurrentActiveSessions] = useState(mockActiveSessions);
  const [activityAlerts, setActivityAlerts] = useState({
    newDeviceLogin: true,
    failedLogins: true,
    passwordChanged: true,
    twoFactorChanged: false,
  });
  
  const handleNotificationChange = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleChannelChange = (channel: keyof NotificationSettings['channels'], value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      channels: { ...prev.channels, [channel]: value },
    }));
  };

  const handlePreferenceChange = (
    event: keyof NotificationSettings['preferences'],
    type: keyof NotificationPreference,
    value: boolean
  ) => {
    setNotificationSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [event]: { ...prev.preferences[event], [type]: value },
      },
    }));
  };


  const handlePlaceholderAction = (actionMessageKey: string, descriptionKey?: string) => {
    toast({
      title: t(actionMessageKey),
      description: descriptionKey ? t(descriptionKey) : t("This functionality is for demonstration."),
      duration: 3000,
    });
  };

  const handleAccountDeletion = () => {
    toast({
      title: t("Account Deletion Process"),
      description: t("Account deletion initiated (simulated). This would be permanent."),
      variant: "destructive",
      duration: 5000,
    });
  }

  const handleSaveNotificationSettings = () => {
    toast({
      title: t("Settings Saved"),
      description: t("Your notification preferences have been updated (simulated)."),
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
    toast({ title: t("Session Signed Out"), description: t("Session {sessionId} has been remotely signed out (simulated).", {sessionId})});
  };

  const handleSignOutAllOtherSessions = () => {
    if (currentActiveSessions.length > 1) { 
        setCurrentActiveSessions(prev => prev.slice(0, 1));
    }
    toast({ title: t("All Other Sessions Signed Out"), description: t("All other active sessions have been remotely signed out (simulated).")});
  };

  const handleSaveActivityAlerts = () => {
    toast({ title: t("Activity Alert Preferences Saved"), description: t("Your preferences for account activity alerts have been updated (simulated).") });
  };

  const handleSaveAppearanceSettings = () => {
    toast({
      title: t("Appearance Settings Saved"),
      description: t("Theme preference updated to {theme}. Accent color is a placeholder.", { theme }),
      duration: 3000,
    });
  };

  const handleSaveLanguageSettings = () => {
     toast({
      title: t("Settings Saved"),
      description: t("Language and region preferences have been updated (simulated)."),
      duration: 3000,
    });
  };
  
  const handleUpdatePaymentMethod = () => {
    setShowUpdatePaymentDialog(false);
    toast({
      title: t("Payment Method Updated"),
      description: t("Your payment method has been successfully updated (simulated)."),
      duration: 3000,
    });
  };

  const handleEditBillingAddress = () => {
    setShowEditBillingAddressDialog(false);
    toast({
      title: t("Billing Address Updated"),
      description: t("Your billing address has been successfully updated (simulated)."),
      duration: 3000,
    });
  };

  const renderSectionContent = () => {
    const section = settingsMenuItems.find(item => item.id === activeSection);
    
    if (activeSection === 'account') {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <UserCircle className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{t('Profile Information')}</CardTitle>
              </div>
              <CardDescription>{t('Manage your personal details and profile picture.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-primary/30">
                  <AvatarImage src={mockUserData.avatarUrl} alt={mockUserData.name} data-ai-hint="user avatar"/>
                  <AvatarFallback className="text-3xl">{mockUserData.name.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <h3 className="text-lg font-semibold">{mockUserData.name}</h3>
                  <p className="text-sm text-muted-foreground">{mockUserData.email}</p>
                  <p className="text-xs text-muted-foreground">{mockUserData.role}</p>
                   <Button variant="outline" size="sm" className="mt-2" onClick={() => handlePlaceholderAction("Change Profile Picture Triggered")}>
                    {t('Change Picture')}
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profileName">{t('Full Name')}</Label>
                  <Input id="profileName" defaultValue={mockUserData.name} disabled className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="profileEmail">{t('Email Address')}</Label>
                  <Input id="profileEmail" type="email" defaultValue={mockUserData.email} disabled className="mt-1" />
                </div>
                 <div>
                  <Label htmlFor="profilePhone">{t('Phone Number')}</Label>
                  <Input id="profilePhone" type="tel" defaultValue={mockUserData.phone} disabled className="mt-1" />
                </div>
                 <Button onClick={() => handlePlaceholderAction("Edit Profile Details Triggered")}>
                    <Edit3 className="mr-2 h-4 w-4"/> {t('Edit Profile')}
                </Button>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{t('Security Settings (Basic)')}</CardTitle>
              </div>
              <CardDescription>{t('Manage your password and basic security options.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               <Button variant="outline" onClick={() => { setActiveSection('security'); handlePlaceholderAction("Redirecting to Full Security Settings...");}}>
                    {t('Go to Full Security Settings')}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                    {t('Advanced options like Two-Factor Authentication, Active Sessions, and Audit Logs are available in the main "Security" section.')}
                </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Paintbrush className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{t('Preferences')}</CardTitle>
              </div>
              <CardDescription>{t('Personalize your application experience.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-medium">{t('Appearance & Language')}</h4>
                    <p className="text-sm text-muted-foreground">{t('Theme (Dark/Light mode) and language settings can be found in their dedicated sections in the main settings menu.')}</p>
                     <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => setActiveSection('appearance')}>
                            <Palette className="mr-2 h-4 w-4"/> {t('Go to Appearance')}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setActiveSection('language')}>
                            <Languages className="mr-2 h-4 w-4"/> {t('Go to Language & Region')}
                        </Button>
                     </div>
                </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/50">
            <CardHeader>
               <div className="flex items-center gap-3">
                <Trash2 className="h-7 w-7 text-destructive" />
                <CardTitle className="text-xl text-destructive">{t('Account Management')}</CardTitle>
              </div>
              <CardDescription className="text-destructive/90">{t('Manage critical account actions.')}</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> {t('Delete Account')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('Are you absolutely sure?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('This action cannot be undone. This will permanently delete your account and remove your data from our servers.')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAccountDeletion}>{t('Continue')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <p className="text-xs text-muted-foreground mt-2">
                {t('Deleting your account is permanent. Please be certain before proceeding.')}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === 'notifications') {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BellRing className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{t('Notification Settings')}</CardTitle>
              </div>
              <CardDescription>{t('Manage how and when you receive alerts from Consult Vista.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div>
                  <Label htmlFor="masterEnable" className="text-base font-semibold">{t('Enable All Notifications')}</Label>
                  <p className="text-xs text-muted-foreground">{t('Master control for all application alerts.')}</p>
                </div>
                <Switch
                  id="masterEnable"
                  checked={notificationSettings.masterEnable}
                  onCheckedChange={(checked) => handleNotificationChange('masterEnable', checked)}
                />
              </div>
              <Separator />
              <div>
                <h4 className="text-md font-semibold mb-3">{t('Notification Channels')}</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailChannel">{t('Email Notifications')}</Label>
                    <Switch
                      id="emailChannel"
                      checked={notificationSettings.channels.email}
                      onCheckedChange={(checked) => handleChannelChange('email', checked)}
                      disabled={!notificationSettings.masterEnable}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inAppChannel">{t('In-App Notifications')}</Label>
                    <Switch
                      id="inAppChannel"
                      checked={notificationSettings.channels.inApp}
                      onCheckedChange={(checked) => handleChannelChange('inApp', checked)}
                      disabled={!notificationSettings.masterEnable}
                    />
                  </div>
                  <div className="flex items-center justify-between opacity-50">
                    <Label htmlFor="pushChannel">{t('Push Notifications (Mobile)')}</Label>
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-muted-foreground italic mr-2">{t('Coming Soon')}</span>
                       <Switch id="pushChannel" checked={notificationSettings.channels.push} disabled />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-md font-semibold mb-3">{t('Detailed Notification Preferences')}</h4>
                <p className="text-sm text-muted-foreground mb-4">{t('Choose which types of events trigger notifications for each channel. (Only active if master notifications are enabled.)')}</p>
                {(Object.keys(notificationSettings.preferences) as Array<keyof NotificationSettings['preferences']>).map((eventKey) => {
                  const eventLabel = t(eventKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) as keyof typeof languagePacks.en.translations);
                  const Icon = 
                    eventKey === 'projectUpdates' ? Briefcase :
                    eventKey === 'clientCommunications' ? MessageSquare :
                    eventKey === 'taskManagement' ? UsersIcon : 
                    eventKey === 'financialAlerts' ? FinancialIcon :
                    Server; 
                  return (
                    <div key={eventKey} className="mb-4 p-3 border rounded-md bg-card/50">
                      <div className="flex items-center gap-2 mb-2">
                         <Icon className="h-5 w-5 text-muted-foreground"/>
                         <h5 className="font-medium text-sm">{eventLabel}</h5>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pl-7">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`${eventKey}-email`} className="text-xs">{t('Email')}</Label>
                          <Switch
                            id={`${eventKey}-email`}
                            checked={notificationSettings.preferences[eventKey].email}
                            onCheckedChange={(checked) => handlePreferenceChange(eventKey, 'email', checked)}
                            disabled={!notificationSettings.masterEnable || !notificationSettings.channels.email}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`${eventKey}-inApp`} className="text-xs">{t('In-App')}</Label>
                          <Switch
                            id={`${eventKey}-inApp`}
                            checked={notificationSettings.preferences[eventKey].inApp}
                            onCheckedChange={(checked) => handlePreferenceChange(eventKey, 'inApp', checked)}
                            disabled={!notificationSettings.masterEnable || !notificationSettings.channels.inApp}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Separator />
               <div>
                  <h4 className="text-md font-semibold mb-2">{t('Notification Delivery')}</h4>
                   <Label htmlFor="digestFrequency" className="text-sm text-muted-foreground">{t('Notification Digest Frequency (Planned)')}</Label>
                    <Select
                        value={notificationSettings.digestFrequency}
                        onValueChange={(value: NotificationSettings['digestFrequency']) => handleNotificationChange('digestFrequency', value) }
                        disabled 
                    >
                        <SelectTrigger id="digestFrequency" className="mt-1 w-full sm:w-[250px]">
                            <SelectValue placeholder={t('Select frequency')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="instant">{t('Instant')}</SelectItem>
                            <SelectItem value="daily">{t('Daily Digest')}</SelectItem>
                            <SelectItem value="weekly">{t('Weekly Digest')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1 italic">{t('Consolidate non-critical notifications into a summary. (Feature coming soon)')}</p>
               </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotificationSettings} disabled={!notificationSettings.masterEnable}>{t('Save Notification Settings')}</Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    if (activeSection === 'security') {
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
              <p className="text-xs text-muted-foreground">{t('Last password change')}: {formatDate(new Date(mockUserData.lastPasswordChange))}</p>
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
                    {mockLoginHistory.slice(0, 5).map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">{log.timestamp}</TableCell>
                        <TableCell>
                          <Badge variant={log.status === 'Success' || log.status.includes('2FA') ? 'default' : 'destructive'}
                                 className={cn(log.status === 'Success' || log.status.includes('2FA') ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700')}>
                            {t(log.status as keyof typeof languagePacks.en.translations)}
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
                            {mockAuditLogPreview.map(log => (<TableRow key={log.id}><TableCell className="text-xs">{log.timestamp}</TableCell><TableCell className="text-xs font-medium">{t(log.event as keyof typeof languagePacks.en.translations)}</TableCell><TableCell className="text-xs">{log.user}</TableCell><TableCell className="text-xs">{log.ipAddress}</TableCell><TableCell className="text-xs text-muted-foreground">{t(log.details as keyof typeof languagePacks.en.translations)}</TableCell></TableRow>))}
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

    if (activeSection === 'appearance') {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader><div className="flex items-center gap-3"><Paintbrush className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('Theme & Display Settings')}</CardTitle></div><CardDescription>{t('Personalize the visual appearance of the application.')}</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold">{t('Application Theme')}</Label>
                <p className="text-xs text-muted-foreground mb-2">{t('Select your preferred interface theme.')}</p>
                <RadioGroup value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Label htmlFor="theme-light" className={cn("flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:border-primary transition-colors", theme === 'light' && "border-primary ring-2 ring-primary")}><RadioGroupItem value="light" id="theme-light" /> <Sun className="h-5 w-5" /> {t('Light Mode')}</Label>
                  <Label htmlFor="theme-dark" className={cn("flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:border-primary transition-colors", theme === 'dark' && "border-primary ring-2 ring-primary")}><RadioGroupItem value="dark" id="theme-dark" /> <Moon className="h-5 w-5" /> {t('Dark Mode')}</Label>
                  <Label htmlFor="theme-system" className={cn("flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:border-primary transition-colors", theme === 'system' && "border-primary ring-2 ring-primary")}><RadioGroupItem value="system" id="theme-system" /> <Laptop className="h-5 w-5" /> {t('System Default')}</Label>
                </RadioGroup>
              </div>
              <Separator />
              <div>
                <Label htmlFor="accent-color" className="text-base font-semibold">{t('Accent Color Palette')}</Label>
                <p className="text-xs text-muted-foreground mb-2">{t('Choose an accent color for primary actions and highlights.')}</p>
                <Select defaultValue="defaultBlue" disabled>
                  <SelectTrigger id="accent-color" className="w-full sm:w-[280px]"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="defaultBlue">{t('Default Blue (Current)')}</SelectItem></SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">{t('More color palettes coming soon.')}</p>
              </div>
               <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label htmlFor="interface-scale" className="text-base font-semibold">{t('Interface Scale')}</Label><p className="text-xs text-muted-foreground mb-2">{t('Adjust the overall size of UI elements.')}</p><Select defaultValue="default" disabled><SelectTrigger id="interface-scale"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="compact">{t('Compact')}</SelectItem><SelectItem value="default">{t('Default')}</SelectItem><SelectItem value="spacious">{t('Spacious')}</SelectItem></SelectContent></Select></div>
                <div><Label htmlFor="data-density" className="text-base font-semibold">{t('Data Density')}</Label><p className="text-xs text-muted-foreground mb-2">{t('Optimize tables and lists for more or less information.')}</p><Select defaultValue="comfortable" disabled><SelectTrigger id="data-density"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="compact">{t('Compact (More Data)')}</SelectItem><SelectItem value="comfortable">{t('Comfortable (Balanced)')}</SelectItem></SelectContent></Select></div>
              </div>
            </CardContent>
            <CardFooter><Button onClick={handleSaveAppearanceSettings}>{t('Save Appearance Settings')}</Button></CardFooter>
          </Card>
          <Card>
            <CardHeader><div className="flex items-center gap-3"><LayoutDashboard className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('Dashboard & Widget Customization')}</CardTitle></div><CardDescription>{t('Tailor your dashboard views by arranging widgets and choosing what information to display.')}</CardDescription></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground mb-4">{t('Personalize your dashboard views to prioritize the information most relevant to you. (Feature under development)')}</p><div className="p-6 border-2 border-dashed rounded-lg text-center bg-muted/30"><p className="text-muted-foreground mb-2">{t('Visual representation of dashboard customization area.')}</p><div className="flex justify-around items-center h-32 opacity-50"><div className="p-2 border rounded bg-card w-1/3 h-20 text-xs flex items-center justify-center">{t('Widget A')}</div><div className="p-2 border rounded bg-card w-1/3 h-24 text-xs flex items-center justify-center">{t('Widget B')}</div></div><p className="text-xs text-muted-foreground mt-2">{t('Drag-and-drop widget arrangement and content selection coming soon.')}</p></div><Button variant="outline" className="mt-4" onClick={() => handlePlaceholderAction("Launch Dashboard Layout Editor Clicked")} disabled>{t('Launch Dashboard Layout Editor')}</Button></CardContent>
          </Card>
          <Card>
            <CardHeader><div className="flex items-center gap-3"><ImageIcon className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('System Branding (Admin)')}</CardTitle></div><CardDescription>{t('Customize the application with your organization\'s logo and branding elements.')}</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div><Label className="text-base font-semibold">{t('Company Logo')}</Label><div className="flex items-center gap-4 mt-2"><Avatar className="h-16 w-16 rounded-md border"><AvatarImage src="https://placehold.co/128x128/333333/FFFFFF.png?text=LOGO" alt="Current Company Logo" data-ai-hint="company logo"/><AvatarFallback>LOGO</AvatarFallback></Avatar><Button variant="outline" onClick={() => handlePlaceholderAction("Upload New Logo Clicked")} disabled>{t('Upload New Logo')}</Button></div></div>
              <Separator />
              <div><Label className="text-base font-semibold">{t('Login Screen Customization')}</Label><p className="text-xs text-muted-foreground mb-2">{t('Personalize the login page experience.')}</p><div className="space-y-3 mt-2"><div><Label htmlFor="login-welcome-msg">{t('Custom Welcome Message')}</Label><Input id="login-welcome-msg" placeholder={t('Welcome to Consult Vista')} disabled className="mt-1"/></div><Button variant="outline" onClick={() => handlePlaceholderAction("Upload Login Background Clicked")} disabled>{t('Upload Login Background Image')}</Button></div></div>
               <p className="text-xs text-muted-foreground">{t('System branding features are typically available for System Administrators only.')}</p>
            </CardContent>
            <CardFooter><Button onClick={() => handlePlaceholderAction("Save Branding Settings Clicked")} disabled>{t('Save Branding Settings')}</Button></CardFooter>
          </Card>
        </div>
      );
    }

    if (activeSection === 'language') {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Languages className="h-7 w-7 text-primary" />
              <CardTitle className="text-xl">{t('Language & Region')}</CardTitle>
            </div>
            <CardDescription>{t('Set your preferred language and regional formats for the application.')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="language-select" className="text-base font-semibold">{t('Application Language')}</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as SupportedLanguage)}>
                <SelectTrigger id="language-select" className="w-full sm:w-[280px] mt-1">
                  <SelectValue placeholder={t('Select Language')} />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((langCode) => (
                    <SelectItem key={langCode} value={langCode}>
                      {languagePacks[langCode].nativeName} ({languagePacks[langCode].name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div>
              <Label htmlFor="region-select" className="text-base font-semibold">{t('Region (for formatting)')}</Label>
                <p className="text-xs text-muted-foreground mb-1">{t('This affects date, number, and currency formatting (future).')}</p>
              <Select value={region} onValueChange={(value) => setRegion(value as SupportedRegion)}>
                <SelectTrigger id="region-select" className="w-full sm:w-[280px] mt-1">
                  <SelectValue placeholder={t('Select Region')} />
                </SelectTrigger>
                <SelectContent>
                  {supportedRegions.map((regCode) => (
                    <SelectItem key={regCode} value={regCode}>{regCode}</SelectItem> 
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div>
                <Label className="text-base font-semibold">{t('Example Date Format')}</Label>
                <div className="mt-1 p-3 border rounded-md bg-muted/50 w-full sm:w-[280px] text-sm">
                    <CalendarIcon className="inline h-4 w-4 mr-2 text-muted-foreground"/> {formatDate(new Date())}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t('Current format based on selected language: {dateFormat}', {dateFormat: languagePacks[language].dateFormat })}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveLanguageSettings}>{t('Save Language & Region')}</Button>
          </CardFooter>
        </Card>
      );
    }
    
    if (activeSection === 'billing') {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCard className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{t('Current Subscription')}</CardTitle>
              </div>
              <CardDescription>{t('Manage your subscription to Consult Vista.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{mockBillingData.currentPlan.name}</h3>
                <p className="text-muted-foreground">
                  {t('${price}/month', { price: mockBillingData.currentPlan.price })} - {t('Next billing date')}: {mockBillingData.currentPlan.nextBillingDate}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">{t('Plan Features')}:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {mockBillingData.currentPlan.features.map(feature => <li key={feature}>{t(feature as keyof typeof languagePacks.en.translations)}</li>)}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => handlePlaceholderAction("Upgrade Plan Clicked")}>{t('Upgrade Plan')}</Button>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" >{t('Cancel Subscription')}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('Are you sure you want to cancel?')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('Your subscription will remain active until {nextBillingDate}. After this date, you will lose access to Pro features.', { nextBillingDate: mockBillingData.currentPlan.nextBillingDate})}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('Keep Subscription')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handlePlaceholderAction("Subscription Cancellation Confirmed")}>{t('Proceed with Cancellation')}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FinancialIcon className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{t('Payment Method')}</CardTitle>
              </div>
              <CardDescription>{t('Update your primary payment method.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                {t('Current method')}: {mockBillingData.paymentMethod.type} {t('ending in')} {mockBillingData.paymentMethod.last4} - {t('Expires')} {mockBillingData.paymentMethod.expiry}
              </p>
              <Dialog open={showUpdatePaymentDialog} onOpenChange={setShowUpdatePaymentDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">{t('Update Payment Method')}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('Update Payment Method')}</DialogTitle>
                    <DialogDescription>{t('Enter your new card details. This is a simulated form.')}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div><Label htmlFor="cardNumber">{t('Card Number')}</Label><Input id="cardNumber" placeholder="**** **** **** ****" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label htmlFor="expiryDate">{t('Expiry Date (MM/YY)')}</Label><Input id="expiryDate" placeholder="MM/YY" /></div>
                      <div><Label htmlFor="cvc">{t('CVC')}</Label><Input id="cvc" placeholder="123" /></div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowUpdatePaymentDialog(false)}>{t('Cancel')}</Button>
                    <Button onClick={handleUpdatePaymentMethod}>{t('Save Payment Method')}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BillingHistoryIcon className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{t('Billing History')}</CardTitle>
              </div>
              <CardDescription>{t('View your past invoices for Consult Vista subscription.')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-72 overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>{t('Invoice ID')}</TableHead><TableHead>{t('Date')}</TableHead><TableHead className="text-right">{t('Amount')}</TableHead><TableHead className="text-center">{t('Status')}</TableHead><TableHead className="text-right">{t('Actions')}</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {mockBillingData.billingHistory.map(invoice => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono">{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell className="text-right">{mockBillingData.currentPlan.currency} {invoice.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={invoice.status === 'Paid' ? 'default' : 'destructive'} className={cn(invoice.status === 'Paid' ? 'bg-green-500/20 text-green-700' : '')}>
                            {t(invoice.status as keyof typeof languagePacks.en.translations)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handlePlaceholderAction("Download Invoice PDF Triggered")}>
                            <Download className="h-4 w-4" /> <span className="sr-only">{t('Download PDF')}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
                <div className="flex items-center gap-3"><Activity className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('Usage & Limits')}</CardTitle></div>
                <CardDescription>{t('Monitor your current usage against your plan allowances.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div>
                    <div className="flex justify-between mb-1"><span>{t('Users')}</span><span>{mockBillingData.usage.users.current} / {mockBillingData.usage.users.limit}</span></div>
                    <Progress value={(mockBillingData.usage.users.current / mockBillingData.usage.users.limit) * 100} className="h-2" />
                </div>
                <div>
                    <div className="flex justify-between mb-1"><span>{t('Projects')}</span><span>{mockBillingData.usage.projects.current} / {mockBillingData.usage.projects.limit === Infinity ? t('Unlimited') : mockBillingData.usage.projects.limit}</span></div>
                    <Progress value={mockBillingData.usage.projects.limit === Infinity ? 100 : (mockBillingData.usage.projects.current / mockBillingData.usage.projects.limit) * 100} className="h-2" indicatorClassName={mockBillingData.usage.projects.limit === Infinity ? 'bg-green-500' : undefined}/>
                </div>
                <div>
                    <div className="flex justify-between mb-1"><span>{t('Data Storage')}</span><span>{mockBillingData.usage.storage.current}{mockBillingData.usage.storage.unit} / {mockBillingData.usage.storage.limit}{mockBillingData.usage.storage.unit}</span></div>
                    <Progress value={(mockBillingData.usage.storage.current / mockBillingData.usage.storage.limit) * 100} className="h-2" />
                </div>
                 <Button variant="outline" size="sm" className="mt-2" onClick={() => handlePlaceholderAction("View Usage Details Clicked")}>{t('View Usage Details')}</Button>
            </CardContent>
           </Card>

           <Card>
            <CardHeader>
                <div className="flex items-center gap-3"><UserCircle className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('Billing Address & Tax Info')}</CardTitle></div>
                <CardDescription>{t('Manage the billing details for your organization.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p className="font-medium">{mockBillingData.billingAddress.company}</p>
                <p>{mockBillingData.billingAddress.line1}</p>
                <p>{mockBillingData.billingAddress.city}, {mockBillingData.billingAddress.state} {mockBillingData.billingAddress.zip}</p>
                <p>{mockBillingData.billingAddress.country}</p>
                <p className="mt-2"><strong>{t('Tax ID')}:</strong> {mockBillingData.billingAddress.taxId || t('Not Provided')}</p>
                <Dialog open={showEditBillingAddressDialog} onOpenChange={setShowEditBillingAddressDialog}>
                    <DialogTrigger asChild>
                         <Button variant="outline" className="mt-2">{t('Edit Billing Information')}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{t('Edit Billing Information')}</DialogTitle><DialogDescription>{t('Update your company\'s billing address and tax details.')}</DialogDescription></DialogHeader>
                        <div className="space-y-3 py-4">
                            <div><Label htmlFor="companyNameBill">{t('Company Name')}</Label><Input id="companyNameBill" defaultValue={mockBillingData.billingAddress.company} /></div>
                            <div><Label htmlFor="addressLine1Bill">{t('Address Line 1')}</Label><Input id="addressLine1Bill" defaultValue={mockBillingData.billingAddress.line1} /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><Label htmlFor="cityBill">{t('City')}</Label><Input id="cityBill" defaultValue={mockBillingData.billingAddress.city} /></div>
                                <div><Label htmlFor="stateBill">{t('State/Province')}</Label><Input id="stateBill" defaultValue={mockBillingData.billingAddress.state} /></div>
                            </div>
                             <div className="grid grid-cols-2 gap-3">
                                <div><Label htmlFor="zipBill">{t('ZIP/Postal Code')}</Label><Input id="zipBill" defaultValue={mockBillingData.billingAddress.zip} /></div>
                                <div><Label htmlFor="countryBill">{t('Country')}</Label><Input id="countryBill" defaultValue={mockBillingData.billingAddress.country} /></div>
                            </div>
                            <div><Label htmlFor="taxIdBill">{t('Tax ID (Optional)')}</Label><Input id="taxIdBill" defaultValue={mockBillingData.billingAddress.taxId} /></div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowEditBillingAddressDialog(false)}>{t('Cancel')}</Button>
                            <Button onClick={handleEditBillingAddress}>{t('Save Billing Information')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
           </Card>
        </div>
      );
    }


    if (!section) {
      return (
          <Card>
            <CardHeader>
                <CardTitle>{t('Welcome to Settings')}</CardTitle>
                <CardDescription>{t('Select a category from the left to configure its settings.')}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{t('This area allows for comprehensive management of user roles, workflow customization, third-party integrations, and personalization of your experience.')}</p>
            </CardContent>
          </Card>
      );
    }

    // Fallback for sections not yet detailed
    return (
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <section.icon className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">{t(section.labelKey)}</CardTitle>
          </div>
          <CardDescription className="pt-1 text-base">{t(section.description as keyof typeof languagePacks.en.translations)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[250px] flex flex-col items-center justify-center bg-muted/30 rounded-lg p-8 border border-dashed">
            <SettingsIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-center text-muted-foreground text-lg">
              {t('Settings for {sectionLabel} are currently under development.', { sectionLabel: t(section.labelKey) })}
            </p>
            <p className="text-sm text-muted-foreground mt-2">{t('Detailed configuration options will be available here soon.')}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <header className="pb-2 border-b">
        <h1 className="text-4xl font-bold tracking-tight">{t('Settings')}</h1>
        <p className="text-lg text-muted-foreground mt-1">
          {t('Configure application preferences, integrations, and user management.')}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
        <nav className="lg:col-span-3 xl:col-span-2 space-y-1 pr-4 border-r-0 lg:border-r lg:h-[calc(100vh-10rem)] lg:sticky lg:top-20">
          <ScrollArea className="h-full">
            {settingsMenuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start px-3 py-2.5 text-left h-auto text-base rounded-md flex items-center gap-3 mb-1",
                  activeSection === item.id 
                    ? "bg-primary/10 text-primary font-semibold border border-primary/30 shadow-sm" 
                    : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", activeSection === item.id ? "text-primary" : "")} />
                <span className="truncate">{t(item.labelKey)}</span>
              </Button>
            ))}
          </ScrollArea>
        </nav>

        <div className="lg:col-span-9 xl:col-span-10">
          {renderSectionContent()}
        </div>
      </div>

      <Card className="mt-8 border-t pt-6 bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-muted-foreground" />
            {t('Enhancements & System Overview')}
          </CardTitle>
          <CardDescription>
             {t('The settings area is designed for comprehensive management. Key future options across categories include:')}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground columns-1 md:columns-2">
              <li>{t('Granular User Preferences & Advanced Notification Controls')}</li>
              <li>{t('Detailed Role-Based Access Control (RBAC) Configuration')}</li>
              <li>{t('Visual Workflow Customization Tools & Versioning')}</li>
              <li>{t('Expanded Library of Third-Party Integrations with OAuth Support')}</li>
              <li>{t('Advanced System Auditing & Compliance Reporting Tools')}</li>
              <li>{t('Data Backup & Restoration Management')}</li>
              <li>{t('API Key Management for External Services')}</li>
              <li>{t('Theme Customization and White-Labeling Options')}</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}

    
