
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { navLinks } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/localization-provider'; // Import useLocalization

export default function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLocalization(); // Get translation function

  return (
    <SidebarMenu className="p-2">
      {navLinks.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))}
            className={cn(
              'justify-start',
              (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)))
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
            tooltip={t(link.label as keyof typeof languagePacks.en.translations)} // Translate tooltip
          >
            <Link href={link.href}>
              <link.icon className="h-5 w-5" />
              {/* Translate link label */}
              <span className="group-data-[collapsible=icon]:hidden">{t(link.label as keyof typeof languagePacks.en.translations)}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

    