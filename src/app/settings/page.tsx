
// src/app/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useLocalization } from '@/context/localization-provider';
import { useTheme } from '@/context/theme-provider'; // For theme related settings
import {
  Settings as SettingsIcon,
  UserCircle,
  BellRing,
  Lock,
  Paintbrush,
  Languages,
  CreditCard,
  Users as UsersIcon,
  ShieldCheck,
  Link2,
  Workflow,
  Server,
  AlertTriangle,
  Palette,
  CalendarIcon,
  Download,
  Activity,
  FileText as BillingHistoryIcon,
  KeyRound,
  FileLock2,
  Fingerprint,
  Network,
  LogOut,
  History,
  UserCheck as UserCheckLucide,
  UserX,
  ClipboardList,
  PlusCircle,
  Edit3,
  Trash2,
  MoreHorizontal,
  Sun,
  Moon,
  Laptop,
  LayoutDashboard,
  ImageIcon,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SystemUser, SystemUserStatus, SystemRole } from '@/lib/types';
import { initialSystemUsers, initialConsultants } from '@/lib/mockData';
import { format, parseISO, formatISO } from 'date-fns';
import type { LanguagePack } from '@/lib/i18n-config'; // for t function typings

// Dynamic imports for submodule components
const AccountSettingsSection = dynamic(() => import('@/components/settings/account-settings'), { loading: () => <SettingsSectionSkeleton /> });
const NotificationSettingsSection = dynamic(() => import('@/components/settings/notification-settings'), { loading: () => <SettingsSectionSkeleton /> });
const SecuritySettingsSection = dynamic(() => import('@/components/settings/security-settings'), { loading: () => <SettingsSectionSkeleton /> });
const AppearanceSettingsSection = dynamic(() => import('@/components/settings/appearance-settings'), { loading: () => <SettingsSectionSkeleton /> });
const LanguageSettingsSection = dynamic(() => import('@/components/settings/language-settings'), { loading: () => <SettingsSectionSkeleton /> });
const BillingSettingsSection = dynamic(() => import('@/components/settings/billing-settings'), { loading: () => <SettingsSectionSkeleton /> });
const UserManagementSettingsSection = dynamic(() => import('@/components/settings/user-management-settings'), { loading: () => <SettingsSectionSkeleton /> });
const AccessControlSettingsSection = dynamic(() => import('@/components/settings/access-control-settings'), { loading: () => <SettingsSectionSkeleton /> });
const IntegrationsSettingsSection = dynamic(() => import('@/components/settings/integrations-settings'), { loading: () => <SettingsSectionSkeleton /> });
const WorkflowSettingsSection = dynamic(() => import('@/components/settings/workflow-settings'), { loading: () => <SettingsSectionSkeleton /> });
const SystemComplianceSettingsSection = dynamic(() => import('@/components/settings/system-compliance-settings'), { loading: () => <SettingsSectionSkeleton /> });


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
  labelKey: keyof LanguagePack['translations'];
  icon: React.ElementType;
  descriptionKey: keyof LanguagePack['translations'];
}

const settingsMenuItems: SettingsMenuItem[] = [
  { id: 'account', labelKey: 'Account', icon: UserCircle, descriptionKey: 'Manage your personal account details and profile information.' },
  { id: 'notifications', labelKey: 'Notifications', icon: BellRing, descriptionKey: 'Configure how and when you receive notifications from the system.' },
  { id: 'security', labelKey: 'Security', icon: Lock, descriptionKey: 'Manage your password, two-factor authentication, and view active sessions.' },
  { id: 'appearance', labelKey: 'Appearance', icon: Paintbrush, descriptionKey: 'Customize the look and feel of the application, including theme.' },
  { id: 'language', labelKey: 'Language & Region', icon: Languages, descriptionKey: 'Set your preferred language and region for the application interface.' },
  { id: 'billing', labelKey: 'Billing', icon: CreditCard, descriptionKey: 'View your subscription details, payment history, and manage billing information.' },
  { id: 'userManagement', labelKey: 'User Management', icon: UsersIcon, descriptionKey: 'Administer user accounts, roles, and permissions. (Admins)' },
  { id: 'accessControl', labelKey: 'Access Control', icon: ShieldCheck, descriptionKey: 'Define and manage role-based access control (RBAC) policies. (Admins)' },
  { id: 'integrations', labelKey: 'Integrations', icon: Link2, descriptionKey: 'Connect and manage third-party application integrations.' },
  { id: 'workflow', labelKey: 'Workflow Customization', icon: Workflow, descriptionKey: 'Customize business workflows and approval processes.' },
  { id: 'system', labelKey: 'System & Compliance', icon: Server, descriptionKey: 'Configure system-wide settings, view audit logs, and manage compliance.' },
];

const SettingsSectionSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="h-8 w-3/4 bg-muted rounded animate-pulse"></div>
      <div className="h-4 w-1/2 bg-muted rounded animate-pulse mt-2"></div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
      <div className="h-20 w-full bg-muted rounded animate-pulse"></div>
      <div className="h-10 w-1/3 bg-muted rounded animate-pulse"></div>
    </CardContent>
  </Card>
);

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('account');
  const { t, formatDate } = useLocalization();
  const { toast } = useToast();
  
  // State for User Management - kept in parent as it might be shared with Access Control
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(initialSystemUsers);


  const renderSectionContent = () => {
    switch (activeSection) {
      case 'account':
        return <AccountSettingsSection t={t} setActiveSection={setActiveSection} />;
      case 'notifications':
        return <NotificationSettingsSection t={t} />;
      case 'security':
        return <SecuritySettingsSection t={t} formatDate={formatDate} />;
      case 'appearance':
        return <AppearanceSettingsSection t={t} />;
      case 'language':
        return <LanguageSettingsSection t={t} />; // t is also available via useLocalization inside
      case 'billing':
        return <BillingSettingsSection t={t} formatDate={formatDate} />;
      case 'userManagement':
        return <UserManagementSettingsSection 
                  t={t} 
                  formatDate={formatDate} 
                  systemUsers={systemUsers} 
                  setSystemUsers={setSystemUsers} 
                  initialConsultants={initialConsultants} 
                  setActiveSection={setActiveSection} 
                />;
      case 'accessControl':
        return <AccessControlSettingsSection t={t} />;
      case 'integrations':
        return <IntegrationsSettingsSection t={t} />;
      case 'workflow':
        return <WorkflowSettingsSection t={t} />;
      case 'system':
        return <SystemComplianceSettingsSection t={t} />;
      default:
        const fallbackSection = settingsMenuItems.find(item => item.id === activeSection);
        return (
            <Card className="shadow-md">
                <CardHeader>
                {fallbackSection && (
                    <div className="flex items-center gap-3">
                        <fallbackSection.icon className="h-7 w-7 text-primary" />
                        <CardTitle className="text-2xl">{t(fallbackSection.labelKey)}</CardTitle>
                    </div>
                )}
                <CardDescription className="pt-1 text-base">{fallbackSection ? t(fallbackSection.descriptionKey) : t('Settings details will appear here.')}</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="min-h-[250px] flex flex-col items-center justify-center bg-muted/30 rounded-lg p-8 border border-dashed">
                    <SettingsIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <p className="text-center text-muted-foreground text-lg">
                    {t('Settings for {sectionLabel} are currently under development.', { sectionLabel: fallbackSection ? t(fallbackSection.labelKey) : 'this section' })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">{t('Detailed configuration options will be available here soon.')}</p>
                </div>
                </CardContent>
            </Card>
        );
    }
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
        <nav className="lg:col-span-3 xl:col-span-2 space-y-1 pr-4 border-r-0 lg:border-r lg:h-[calc(100vh-12rem)] lg:sticky lg:top-[5.5rem]">
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

    