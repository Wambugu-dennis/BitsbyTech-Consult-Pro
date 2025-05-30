
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
import { useLocalization, type LanguagePack } from '@/context/localization-provider';

export default function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLocalization();

  return (
    <SidebarMenu className="p-2">
      {navLinks.map((link) => {
        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && link.href !== '/dashboard');
        // Special handling for dashboard to not stay active if on other root paths
        const isDashboardActive = link.href === '/dashboard' && pathname === '/dashboard';
        const finalIsActive = link.href === '/dashboard' ? isDashboardActive : isActive;

        const translatedLabel = t(link.label as keyof LanguagePack['translations']);

        return (
          <SidebarMenuItem key={link.href}>
            <SidebarMenuButton
              asChild
              isActive={finalIsActive}
              className={cn(
                "justify-start",
                finalIsActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
              )}
              tooltip={translatedLabel}
            >
              <Link href={link.href}>
                <link.icon className="h-5 w-5 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">{translatedLabel}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
