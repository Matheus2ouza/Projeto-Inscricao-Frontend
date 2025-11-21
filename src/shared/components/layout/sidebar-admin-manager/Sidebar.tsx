"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import Logo from "@/shared/components/ui/logo";
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
} from "@/shared/components/ui/sidebar";
import { useLogout } from "@/shared/hooks/logout/logout";
import { cn } from "@/shared/lib/utils";
import {
  BanknoteArrowDown,
  CalendarDays,
  ChevronRight,
  ChevronsUpDown,
  FileText,
  House,
  ListOrdered,
  LogOut,
  Map,
  ScrollText,
  Settings,
  SquareChartGantt,
  Tickets,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useCurrentUser } from "@/shared/context/user-context";
import { useIsMobile } from "@/shared/hooks/use-mobile";

export default function AppSidebarAdminManager({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { logout } = useLogout();
  const { user } = useCurrentUser();
  const router = useRouter();
  const [inscriptionsOpen, setInscriptionsOpen] = React.useState(true);
  const [paymentsOpen, setPaymentsOpen] = React.useState(true);
  const [eventsOpen, setEventsOpen] = React.useState(true);
  const isMobile = useIsMobile();

  const userInitials = React.useMemo(() => {
    if (user?.username) {
      const [first, second] = user.username.trim().split(" ");
      if (second) {
        return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
      }
      return first.charAt(0).toUpperCase();
    }
    return "U";
  }, [user?.username]);

  const accountPath = React.useMemo(() => {
    if (!user?.role) {
      return "/conta";
    }

    return `/${user.role.toLowerCase()}/conta`;
  }, [user?.role]);

  const handleAccountClick = React.useCallback(() => {
    router.push(accountPath);
  }, [router, accountPath]);

  const sidebarStyle = React.useMemo(
    () =>
      ({
        "--sidebar-width": "18rem",
      }) as React.CSSProperties,
    []
  );

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex w-full">
        <Sidebar className="bg-sidebar">
          <SidebarHeader className="flex items-center justify-center border-b border-sidebar-border py-4">
            <Logo className="h-10 w-10" showTitle={false} />
          </SidebarHeader>
          <SidebarContent className="px-2 pb-4">
            <SidebarGroup className="gap-2">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/admin/home" className="flex items-center gap-2">
                        <House className="size-4" />
                        Início
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
                          <span className="flex items-center gap-2">
                            <ScrollText className="size-4" />
                            Inscrições
                          </span>
                          <ChevronRight
                            className={cn(
                              "size-4 text-muted-foreground transition-transform",
                              inscriptionsOpen && "rotate-90"
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/inscriptions/analysis"
                              className="gap-2"
                            >
                              <span>Analizar Inscrições</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/inscriptions/avulsa"
                              className="gap-2"
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
                          <span className="flex items-center gap-2">
                            <BanknoteArrowDown className="size-4" />
                            Pagamentos
                          </span>
                          <ChevronRight
                            className={cn(
                              "size-4 text-muted-foreground transition-transform",
                              paymentsOpen && "rotate-90"
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/payments/analysis"
                              className="gap-2"
                            >
                              <span>Analizar Pagamentos</span>
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
                        className="flex items-center gap-2"
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
                        className="flex items-center gap-2"
                      >
                        <Map className="size-4" />
                        Regiões
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Collapsible open={eventsOpen} onOpenChange={setEventsOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                          <span className="flex items-center gap-2">
                            <CalendarDays className="size-4" />
                            Eventos
                          </span>
                          <ChevronRight
                            className={cn(
                              "size-4 text-muted-foreground transition-transform",
                              eventsOpen && "rotate-90"
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/events/manager"
                              className="gap-2"
                            >
                              <FileText className="size-4" />
                              <span>Gerenciamento</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/admin/participants/select-event"
                              className="gap-2"
                            >
                              <ListOrdered className="size-4" />
                              <span>Lista de Participantes</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/admin/tickets"
                        className="flex items-center gap-2"
                      >
                        <Tickets className="size-4" />
                        Tickets
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/admin/gastos"
                        className="flex items-center gap-2"
                      >
                        <BanknoteArrowDown className="size-4" />
                        Gastos
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/admin/report"
                        className="flex items-center gap-2"
                      >
                        <SquareChartGantt className="size-4" />
                        Relatórios
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
                          alt={user?.username ?? "Avatar"}
                        />
                      )}
                      <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col text-left leading-tight">
                      <span className="text-sm font-medium">
                        {user?.username ?? "Usuário"}
                      </span>
                      {user?.email && (
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      )}
                    </span>
                  </span>
                  <ChevronsUpDown className="size-4 hidden lg:block text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "center" : "start"}
                sideOffset={isMobile ? 6 : 12}
                className={cn(
                  "overflow-hidden rounded-xl border bg-popover shadow-lg lg:mb-5",
                  isMobile
                    ? "mx-auto w-full min-w-[15rem] max-w-[15rem]"
                    : "w-60"
                )}
              >
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                  <Avatar className="size-9">
                    {user?.image && (
                      <AvatarImage
                        src={user.image}
                        alt={user?.username ?? "Avatar"}
                      />
                    )}
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-sm font-semibold">
                      {user?.username ?? "Usuário"}
                    </span>
                    {user?.email && (
                      <span className="text-xs text-muted-foreground">
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
                  className="cursor-pointer gap-2 px-4 py-2"
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
                  className="cursor-pointer gap-2 px-4 py-2"
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
