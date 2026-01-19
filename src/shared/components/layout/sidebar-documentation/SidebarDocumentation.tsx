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
import { useCurrentUser } from "@/shared/context/user-context";
import { cn } from "@/shared/lib/utils";
import { ChevronRight, ClipboardList, Home, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SidebarDocumentation({
  children,
}: {
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [gettingStartedOpen, setGettingStartedOpen] = useState(false);
  const [inscriptionOpen, setInscriptionOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);

  const handleBackToHome = () => {
    router.replace(`/${user.role.toLowerCase()}/home`);
  };

  const sidebarStyle = {
    "--sidebar-width": "18rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex w-full">
        <Sidebar className="bg-sidebar">
          <SidebarHeader className="flex-row items-center justify-center gap-2 border-b border-sidebar-border py-4">
            <Logo className="h-10 w-10" showTitle={false} />
          </SidebarHeader>

          <SidebarContent className="px-2 pb-4">
            <SidebarGroup className="gap-1">
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Home */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        onClick={handleBackToHome}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <Home className="size-4" />
                        Voltar à página inicial
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Introdução */}
                  <SidebarMenuItem>
                    <Collapsible
                      open={gettingStartedOpen}
                      onOpenChange={setGettingStartedOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                          <span className="flex items-center gap-1">
                            <Rocket className="size-4" />
                            Introdução
                          </span>
                          <ChevronRight
                            className={cn(
                              "size-4 text-muted-foreground transition-transform",
                              gettingStartedOpen && "rotate-90",
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/documentation"
                              className="gap-1"
                            >
                              <span>Introdução</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/documentation/getting-started"
                              className="gap-1"
                            >
                              <span>Comece por aqui</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>

                  {/* Inscrição */}
                  <SidebarMenuItem>
                    <Collapsible
                      open={inscriptionOpen}
                      onOpenChange={setInscriptionOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                          <span className="flex items-center gap-1">
                            <ClipboardList className="size-4" />
                            Inscrição
                          </span>
                          <ChevronRight
                            className={cn(
                              "size-4 text-muted-foreground transition-transform",
                              inscriptionOpen && "rotate-90",
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/documentation/inscription/introduction"
                              className="gap-1"
                            >
                              <span>Instrodução</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/documentation/inscription/individual"
                              className="gap-1"
                            >
                              <span>Inscrição Individual</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/documentation/inscription/in-group"
                              className="gap-1"
                            >
                              <span>Inscrição em Grupo</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/documentation/inscription/my-inscriptions"
                              className="gap-1"
                            >
                              <span>Minhas Inscrições</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>

                  {/* Pagamento */}
                  <SidebarMenuItem>
                    <Collapsible
                      open={paymentOpen}
                      onOpenChange={setPaymentOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                          <span className="flex items-center gap-1">
                            <ClipboardList className="size-4" />
                            Pagamento
                          </span>
                          <ChevronRight
                            className={cn(
                              "size-4 text-muted-foreground transition-transform",
                              paymentOpen && "rotate-90",
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/documentation/payment/register"
                              className="gap-1"
                            >
                              <span>Registro de Pagamento</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/documentation/payment/list"
                              className="gap-1"
                            >
                              <span>Listar Pagamentos</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>

                  {/* Membro */}
                  <SidebarMenuItem>
                    <Collapsible
                      open={membershipOpen}
                      onOpenChange={setMembershipOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                          <span className="flex items-center gap-1">
                            <ClipboardList className="size-4" />
                            Membro
                          </span>
                          <ChevronRight
                            className={cn(
                              "size-4 text-muted-foreground transition-transform",
                              membershipOpen && "rotate-90",
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/documentation/members/list"
                              className="gap-1"
                            >
                              <span>Listar Membros</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                        <SidebarMenuSub className="mt-1 border-0 pl-6">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              href="/documentation/members/register"
                              className="gap-1"
                            >
                              <span>Registro de Membro</span>
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
        </Sidebar>
        <div className="flex-1 flex flex-col min-h-screen">{children}</div>
      </div>
    </SidebarProvider>
  );
}
