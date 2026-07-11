// shared/components/layout/sidebar-admin-manager/NavMain.tsx
'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/components/ui';
import { type Icon } from '@tabler/icons-react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export type NavItem = {
  title: string;
  url?: string;
  icon?: Icon;
  items?: NavItem[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Verifica se um item tem subitens
  const hasSubItems = (item: NavItem) => {
    return item.items && item.items.length > 0;
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isOpen = openItems[item.title] ?? false;
            const hasItems = hasSubItems(item);

            return (
              <SidebarMenuItem key={item.title}>
                {hasItems ? (
                  // Item com subitens (Collapsible)
                  <Collapsible
                    open={isOpen}
                    onOpenChange={() => toggleItem(item.title)}
                    className="group/collapsible"
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronDown
                          className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url || '#'}>
                                {subItem.icon && (
                                  <subItem.icon className="h-4 w-4" />
                                )}
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  // Item sem subitens (link direto)
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url || '#'}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
