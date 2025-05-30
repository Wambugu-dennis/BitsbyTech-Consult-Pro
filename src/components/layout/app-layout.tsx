// src/components/layout/app-layout.tsx
'use client';

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
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

interface AppLayoutProps {
  children: ReactNode;
}

const publicShellLessPaths = ['/login']; // Paths that should not have the main app shell

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !currentUser && !publicShellLessPaths.includes(pathname) && pathname !== '/') {
      router.push('/login');
    }
    if (!isLoading && currentUser && (pathname === '/login' || pathname === '/')) {
      router.push('/dashboard');
    }
  }, [currentUser, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="ml-3 text-muted-foreground">Loading Consult Vista...</p>
      </div>
    );
  }

  // Render children directly for login page or if it's the root path and user is not authenticated (handled by page.tsx)
  if (publicShellLessPaths.includes(pathname) || (pathname === '/' && !currentUser)) {
    return <>{children}</>;
  }
  
  // If user is not logged in but trying to access a protected page, show redirecting message
  // (useEffect will handle the actual redirect)
  if (!currentUser) {
     return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  // If user is logged in, render the full app shell
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
