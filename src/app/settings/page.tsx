
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure application preferences, integrations, and user management.
        </p>
      </header>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">System Configuration</CardTitle>
          </div>
          <CardDescription>
            Manage user roles, customize workflows, set up integrations, and personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] flex items-center justify-center bg-muted/50 rounded-md p-8">
            <p className="text-center text-muted-foreground">
              The settings area is under development. <br />
              Future options will include:
              <ul className="list-disc list-inside mt-2 text-left mx-auto max-w-md">
                <li>User Preferences & Notifications</li>
                <li>Role-Based Access Control</li>
                <li>Workflow Customization</li>
                <li>Third-Party Integrations</li>
                <li>System & Compliance Settings</li>
              </ul>
              Please provide details for specific sub-features you'd like to see here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
