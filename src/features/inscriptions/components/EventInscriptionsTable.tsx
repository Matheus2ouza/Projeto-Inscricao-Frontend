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
import { cn } from "@/shared/lib/utils";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { Banknote, Calendar, FileText, UserCheck, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Event, Inscriptions } from "../types/InscriptionsTypes";
import { ComboboxPeriod } from "./ComboboxPeriod";

type EventInscriptionsTableProps = {
  event: Event | null;
  inscriptions: Inscriptions;
  page: number;
  pageCount: number;
  totalInscription: number;
  totalParticipant: number;
  totalDebt: number;
  limitTime: string;
  setLimitTime: (value: string) => void;
  setPage: (page: number) => void;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const getEventInitials = (eventName: string): string => {
  return eventName.trim().substring(0, 2).toUpperCase();
};

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

  let hash = 0;
  for (let i = 0; i < eventName.length; i++) {
    hash = eventName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
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

export function EventInscriptionsTable({
  event,
  inscriptions,
  page,
  pageCount,
  totalInscription,
  totalParticipant,
  totalDebt,
  limitTime,
  setLimitTime,
  setPage,
  loading,
  error,
  refetch,
}: EventInscriptionsTableProps) {
  const router = useRouter();
  const totalPages = pageCount || 1;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR");

  if (error) {
    return (
      <div className="border rounded-lg p-6 text-center space-y-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Button onClick={refetch} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {event ? (
        <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
          {/* Banner da Imagem do Evento */}
          <AspectRatio ratio={21 / 6} className="relative w-full">
            {event.image ? (
              <Image
                src={event.image}
                alt={event.name}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
                  getEventGradient(event.name),
                )}
              >
                <span className="text-7xl sm:text-8xl lg:text-9xl font-bold text-white drop-shadow-lg">
                  {getEventInitials(event.name)}
                </span>
              </div>
            )}
          </AspectRatio>

          {/* Informações do Evento */}
          <div className="bg-gradient-to-r from-muted to-muted/50 p-6 border-b">
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-1 uppercase">
                  {event.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      Total de Inscrições
                    </span>
                  </div>
                  <p className="text-lg font-bold">{totalInscription}</p>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <UserCheck className="h-4 w-4" />
                    <span className="text-xs font-medium">Participantes</span>
                  </div>
                  <p className="text-lg font-bold">{totalParticipant}</p>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Banknote className="h-4 w-4" />
                    <span className="text-xs font-medium">Débito total</span>
                  </div>
                  <p className="text-lg font-bold">
                    {getFormatCurrency(totalDebt)}
                  </p>
                </div>
              </div>

              {/* Filtro */}
              <div className="flex justify-start items-center gap-2">
                <div className="w-full sm:w-auto max-w-xs">
                  <ComboboxPeriod value={limitTime} onChange={setLimitTime} />
                </div>
                {limitTime !== "all" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setLimitTime("all")}
                    className="gap-2"
                    title="Limpar filtro"
                  >
                    <X className="h-4 w-4" />
                    Limpar Filtro
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Tabela */}
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
                  {inscriptions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-muted-foreground"
                      >
                        Nenhuma inscrição encontrada para os filtros
                        selecionados.
                      </td>
                    </tr>
                  ) : (
                    inscriptions.map((inscription) => (
                      <tr
                        key={inscription.id}
                        className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() =>
                          router.push(
                            `/user/MyInscriptions/${event.id}/${inscription.id}`,
                          )
                        }
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
                            className={cn(
                              "inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap",
                              getStatusColor(inscription.status),
                            )}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginação */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border-t bg-muted/20 sm:relative">
            {/* Informações de paginação - Esconder no desktop */}
            <div className="text-center sm:text-left text-xs sm:text-sm text-muted-foreground order-2 sm:order-1 sm:hidden">
              <span className="block sm:inline">
                Página {page} de {totalPages}
              </span>
              <span className="hidden sm:inline mx-2">-</span>
              <span className="block sm:inline">
                {inscriptions.length} de {totalInscription} inscrição
                {totalInscription !== 1 ? "ões" : ""}
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
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
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
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
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
                Mostrando {inscriptions.length} de {totalInscription} inscrição
                {totalInscription !== 1 ? "ões" : ""}
              </p>
              <p className="text-xs">
                Página {page} de {totalPages}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 text-center text-sm text-muted-foreground">
          Evento não encontrado ou ainda carregando.
        </div>
      )}
    </div>
  );
}
