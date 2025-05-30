
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
    <SidebarMenu className="p-2">
      {navLinks.map((link) => {
        const isActiveParent = link.subItems && link.subItems.length > 0 && pathname.startsWith(link.href);
        const translatedLabel = t(link.label as keyof LanguagePack['translations']);

        if (link.subItems && link.subItems.length > 0) {
          return (
            <SidebarMenuItem key={link.href} className="p-0">
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue={pathname.startsWith(link.href) ? link.href : undefined}
              >
                <AccordionItem value={link.href} className="border-none">
                  <AccordionTrigger asChild>
                    <SidebarMenuButton
                      isActive={isActiveParent}
                      className={cn(
                        "justify-between w-full", // SidebarMenuButton handles its own padding
                        isActiveParent ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                      )}
                      tooltip={translatedLabel}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <link.icon className="h-5 w-5 shrink-0" />
                        <span className="flex-1 text-left group-data-[collapsible=icon]:hidden">{translatedLabel}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden accord-chevron" />
                    </SidebarMenuButton>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-0 pl-6 pr-0 group-data-[collapsible=icon]:hidden"> {/* Indent content */}
                    {/* Sub-items are rendered inside AccordionContent. Ensure this container is visible. */}
                    <SidebarMenu className="gap-0.5 py-1 border-l border-sidebar-border ml-0.5 pl-2"> {/* Adjusted ml and pl for alignment */}
                      {link.subItems.map((subItem) => {
                        const isSubItemActive = pathname === subItem.href;
                        const translatedSubLabel = t(subItem.label as keyof LanguagePack['translations']);
                        return (
                          <SidebarMenuItem key={subItem.href} className="relative p-0"> {/* Removed padding from LI */}
                            <SidebarMenuButton
                              asChild
                              size="sm" // Make sub-items slightly smaller
                              isActive={isSubItemActive}
                              className={cn(
                                "justify-start w-full h-8", // Ensure full width for sub-items
                                isSubItemActive
                                  ? "bg-sidebar-accent/80 text-sidebar-accent-foreground font-semibold"
                                  : "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground text-sidebar-foreground/90"
                              )}
                              tooltip={translatedSubLabel}
                            >
                              <Link href={subItem.href} className="flex items-center gap-2 w-full px-2"> {/* Added padding to Link for subItem content */}
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
