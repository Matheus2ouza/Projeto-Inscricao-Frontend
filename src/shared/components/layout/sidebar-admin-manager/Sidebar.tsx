'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import Logo from '@/shared/components/ui/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from '@/shared/components/ui/sidebar';
import { useCurrentUser } from '@/shared/context/user-context';
import { useLogout } from '@/shared/hooks/logout/logout';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/lib/utils';
import {
  BanknoteArrowDown,
  CalendarDays,
  ChevronRight,
  ChevronsUpDown,
  Command,
  LogOut,
  Map,
  ScrollText,
  Settings,
  Tickets,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function AppSidebarAdminManager({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { logout } = useLogout();
  const { user } = useCurrentUser();
  const router = useRouter();
  const [inscriptionsOpen, setInscriptionsOpen] = React.useState(false);
  const [paymentsOpen, setPaymentsOpen] = React.useState(false);
  const [eventsOpen, setEventsOpen] = React.useState(false);
  const [ticketsOpen, setTicketsOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);

  const isMobile = useIsMobile();

  const userInitials = React.useMemo(() => {
    if (user?.username) {
      const [first, second] = user.username.trim().split(' ');
      if (second) {
        return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
      }
      return first.charAt(0).toUpperCase();
    }
    return 'U';
  }, [user?.username]);

  const accountPath = React.useMemo(() => {
    if (!user?.role) {
      return '/conta';
    }

    return `/${user.role.toLowerCase()}/conta`;
  }, [user?.role]);

  const handleAccountClick = React.useCallback(() => {
    router.push(accountPath);
  }, [router, accountPath]);

  const sidebarStyle = React.useMemo(
    () =>
      ({
        '--sidebar-width': '18rem',
      }) as React.CSSProperties,
    [],
  );

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex w-full">
        <Sidebar
          className="bg-transparent"
          sidebarClassName="liquid-panel liquid-panel-no-border"
        >
          <SidebarHeader className="border-sidebar-border flex items-center justify-center border-b py-4">
            <Logo className="h-10 w-10" showTitle={false} />
          </SidebarHeader>
          <SidebarContent className="px-2 pb-4">
            <SidebarGroup className="gap-1">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/admin/home" className="flex items-center gap-1">
                        <Command className="size-4" />
                        Dashboard
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Collapsible
                      open={inscriptionsOpen}
                      onOpenChange={setInscriptionsOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                          <span className="flex items-center gap-1">
                            <ScrollText className="size-4" />
                            Inscrições
                          </span>
                          <ChevronRight
                            className={cn(
                              'text-muted-foreground size-4 transition-transform',
                              inscriptionsOpen && 'rotate-90',
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/inscriptions/register"
                              className="gap-1"
                            >
                              <span>Registar Inscrição</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/inscriptions/analysis"
                              className="gap-1"
                            >
                              <span>Analizar Inscrições</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/inscriptions/list-inscriptions"
                              className="gap-1"
                            >
                              <span>Lista de Inscrições</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/inscriptions/exclusive-inscription-link"
                              className="gap-1"
                            >
                              <span>Links de Inscrições</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/inscriptions/avulsa"
                              className="gap-1"
                            >
                              <span>Inscrição Avulsas</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Collapsible
                      open={paymentsOpen}
                      onOpenChange={setPaymentsOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                          <span className="flex items-center gap-1">
                            <BanknoteArrowDown className="size-4" />
                            Pagamentos
                          </span>
                          <ChevronRight
                            className={cn(
                              'text-muted-foreground size-4 transition-transform',
                              paymentsOpen && 'rotate-90',
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/payments/analysis"
                              className="gap-1"
                            >
                              <span>Analizar Pagamentos</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/payments/list-payments"
                              className="gap-1"
                            >
                              <span>Lista de Pagamentos</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/payments/list-receipts"
                              className="gap-1"
                            >
                              <span>Lista de Comprovantes</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/payments/register-payment"
                              className="gap-1"
                            >
                              <span>Registrar Pagamento</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/admin/accounts"
                        className="flex items-center gap-1"
                      >
                        <Users className="size-4" />
                        Usuários
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/admin/regions"
                        className="flex items-center gap-1"
                      >
                        <Map className="size-4" />
                        Regiões
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {/* <EVENTOS> */}
                  <SidebarMenuItem>
                    <Collapsible open={eventsOpen} onOpenChange={setEventsOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-4" />
                            Eventos
                          </span>
                          <ChevronRight
                            className={cn(
                              'text-muted-foreground size-4 transition-transform',
                              eventsOpen && 'rotate-90',
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/events/manager"
                              className="gap-1"
                            >
                              <span>Gerenciamento</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/participants/list-participants"
                              className="gap-1"
                            >
                              <span>Lista de Participantes</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/participants/room"
                              className="gap-1"
                            >
                              <span>Lista de Quartos</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/events/check-in"
                              className="gap-1"
                            >
                              <span>Check-in</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                  {/* <TICKETS> */}
                  <SidebarMenuItem>
                    <Collapsible
                      open={ticketsOpen}
                      onOpenChange={setTicketsOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                          <span className="flex items-center gap-1">
                            <Tickets className="size-4" />
                            Tickets
                          </span>
                          <ChevronRight
                            className={cn(
                              'text-muted-foreground size-4 transition-transform',
                              eventsOpen && 'rotate-90',
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/tickets/manager"
                              className="gap-1"
                            >
                              <span>Gerenciamento</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/tickets/analisy-sales"
                              className="gap-1"
                            >
                              <span>Analise de Vendas</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/tickets/list-sales"
                              className="gap-1"
                            >
                              <span>Lista de Vendas</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/tickets/register-sale"
                              className="gap-1"
                            >
                              <span>Registrar Venda</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/admin/expenses"
                        className="flex items-center gap-1"
                      >
                        <BanknoteArrowDown className="size-4" />
                        Gastos
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/admin/cash-register"
                        className="flex items-center gap-1"
                      >
                        <Wallet className="size-4" />
                        Caixa
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Collapsible open={reportOpen} onOpenChange={setReportOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="size-4" />
                            Relatórios
                          </span>
                          <ChevronRight
                            className={cn(
                              'text-muted-foreground size-4 transition-transform',
                              eventsOpen && 'rotate-90',
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/report/geral"
                              className="gap-1"
                            >
                              <span>Relatorio Geral</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/report/financial"
                              className="gap-1"
                            >
                              <span>Relatorio Financeiro</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="mt-auto px-3 pb-4">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Abrir configurações da conta"
                  className="bg-sidebar-accent/10 hover:bg-sidebar-accent/20 focus-visible:ring-sidebar-ring flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2"
                >
                  <span className="flex items-center gap-3">
                    <Avatar className="size-9">
                      {user?.image && (
                        <AvatarImage
                          src={user.image}
                          alt={user?.username ?? 'Avatar'}
                        />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col text-left leading-tight">
                      <span className="text-sm font-medium">
                        {user?.username ?? 'Usuário'}
                      </span>
                      {user?.email && (
                        <span className="text-muted-foreground text-xs">
                          {user.email}
                        </span>
                      )}
                    </span>
                  </span>
                  <ChevronsUpDown className="text-muted-foreground hidden size-4 lg:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'center' : 'start'}
                sideOffset={isMobile ? 6 : 12}
                className={cn(
                  'bg-popover overflow-hidden rounded-xl border shadow-lg lg:mb-5',
                  isMobile
                    ? 'mx-auto w-full max-w-[15rem] min-w-[15rem]'
                    : 'w-60',
                )}
              >
                <div className="border-border flex items-center gap-3 border-b px-4 py-3">
                  <Avatar className="size-9">
                    {user?.image && (
                      <AvatarImage
                        src={user.image}
                        alt={user?.username ?? 'Avatar'}
                      />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-sm font-semibold">
                      {user?.username ?? 'Usuário'}
                    </span>
                    {user?.email && (
                      <span className="text-muted-foreground text-xs">
                        {user.email}
                      </span>
                    )}
                  </div>
                </div>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    handleAccountClick();
                  }}
                  className="cursor-pointer gap-1 px-4 py-2"
                >
                  <Settings className="size-4" />
                  Conta
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(event) => {
                    event.preventDefault();
                    logout();
                  }}
                  className="cursor-pointer gap-1 px-4 py-2"
                >
                  <LogOut className="size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex min-h-screen flex-1 flex-col">{children}</div>
      </div>
    </SidebarProvider>
  );
}
