
// src/components/settings/workflow-settings.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow, Settings as SettingsIcon } from "lucide-react";
import type { LanguagePack } from '@/lib/i18n-config';

interface WorkflowSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export default function WorkflowSettingsSection({ t }: WorkflowSettingsProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Workflow className="h-7 w-7 text-primary" />
          <CardTitle className="text-2xl">{t('Workflow Customization')}</CardTitle>
        </div>
        <CardDescription className="pt-1 text-base">
          {t('Customize business workflows, approval processes, and automation rules to fit your organization\'s specific needs.')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[250px] flex flex-col items-center justify-center bg-muted/30 rounded-lg p-8 border border-dashed">
          <SettingsIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-center text-muted-foreground text-lg">
            {t('Workflow customization tools are under development.')}
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            {t('Future features will include a visual workflow builder, configurable approval steps, automated triggers, and versioning for workflow processes.')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

    