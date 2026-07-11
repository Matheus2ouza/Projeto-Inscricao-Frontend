// AppSidebarAdmin.tsx
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
  // Eventos
  IconCalendar,
  IconCalendarEvent,
  IconCash,
  IconCashBanknotePlus,
  IconCashRegister,
  // Relatórios
  IconChartBar,
  IconChartLine,
  IconChartPie,
  IconChecklist,
  IconCommand,
  IconDoor,
  IconFileAnalytics,
  IconFileDollar,
  IconFileInvoice,
  IconFilePlus,
  IconFolder,
  IconLink,
  IconList,
  IconListDetails,
  IconMapPin2,
  IconPremiumRights,
  IconReport,
  IconShoppingCart,
  // Tickets
  IconTicket,
  IconUserPlus,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';
import * as React from 'react';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin/home',
      icon: IconCommand,
    },
    {
      title: 'Inscrições',
      icon: IconListDetails,
      items: [
        {
          title: 'Registar Inscrição',
          url: '/admin/inscriptions/register',
          icon: IconFilePlus,
        },
        {
          title: 'Analizar Inscrições',
          url: '/admin/inscriptions/analysis',
          icon: IconFileAnalytics,
        },
        {
          title: 'Lista de Inscrições',
          url: '/admin/inscriptions/list-inscriptions',
          icon: IconList,
        },
        {
          title: 'Links de Inscrições',
          url: '/admin/inscriptions/exclusive-inscription-link',
          icon: IconLink,
        },
        {
          title: 'Inscrição Avulsas',
          url: '/admin/inscriptions/avulsa',
          icon: IconUserPlus,
        },
      ],
    },
    {
      title: 'Pagamentos',
      icon: IconPremiumRights,
      items: [
        {
          title: 'Analizar Pagamentos',
          url: '/admin/payments/analysis',
          icon: IconFileDollar,
        },
        {
          title: 'Lista de Pagamentos',
          url: '/admin/payments/list-payments',
          icon: IconList,
        },
        {
          title: 'Lista de Comprovantes',
          url: '/admin/payments/list-receipts',
          icon: IconFileInvoice,
        },
        {
          title: 'Registrar Pagamento',
          url: '/admin/payments/register-payment',
          icon: IconCashBanknotePlus,
        },
      ],
    },
    {
      title: 'Usuários',
      url: '/admin/accounts',
      icon: IconUsers,
    },
    {
      title: 'Regiões',
      url: '/admin/regions',
      icon: IconMapPin2,
    },
    {
      title: 'Eventos',
      icon: IconCalendar,
      items: [
        {
          title: 'Gerenciamento',
          url: '/admin/events/manager',
          icon: IconCalendarEvent,
        },
        {
          title: 'Lista de Participantes',
          url: '/admin/participants/list-participants',
          icon: IconUsersGroup,
        },
        {
          title: 'Lista de Quartos',
          url: '/admin/participants/room',
          icon: IconDoor,
        },
        {
          title: 'Check-in',
          url: '/admin/events/check-in',
          icon: IconChecklist,
        },
      ],
    },
    {
      title: 'Tickets',
      icon: IconTicket,
      items: [
        {
          title: 'Gerenciamento',
          url: '/admin/tickets/manager',
          icon: IconFolder,
        },
        {
          title: 'Analise de Vendas',
          url: '/admin/tickets/analisy-sales',
          icon: IconChartLine,
        },
        {
          title: 'Lista de Vendas',
          url: '/admin/tickets/list-sales',
          icon: IconList,
        },
        {
          title: 'Registrar Venda',
          url: '/admin/tickets/register-sale',
          icon: IconShoppingCart,
        },
      ],
    },
    {
      title: 'Gastos',
      url: '/admin/expenses',
      icon: IconCash,
    },
    {
      title: 'Caixa',
      url: '/admin/cash-register',
      icon: IconCashRegister,
    },
    {
      title: 'Relatórios',
      icon: IconChartBar,
      items: [
        {
          title: 'Relatorio Geral',
          url: '/admin/report/geral',
          icon: IconReport,
        },
        {
          title: 'Relatorio Financeiro',
          url: '/admin/report/financial',
          icon: IconChartPie,
        },
      ],
    },
  ],
  navSecondary: [],
  documents: [],
};

interface AppSidebarProps {
  user: AuthUser;
}

export function AppSidebarAdmin({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & AppSidebarProps) {
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="navbar-glass! h-[96vh] self-center rounded-2xl border-none! shadow-xs shadow-black/10 backdrop-blur-2xl"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-transparent data-[slot=sidebar-menu-button]:p-1.5"
            >
              <a
                href="./dashboard"
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
