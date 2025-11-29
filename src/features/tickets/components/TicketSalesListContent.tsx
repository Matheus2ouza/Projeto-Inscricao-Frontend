"use client";

import type { PaymentMethod } from "@/features/avulsa/types/avulsaTypes";
import type {
  TicketSaleListEvent,
  TicketSaleListItem,
} from "@/features/tickets/types/ticketListSalesTypes";
import type { StatusPayment } from "@/features/tickets/types/ticketSaleGroupTypes";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import {
  Download,
  Loader2,
  ReceiptText,
  RefreshCcw,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTicketSalesListActions } from "../hooks/useTicketSalesListActions";

type TicketSalesListContentProps = {
  event: TicketSaleListEvent | null;
  sales: TicketSaleListItem[];
  total: number;
  page: number;
  pageCount: number;
  isFetching: boolean;
  onRefresh: () => void | Promise<unknown>;
  onPageChange: (page: number) => void;
};

const statusDisplay: Record<
  StatusPayment,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pendente",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  UNDER_REVIEW: {
    label: "Em análise",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  PAID: {
    label: "Pago",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
};

const paymentMethodDisplay: Record<
  PaymentMethod,
  { label: string; className: string }
> = {
  DINHEIRO: {
    label: "Dinheiro",
    className: "text-emerald-700",
  },
  PIX: {
    label: "PIX",
    className: "text-blue-700",
  },
  CARTÃO: {
    label: "Cartão",
    className: "text-purple-700",
  },
};

