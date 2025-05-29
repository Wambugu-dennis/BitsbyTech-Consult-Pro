
'use client';

import { useState, useEffect } from 'react';
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
import { Badge } from "@/components/ui/badge"; // Added Badge import
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
  UserX
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


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
  label: string;
  icon: React.ElementType;
  description: string;
}

const settingsMenuItems: SettingsMenuItem[] = [
  { id: 'account', label: 'Account', icon: UserCircle, description: 'Manage your personal account details and profile information.' },
  { id: 'notifications', label: 'Notifications', icon: BellRing, description: 'Configure how and when you receive notifications from the system.' },
  { id: 'security', label: 'Security', icon: Lock, description: 'Manage your password, two-factor authentication, and view active sessions.' },
  { id: 'appearance', label: 'Appearance', icon: Paintbrush, description: 'Customize the look and feel of the application, including theme.' },
  { id: 'language', label: 'Language & Region', icon: Languages, description: 'Set your preferred language and region for the application interface.' },
  { id: 'billing', label: 'Billing', icon: CreditCard, description: 'View your subscription details, payment history, and manage billing information.' },
  { id: 'userManagement', label: 'User Management', icon: UsersIcon, description: 'Administer user accounts, roles, and permissions. (Admins)' },
  { id: 'accessControl', label: 'Access Control', icon: ShieldCheck, description: 'Define and manage role-based access control (RBAC) policies. (Admins)' },
  { id: 'integrations', label: 'Integrations', icon: Link2, description: 'Connect and manage third-party application integrations.' },
  { id: 'workflow', label: 'Workflow Customization', icon: Workflow, description: 'Customize business workflows and approval processes.' },
  { id: 'system', label: 'System & Compliance', icon: Server, description: 'Configure system-wide settings, view audit logs, and manage compliance.' },
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
    { id: 'log4', timestamp: '2024-07-23 11:00:00 UTC', event: 'API Key "ProjectRead" created', user: 'Alex Mercer', ipAddress: '192.168.1.101', details: 'Permissions: read-only project data' },
    { id: 'log5', timestamp: '2024-07-22 18:00:00 UTC', event: 'User Role "Project Manager" updated', user: 'Alex Mercer', ipAddress: '192.168.1.101', details: 'Added permission "approve_expenses_low_value"' },
];

const mockLoginHistory = [
    { id: 'lh1', timestamp: '2024-07-26 10:00:00 UTC', status: 'Success', ipAddress: '192.168.1.101', device: 'Chrome on Windows', location: 'New York, USA' },
    { id: 'lh2', timestamp: '2024-07-26 09:55:00 UTC', status: 'Failed', ipAddress: '203.0.113.45', device: 'Unknown Browser', location: 'Unknown (Suspicious)' },
    { id: 'lh3', timestamp: '2024-07-25 14:30:00 UTC', status: 'Success', ipAddress: '10.0.0.5', device: 'Safari on macOS', location: 'London, UK (Trusted)' },
    { id: 'lh4', timestamp: '2024-07-25 08:15:00 UTC', status: 'Success (2FA)', ipAddress: '172.16.0.20', device: 'Mobile App (iOS)', location: 'San Francisco, USA' },
];


