
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { navLinks } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useLocalization, type LanguagePack } from '@/context/localization-provider';
import { ChevronDown } from 'lucide-react';

export default function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLocalization();

  return (
    <SidebarMenu className="p-2"> {/* This is a UL element */}
      {navLinks.map((link) => {
        const isActiveParent = link.subItems && link.subItems.length > 0 && pathname.startsWith(link.href);
        const translatedLabel = t(link.label as keyof LanguagePack['translations']);

        if (link.subItems && link.subItems.length > 0) {
          return (
            <SidebarMenuItem key={link.href} className="p-0"> {/* This is an LI element, remove its padding */}
              <Accordion
                type="single"
                collapsible
                className="w-full"
                // defaultValue to open if current path matches this parent link's href prefix
                defaultValue={pathname.startsWith(link.href) ? link.href : undefined}
              >
                <AccordionItem value={link.href} className="border-none">
                  <SidebarMenuButton
                    asChild
                    isActive={isActiveParent}
                    className={cn(
                      "justify-between w-full", // Ensure it spans full width
                      isActiveParent ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                      // Tooltip handled by SidebarMenuButton
                    )}
                    tooltip={translatedLabel}
                  >
                    <AccordionTrigger className="p-0 flex-1 h-auto hover:no-underline [&>svg.lucide-chevron-down]:hidden group-data-[collapsible=icon]:[&>svg.lucide-chevron-down]:hidden">
                      <div className="flex items-center gap-2 w-full p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
                        <link.icon className="h-5 w-5 shrink-0" />
                        <span className="flex-1 text-left group-data-[collapsible=icon]:hidden">{translatedLabel}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden accord-chevron" />
                      </div>
                    </AccordionTrigger>
                  </SidebarMenuButton>
                  <AccordionContent className="pb-0 pt-0 pl-4 pr-0 group-data-[collapsible=icon]:hidden">
                    {/* Nested SidebarMenu for proper UL/LI structure of sub-items */}
                    <SidebarMenu className="gap-0.5 py-1 border-l border-sidebar-border ml-[11px] pl-2">
                      {link.subItems.map((subItem) => {
                        const isSubItemActive = pathname === subItem.href;
                        const translatedSubLabel = t(subItem.label as keyof LanguagePack['translations']);
                        return (
                          <SidebarMenuItem key={subItem.href} className="relative">
                            <SidebarMenuButton
                              asChild
                              isActive={isSubItemActive}
                              className={cn(
                                "justify-start text-xs h-7", // Indented sub-item
                                isSubItemActive
                                  ? "bg-sidebar-accent/70 text-sidebar-accent-foreground font-semibold"
                                  : "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                              )}
                              tooltip={translatedSubLabel}
                            >
                              <Link href={subItem.href}>
                                {subItem.icon && <subItem.icon className="h-4 w-4 shrink-0" />}
                                <span className="group-data-[collapsible=icon]:hidden">{translatedSubLabel}</span>
                              </Link>
                            </SidebarMenuButton>
                            {isSubItemActive && <div className="absolute left-[-7px] top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary group-data-[collapsible=icon]:hidden"></div>}
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SidebarMenuItem>
          );
        } else {
          // Non-dropdown items
          return (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                className={cn(
                  "justify-start",
                  pathname === link.href
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
        }
      })}
    </SidebarMenu>
  );
}
