// src/components/layout/app-layout.tsx
'use client';

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/layout/sidebar-nav';
import UserProfile from '@/components/layout/user-profile';
import Logo from '@/components/logo';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // Since auth has been rolled back, we always render the main app shell.
  // The root page.tsx will handle redirecting to /dashboard.
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">Consult Vista</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <ScrollArea className="h-full">
            <SidebarNav />
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t">
          <UserProfile />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-start gap-4 border-b bg-background/80 px-6 backdrop-blur-sm">
          <SidebarTrigger />
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