export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('account');
  const { toast } = useToast();

  // State for Notifications section
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

  // State for Security section
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentActiveSessions, setCurrentActiveSessions] = useState(mockActiveSessions); // Renamed to avoid conflict
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


  const handlePlaceholderAction = (actionMessage: string, description?: string) => {
    toast({
      title: actionMessage,
      description: description || "This functionality is for demonstration and not fully implemented.",
      duration: 3000,
    });
  };

  const handleAccountDeletion = () => {
    toast({
      title: "Account Deletion Process",
      description: "Account deletion initiated (simulated). In a real system, this would be a permanent action with further confirmations.",
      variant: "destructive",
      duration: 5000,
    });
  }

  const handleSaveNotificationSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated (simulated).",
      duration: 3000,
    });
  };

  const handleChangePassword = () => {
    setShowPasswordDialog(false);
    toast({
      title: "Password Changed Successfully",
      description: "Your password has been updated (simulated).",
      duration: 3000,
    });
  };

  const handleToggle2FA = () => {
    if (is2FAEnabled) {
        setIs2FAEnabled(false);
        toast({ title: "Two-Factor Authentication Disabled (Simulated)" });
    } else {
        setIs2FAEnabled(true);
        handlePlaceholderAction("2FA Setup Process", "The 2FA setup process (e.g., QR code, app pairing) would begin here.");
    }
  };
  
  const handleSignOutSession = (sessionId: string) => {
    setCurrentActiveSessions(prev => prev.filter(session => session.id !== sessionId)); // Use renamed state variable
    toast({ title: "Session Signed Out", description: `Session ${sessionId} has been remotely signed out (simulated).`});
  };

  const handleSignOutAllOtherSessions = () => {
    if (currentActiveSessions.length > 1) { // Use renamed state variable
        setCurrentActiveSessions([currentActiveSessions[0]]); 
    }
    toast({ title: "All Other Sessions Signed Out", description: "All other active sessions have been remotely signed out (simulated)."});
  };

  const handleSaveActivityAlerts = () => {
    toast({ title: "Activity Alert Preferences Saved", description: "Your preferences for account activity alerts have been updated (simulated)." });
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
                <CardTitle className="text-xl">Profile Information</CardTitle>
              </div>
              <CardDescription>Manage your personal details and profile picture.</CardDescription>
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
                    Change Picture
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profileName">Full Name</Label>
                  <Input id="profileName" defaultValue={mockUserData.name} disabled className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="profileEmail">Email Address</Label>
                  <Input id="profileEmail" type="email" defaultValue={mockUserData.email} disabled className="mt-1" />
                </div>
                 <div>
                  <Label htmlFor="profilePhone">Phone Number</Label>
                  <Input id="profilePhone" type="tel" defaultValue={mockUserData.phone} disabled className="mt-1" />
                </div>
                 <Button onClick={() => handlePlaceholderAction("Edit Profile Details Triggered")}>
                    <Edit3 className="mr-2 h-4 w-4"/> Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Security Settings (Basic)</CardTitle>
              </div>
              <CardDescription>Manage your password and basic security options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               <Button variant="outline" onClick={() => { setActiveSection('security'); handlePlaceholderAction("Redirecting to Full Security Settings...");}}>
                    Go to Full Security Settings
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                    Advanced options like Two-Factor Authentication, Active Sessions, and Audit Logs are available in the main "Security" section.
                </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Paintbrush className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Preferences</CardTitle>
              </div>
              <CardDescription>Personalize your application experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-medium">Appearance & Language</h4>
                    <p className="text-sm text-muted-foreground">Theme (Dark/Light mode) and language settings can be found in their dedicated sections in the main settings menu.</p>
                     <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => setActiveSection('appearance')}>
                            <Palette className="mr-2 h-4 w-4"/> Go to Appearance
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setActiveSection('language')}>
                            <Languages className="mr-2 h-4 w-4"/> Go to Language & Region
                        </Button>
                     </div>
                </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/50">
            <CardHeader>
               <div className="flex items-center gap-3">
                <Trash2 className="h-7 w-7 text-destructive" />
                <CardTitle className="text-xl text-destructive">Account Management</CardTitle>
              </div>
              <CardDescription className="text-destructive/90">Manage critical account actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAccountDeletion}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <p className="text-xs text-muted-foreground mt-2">
                Deleting your account is permanent. Please be certain before proceeding.
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
                <CardTitle className="text-xl">Notification Settings</CardTitle>
              </div>
              <CardDescription>Manage how and when you receive alerts from Consult Vista.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div>
                  <Label htmlFor="masterEnable" className="text-base font-semibold">Enable All Notifications</Label>
                  <p className="text-xs text-muted-foreground">Master control for all application alerts.</p>
                </div>
                <Switch
                  id="masterEnable"
                  checked={notificationSettings.masterEnable}
                  onCheckedChange={(checked) => handleNotificationChange('masterEnable', checked)}
                />
              </div>
              <Separator />
              <div>
                <h4 className="text-md font-semibold mb-3">Notification Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailChannel">Email Notifications</Label>
                    <Switch
                      id="emailChannel"
                      checked={notificationSettings.channels.email}
                      onCheckedChange={(checked) => handleChannelChange('email', checked)}
                      disabled={!notificationSettings.masterEnable}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inAppChannel">In-App Notifications</Label>
                    <Switch
                      id="inAppChannel"
                      checked={notificationSettings.channels.inApp}
                      onCheckedChange={(checked) => handleChannelChange('inApp', checked)}
                      disabled={!notificationSettings.masterEnable}
                    />
                  </div>
                  <div className="flex items-center justify-between opacity-50">
                    <Label htmlFor="pushChannel">Push Notifications (Mobile)</Label>
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-muted-foreground italic mr-2">Coming Soon</span>
                       <Switch id="pushChannel" checked={notificationSettings.channels.push} disabled />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-md font-semibold mb-3">Detailed Notification Preferences</h4>
                <p className="text-sm text-muted-foreground mb-4">Choose which types of events trigger notifications for each channel. (Only active if master notifications are enabled.)</p>
                {(Object.keys(notificationSettings.preferences) as Array<keyof NotificationSettings['preferences']>).map((eventKey) => {
                  const eventLabel = eventKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
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
                          <Label htmlFor={`${eventKey}-email`} className="text-xs">Email</Label>
                          <Switch
                            id={`${eventKey}-email`}
                            checked={notificationSettings.preferences[eventKey].email}
                            onCheckedChange={(checked) => handlePreferenceChange(eventKey, 'email', checked)}
                            disabled={!notificationSettings.masterEnable || !notificationSettings.channels.email}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`${eventKey}-inApp`} className="text-xs">In-App</Label>
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
                  <h4 className="text-md font-semibold mb-2">Notification Delivery</h4>
                   <Label htmlFor="digestFrequency" className="text-sm text-muted-foreground">Notification Digest Frequency (Planned)</Label>
                    <Select
                        value={notificationSettings.digestFrequency}
                        onValueChange={(value: NotificationSettings['digestFrequency']) => handleNotificationChange('digestFrequency', value) }
                        disabled // For future implementation
                    >
                        <SelectTrigger id="digestFrequency" className="mt-1 w-full sm:w-[250px]">
                            <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="instant">Instant</SelectItem>
                            <SelectItem value="daily">Daily Digest</SelectItem>
                            <SelectItem value="weekly">Weekly Digest</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1 italic">Consolidate non-critical notifications into a summary. (Feature coming soon)</p>
               </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotificationSettings} disabled={!notificationSettings.masterEnable}>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    if (activeSection === 'security') {
      return (
        <div className="space-y-6">
          {/* Password Management Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <KeyRound className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Password Management</CardTitle>
              </div>
              <CardDescription>Manage your account password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">Change Password</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Your Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one. Ensure your new password meets the policy requirements.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-1">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                      <Input id="confirmNewPassword" type="password" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
                    <Button onClick={handleChangePassword}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <p className="text-xs text-muted-foreground">Last password change: {new Date(mockUserData.lastPasswordChange).toLocaleDateString()}</p>
            </CardContent>
          </Card>

          {/* Password Policy Configuration Card (Admin) */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileLock2 className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Password Policy Configuration (Admin)</CardTitle>
              </div>
              <CardDescription>Define and enforce password requirements across the organization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Minimum Length:</Label>
                  <Input type="number" defaultValue="12" disabled className="mt-1" />
                </div>
                <div>
                  <Label>Password Expiry (days):</Label>
                  <Input type="number" defaultValue="90" disabled className="mt-1" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Required Character Types:</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="reqUppercase" defaultChecked disabled /><Label htmlFor="reqUppercase" className="font-normal">Uppercase</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                    <Switch id="reqLowercase" defaultChecked disabled /><Label htmlFor="reqLowercase" className="font-normal">Lowercase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="reqNumber" defaultChecked disabled /><Label htmlFor="reqNumber" className="font-normal">Number</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="reqSpecial" defaultChecked disabled /><Label htmlFor="reqSpecial" className="font-normal">Special Character</Label>
                  </div>
                </div>
                 <div>
                  <Label>Account Lockout Threshold (attempts):</Label>
                  <Input type="number" defaultValue="5" disabled className="mt-1" />
                </div>
                <div>
                  <Label>Lockout Duration (minutes):</Label>
                  <Input type="number" defaultValue="30" disabled className="mt-1" />
                </div>
              </div>
              <Button onClick={() => handlePlaceholderAction("Save Password Policy", "Password policy settings would be saved.")} className="mt-3">Save Password Policy</Button>
               <p className="text-xs text-muted-foreground mt-2">These settings apply system-wide and affect all users.</p>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Fingerprint className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Two-Factor Authentication (2FA)</CardTitle>
              </div>
              <CardDescription>Enhance your account security with an additional verification step.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p>Status: <span className={cn("font-semibold", is2FAEnabled ? "text-green-600" : "text-red-600")}>{is2FAEnabled ? "Enabled" : "Disabled"}</span></p>
                <Button variant={is2FAEnabled ? "destructive" : "default"} onClick={handleToggle2FA}>
                  {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                </Button>
              </div>
              {is2FAEnabled && (
                <Button variant="outline" size="sm" onClick={() => handlePlaceholderAction("Manage 2FA Settings", "Options like viewing recovery codes or changing 2FA method would be here.")}>
                  Manage 2FA Settings
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                {is2FAEnabled 
                  ? "2FA adds an extra layer of security to your account during login." 
                  : "It is highly recommended to enable 2FA for enhanced security."}
              </p>
            </CardContent>
          </Card>

          {/* Active Sessions Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Network className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Active Sessions</CardTitle>
              </div>
              <CardDescription>View and manage devices currently logged into your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-60 overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device/Browser</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentActiveSessions.map(session => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.device}</TableCell>
                        <TableCell>{session.location} ({session.ipAddress})</TableCell>
                        <TableCell>{session.lastActive}</TableCell>
                        <TableCell className="text-right">
                           <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <LogOut className="mr-1 h-3 w-3" /> Sign Out
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Sign out this session?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will sign out the session on {session.device} from {session.location}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleSignOutSession(session.id)}>Sign Out</AlertDialogAction>
                              </AlertDialogFooter>
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
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">Sign Out All Other Sessions</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Sign out all other sessions?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will sign you out of Consult Vista on all devices except this one. You will need to sign in again on other devices.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSignOutAllOtherSessions}>Sign Out Others</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              )}
              <p className="text-xs text-muted-foreground">If you see any unrecognized sessions, sign them out immediately and consider changing your password.</p>
            </CardContent>
          </Card>
          
          {/* Login History Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <UserCheck className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Recent Login History</CardTitle>
              </div>
              <CardDescription>Review recent login attempts to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-60 overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Device/Browser</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLoginHistory.slice(0, 5).map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">{log.timestamp}</TableCell>
                        <TableCell>
                          <Badge variant={log.status === 'Success' || log.status.includes('2FA') ? 'default' : 'destructive'}
                                 className={cn(log.status === 'Success' || log.status.includes('2FA') ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700')}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{log.ipAddress}</TableCell>
                        <TableCell className="text-xs">{log.device}</TableCell>
                        <TableCell className="text-xs">{log.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" onClick={() => handlePlaceholderAction("View Full Login History")} disabled>
                View Full Login History (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* Account Activity Alerts Card */}
          <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Bell className="h-7 w-7 text-primary" />
                    <CardTitle className="text-xl">Account Activity Alerts</CardTitle>
                </div>
                <CardDescription>Configure alerts for specific security-sensitive account activities. These are in addition to general notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor="alertNewDevice" className="flex-1">Notify on login from new device/location</Label>
                    <Switch
                        id="alertNewDevice"
                        checked={activityAlerts.newDeviceLogin}
                        onCheckedChange={(checked) => setActivityAlerts(prev => ({ ...prev, newDeviceLogin: checked }))}
                    />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor="alertFailedLogins" className="flex-1">Notify on multiple failed login attempts</Label>
                    <Switch
                        id="alertFailedLogins"
                        checked={activityAlerts.failedLogins}
                        onCheckedChange={(checked) => setActivityAlerts(prev => ({ ...prev, failedLogins: checked }))}
                    />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor="alertPasswordChanged" className="flex-1">Notify when password is changed</Label>
                    <Switch
                        id="alertPasswordChanged"
                        checked={activityAlerts.passwordChanged}
                        onCheckedChange={(checked) => setActivityAlerts(prev => ({ ...prev, passwordChanged: checked }))}
                    />
                </div>
                 <div className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor="alert2FAChanged" className="flex-1">Notify when 2FA settings are changed</Label>
                    <Switch
                        id="alert2FAChanged"
                        checked={activityAlerts.twoFactorChanged}
                        onCheckedChange={(checked) => setActivityAlerts(prev => ({ ...prev, twoFactorChanged: checked }))}
                    />
                </div>
                <Button onClick={handleSaveActivityAlerts} className="mt-2">Save Alert Preferences</Button>
            </CardContent>
          </Card>
          
          {/* Security & Audit Logs Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <History className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">System Security & Audit Logs (Preview)</CardTitle>
              </div>
              <CardDescription>Review important security events and account activity across the system (Admin view).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="max-h-60 overflow-y-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockAuditLogPreview.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-xs">{log.timestamp}</TableCell>
                                    <TableCell className="text-xs font-medium">{log.event}</TableCell>
                                    <TableCell className="text-xs">{log.user}</TableCell>
                                    <TableCell className="text-xs">{log.ipAddress}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{log.details}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Button variant="outline" onClick={() => handlePlaceholderAction("View Full Audit Log", "A dedicated page with comprehensive, filterable audit logs would be shown here.")} disabled>
                    View Full Audit Log (Coming Soon)
                </Button>
            </CardContent>
          </Card>

          {/* API Key Management Card */}
          <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <ShieldCheck className="h-7 w-7 text-primary" />
                    <CardTitle className="text-xl">API Key Management (Admin)</CardTitle>
                </div>
                <CardDescription>Manage API keys for integrations and external services.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" onClick={() => handlePlaceholderAction("Manage API Keys", "Redirecting to API Key Management section (Admin only).")}>
                    Manage API Keys
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                    Create, revoke, and set permissions for API keys used by third-party applications or custom scripts.
                </p>
            </CardContent>
          </Card>
          
          {/* Data Encryption & Advanced Posture Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl text-primary">Data Encryption & Security Posture</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>Consult Vista is committed to the highest standards of data security.</p>
              <p>All sensitive data is encrypted in transit (using TLS/SSL) and at rest (using AES-256 or equivalent).</p>
              <p>We conduct regular security audits and vulnerability assessments to ensure the integrity of our platform.</p>
              <p>Your data privacy and security are our top priorities.</p>
            </CardContent>
          </Card>
        </div>
      );
    }


    if (!section) {
      return (
          <Card>
            <CardHeader>
                <CardTitle>Welcome to Settings</CardTitle>
                <CardDescription>Select a category from the left to configure its settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>This area allows for comprehensive management of user roles, workflow customization, third-party integrations, and personalization of your experience.</p>
            </CardContent>
          </Card>
      );
    }

    // Default placeholder for other sections
    return (
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <section.icon className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">{section.label}</CardTitle>
          </div>
          <CardDescription className="pt-1 text-base">{section.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[250px] flex flex-col items-center justify-center bg-muted/30 rounded-lg p-8 border border-dashed">
            <SettingsIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-center text-muted-foreground text-lg">
              Settings for <span className="font-semibold text-foreground">{section.label}</span> are currently under development.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Detailed configuration options will be available here soon.</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <header className="pb-2 border-b">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-lg text-muted-foreground mt-1">
          Configure application preferences, integrations, and user management.
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
                <span className="truncate">{item.label}</span>
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
            Enhancements &amp; System Overview
          </CardTitle>
          <CardDescription>
             The settings area is designed for comprehensive management. Key future options across categories include:
          </CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground columns-1 md:columns-2">
              <li>Granular User Preferences & Advanced Notification Controls</li>
              <li>Detailed Role-Based Access Control (RBAC) Configuration</li>
              <li>Visual Workflow Customization Tools & Versioning</li>
              <li>Expanded Library of Third-Party Integrations with OAuth Support</li>
              <li>Advanced System Auditing & Compliance Reporting Tools</li>
              <li>Data Backup & Restoration Management</li>
              <li>API Key Management for External Services</li>
              <li>Theme Customization and White-Labeling Options</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}

