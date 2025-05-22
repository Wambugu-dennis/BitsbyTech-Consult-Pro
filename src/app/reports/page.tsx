
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and view detailed reports on various aspects of your business.
        </p>
      </header>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Reporting Hub</CardTitle>
          </div>
          <CardDescription>
            Access standard reports, build custom reports, and export data for further analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] flex items-center justify-center bg-muted/50 rounded-md p-8">
            <p className="text-center text-muted-foreground">
              The reporting module is currently being developed. <br />
              It will offer:
              <ul className="list-disc list-inside mt-2 text-left mx-auto max-w-md">
                <li>Standard Business Reports</li>
                <li>Custom Report Builder</li>
                <li>Data Visualization Tools</li>
                <li>Scheduled Reporting & Export</li>
              </ul>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
