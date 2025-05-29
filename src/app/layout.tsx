
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppLayout from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/context/theme-provider'; // Import ThemeProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Consult Vista',
  description: 'Strategic insights and project management for consultants.',
};

// Small script to apply theme from localStorage before hydration to reduce FOUC
// This is a simplified approach. Next-themes handles this more robustly.
const InitializeTheme = () => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('vite-ui-theme') as ('light' | 'dark' | 'system') | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let themeToApply: 'light' | 'dark';

    if (storedTheme && storedTheme !== 'system') {
      themeToApply = storedTheme;
    } else {
      themeToApply = systemPrefersDark ? 'dark' : 'light';
    }

    if (themeToApply === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  return null; // This component doesn't render anything visible
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 
          Ideally, a script here would set the theme class before any rendering.
          For simplicity with current constraints, we'll rely on ThemeProvider's useEffect,
          which might cause a brief flash on initial load if preference differs from system.
          The `InitializeTheme` component is a client-side attempt to mitigate this.
        */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <InitializeTheme />
        <ThemeProvider
          defaultTheme="system"
          storageKey="vite-ui-theme"
        >
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
