
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Gain deeper insights into your consultancy's performance.
        </p>
      </header>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Performance Analytics</CardTitle>
          </div>
          <CardDescription>
            Explore data trends, identify opportunities, and make data-driven decisions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] flex items-center justify-center bg-muted/50 rounded-md p-8">
            <p className="text-center text-muted-foreground">
              Advanced analytics capabilities are under construction. <br />
              This section will feature:
              <ul className="list-disc list-inside mt-2 text-left mx-auto max-w-md">
                <li>Predictive Analytics for Trends</li>
                <li>Anomaly Detection</li>
                <li>Customizable Data Visualizations</li>
                <li>Personalized Insights</li>
              </ul>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
