"use client";

import ImageViewerDialog from "@/shared/components/ImageViewerDialog";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
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
import { getConvertStatusPayment } from "@/shared/utils/getConvertStatus";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import { ImageOff, ZoomIn } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { PaymentsList } from "../types/listPayments.types";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value ?? 0);

const formatDayLabel = (isoDay: string) => {
  const date = new Date(isoDay);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatHour = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

interface PaymentsListTableProps {
  payments: PaymentsList;
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onViewDetails: (paymentsInscriptionId: string) => void;
}

export default function PaymentsListTable({
  payments,
  total,
  page,
  pageCount,
  onPageChange,
  onViewDetails,
}: PaymentsListTableProps) {
  const totalValue = payments.reduce((sum, payment) => sum + payment.value, 0);
  const approvedPayments = payments.filter(
    (payment) => !!payment.approvedBy
  ).length;
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImage, setViewerImage] = useState<{
    url: string;
    title?: string;
    description?: string;
  } | null>(null);

  const handleOpenViewer = (payment: PaymentsList[number]) => {
    if (!payment.imageUrl) return;
    setViewerImage({
      url: payment.imageUrl,
      title: `Comprovante ${payment.accountName ?? "conta"}`,
      description: `Inscrição ${payment.accountName} • ${formatHour(
        payment.createdAt
      )}`,
    });
    setViewerOpen(true);
  };

  if (payments.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
            <span className="text-3xl">💳</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Nenhum pagamento encontrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Ainda não existem comprovantes para este evento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const paymentsByDay = new Map<string, PaymentsList>();
  const dayOrder: string[] = [];

  payments.forEach((payment) => {
    const isoDay = new Date(payment.createdAt).toISOString().split("T")[0];

    if (!paymentsByDay.has(isoDay)) {
      paymentsByDay.set(isoDay, []);
      dayOrder.push(isoDay);
    }

    paymentsByDay.get(isoDay)?.push(payment);
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pagamentos</p>
              <p className="text-2xl font-semibold">{total}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-lg">⇄</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valor listado</p>
              <p className="text-2xl font-semibold">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <span className="text-green-500 text-lg">R$</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Aprovados nesta página
              </p>
              <p className="text-2xl font-semibold">{approvedPayments}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <span className="text-blue-500 text-lg">✓</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {dayOrder.map((isoDay) => {
        const dayPayments = paymentsByDay.get(isoDay) ?? [];

        return (
          <Card key={isoDay} className="border-0 shadow-lg">
            <CardHeader className="border-b border-dashed">
              <div>
                <CardTitle className="text-xl">
                  {formatDayLabel(isoDay)}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {dayPayments.length} comprovante
                  {dayPayments.length === 1 ? "" : "s"} recebidos
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-2">
                  {dayPayments.map((payment) => (
                    <article
                      key={payment.id}
                      className="flex min-w-[260px] flex-col gap-3 rounded-2xl border border-muted/30 bg-card/40 p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <span className="text-base text-foreground font-semibold">
                          {payment.accountName ?? "Conta não informada"}
                        </span>
                        <span>{formatHour(payment.createdAt)}</span>
                      </div>
                      <AspectRatio
                        ratio={4 / 5}
                        className={`relative min-h-[170px] min-w-[220px] overflow-hidden rounded-xl border border-muted/30 bg-muted/60 ${
                          payment.imageUrl ? "group cursor-pointer" : ""
                        }`}
                      >
                        {payment.imageUrl ? (
                          <button
                            type="button"
                            className="absolute inset-0"
                            onClick={() => handleOpenViewer(payment)}
                            aria-label="Ver comprovante"
                          >
                            <img
                              src={payment.imageUrl}
                              alt={`Comprovante ${payment.accountName ?? ""}`}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
                            <ImageOff className="h-6 w-6" />
                            Sem imagem enviada
                          </div>
                        )}
                        {payment.imageUrl && (
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                            <ZoomIn className="w-8 h-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        )}
                        <span
                          className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getStatusColor(
                            payment.status ?? "pending"
                          )}`}
                        >
                          {getConvertStatusPayment(payment.status)}
                        </span>
                      </AspectRatio>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Valor</span>
                          <span className="font-semibold text-foreground">
                            {formatCurrency(payment.value)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Aprovado por
                          </span>
                          <span className="font-medium text-foreground">
                            {payment.approvedBy ?? "Pendente"}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(payment.id)}
                      >
                        Detalhes
                      </Button>
                    </article>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {pageCount > 1 && (
        <div className="border-t border-muted/40 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Página {page} de {pageCount}
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={page > 1 ? "#" : undefined}
                    onClick={() => page > 1 && onPageChange(page - 1)}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: pageCount }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      isActive={page === index + 1}
                      onClick={() => onPageChange(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href={page < pageCount ? "#" : undefined}
                    onClick={() => page < pageCount && onPageChange(page + 1)}
                    className={
                      page === pageCount ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
      <ImageViewerDialog
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        imageUrl={viewerImage?.url ?? ""}
        title={viewerImage?.title}
        description={viewerImage?.description}
      />
    </div>
  );
}
