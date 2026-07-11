'use client';

import { AuthUser } from '@/features/auth/types/userTypes';
import {
  NavDocuments,
  NavMain,
  NavSecondary,
  NavUser,
} from '@/shared/components/layout/sidebar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui';
import Logo from '@/shared/components/ui/logo';
import {
  IconCalendarEvent,
  IconCashBanknotePlus,
  IconDashboard,
  IconFileAnalytics,
  IconFilePlus,
  IconLibrary,
  IconList,
  IconListDetails,
  IconPremiumRights,
  IconTicket,
  IconUsers,
} from '@tabler/icons-react';
import * as React from 'react';

const data = {
  navMain: [
    // Dashboard - SEM subitens
    {
      title: 'Dashboard',
      url: '/user/home',
      icon: IconDashboard,
    },
    // Eventos - SEM subitens
    {
      title: 'Eventos',
      url: '/user/events',
      icon: IconCalendarEvent,
    },
    // Inscrições - COM subitens
    {
      title: 'Inscrições',
      icon: IconListDetails,
      items: [
        {
          title: 'Inscrição Individual',
          url: '/user/inscription/individual-inscription',
          icon: IconFilePlus,
        },
        {
          title: 'Inscrição em Grupo',
          url: '/user/inscription/group-inscription',
          icon: IconUsers,
        },
        {
          title: 'Minhas Inscrições',
          url: '/user/inscription/my-inscriptions',
          icon: IconList,
        },
      ],
    },
    // Pagamentos - COM subitens
    {
      title: 'Pagamentos',
      icon: IconPremiumRights,
      items: [
        {
          title: 'Registrar Pagamento',
          url: '/user/payment/register',
          icon: IconCashBanknotePlus,
        },
        {
          title: 'Visualizar Pagamentos',
          url: '/user/payment/list-payments',
          icon: IconFileAnalytics,
        },
      ],
    },
    // Membros - SEM subitens
    {
      title: 'Membros',
      url: '/user/members',
      icon: IconUsers,
    },
    // Tickets - SEM subitens
    {
      title: 'Tickets',
      url: '/user/tickets',
      icon: IconTicket,
    },
    // Documentação - SEM subitens
    {
      title: 'Documentação',
      url: '/documentation',
      icon: IconLibrary,
    },
  ],
  navSecondary: [],
  documents: [],
};

interface AppSidebarProps {
  user: AuthUser;
}

export function AppSidebarUser({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & AppSidebarProps) {
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="navbar-glass h-[96vh] self-center rounded-2xl border-none! shadow-xs! shadow-black/10 backdrop-blur-2xl"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-transparent data-[slot=sidebar-menu-button]:p-1.5"
            >
              <a
                href="/user/home"
                className="flex h-10 items-center justify-center overflow-visible"
              >
                <Logo className="mb-0! h-10 w-10" showTitle={false} />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
