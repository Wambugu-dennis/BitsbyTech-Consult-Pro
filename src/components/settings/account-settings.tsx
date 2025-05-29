
// src/components/settings/account-settings.tsx
'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  UserCircle,
  Lock,
  Palette,
  Languages,
  Trash2,
  Edit3,
} from "lucide-react";
import type { SupportedLanguage, LanguagePack } from '@/lib/i18n-config';

// Mock data, as it was in SettingsPage
const mockUserData = {
  name: 'Alex Mercer (Super Admin)',
  email: 'alex.mercer@consult.com',
  role: 'Lead Strategist & System Administrator',
  avatarUrl: 'https://placehold.co/128x128/64B5F6/FFFFFF.png?text=AM',
  phone: '(555) 123-4567',
};

interface AccountSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  setActiveSection: (sectionId: string) => void;
}

export default function AccountSettings({ t, setActiveSection }: AccountSettingsProps) {
  const { toast } = useToast();

  const handlePlaceholderAction = (actionMessageKey: string, descriptionKey?: string) => {
    toast({
      title: t(actionMessageKey),
      description: descriptionKey ? t(descriptionKey) : t("This functionality is for demonstration."),
      duration: 3000,
    });
  };

  const handleAccountDeletion = () => {
    toast({
      title: t("Account Deletion Process"),
      description: t("Account deletion initiated (simulated). This would be permanent."),
      variant: "destructive",
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserCircle className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl">{t('Profile Information')}</CardTitle>
          </div>
          <CardDescription>{t('Manage your personal details and profile picture.')}</CardDescription>
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
                {t('Change Picture')}
              </Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div>
              <Label htmlFor="profileName">{t('Full Name')}</Label>
              <Input id="profileName" defaultValue={mockUserData.name} disabled className="mt-1" />
            </div>
            <div>
              <Label htmlFor="profileEmail">{t('Email Address')}</Label>
              <Input id="profileEmail" type="email" defaultValue={mockUserData.email} disabled className="mt-1" />
            </div>
            <div>
              <Label htmlFor="profilePhone">{t('Phone Number')}</Label>
              <Input id="profilePhone" type="tel" defaultValue={mockUserData.phone} disabled className="mt-1" />
            </div>
            <Button onClick={() => handlePlaceholderAction("Edit Profile Details Triggered")}>
                <Edit3 className="mr-2 h-4 w-4"/> {t('Edit Profile')}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lock className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl">{t('Security Settings (Basic)')}</CardTitle>
          </div>
          <CardDescription>{t('Manage your password and basic security options.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            <Button variant="outline" onClick={() => { setActiveSection('security'); handlePlaceholderAction("Redirecting to Full Security Settings...");}}>
                {t('Go to Full Security Settings')}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
                {t('Advanced options like Two-Factor Authentication, Active Sessions, and Audit Logs are available in the main "Security" section.')}
            </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl">{t('Preferences')}</CardTitle>
          </div>
          <CardDescription>{t('Personalize your application experience.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h4 className="font-medium">{t('Appearance & Language')}</h4>
                <p className="text-sm text-muted-foreground">{t('Theme (Dark/Light mode) and language settings can be found in their dedicated sections in the main settings menu.')}</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveSection('appearance')}>
                        <Palette className="mr-2 h-4 w-4"/> {t('Go to Appearance')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveSection('language')}>
                        <Languages className="mr-2 h-4 w-4"/> {t('Go to Language & Region')}
                    </Button>
                  </div>
            </div>
        </CardContent>
      </Card>
      <Card className="border-destructive/50">
        <CardHeader>
            <div className="flex items-center gap-3">
            <Trash2 className="h-7 w-7 text-destructive" />
            <CardTitle className="text-xl text-destructive">{t('Account Management')}</CardTitle>
            </div>
            <CardDescription className="text-destructive/90">{t('Manage critical account actions.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" /> {t('Delete Account')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('Are you absolutely sure?')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('This action cannot be undone. This will permanently delete your account and remove your data from our servers.')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleAccountDeletion}>{t('Continue')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p className="text-xs text-muted-foreground mt-2">
            {t('Deleting your account is permanent. Please be certain before proceeding.')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    