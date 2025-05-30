
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppLayout from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/context/theme-provider';
import { LocalizationProvider } from '@/context/localization-provider';

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

// Client-side component to apply theme early
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
  return null; 
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <InitializeTheme />
        <ThemeProvider
          defaultTheme="system"
          storageKey="vite-ui-theme"
        >
          <LocalizationProvider>
            {/* AppLayout is now rendered directly here, 
                it will handle its own visibility for login page vs main app */}
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