export default function TicketSalesListContent({
  event,
  sales,
  total,
  page,
  pageCount,
  isFetching,
  onRefresh,
  onPageChange,
}: TicketSalesListContentProps) {
  const [eventImageLoading, setEventImageLoading] = useState(
    Boolean(event?.imageUrl)
  );
  const { handleDownloadSecondCopy, downloadingSaleId } =
    useTicketSalesListActions();

  useEffect(() => {
    setEventImageLoading(Boolean(event?.imageUrl));
  }, [event?.imageUrl]);

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
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const totalAmount = useMemo(
    () => sales.reduce((sum, sale) => sum + sale.totalValue, 0),
    [sales]
  );

  const totalRecords = event?.countTicketSales ?? total;
  const totalPaid = event?.countTicketSalesPaid ?? 0;
  const totalPending = event?.countTicketSalesPending ?? 0;

  const renderPagination = () => {
    if (pageCount <= 1) {
      return null;
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(page - 1)}
              href={page > 1 ? "#" : undefined}
              aria-disabled={page === 1}
              className={cn(page === 1 && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
          {Array.from({ length: pageCount }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={pageNumber === page}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(page + 1)}
              href={page < pageCount ? "#" : undefined}
              aria-disabled={page === pageCount}
              className={cn(
                page === pageCount && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Lista de vendas
              </p>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {event?.name ?? "Evento selecionado"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {totalRecords} registro{totalRecords === 1 ? "" : "s"}{" "}
                encontrado
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isFetching && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Atualizando...
                </div>
              )}
              <Button variant="outline" onClick={onRefresh} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Atualizar
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="w-full lg:w-1/3">
              {event?.imageUrl ? (
                <div className="relative w-full overflow-hidden rounded-2xl">
                  <AspectRatio ratio={16 / 9} className="w-full h-full">
                    {eventImageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}
                    <Image
                      src={event.imageUrl}
                      alt={event.name}
                      fill
                      sizes="(max-width: 768px) 100vw,
                      (max-width: 1200px) 60vw,
                      33vw"
                      className={cn(
                        "object-cover transition-opacity duration-300",
                        eventImageLoading ? "opacity-0" : "opacity-100"
                      )}
                      onLoadingComplete={() => setEventImageLoading(false)}
                      onError={() => setEventImageLoading(false)}
                      priority
                    />
                  </AspectRatio>
                </div>
              ) : (
                <div className="h-48 w-full rounded-2xl bg-muted flex items-center justify-center">
                  <Ticket className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Evento
                </p>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {event?.name ?? "Evento selecionado"}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border border-border/40 shadow-none">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Vendas encontradas
                    </p>
                    <p className="text-2xl font-bold">{totalRecords}</p>
                  </CardContent>
                </Card>
                <Card className="border border-border/40 shadow-none">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Valor listado
                    </p>
                    <p className="text-2xl font-bold">
                      {currencyFormatter.format(totalAmount)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Aprovadas
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalPaid}
              </p>
              <p className="text-xs text-muted-foreground">
                Vendas finalizadas
              </p>
            </div>
            <Ticket className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pendentes/Em análise
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalPending}
              </p>
              <p className="text-xs text-muted-foreground">
                Aguardando processamento
              </p>
            </div>
            <ReceiptText className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
      </div>

      {sales.length === 0 ? (
        <Card className="border border-dashed border-border/60 shadow-none">
          <CardContent className="py-12 text-center space-y-3">
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              Nenhuma venda encontrada
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Ainda não existem vendas registradas para este evento. Assim que
              novas solicitações forem recebidas, elas aparecerão aqui
              automaticamente.
            </p>
            <Button variant="outline" onClick={onRefresh} className="mt-2">
              Atualizar lista
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => {
            const ticketCount = sale.TicketSaleItem.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            const paymentDisplay =
              sale.payments?.paymentMethod &&
              paymentMethodDisplay[sale.payments.paymentMethod];

            const statusInfo =
              statusDisplay[sale.status] ?? statusDisplay.PENDING;

            return (
              <Card
                key={sale.id}
                className="border border-border/40 shadow-sm rounded-2xl overflow-hidden"
              >
                <CardHeader className="space-y-3">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wide">
                        Comprador
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {sale.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {sale.email}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-3 py-1 text-xs font-semibold rounded-full border",
                        statusInfo.className
                      )}
                    >
                      {statusInfo.label}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {sale.phone && (
                      <span className="font-medium">
                        Telefone:{" "}
                        <span className="font-normal">{sale.phone}</span>
                      </span>
                    )}
                    {sale.payments?.createdAt && (
                      <span className="font-medium">
                        Registrado em:{" "}
                        <span className="font-normal">
                          {dateFormatter.format(
                            new Date(sale.payments.createdAt)
                          )}
                        </span>
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border bg-card p-4">
                      <p className="text-xs text-muted-foreground uppercase">
                        Valor total
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {currencyFormatter.format(sale.totalValue)}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <p className="text-xs text-muted-foreground uppercase">
                        Quantidade
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {ticketCount} ticket{ticketCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <p className="text-xs text-muted-foreground uppercase">
                        Pagamento
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {paymentDisplay ? (
                          <span className={paymentDisplay.className}>
                            {paymentDisplay.label}
                          </span>
                        ) : (
                          "-"
                        )}
                      </p>
                      {sale.totalValue && (
                        <p className="text-xs text-muted-foreground">
                          Valor informado:{" "}
                          {currencyFormatter.format(sale.totalValue)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Tickets desta venda
                    </p>
                    {sale.TicketSaleItem.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        Nenhum ticket vinculado a esta venda.
                      </div>
                    ) : (
                      <div className="rounded-xl border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Ticket</TableHead>
                              <TableHead className="text-right">
                                Quantidade
                              </TableHead>
                              <TableHead className="text-right">
                                Valor unitário
                              </TableHead>
                              <TableHead className="text-right">
                                Total
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sale.TicketSaleItem.map((item) => (
                              <TableRow key={`${sale.id}-${item.id}`}>
                                <TableCell className="font-medium">
                                  {item.ticketName}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.quantity}
                                </TableCell>
                                <TableCell className="text-right">
                                  {currencyFormatter.format(
                                    item.pricePerTicket
                                  )}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {currencyFormatter.format(item.totalValue)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    {sale.status === "PAID" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto gap-2"
                        onClick={() => handleDownloadSecondCopy(sale.id)}
                        disabled={downloadingSaleId === sale.id}
                      >
                        {downloadingSaleId === sale.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Gerando PDF...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Segunda via (PDF)
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {renderPagination()}
    </div>
  );
}
