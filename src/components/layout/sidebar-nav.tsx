
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
import React from 'react';

export default function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLocalization();

  const defaultOpenAccordionItems = React.useMemo(() => {
    const openItems: string[] = [];
    navLinks.forEach(link => {
      if (link.subItems && link.subItems.some(subItem => pathname.startsWith(subItem.href) && subItem.href !== link.href)) { // Ensure parent overview doesn't keep it always open
        openItems.push(link.href); 
      } else if (link.subItems && pathname === link.href && link.subItems.some(si => si.href === link.href)) { // Open if on parent overview page
        openItems.push(link.href);
      }
    });
    return openItems;
  }, [pathname]);

  return (
    <SidebarMenu className="p-2">
      {navLinks.map((link) => {
        const translatedLabel = t(link.label as keyof LanguagePack['translations']);
        
        if (link.subItems && link.subItems.length > 0) {
          const isParentCurrentlyActive = link.subItems.some(subItem => pathname === subItem.href);
          // The AccordionTrigger itself is active if any of its children are active OR if the path matches the parent link's href AND it has an overview sub-item
          const isAccordionTriggerActive = isParentCurrentlyActive || (pathname === link.href && link.subItems.some(si => si.href === link.href));

          return (
            <SidebarMenuItem key={link.href} className="p-0">
              <Accordion type="single" collapsible defaultValue={defaultOpenAccordionItems.includes(link.href) ? link.href : undefined} className="w-full">
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
                    <AccordionTrigger className="p-0 hover:no-underline [&>svg.accord-chevron]:data-[state=open]:rotate-180">
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
                        const isSubItemActive = pathname === subItem.href; // Strict equality for sub-item active state
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

        // Render as a simple link if no subItems
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
