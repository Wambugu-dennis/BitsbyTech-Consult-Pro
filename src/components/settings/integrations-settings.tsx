
// src/components/settings/integrations-settings.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link2, Zap, PlusCircle, Settings as SettingsIcon, HelpCircle, Building, Briefcase, MessageSquare, DollarSign, BarChart2, Database, GitBranch, FileArchive, BrainCircuit } from "lucide-react";
import type { LanguagePack } from '@/lib/i18n-config';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  logoUrl?: string;
  logoFallback: string;
  status: 'Connected' | 'Not Connected' | 'Coming Soon';
}

const mockIntegrations: Integration[] = [
  {
    id: 'salesforce',
    name: 'Salesforce CRM',
    category: 'CRM',
    description: 'Sync client and contact data, manage leads, and track opportunities directly within Consult Vista.',
    logoFallback: 'SF',
    logoUrl: 'https://placehold.co/64x64/00A1E0/FFFFFF.png?text=SFDC',
    status: 'Not Connected',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks Online',
    category: 'Accounting',
    description: 'Automate invoicing, sync expense data, and streamline financial reporting between systems.',
    logoFallback: 'QB',
    logoUrl: 'https://placehold.co/64x64/2CA01C/FFFFFF.png?text=QB',
    status: 'Not Connected',
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Receive project updates, client notifications, and collaborate more effectively via Slack channels.',
    logoFallback: 'SL',
    logoUrl: 'https://placehold.co/64x64/4A154B/FFFFFF.png?text=SL',
    status: 'Connected',
  },
  {
    id: 'google_workspace',
    name: 'Google Workspace',
    category: 'Productivity',
    description: 'Integrate with Google Calendar, Drive, and Meet for seamless scheduling and document management.',
    logoFallback: 'G',
    logoUrl: 'https://placehold.co/64x64/EA4335/FFFFFF.png?text=G',
    status: 'Not Connected',
  },
  {
    id: 'microsoft_teams',
    name: 'Microsoft Teams',
    category: 'Communication',
    description: 'Enable real-time collaboration, file sharing, and meeting integration directly within Teams.',
    logoFallback: 'MT',
    logoUrl: 'https://placehold.co/64x64/6264A7/FFFFFF.png?text=MT',
    status: 'Coming Soon',
  },
  {
    id: 'jira',
    name: 'Jira Software',
    category: 'Project Management',
    description: 'Sync project tasks, issues, and development progress for enhanced project tracking.',
    logoFallback: 'JR',
    logoUrl: 'https://placehold.co/64x64/0052CC/FFFFFF.png?text=JIRA',
    status: 'Coming Soon',
  },
  {
    id: 'tableau',
    name: 'Tableau',
    category: 'Business Intelligence',
    description: 'Connect Consult Vista data to Tableau for advanced visualizations and business intelligence dashboards.',
    logoFallback: 'TB',
    logoUrl: 'https://placehold.co/64x64/E97627/FFFFFF.png?text=TB',
    status: 'Not Connected',
  },
  {
    id: 'powerbi',
    name: 'Microsoft Power BI',
    category: 'Business Intelligence',
    description: 'Leverage Power BI to create custom reports and dashboards using your Consult Vista data.',
    logoFallback: 'PBI',
    logoUrl: 'https://placehold.co/64x64/F2C811/000000.png?text=PBI',
    status: 'Not Connected',
  },
  {
    id: 'xero',
    name: 'Xero',
    category: 'Accounting',
    description: 'Streamline your accounting with Xero by syncing invoices, expenses, and financial data.',
    logoFallback: 'XO',
    logoUrl: 'https://placehold.co/64x64/13B5EA/FFFFFF.png?text=Xero',
    status: 'Not Connected',
  },
  {
    id: 'netsuite',
    name: 'Oracle NetSuite',
    category: 'ERP / Accounting',
    description: 'Integrate with NetSuite for comprehensive financial management and ERP capabilities.',
    logoFallback: 'NS',
    logoUrl: 'https://placehold.co/64x64/FF5F3D/FFFFFF.png?text=NS',
    status: 'Coming Soon',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payment Gateway',
    description: 'Enable online payments for invoices directly through Consult Vista via Stripe.',
    logoFallback: 'ST',
    logoUrl: 'https://placehold.co/64x64/6772E5/FFFFFF.png?text=Stripe',
    status: 'Not Connected',
  },
  {
    id: 'gusto',
    name: 'Gusto',
    category: 'Payroll & HR',
    description: 'Connect consultant timesheets and project billing data to Gusto for streamlined payroll.',
    logoFallback: 'GU',
    logoUrl: 'https://placehold.co/64x64/F36949/FFFFFF.png?text=Gusto',
    status: 'Coming Soon',
  },
  {
    id: 'asana',
    name: 'Asana',
    category: 'Project Management',
    description: 'Two-way sync of projects, tasks, and deadlines between Consult Vista and Asana.',
    logoFallback: 'AS',
    logoUrl: 'https://placehold.co/64x64/F06A6A/FFFFFF.png?text=Asana',
    status: 'Not Connected',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Version Control',
    description: 'Link project tasks and milestones to GitHub repositories, commits, and issues for tech consultancies.',
    logoFallback: 'GH',
    logoUrl: 'https://placehold.co/64x64/181717/FFFFFF.png?text=GH',
    status: 'Not Connected',
  },
  {
    id: 'sharepoint',
    name: 'Microsoft SharePoint',
    category: 'Document Management',
    description: 'Enhanced integration for document storage, versioning, and collaboration using SharePoint.',
    logoFallback: 'SP',
    logoUrl: 'https://placehold.co/64x64/0078D4/FFFFFF.png?text=SP',
    status: 'Not Connected',
  },
  {
    id: 'knowledgenet_ai',
    name: 'KnowledgeNet AI',
    category: 'Knowledge Management',
    description: 'AI-powered indexing and search across all project documents and internal knowledge bases.',
    logoFallback: 'KN',
    logoUrl: 'https://placehold.co/64x64/7E57C2/FFFFFF.png?text=KN',
    status: 'Coming Soon',
  },
];


