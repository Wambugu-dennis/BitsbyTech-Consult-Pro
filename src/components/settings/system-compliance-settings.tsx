
// src/components/settings/system-compliance-settings.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Settings as SettingsIcon } from "lucide-react";
import type { LanguagePack } from '@/lib/i18n-config';

interface SystemComplianceSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export default function SystemComplianceSettingsSection({ t }: SystemComplianceSettingsProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Server className="h-7 w-7 text-primary" />
          <CardTitle className="text-2xl">{t('System & Compliance')}</CardTitle>
        </div>
        <CardDescription className="pt-1 text-base">
          {t('Configure system-wide settings, view audit logs, manage data backup, and ensure compliance with industry regulations.')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[250px] flex flex-col items-center justify-center bg-muted/30 rounded-lg p-8 border border-dashed">
          <SettingsIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-center text-muted-foreground text-lg">
            {t('System and compliance settings are under development.')}
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            {t('This area will provide access to comprehensive audit trails, data backup and restoration tools, API key management, and compliance reporting features.')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

    