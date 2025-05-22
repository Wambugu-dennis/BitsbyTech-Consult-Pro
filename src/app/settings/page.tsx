
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings as SettingsIcon, 
  UserCircle, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  CreditCard, 
  Users as UsersIcon, // Renamed to avoid conflict with potential 'Users' type
  Shield,
  Link2, // For Integrations
  Workflow, // For Workflow Customization
  Server // For System & Compliance
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  { id: 'account', label: 'Account', icon: UserCircle, description: 'Manage your personal account details, profile information, and login credentials.' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Configure how and when you receive notifications from the system.' },
  { id: 'security', label: 'Security', icon: Lock, description: 'Manage your password, two-factor authentication, and view active sessions.' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Customize the look and feel of the application, including theme and layout preferences.' },
  { id: 'language', label: 'Language', icon: Globe, description: 'Set your preferred language and region for the application interface.' },
  { id: 'billing', label: 'Billing', icon: CreditCard, description: 'View your subscription details, payment history, and manage billing information.' },
  { id: 'userManagement', label: 'User Management', icon: UsersIcon, description: 'Administer user accounts, roles, and permissions. (Typically for Admins)' },
  { id: 'accessControl', label: 'Access Control', icon: Shield, description: 'Define and manage role-based access control (RBAC) policies. (Typically for Admins)' },
  { id: 'integrations', label: 'Integrations', icon: Link2, description: 'Connect and manage third-party application integrations with Consult Vista.' },
  { id: 'workflow', label: 'Workflow Customization', icon: Workflow, description: 'Customize and manage business workflows and approval processes within the platform.' },
  { id: 'system', label: 'System & Compliance', icon: Server, description: 'Configure system-wide settings, view audit logs, and manage compliance requirements.' },
];


export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('account');

  const renderSectionContent = () => {
    const section = settingsMenuItems.find(item => item.id === activeSection);
    if (!section) {
      // Fallback if somehow no section is active, though 'account' is default
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
        <nav className="lg:col-span-3 xl:col-span-2 space-y-1 pr-4 border-r-0 lg:border-r">
          {settingsMenuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start px-3 py-2.5 text-left h-auto text-base rounded-md",
                activeSection === item.id 
                  ? "bg-primary/10 text-primary font-semibold border border-primary/30 shadow-sm" 
                  : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon className={cn("mr-3 h-5 w-5", activeSection === item.id ? "text-primary" : "")} />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="lg:col-span-9 xl:col-span-10">
          {renderSectionContent()}
        </div>
      </div>

       <Card className="mt-6 border-t pt-6 bg-card/50">
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

    
