'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
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
import { useLogout } from '@/shared/hooks/logout/logout';
import { cn } from '@/shared/lib/utils';
import {
  CalendarCheck2,
  ChevronRight,
  ChevronsUpDown,
  Command,
  Dock,
  LibraryBig,
  LogOut,
  ScrollText,
  Settings,
  Ticket,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useCurrentUser } from '@/shared/context/user-context';
import { useIsMobile } from '@/shared/hooks/use-mobile';

export default function AppSidebarNormal({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { logout } = useLogout();
  const { user } = useCurrentUser();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [inscriptionsOpen, setInscriptionsOpen] = React.useState(true);
  const [paymentsOpen, setPaymentsOpen] = React.useState(true);

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
        <Sidebar className="bg-sidebar">
          <SidebarHeader className="border-sidebar-border flex items-center justify-center border-b py-4">
            <Logo className="h-10 w-10" showTitle={false} />
          </SidebarHeader>
          <SidebarContent className="px-2 pb-4">
            <SidebarGroup className="gap-1">
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Inicio */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/user/home" className="flex items-center gap-1">
                        <Command className="size-4" />
                        Dashboard
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Eventos */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/user/events"
                        className="flex items-center gap-1"
                      >
                        <CalendarCheck2 className="size-4" />
                        Eventos
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Inscrições */}
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
                              href="/user/inscription/individual-inscription"
                              className="gap-1"
                            >
                              <span>Inscrição em Individual</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/user/inscription/group-inscription"
                              className="gap-1"
                            >
                              <span>Inscrição em Grupo</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/user/inscription/my-inscriptions"
                              className="gap-1"
                            >
                              <span>Minhas Inscrições</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>

                  {/* Minhas inscrições */}
                  {/* <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/user/MyInscriptions"
                        className="flex items-center gap-1"
                      >
                        <FileText className="size-4" />
                        Minhas Inscrições
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}

                  {/* Pagamentos */}
                  <SidebarMenuItem>
                    <Collapsible
                      open={paymentsOpen}
                      onOpenChange={setPaymentsOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                          <span className="flex items-center gap-1">
                            <Dock className="size-4" />
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
                              href="/user/payment/register"
                              className="gap-1"
                            >
                              <span>Registrar Pagamento</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/user/payment/list-payments"
                              className="gap-1"
                            >
                              <span>Visualizar Pagamentos</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/user/members"
                        className="flex items-center gap-1"
                      >
                        <Users className="size-4" />
                        Membros
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Tickets */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/user/tickets"
                        className="flex items-center gap-1"
                      >
                        <Ticket className="size-4" />
                        Tickets
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Documentação */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/documentation"
                        className="flex items-center gap-1"
                      >
                        <LibraryBig className="size-4" />
                        Documentação
                      </a>
                    </SidebarMenuButton>
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
