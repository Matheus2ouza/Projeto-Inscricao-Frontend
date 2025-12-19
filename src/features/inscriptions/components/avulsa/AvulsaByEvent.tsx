"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useMemo } from "react";
import type { ListAvulsaResponse } from "../../types/avulsa/avulsaTypes";

const formatStatusLabel = (status: string) => {
  const normalized = status?.toLowerCase();
  switch (normalized) {
    case "paid":
      return "Pago";
    case "pending":
      return "Pendente";
    case "cancelled":
      return "Cancelado";
    case "under_review":
      return "Em análise";
    default:
      return status;
  }
};

const statusBadgeVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  const normalized = status?.toLowerCase();
  switch (normalized) {
    case "paid":
      return "default";
    case "pending":
      return "secondary";
    case "cancelled":
      return "destructive";
    case "under_review":
      return "outline";
    default:
      return "outline";
  }
};

interface AvulsaByEventProps {
  data?: ListAvulsaResponse;
  isLoading: boolean;
  error: string | null;
  page: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onCreate: () => void;
  onViewDetails: (registrationId: string) => void;
}

export default function AvulsaByEvent({
  data,
  isLoading,
  error,
  page,
  pageCount,
  pageSize,
  onPageChange,
  onCreate,
  onViewDetails,
}: AvulsaByEventProps) {
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    []
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    []
  );

  const totals = data?.totals;
  const formatCreatedAt = (value: string) => {
    const createdAtDate = new Date(value);
    if (Number.isNaN(createdAtDate.getTime())) {
      return null;
    }
    return dateFormatter.format(createdAtDate);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-end gap-4 flex-wrap">
          <Button onClick={onCreate}>Nova Inscrição Avulsa</Button>
        </div>

        {error && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center text-red-600">
              {error}
            </CardContent>
          </Card>
        )}

        {totals && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Geral</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {currencyFormatter.format(totals.totalGeral ?? 0)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Dinheiro</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {currencyFormatter.format(totals.totalDinheiro ?? 0)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">PIX</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {currencyFormatter.format(totals.totalPix ?? 0)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Cartão</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {currencyFormatter.format(totals.totalCartao ?? 0)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-2 w-1/2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data && data.registrations.length > 0 ? (
          <div className="space-y-4">
            {data.registrations.map((registration) => (
              <Card key={registration.id} className="border-0 shadow-sm">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {registration.responsible}
                      </h3>
                      <Badge variant={statusBadgeVariant(registration.status)}>
                        {formatStatusLabel(registration.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currencyFormatter.format(registration.totalValue ?? 0)}
                      {registration.phone ? ` • ${registration.phone}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {`Criado em ${
                        formatCreatedAt(registration.createdAt) ?? "-"
                      }`}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => onViewDetails(registration.id)}
                  >
                    Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}

            {pageCount > 1 && (
              <div className="flex justify-center pt-2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        href="#"
                        className={
                          page === 1 ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: pageCount }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={page === i + 1}
                          href="#"
                          onClick={() => onPageChange(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          onPageChange(Math.min(pageCount, page + 1))
                        }
                        href="#"
                        className={
                          page === pageCount
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            Nenhuma inscrição avulsa encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
