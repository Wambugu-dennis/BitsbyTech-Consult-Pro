
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
  DollarSign as FinancialIcon // Renamed to avoid conflict
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
  { id: 'accessControl', label: 'Access Control', icon: Shield, description: 'Define and manage role-based access control (RBAC) policies. (Admins)' },
  { id: 'integrations', label: 'Integrations', icon: Link2, description: 'Connect and manage third-party application integrations.' },
  { id: 'workflow', label: 'Workflow Customization', icon: Workflow, description: 'Customize business workflows and approval processes.' },
  { id: 'system', label: 'System & Compliance', icon: Server, description: 'Configure system-wide settings, view audit logs, and manage compliance.' },
];

const mockUserData = {
  name: 'Alex Mercer (Super Admin)',
  email: 'alex.mercer@consult.com',
  role: 'Lead Strategist & System Administrator',
  avatarUrl: 'https://placehold.co/128x128/64B5F6/FFFFFF.png?text=AM',
  phone: '(555) 123-4567'
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
    push: boolean; // For UI only, marked as coming soon
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


export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('account');
  const { toast } = useToast();

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    masterEnable: true,
    channels: {
      email: true,
      inApp: true,
      push: false,
    },
    preferences: {
      projectUpdates: { email: true, inApp: true },
      clientCommunications: { email: true, inApp: false },
      taskManagement: { email: false, inApp: true },
      financialAlerts: { email: true, inApp: true },
      systemAnnouncements: { email: true, inApp: true },
    },
    digestFrequency: 'daily',
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


  const handlePlaceholderAction = (actionMessage: string) => {
    toast({
      title: "Feature Under Development",
      description: `${actionMessage} functionality is not yet implemented.`,
      duration: 3000,
    });
  };

  const handleAccountDeletion = () => {
    toast({
      title: "Account Deletion Process",
      description: "Account deletion initiated (simulated). In a real system, this would be a permanent action.",
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
  }

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
                   <Button variant="outline" size="sm" className="mt-2" onClick={() => handlePlaceholderAction("Change Profile Picture")}>
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
                 <Button onClick={() => handlePlaceholderAction("Edit Profile Details")}>
                    <Edit3 className="mr-2 h-4 w-4"/> Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Security Settings</CardTitle>
              </div>
              <CardDescription>Manage your password and account security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => handlePlaceholderAction("Change Password")}>
                <KeyRound className="mr-2 h-4 w-4" /> Change Password
              </Button>
              <div>
                <h4 className="font-medium">Two-Factor Authentication (2FA)</h4>
                <p className="text-sm text-muted-foreground">Enhance your account security by enabling 2FA.</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => handlePlaceholderAction("Setup Two-Factor Authentication")} disabled>
                  Setup 2FA (Coming Soon)
                </Button>
              </div>
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
                    eventKey === 'taskManagement' ? UsersIcon : // Or ListChecks
                    eventKey === 'financialAlerts' ? FinancialIcon :
                    Server; // Default for SystemAnnouncements

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
                            size="sm"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`${eventKey}-inApp`} className="text-xs">In-App</Label>
                          <Switch
                            id={`${eventKey}-inApp`}
                            checked={notificationSettings.preferences[eventKey].inApp}
                            onCheckedChange={(checked) => handlePreferenceChange(eventKey, 'inApp', checked)}
                            disabled={!notificationSettings.masterEnable || !notificationSettings.channels.inApp}
                            size="sm"
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
              <li>Granular User Preferences &amp; Advanced Notification Controls</li>
              <li>Detailed Role-Based Access Control (RBAC) Configuration</li>
              <li>Visual Workflow Customization Tools &amp; Versioning</li>
              <li>Expanded Library of Third-Party Integrations with OAuth Support</li>
              <li>Advanced System Auditing &amp; Compliance Reporting Tools</li>
              <li>Data Backup &amp; Restoration Management</li>
              <li>API Key Management for External Services</li>
              <li>Theme Customization and White-Labeling Options</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}


    