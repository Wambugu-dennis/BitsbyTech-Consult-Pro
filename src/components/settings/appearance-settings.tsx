
// src/components/settings/appearance-settings.tsx
'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from '@/context/theme-provider';
import { Paintbrush, Sun, Moon, Laptop, LayoutDashboard, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LanguagePack } from '@/lib/i18n-config';

interface AppearanceSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export default function AppearanceSettingsSection({ t }: AppearanceSettingsProps) {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handlePlaceholderAction = (actionMessageKey: string) => {
    toast({
      title: t(actionMessageKey as keyof LanguagePack['translations']),
      description: t("This functionality is for demonstration and is planned for future development."),
      duration: 3000,
    });
  };

  const handleSaveAppearanceSettings = () => {
    toast({
      title: t("Appearance Settings Saved"),
      description: t("Theme preference updated to {theme}. Other settings are placeholders.", { theme: theme }),
      duration: 3000,
    });
  };

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

    