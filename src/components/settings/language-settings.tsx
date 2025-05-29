
// src/components/settings/language-settings.tsx
'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { useLocalization } from '@/context/localization-provider';
import { languagePacks, supportedLanguages, supportedRegions, type SupportedLanguage, type SupportedRegion } from '@/lib/i18n-config';
import { Languages, CalendarIcon } from "lucide-react";

interface LanguageSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string; // Already provided by useLocalization
}

export default function LanguageSettingsSection({ t: translateProp }: LanguageSettingsProps) { // Renamed prop to avoid conflict
  const { toast } = useToast();
  const { language, region, setLanguage, setRegion, t, formatDate } = useLocalization(); // Use t from context

  const handleSaveLanguageSettings = () => {
     toast({
      title: t("Settings Saved"),
      description: t("Language and region preferences have been updated."), // Removed (simulated) as it's now live
      duration: 3000,
    });
  };

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

    