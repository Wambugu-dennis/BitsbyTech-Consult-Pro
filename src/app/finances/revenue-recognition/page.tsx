
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Landmark, Settings, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RevenueRecognitionPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => router.push('/finances')} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <Landmark className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Revenue Recognition</h1>
                <p className="text-muted-foreground">
                Configure and manage revenue recognition rules and processes.
                </p>
            </div>
        </div>
         <Button disabled>
          <Settings className="mr-2 h-4 w-4" />
          Configure Rules
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Revenue Recognition Settings</CardTitle>
          <CardDescription>
            Implement systematic revenue recognition based on project milestones, contract terms, or service delivery periods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] flex flex-col items-center justify-center bg-muted/50 rounded-md p-8 text-center">
            <Landmark className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              Revenue recognition features are currently under development.
            </p>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              This area will allow you to define rules for recognizing revenue (e.g., percentage of completion, milestone achievement), track deferred vs. recognized revenue, and ensure compliance with accounting standards.
            </p>
            <h4 className="font-semibold text-foreground mb-2">Key Upcoming Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground text-left mx-auto max-w-lg">
              <li>Customizable Revenue Recognition Rules</li>
              <li>Milestone-Based & Subscription-Based Recognition</li>
              <li>Deferred Revenue Waterfall Tracking</li>
              <li>Automated Journal Entry Suggestions</li>
              <li>Compliance Reporting (e.g., ASC 606 / IFRS 15)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
