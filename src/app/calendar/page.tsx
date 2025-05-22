
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View and manage schedules, appointments, and project timelines.
        </p>
      </header>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Scheduling & Availability</CardTitle>
          </div>
          <CardDescription>
            Integrate project deadlines, consultant availability, and client meetings in a unified view.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] flex items-center justify-center bg-muted/50 rounded-md p-8">
            <p className="text-center text-muted-foreground">
              Calendar features are currently under development. <br />
              This section will provide an interactive calendar for managing:
              <ul className="list-disc list-inside mt-2 text-left mx-auto max-w-md">
                <li>Project Milestones & Deadlines</li>
                <li>Consultant Schedules</li>
                <li>Client Meetings</li>
                <li>Team Availability</li>
              </ul>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
