
// src/components/settings/notification-settings.tsx
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { BellRing, Briefcase, MessageSquare, DollarSign as FinancialIcon, Server, Users as UsersIcon } from "lucide-react";
import type { LanguagePack } from '@/lib/i18n-config';

interface NotificationPreference {
  email: boolean;
  inApp: boolean;
}

interface NotificationSettingsData {
  masterEnable: boolean;
  channels: {
    email: boolean;
    inApp: boolean;
    push: boolean;
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

interface NotificationSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export default function NotificationSettingsSection({ t }: NotificationSettingsProps) {
  const { toast } = useToast();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsData>({
    masterEnable: true,
    channels: { email: true, inApp: true, push: false },
    preferences: {
      projectUpdates: { email: true, inApp: true },
      clientCommunications: { email: true, inApp: false },
      taskManagement: { email: false, inApp: true },
      financialAlerts: { email: true, inApp: true },
      systemAnnouncements: { email: true, inApp: true },
    },
    digestFrequency: 'daily',
  });

  const handleNotificationChange = <K extends keyof NotificationSettingsData>(
    key: K,
    value: NotificationSettingsData[K]
  ) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleChannelChange = (channel: keyof NotificationSettingsData['channels'], value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      channels: { ...prev.channels, [channel]: value },
    }));
  };

  const handlePreferenceChange = (
    event: keyof NotificationSettingsData['preferences'],
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

  const handleSaveNotificationSettings = () => {
    toast({
      title: t("Settings Saved"),
      description: t("Your notification preferences have been updated (simulated)."),
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BellRing className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl">{t('Notification Settings')}</CardTitle>
          </div>
          <CardDescription>{t('Manage how and when you receive alerts from Consult Vista.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div>
              <Label htmlFor="masterEnable" className="text-base font-semibold">{t('Enable All Notifications')}</Label>
              <p className="text-xs text-muted-foreground">{t('Master control for all application alerts.')}</p>
            </div>
            <Switch
              id="masterEnable"
              checked={notificationSettings.masterEnable}
              onCheckedChange={(checked) => handleNotificationChange('masterEnable', checked)}
            />
          </div>
          <Separator />
          <div>
            <h4 className="text-md font-semibold mb-3">{t('Notification Channels')}</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailChannel">{t('Email Notifications')}</Label>
                <Switch
                  id="emailChannel"
                  checked={notificationSettings.channels.email}
                  onCheckedChange={(checked) => handleChannelChange('email', checked)}
                  disabled={!notificationSettings.masterEnable}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="inAppChannel">{t('In-App Notifications')}</Label>
                <Switch
                  id="inAppChannel"
                  checked={notificationSettings.channels.inApp}
                  onCheckedChange={(checked) => handleChannelChange('inApp', checked)}
                  disabled={!notificationSettings.masterEnable}
                />
              </div>
              <div className="flex items-center justify-between opacity-50">
                <Label htmlFor="pushChannel">{t('Push Notifications (Mobile)')}</Label>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground italic mr-2">{t('Coming Soon')}</span>
                    <Switch id="pushChannel" checked={notificationSettings.channels.push} disabled />
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-md font-semibold mb-3">{t('Detailed Notification Preferences')}</h4>
            <p className="text-sm text-muted-foreground mb-4">{t('Choose which types of events trigger notifications for each channel. (Only active if master notifications are enabled.)')}</p>
            {(Object.keys(notificationSettings.preferences) as Array<keyof NotificationSettingsData['preferences']>).map((eventKey) => {
              const eventLabel = t(eventKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) as keyof LanguagePack['translations']);
              const Icon =
                eventKey === 'projectUpdates' ? Briefcase :
                eventKey === 'clientCommunications' ? MessageSquare :
                eventKey === 'taskManagement' ? UsersIcon : // Re-using UsersIcon for Task for now
                eventKey === 'financialAlerts' ? FinancialIcon :
                Server; // Default icon
              return (
                <div key={eventKey} className="mb-4 p-3 border rounded-md bg-card/50">
                  <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-muted-foreground"/>
                      <h5 className="font-medium text-sm">{eventLabel}</h5>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pl-7">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${eventKey}-email`} className="text-xs">{t('Email')}</Label>
                      <Switch
                        id={`${eventKey}-email`}
                        checked={notificationSettings.preferences[eventKey].email}
                        onCheckedChange={(checked) => handlePreferenceChange(eventKey, 'email', checked)}
                        disabled={!notificationSettings.masterEnable || !notificationSettings.channels.email}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${eventKey}-inApp`} className="text-xs">{t('In-App')}</Label>
                      <Switch
                        id={`${eventKey}-inApp`}
                        checked={notificationSettings.preferences[eventKey].inApp}
                        onCheckedChange={(checked) => handlePreferenceChange(eventKey, 'inApp', checked)}
                        disabled={!notificationSettings.masterEnable || !notificationSettings.channels.inApp}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Separator />
            <div>
              <h4 className="text-md font-semibold mb-2">{t('Notification Delivery')}</h4>
                <Label htmlFor="digestFrequency" className="text-sm text-muted-foreground">{t('Notification Digest Frequency (Planned)')}</Label>
                <Select
                    value={notificationSettings.digestFrequency}
                    onValueChange={(value: NotificationSettingsData['digestFrequency']) => handleNotificationChange('digestFrequency', value) }
                    disabled
                >
                    <SelectTrigger id="digestFrequency" className="mt-1 w-full sm:w-[250px]">
                        <SelectValue placeholder={t('Select frequency')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="instant">{t('Instant')}</SelectItem>
                        <SelectItem value="daily">{t('Daily Digest')}</SelectItem>
                        <SelectItem value="weekly">{t('Weekly Digest')}</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1 italic">{t('Consolidate non-critical notifications into a summary. (Feature coming soon)')}</p>
            </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveNotificationSettings} disabled={!notificationSettings.masterEnable}>{t('Save Notification Settings')}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    