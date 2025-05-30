
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

  // Determine which accordion items should be open by default
  const defaultOpenAccordionItems = React.useMemo(() => {
    const openItems: string[] = [];
    navLinks.forEach(link => {
      if (link.subItems && link.subItems.some(subItem => pathname.startsWith(subItem.href))) {
        openItems.push(link.href); // Use parent href as accordion item value
      }
    });
    return openItems;
  }, [pathname]);

  return (
    <SidebarMenu className="p-2">
      {navLinks.map((link) => {
        const isParentActive = link.subItems ? link.subItems.some(subItem => pathname.startsWith(subItem.href)) : pathname.startsWith(link.href);
        // Special handling for dashboard to not stay active if on other root paths
        const isDashboardActive = link.href === '/dashboard' && pathname === '/dashboard';
        const finalIsActive = link.href === '/dashboard' ? isDashboardActive : isParentActive;

        const translatedLabel = t(link.label as keyof LanguagePack['translations']);

        if (link.subItems && link.subItems.length > 0) {
          return (
            <SidebarMenuItem key={link.href} className="p-0">
              <Accordion type="single" collapsible defaultValue={defaultOpenAccordionItems.includes(link.href) ? link.href : undefined} className="w-full">
                <AccordionItem value={link.href} className="border-none">
                  <AccordionTrigger
                    asChild
                    className={cn(
                      "flex w-full items-center justify-between rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg.accord-chevron]:data-[state=open]:rotate-180",
                      finalIsActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground",
                      "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2"
                    )}
                  >
                    <SidebarMenuButton
                      isActive={finalIsActive}
                      tooltip={translatedLabel}
                      className="flex-1 justify-start p-0 h-auto bg-transparent hover:bg-transparent data-[active=true]:bg-transparent"
                      asChild
                    >
                      <div> {/* Wrapper for flex layout of icon, label, and chevron */}
                        <link.icon className="h-5 w-5 shrink-0" />
                        <span className="flex-grow group-data-[collapsible=icon]:hidden">{translatedLabel}</span>
                        <ChevronDown className="accord-chevron ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[collapsible=icon]:hidden" />
                      </div>
                    </SidebarMenuButton>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pl-5 pr-2 group-data-[collapsible=icon]:hidden">
                    <SidebarMenu className="mt-1 space-y-1 border-l border-sidebar-border pl-3">
                      {link.subItems.map((subItem) => {
                        const isSubItemActive = pathname === subItem.href || (subItem.href !== '/' && pathname.startsWith(subItem.href) && subItem.href !== '/dashboard');
                         const translatedSubLabel = t(subItem.label as keyof LanguagePack['translations']);
                        return (
                          <SidebarMenuItem key={subItem.href}>
                            <SidebarMenuButton
                              asChild
                              isActive={isSubItemActive}
                              className={cn(
                                "h-8 justify-start text-xs", // Smaller for sub-items
                                isSubItemActive
                                  ? "bg-sidebar-accent/70 text-sidebar-accent-foreground"
                                  : "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                              )}
                              tooltip={translatedSubLabel}
                            >
                              <Link href={subItem.href}>
                                <subItem.icon className="mr-2 h-4 w-4 shrink-0" />
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
