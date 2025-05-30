// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from '@/components/logo';

export default function HomePage() {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.replace('/dashboard');
    }
    // If not loading and no current user, this page will render its content (login prompt)
    // If not loading and no current user, but on a different protected path, AppLayout will redirect to /login
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="ml-3 text-muted-foreground">Initializing Consult Vista...</p>
      </div>
    );
  }

  // If not loading and no current user, show the login prompt
  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <Logo className="h-16 w-16 mb-6" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Welcome to Consult Vista</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Strategic insights and project management for consultants. Please log in to continue.
        </p>
        <Button asChild size="lg">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  // If authenticated, this will likely be redirected by the useEffect above or by AppLayout
  // If somehow still here, show a spinner or a message
  return (
     <div className="flex h-screen w-screen items-center justify-center">
      <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="ml-3 text-muted-foreground">Loading dashboard...</p>
    </div>
  );
}
