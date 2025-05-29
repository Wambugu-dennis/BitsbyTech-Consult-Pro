
// src/components/settings/integrations-settings.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Settings as SettingsIcon } from "lucide-react";
import type { LanguagePack } from '@/lib/i18n-config';

interface IntegrationsSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export default function IntegrationsSettingsSection({ t }: IntegrationsSettingsProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Link2 className="h-7 w-7 text-primary" />
          <CardTitle className="text-2xl">{t('Integrations')}</CardTitle>
        </div>
        <CardDescription className="pt-1 text-base">
          {t('Connect and manage third-party application integrations to streamline your workflows and data synchronization.')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[250px] flex flex-col items-center justify-center bg-muted/30 rounded-lg p-8 border border-dashed">
          <SettingsIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-center text-muted-foreground text-lg">
            {t('Third-party integration management is under development.')}
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            {t('This section will allow you to connect to popular services like CRMs, accounting software, communication tools, and more. OAuth support and custom integration builders are planned.')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

    