"use client";

import {
  BookOpen,
  Calendar,
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  href: string;
  items?: NavItem[];
}

export default function SidebarNavigation() {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "getting-started",
  ]);

  const navItems: NavItem[] = [
    {
      id: "getting-started",
      title: "Introdução",
      icon: <Home className="h-4 w-4" />,
      href: "#getting-started",
      items: [
        {
          id: "welcome",
          title: "Bem-vindo",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#welcome",
        },
        {
          id: "system-overview",
          title: "Visão Geral",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#system-overview",
        },
        {
          id: "requirements",
          title: "Requisitos",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#requirements",
        },
      ],
    },
    {
      id: "members",
      title: "Gestão de Membros",
      icon: <Users className="h-4 w-4" />,
      href: "#members",
      items: [
        {
          id: "create-member",
          title: "Criar Membro",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#create-member",
        },
        {
          id: "edit-member",
          title: "Editar Membro",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#edit-member",
        },
        {
          id: "search-member",
          title: "Buscar Membro",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#search-member",
        },
      ],
    },
    {
      id: "events",
      title: "Eventos e Inscrições",
      icon: <Calendar className="h-4 w-4" />,
      href: "#events",
      items: [
        {
          id: "create-event",
          title: "Criar Evento",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#create-event",
        },
        {
          id: "individual-inscription",
          title: "Inscrição Individual",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#individual-inscription",
        },
        {
          id: "group-inscription",
          title: "Inscrição em Grupo",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#group-inscription",
        },
        {
          id: "view-inscriptions",
          title: "Visualizar Inscrições",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#view-inscriptions",
        },
      ],
    },
    {
      id: "payments",
      title: "Sistema de Pagamentos",
      icon: <CreditCard className="h-4 w-4" />,
      href: "#payments",
      items: [
        {
          id: "register-payment",
          title: "Registrar Pagamento",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#register-payment",
        },
        {
          id: "payment-proof",
          title: "Anexar Comprovante",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#payment-proof",
        },
        {
          id: "payment-status",
          title: "Status de Pagamento",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#payment-status",
        },
      ],
    },
    {
      id: "reports",
      title: "Relatórios",
      icon: <FileText className="h-4 w-4" />,
      href: "#reports",
      items: [
        {
          id: "inscriptions-report",
          title: "Relatório de Inscrições",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#inscriptions-report",
        },
        {
          id: "payments-report",
          title: "Relatório de Pagamentos",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#payments-report",
        },
        {
          id: "members-report",
          title: "Relatório de Membros",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#members-report",
        },
      ],
    },
    {
      id: "settings",
      title: "Configurações",
      icon: <Settings className="h-4 w-4" />,
      href: "#settings",
      items: [
        {
          id: "profile",
          title: "Perfil do Usuário",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#profile",
        },
        {
          id: "account",
          title: "Conta",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#account",
        },
        {
          id: "notifications",
          title: "Notificações",
          icon: <ChevronRight className="h-3 w-3" />,
          href: "#notifications",
        },
      ],
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-full w-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Documentação
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Navegue pelos tópicos abaixo
        </p>
      </div>

      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <div key={item.id} className="space-y-1">
            <button
              onClick={() => toggleSection(item.id)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-600 dark:text-gray-400">
                  {item.icon}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.title}
                </span>
              </div>
              {item.items && (
                <ChevronRight
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    expandedSections.includes(item.id) ? "rotate-90" : ""
                  }`}
                />
              )}
            </button>

            {item.items && expandedSections.includes(item.id) && (
              <div className="ml-8 space-y-1">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.id}
                    href={subItem.href}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                  >
                    <div className="text-gray-500 dark:text-gray-500">
                      {subItem.icon}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {subItem.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 mt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
            Em desenvolvimento
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
            Novos tópicos sendo adicionados diariamente
          </p>
        </div>
      </div>
    </div>
  );
}
