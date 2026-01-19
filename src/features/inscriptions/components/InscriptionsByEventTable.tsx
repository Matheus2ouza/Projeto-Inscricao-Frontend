"use client";

import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Button } from "@/shared/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import {
  BanknoteArrowDown,
  Calendar,
  Eye,
  FileText,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Events } from "../types/InscriptionsTypes";

interface MyInscriptionsTableProps {
  events: Events;
  total: number;
  page: number;
  pageCount: number;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

const getEventInitials = (eventName: string): string => {
  return eventName.trim().substring(0, 2).toUpperCase();
};

// Função para gerar gradiente baseado no nome do evento (para consistência)
const getEventGradient = (eventName: string): string => {
  const gradients = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-blue-500",
    "from-yellow-500 to-orange-500",
    "from-pink-500 to-rose-500",
    "from-violet-500 to-purple-500",
    "from-cyan-500 to-teal-500",
    "from-rose-500 to-pink-500",
    "from-amber-500 to-yellow-500",
    "from-lime-500 to-green-500",
    "from-sky-500 to-blue-500",
    "from-fuchsia-500 to-pink-500",
    "from-emerald-500 to-teal-500",
  ];

  // Gerar índice baseado no nome do evento para consistência
  let hash = 0;
  for (let i = 0; i < eventName.length; i++) {
    hash = eventName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

export default function InscriptionsByEventTable({
  events,
  total,
  page,
  pageCount,
  error,
  setPage,
  refetch,
}: MyInscriptionsTableProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Lista de Eventos */}
      <div className="space-y-6">
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum evento encontrado.
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg overflow-hidden bg-card shadow-sm"
            >
              {/* Cabeçalho do Evento */}
              <div className="bg-gradient-to-r from-muted to-muted/50 p-6 border-b">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Imagem ou Gradiente com Sigla do Evento */}
                  <div className="w-full sm:w-32 flex-shrink-0">
                    <AspectRatio
                      ratio={5 / 4}
                      className="rounded-lg overflow-hidden shadow-md relative"
                    >
                      {event.image ? (
                        <Image
                          src={event.image}
                          alt={event.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${getEventGradient(
                            event.name,
                          )} flex items-center justify-center`}
                        >
                          <span className="lg:text-7xl text-8xl sm:text-7xl font-bold text-white drop-shadow-lg">
                            {getEventInitials(event.name)}
                          </span>
                        </div>
                      )}
                    </AspectRatio>
                  </div>

                  {/* Informações do Evento */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1 uppercase">
                        {event.name}
                      </h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(event.startDate)} -{" "}
                            {formatDate(event.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cards de estatísticas */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-background/50 rounded-lg p-3 border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            Participantes
                          </span>
                        </div>
                        <p className="text-lg font-bold">
                          {event.totalParticipant}
                        </p>
                      </div>

                      <div className="bg-background/50 rounded-lg p-3 border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <FileText className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            Inscrições
                          </span>
                        </div>
                        <p className="text-lg font-bold">
                          {event.inscriptions.length}
                        </p>
                      </div>

                      <div className="bg-background/50 rounded-lg p-3 border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <BanknoteArrowDown className="h-4 w-4" />
                          <span className="text-xs font-medium">Débito</span>
                        </div>
                        <p className="text-lg font-bold">
                          {getFormatCurrency(event.totalDebt)}
                        </p>
                      </div>

                      <div className="bg-background/50 rounded-lg p-3 border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <span className="text-xs font-medium">
                            Valor Total
                          </span>
                        </div>
                        <p className="text-lg font-bold">
                          {getFormatCurrency(
                            event.inscriptions.reduce(
                              (sum, ins) => sum + ins.totalValue,
                              0,
                            ),
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabela de Inscrições do Evento */}
              {event.inscriptions.length > 0 ? (
                <div className="relative">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <colgroup>
                        <col className="w-[50%]" />
                        <col className="w-[25%]" />
                        <col className="w-[25%]" />
                      </colgroup>
                      <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-xs sm:text-sm">
                            Responsável
                          </th>
                          <th className="px-4 py-3 text-center font-semibold text-xs sm:text-sm">
                            Valor
                          </th>
                          <th className="px-4 py-3 text-center font-semibold text-xs sm:text-sm">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {event.inscriptions.map((inscription) => (
                          <tr
                            key={inscription.id}
                            className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => {
                              router.push(
                                `/user/MyInscriptions/${event.id}/${inscription.id}`,
                              );
                            }}
                          >
                            <td className="px-4 py-3 text-xs sm:text-sm">
                              <span className="font-medium">
                                {inscription.responsible}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center font-medium text-xs sm:text-sm">
                              {getFormatCurrency(inscription.totalValue)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusColor(
                                  inscription.status,
                                )}`}
                              >
                                {inscription.status === "PENDING"
                                  ? "PENDENTE"
                                  : inscription.status === "UNDER_REVIEW"
                                    ? "EM ANÁLISE"
                                    : inscription.status === "PAID"
                                      ? "PAGO"
                                      : inscription.status === "CANCELLED"
                                        ? "CANCELADO"
                                        : inscription.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Botão Visualizar Todas as Inscrições */}
                  <div className="p-4 border-t bg-muted/20 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.push(`/user/MyInscriptions/${event.id}`);
                      }}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Visualizar todas as Inscrições
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Nenhuma inscrição encontrada para este evento.
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6 sm:relative">
        {/* Informações de paginação - Esconder no desktop */}
        <div className="text-center sm:text-left text-xs sm:text-sm text-muted-foreground order-2 sm:order-1 sm:hidden">
          <span className="block sm:inline">
            Página {page} de {pageCount}
          </span>
          <span className="hidden sm:inline mx-2">-</span>
          <span className="block sm:inline">
            {events.length} de {total} evento(s)
          </span>
        </div>

        {/* Controles de paginação - Centralizado em todas as telas */}
        <div className="order-1 sm:order-1 w-full flex justify-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(Math.max(1, page - 1))}
                  href="#"
                  className="text-xs"
                />
              </PaginationItem>
              {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    href="#"
                    onClick={() => setPage(i + 1)}
                    className="text-xs"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(Math.min(pageCount, page + 1))}
                  href="#"
                  className="text-xs"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Informações de paginação - Mostrar apenas no desktop */}
        <div className="hidden sm:flex sm:flex-col sm:min-w-[14rem] text-sm text-muted-foreground order-3 text-right sm:ml-auto">
          <p className="mb-1">
            Mostrando {events.length} de {total} evento{total !== 1 ? "s" : ""}
          </p>
          <p className="text-xs">
            Página {page} de {pageCount}
          </p>
        </div>
      </div>
    </div>
  );
}
