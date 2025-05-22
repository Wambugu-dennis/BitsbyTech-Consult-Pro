
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to your questions and get assistance with the platform.
        </p>
      </header>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Support Center</CardTitle>
          </div>
          <CardDescription>
            Access documentation, FAQs, tutorials, and contact support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] flex items-center justify-center bg-muted/50 rounded-md p-8">
            <p className="text-center text-muted-foreground">
              The Help & Support section is being built. <br />
              It will provide resources such as:
              <ul className="list-disc list-inside mt-2 text-left mx-auto max-w-md">
                <li>User Documentation & Guides</li>
                <li>Frequently Asked Questions (FAQs)</li>
                <li>Interactive Tutorials</li>
                <li>Contact Information for Support</li>
                <li>Community Forums (Future)</li>
              </ul>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
