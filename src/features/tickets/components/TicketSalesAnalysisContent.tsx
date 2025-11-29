"use client";

import ImageViewerDialog, {
  ImageViewerDownloadExtension,
} from "@/shared/components/ImageViewerDialog";
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
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { getFormatPaymentMethod } from "@/shared/utils/getFormatPaymentMethod";
import {
  getStatusColor,
  getStatusInscriptionText,
} from "@/shared/utils/getStatusColor";
import {
  DollarSign,
  Loader2,
  Mail,
  Phone,
  RefreshCcw,
  Ticket,
  User,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTicketSalesActions } from "../hooks/useTicketSalesActions";
import type {
  TicketSaleAnalysis,
  TicketSalesAnalysisEvent,
} from "../types/ticketSalesAnalysisTypes";

type TicketSalesAnalysisContentProps = {
  event: TicketSalesAnalysisEvent | null;
  ticketSales: TicketSaleAnalysis[];
  total: number;
  isFetching: boolean;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
};

export default function TicketSalesAnalysisContent({
  event,
  ticketSales,
  total,
  isFetching,
  page,
  pageCount,
  onPageChange,
  onRefresh,
}: TicketSalesAnalysisContentProps) {
  const [imageViewerData, setImageViewerData] = useState<{
    url: string;
    title?: string;
    description?: string;
    downloadFileName?: string;
    downloadFileExtension?: ImageViewerDownloadExtension;
  } | null>(null);
  const [eventImageLoading, setEventImageLoading] = useState(
    Boolean(event?.imageUrl)
  );

  const {
    handleApproveSale,
    handleCancelSale,
    approvingSaleId,
    cancellingSaleId,
    isApproving,
    isCancelling,
  } = useTicketSalesActions({
    onSuccess: onRefresh,
  });

  useEffect(() => {
    setEventImageLoading(Boolean(event?.imageUrl));
  }, [event?.imageUrl]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }),
    []
  );

  const formattedTotalRevenue = useMemo(() => {
    return currencyFormatter.format(
      ticketSales.reduce((acc, sale) => acc + sale.totalValue, 0)
    );
  }, [currencyFormatter, ticketSales]);

  if (!event) {
    return (
      <div className="text-center text-muted-foreground py-12 border rounded-2xl">
        Nenhuma informação de vendas encontrada para este evento.
      </div>
    );
  }

  const handlePreviousPage = () => {
    onPageChange(Math.max(1, page - 1));
  };

  const handleNextPage = () => {
    onPageChange(Math.min(pageCount, page + 1));
  };

  const handleOpenImageViewer = (
    url: string,
    title?: string,
    description?: string,
    downloadFileName?: string,
    downloadFileExtension?: ImageViewerDownloadExtension
  ) => {
    setImageViewerData({
      url,
      title,
      description,
      downloadFileName,
      downloadFileExtension,
    });
  };

  const handleCloseImageViewer = () => {
    setImageViewerData(null);
  };
  const shouldShowTicketSkeletons = isFetching && ticketSales.length > 0;

  const renderTicketSkeletonCards = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={`ticket-skeleton-${index}`}
          className="border border-border/40 shadow-sm rounded-2xl"
        >
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 w-full">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((__, infoIndex) => (
                <div key={infoIndex} className="space-y-2">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-4 space-y-3">
              {[...Array(2)].map((__, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-4 gap-4 items-center"
                >
                  {Array.from({ length: 4 }).map((___, cellIndex) => (
                    <Skeleton key={cellIndex} className="h-3 w-full" />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex w-full justify-end">
            <Button
              type="button"
              onClick={onRefresh}
              disabled={isFetching}
              className="w-full sm:w-auto"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Atualizar dados
            </Button>
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="w-full lg:w-1/3 relative">
              {event.imageUrl ? (
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
                      loading="eager"
                      sizes="(max-width: 768px) 100vw,
                      (max-width: 1200px) 60vw,
                      33vw"
                      className={cn(
                        "object-cover transition-opacity duration-300",
                        eventImageLoading ? "opacity-0" : "opacity-100"
                      )}
                      onLoadingComplete={() => setEventImageLoading(false)}
                      onError={() => setEventImageLoading(false)}
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
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  Evento
                </p>
                <h2 className="text-2xl font-semibold">{event.name}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border border-border/40 shadow-none">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Vendas encontradas
                    </p>
                    <p className="text-2xl font-bold">{total}</p>
                  </CardContent>
                </Card>
                <Card className="border border-border/40 shadow-none">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Valor nesta página
                    </p>
                    <p className="text-2xl font-bold">
                      {formattedTotalRevenue}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {shouldShowTicketSkeletons ? (
        renderTicketSkeletonCards()
      ) : ticketSales.length === 0 ? (
        <div className="border rounded-2xl py-12 text-center text-muted-foreground">
          Nenhuma venda de ticket foi registrada até o momento.
        </div>
      ) : (
        <div className="space-y-4">
          {ticketSales.map((sale) => {
            const payment = sale.payments;
            const paymentDisplay = getFormatPaymentMethod(
              payment?.paymentMethod
            );
            const paymentValue = payment?.value ?? 0;

            return (
              <Card
                key={sale.id}
                className="border border-border/50 shadow-sm rounded-2xl"
              >
                <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{sale.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Venda #{sale.id.slice(-6)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusColor(sale.status)} px-3 py-1 text-xs rounded-full border`}
                  >
                    {getStatusInscriptionText(sale.status)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wide">
                          E-mail
                        </span>
                      </div>
                      <p className="truncate text-base font-medium uppercase">
                        {sale.email || "Sem e-mail"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wide">
                          Telefone
                        </span>
                      </div>
                      <p className="text-base font-medium">
                        {sale.phone || "Sem telefone"}
                      </p>
                    </div>
                    <div className="text-right sm:text-left space-y-1">
                      <div className="flex items-center gap-2 justify-end sm:justify-start text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <p className="text-xs uppercase tracking-wide">Total</p>
                      </div>
                      <p className="text-base font-semibold">
                        {currencyFormatter.format(sale.totalValue)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border p-4 bg-muted/30 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Valor pago
                        </p>
                        <p className="text-base font-semibold">
                          {currencyFormatter.format(paymentValue)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Método</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "inline-flex w-fit px-3 py-1 text-xs rounded-full border",
                            paymentDisplay.className
                          )}
                        >
                          {paymentDisplay.label}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Data/Hora
                        </p>
                        <p className="text-base font-semibold">
                          {payment.createdAt
                            ? new Date(payment.createdAt).toLocaleString(
                                "pt-BR"
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Itens adquiridos
                    </p>
                    {sale.TicketSaleItem.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        Nenhum ticket associado a esta venda.
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
                              <TableRow key={item.id}>
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
                    {sale.status === "UNDER_REVIEW" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApproveSale(sale)}
                          disabled={approvingSaleId === sale.id && isApproving}
                        >
                          {approvingSaleId === sale.id && isApproving && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          {isApproving ? "Aprovando..." : "Aprovar venda"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelSale(sale)}
                          disabled={
                            cancellingSaleId === sale.id && isCancelling
                          }
                        >
                          {cancellingSaleId === sale.id && isCancelling && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          {isCancelling ? "Cancelando..." : "Cancelar venda"}
                        </Button>
                      </>
                    )}
                    {sale.payments?.imageUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenImageViewer(
                            sale.payments!.imageUrl,
                            `Comprovante de pagamento · ${sale.name}`,
                            `Pagamento via ${paymentDisplay.label} no valor de ${currencyFormatter.format(paymentValue)}`,
                            `comprovante_pagamento_${paymentValue}_${sale.id}`,
                            ImageViewerDownloadExtension.JPG
                          )
                        }
                      >
                        Ver comprovante
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {pageCount > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
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
                    isActive={pageNumber === page}
                    href="#"
                    onClick={() => onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                href={page < pageCount ? "#" : undefined}
                aria-disabled={page === pageCount}
                className={cn(
                  page === pageCount && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {imageViewerData && (
        <ImageViewerDialog
          isOpen={Boolean(imageViewerData)}
          onClose={handleCloseImageViewer}
          imageUrl={imageViewerData.url}
          title={imageViewerData.title}
          description={imageViewerData.description}
          downloadFileName={imageViewerData.downloadFileName}
          downloadFileExtension={imageViewerData.downloadFileExtension}
        />
      )}
    </div>
  );
}