interface IntegrationsSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export default function IntegrationsSettingsSection({ t }: IntegrationsSettingsProps) {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);

  const handleConnectToggle = (integrationId: string) => {
    const integration = integrations.find(int => int.id === integrationId);
    if (!integration || integration.status === 'Coming Soon') {
        toast({ title: t("Feature Coming Soon"), description: t("This integration will be available in a future update."), duration: 3000 });
        return;
    }

    setIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId
          ? { ...int, status: int.status === 'Connected' ? 'Not Connected' : 'Connected' }
          : int
      )
    );
    toast({
      title: t(integration.status === 'Connected' ? "Integration Disconnected (Simulated)" : "Integration Connected (Simulated)"),
      description: t("{integrationName} has been {status}. OAuth flow and data sync would occur here.", { integrationName: integration.name, status: integration.status === 'Connected' ? t('disconnected') : t('connected')}),
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Link2 className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">{t('Application Integrations')}</CardTitle>
          </div>
          <CardDescription className="pt-1 text-base">
            {t('Connect Consult Vista with your favorite third-party applications to streamline workflows, automate data synchronization, and enhance productivity.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-6">
                <Input placeholder={t("Search integrations (e.g., CRM, Accounting)...")} className="max-w-sm" disabled />
                <p className="text-xs text-muted-foreground mt-1">{t("Filtering and categories coming soon.")}</p>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((int) => (
              <Card key={int.id} className="flex flex-col">
                <CardHeader className="flex-row items-start gap-4 space-y-0 pb-3">
                    <Avatar className="h-12 w-12 rounded-md border">
                        <AvatarImage src={int.logoUrl} alt={int.name} data-ai-hint={`${int.category} logo application`} />
                        <AvatarFallback className="rounded-md bg-muted text-muted-foreground">{int.logoFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-lg">{t(int.name as keyof LanguagePack['translations'])}</CardTitle>
                        <Badge variant="outline" className="text-xs font-normal">{t(int.category as keyof LanguagePack['translations'])}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">
                    {t(int.description as keyof LanguagePack['translations'])}
                  </p>
                </CardContent>
                <CardFooter>
                  {int.status === 'Connected' ? (
                    <Button variant="outline" className="w-full" onClick={() => handleConnectToggle(int.id)}>
                      <Zap className="mr-2 h-4 w-4 text-green-500" /> {t('Manage / Disconnect')}
                    </Button>
                  ) : int.status === 'Not Connected' ? (
                    <Button className="w-full" onClick={() => handleConnectToggle(int.id)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> {t('Connect')}
                    </Button>
                  ) : (
                    <Button variant="secondary" className="w-full" disabled>
                      <HelpCircle className="mr-2 h-4 w-4" /> {t('Coming Soon')}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <SettingsIcon className="h-6 w-6 text-primary"/>
                <CardTitle className="text-xl">{t('Advanced Integration Capabilities')}</CardTitle>
            </div>
            <CardDescription>{t('Future enhancements for deeper integration and customization.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div className="p-3 border rounded-md bg-muted/10">
                <h4 className="font-semibold text-foreground">{t('Custom Integration Builder (Planned)')}</h4>
                <p className="text-muted-foreground mt-1">{t('A no-code/low-code interface to build custom integrations with your existing enterprise systems or specialized tools using APIs and webhooks.')}</p>
                <Button variant="outline" size="sm" className="mt-2" disabled>{t('Launch Builder (Coming Soon)')}</Button>
            </div>
             <div className="p-3 border rounded-md bg-muted/10">
                <h4 className="font-semibold text-foreground">{t('API & Webhooks Management (Planned)')}</h4>
                <p className="text-muted-foreground mt-1">{t('Generate and manage API keys for secure inbound access to Consult Vista data. Configure webhooks to send real-time updates to external applications based on system events.')}</p>
                 <Button variant="outline" size="sm" className="mt-2" disabled>{t('Access API & Webhook Settings (Coming Soon)')}</Button>
            </div>
             <div className="p-3 border rounded-md bg-muted/10">
                <h4 className="font-semibold text-foreground">{t('Workflow Automation Across Systems (Planned)')}</h4>
                <p className="text-muted-foreground mt-1">{t('Create automated workflows that span across Consult Vista and your integrated applications. For example, automatically create a project in Consult Vista when a deal is closed in your CRM, or sync financial data to your accounting software when an invoice is paid.')}</p>
                 <Button variant="outline" size="sm" className="mt-2" disabled>{t('Explore Workflow Integrations (Coming Soon)')}</Button>
            </div>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">{t('Full integration management, OAuth flows, data mapping, and the custom builder are under active development and will be rolled out in future updates.')}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
