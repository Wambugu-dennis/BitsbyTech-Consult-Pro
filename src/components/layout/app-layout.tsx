
// src/components/layout/app-layout.tsx
'use client';

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
import { useAuth } from '@/context/auth-provider';
import { useEffect } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

// Paths that are explicitly public and should ALWAYS render without the app shell.
const publicShellLessPaths = ['/login'];

export default function AppLayout({ children }: AppLayoutProps) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // If not authenticated and trying to access a protected page
    if (!currentUser && !publicShellLessPaths.includes(pathname) && pathname !== '/') {
      router.push('/login');
    }
    // If authenticated and trying to access login page or the root page (which might be a landing/login prompt)
    else if (currentUser && (pathname === '/login' || pathname === '/')) {
      router.push('/dashboard');
    }
  }, [currentUser, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="ml-3 text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  // Render children directly for login page, or for root page if not authenticated
  if (publicShellLessPaths.includes(pathname) || (pathname === '/' && !currentUser)) {
    return <>{children}</>;
  }
  
  // If user is not logged in but on a protected path (useEffect should catch this, but as a fallback)
  if (!currentUser) {
     return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
         <p>Redirecting to login...</p> {/* This state should be brief */}
      </div>
    );
  }

  // If we reach here, user is authenticated and on a page that requires the full app shell.
  return (
    <SidebarProvider defaultOpen={true}> {/* Ensures sidebar is open by default on desktop */}
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">Consult Vista</h1>
          </div>
          {/* The Sheet for mobile view will have its own close button inside SheetContent (X icon) */}
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
          {/* This SidebarTrigger is for mobile to open the sheet AND for desktop to toggle expand/collapse from icon view */}
          <SidebarTrigger />
          {/* Future: Add global search or notifications here */}
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
