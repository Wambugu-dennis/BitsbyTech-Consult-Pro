
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

  // Determine which accordion items should be open by default
  const defaultOpenAccordionItems = navLinks
    .filter(link => link.subItems && pathname.startsWith(link.href))
    .map(link => link.href);

  return (
    <SidebarMenu className="p-2">
      <Accordion type="multiple" defaultValue={defaultOpenAccordionItems} className="w-full">
        {navLinks.map((link) => {
          const isActiveParent = link.subItems && pathname.startsWith(link.href);
          const translatedLabel = t(link.label as keyof LanguagePack['translations']);

          if (link.subItems && link.subItems.length > 0) {
            return (
              <AccordionItem value={link.href} key={link.href} className="border-none">
                <SidebarMenuItem>
                  <AccordionTrigger
                    className={cn(
                      "flex w-full items-center justify-between rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2",
                      isActiveParent ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground",
                      "data-[state=open]:bg-sidebar-accent/80 data-[state=open]:text-sidebar-accent-foreground",
                      // Remove hover for trigger itself to let SidebarMenuButton's hover work
                      "[&[data-state=closed]>svg]:rotate-0 [&[data-state=open]>svg]:rotate-180" 
                    )}
                    // Tooltip handled by SidebarMenuButton for consistency when collapsed
                  >
                    <SidebarMenuButton
                        asChild // Makes the trigger itself the button, for styling
                        isActive={isActiveParent}
                        className={cn(
                            "justify-start w-full h-auto p-0 bg-transparent hover:bg-transparent",
                            isActiveParent ? "text-sidebar-accent-foreground" : "text-sidebar-foreground",
                            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!size-auto group-data-[collapsible=icon]:!p-0"
                        )}
                        tooltip={translatedLabel}
                    >
                      <div className="flex items-center gap-2 w-full"> {/* Ensures icon and text are part of the clickable button area */}
                        <link.icon className="h-5 w-5" />
                        <span className="flex-1 group-data-[collapsible=icon]:hidden">{translatedLabel}</span>
                         {/* Chevron for accordion, visible only when sidebar is expanded */}
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden" />
                      </div>
                    </SidebarMenuButton>
                  </AccordionTrigger>
                </SidebarMenuItem>
                <AccordionContent className="pb-0 pl-4 group-data-[collapsible=icon]:hidden">
                  <SidebarMenu className="gap-0.5 py-1 border-l border-sidebar-border ml-[9px]">
                    {link.subItems.map((subItem) => {
                      const isSubItemActive = pathname === subItem.href;
                      const translatedSubLabel = t(subItem.label as keyof LanguagePack['translations']);
                      return (
                        <SidebarMenuItem key={subItem.href} className="relative">
                          <SidebarMenuButton
                            asChild
                            isActive={isSubItemActive}
                            className={cn(
                              "justify-start pl-5 text-xs", // Indented sub-item
                              isSubItemActive
                                ? "bg-sidebar-accent/70 text-sidebar-accent-foreground font-semibold"
                                : "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground text-sidebar-foreground/80",
                               "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:!size-8" // Icon only style
                            )}
                            tooltip={translatedSubLabel}
                          >
                            <Link href={subItem.href}>
                              <subItem.icon className="h-4 w-4" />
                              <span className="group-data-[collapsible=icon]:hidden">{translatedSubLabel}</span>
                            </Link>
                          </SidebarMenuButton>
                           {/* Active indicator line for sub-items */}
                           {isSubItemActive && <div className="absolute left-[5px] top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-primary group-data-[collapsible=icon]:hidden"></div>}
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </AccordionContent>
              </AccordionItem>
            );
          } else {
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
                    <link.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{translatedLabel}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </Accordion>
    </SidebarMenu>
  );
}
