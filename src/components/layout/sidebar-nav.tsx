
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { navLinks } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useLocalization, type LanguagePack } from '@/context/localization-provider';
import { ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export default function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLocalization();
  const [openAccordionValues, setOpenAccordionValues] = useState<Record<string, string | undefined>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Only run on client after initial mount

    const initialOpenStates: Record<string, string | undefined> = {};
    navLinks.forEach(navLink => {
      if (navLink.subItems && navLink.subItems.length > 0) {
        const isActiveParentOrChild = 
          navLink.subItems.some(subItem => pathname === subItem.href) ||
          (pathname === navLink.href && navLink.subItems.some(si => si.href === navLink.href));
        
        initialOpenStates[navLink.href] = isActiveParentOrChild ? navLink.href : undefined;
      }
    });
    setOpenAccordionValues(initialOpenStates);
  }, [pathname, isClient]); // Add navLinks if it's not stable, but it should be from constants

  return (
    <SidebarMenu className="p-2">
      {navLinks.map((link) => {
        const translatedLabel = t(link.label as keyof LanguagePack['translations']);
        
        if (link.subItems && link.subItems.length > 0) {
          const isParentCurrentlyActive = pathname === link.href && link.subItems.some(si => si.href === link.href);
          const isAnyChildActive = link.subItems.some(subItem => pathname === subItem.href && subItem.href !== link.href);
          const isAccordionTriggerActive = isParentCurrentlyActive || isAnyChildActive;

          return (
            <SidebarMenuItem key={link.href} className="p-0">
              <Accordion 
                type="single" 
                collapsible 
                value={isClient ? openAccordionValues[link.href] : undefined} // Use undefined during SSR/initial client render
                onValueChange={(value) => {
                  if (isClient) { // Only allow changes on client
                    setOpenAccordionValues(prev => ({
                      ...prev,
                      [link.href]: value === link.href ? link.href : undefined,
                    }));
                  }
                }}
                className="w-full"
              >
                <AccordionItem value={link.href} className="border-none">
                  <SidebarMenuButton
                    asChild
                    isActive={isAccordionTriggerActive}
                    tooltip={translatedLabel}
                    className={cn(
                      "w-full justify-start",
                       isAccordionTriggerActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                    )}
                  >
                    <AccordionTrigger className="p-0 hover:no-underline [&>svg.accord-chevron]:data-[state=open]:rotate-180 [&[data-state=open]>div>svg.accord-chevron]:rotate-180">
                       <div className="flex items-center gap-2 flex-1 p-2">
                         <link.icon className="h-5 w-5 shrink-0" />
                         <span className="flex-grow text-left group-data-[collapsible=icon]:hidden">{translatedLabel}</span>
                         <ChevronDown className="accord-chevron ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[collapsible=icon]:hidden" />
                       </div>
                    </AccordionTrigger>
                  </SidebarMenuButton>
                  <AccordionContent className="pb-1 pl-4 pr-1 group-data-[collapsible=icon]:hidden">
                    <SidebarMenu className="mt-1 space-y-0.5 border-l border-sidebar-border/70 pl-3">
                      {link.subItems.map((subItem) => {
                        const isSubItemActive = pathname === subItem.href;
                        const translatedSubLabel = t(subItem.label as keyof LanguagePack['translations']);
                        return (
                          <SidebarMenuItem key={subItem.href} className="py-0.5">
                            <SidebarMenuButton
                              asChild
                              isActive={isSubItemActive}
                              className={cn(
                                "h-7 justify-start text-xs pl-2",
                                isSubItemActive
                                  ? "bg-sidebar-accent/70 text-sidebar-accent-foreground font-semibold"
                                  : "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                              )}
                              tooltip={translatedSubLabel}
                            >
                              <Link href={subItem.href}>
                                <subItem.icon className="mr-2 h-3.5 w-3.5 shrink-0" />
                                <span className="group-data-[collapsible=icon]:hidden">{translatedSubLabel}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SidebarMenuItem>
          );
        }

        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && link.href !== '/dashboard');
        const isDashboardActive = link.href === '/dashboard' && pathname === '/dashboard';
        const finalIsActive = link.href === '/dashboard' ? isDashboardActive : isActive;

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

