
// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button'; // Import Button
import Link from 'next/link'; // Import Link

export default function HomePage() {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    // This effect handles redirection AFTER auth state is known
    // It doesn't prevent the initial render of this page's content
    if (!isLoading && currentUser) {
      router.replace('/dashboard');
    }
    // No explicit redirect to /login here; AppLayout will handle it for protected routes
    // and this page will show a "Go to Login" button if not authenticated.
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  // If not loading and not authenticated, show the login button
  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Welcome to Consult Vista</h1>
        <p className="text-lg text-muted-foreground mb-8">Please log in to access your dashboard.</p>
        <Button asChild size="lg">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }
  
  // If authenticated, this part will likely not be seen for long due to the redirect in useEffect,
  // but it's good practice to handle this state.
  return (
     <div className="flex h-screen w-screen items-center justify-center">
        <p>Redirecting to dashboard...</p>
      </div>
  );
}
