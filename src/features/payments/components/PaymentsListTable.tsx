"use client";

import ImageViewerDialog from "@/shared/components/ImageViewerDialog";
import { Button } from "@/shared/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { getConvertStatusPayment } from "@/shared/utils/getConvertStatus";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import { Eye, Info } from "lucide-react";
import { useState } from "react";
import type {
  PaymentGroup,
  PaymentListItem,
} from "../types/listPayments.types";

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

const formatHour = (value: Date | string) =>
  new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

interface PaymentsListTableProps {
  groups: PaymentGroup[];
  totalDates: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onViewDetails: (paymentsInscriptionId: string) => void;
}

export default function PaymentsListTable({
  groups,
  totalDates,
  page,
  pageCount,
  onPageChange,
  onViewDetails,
}: PaymentsListTableProps) {
  const allPayments = groups.flatMap((group) => group.payments);
  const totalPayments = allPayments.length;
  const totalValue = allPayments.reduce(
    (sum, payment) => sum + payment.value,
    0
  );
  const approvedPayments = allPayments.filter(
    (payment) => !!payment.approvedBy
  ).length;
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImage, setViewerImage] = useState<{
    url: string;
    title?: string;
    description?: string;
  } | null>(null);

  const handleOpenViewer = (payment: PaymentListItem) => {
    if (!payment.imageUrl) return;
    setViewerImage({
      url: payment.imageUrl,
      title: `Comprovante ${payment.accountName ?? "conta"}`,
      description: `Inscrição ${payment.accountName} • ${formatHour(payment.createdAt)}`,
    });
    setViewerOpen(true);
  };

  if (totalPayments === 0) {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pagamentos</p>
              <p className="text-2xl font-semibold">{totalPayments}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalDates} {totalDates === 1 ? "dia" : "dias"} com
                comprovantes
              </p>
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

      {groups.map((group, index) => (
        <Card key={`${group.date}-${index}`} className="border-0 shadow-lg">
          <CardHeader className="border-b border-dashed">
            <div>
              <CardTitle className="text-xl">
                {formatDayLabel(group.date)}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {group.payments.length} comprovante
                {group.payments.length === 1 ? "" : "s"} recebidos
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="overflow-x-auto">
              <Table className="min-w-full table-fixed divide-y divide-muted/20">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Conta</TableHead>
                    <TableHead className="text-left">Hora</TableHead>
                    <TableHead className="text-left">Status</TableHead>
                    <TableHead className="text-left">Valor</TableHead>
                    <TableHead className="text-left">Aprovado por</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-semibold text-left">
                        {payment.accountName ?? "Conta não informada"}
                      </TableCell>
                      <TableCell className="text-left">
                        {formatHour(payment.createdAt)}
                      </TableCell>
                      <TableCell className="text-left">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getStatusColor(
                            payment.status ?? "pending"
                          )}`}
                        >
                          {getConvertStatusPayment(payment.status)}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-left">
                        {formatCurrency(payment.value)}
                      </TableCell>
                      <TableCell
                        className={
                          payment.approvedBy
                            ? "text-muted-foreground italic"
                            : "text-muted-foreground"
                        }
                      >
                        {payment.approvedBy ?? "Não informado"}
                      </TableCell>
                      <TableCell className="text-center flex items-center justify-center gap-2">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-6 w-6 rounded-lg bg-emerald-500 text-white p-0 flex items-center justify-center"
                          onClick={() => onViewDetails(payment.id)}
                          aria-label="Detalhes"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        {payment.imageUrl && (
                          <Button
                            variant="default"
                            size="sm"
                            className="h-6 w-6 rounded-lg bg-blue-500 text-white p-0 flex items-center justify-center"
                            onClick={() => handleOpenViewer(payment)}
                            aria-label="Ver comprovante"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}

      {pageCount > 1 && (
        <div className="border-t border-muted/40 pt-6">
          <div className="flex flex-col items-center gap-4">
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
                {(() => {
                  const windowSize = 3;
                  if (pageCount <= windowSize) {
                    return Array.from({ length: pageCount }, (_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          isActive={page === index + 1}
                          onClick={() => onPageChange(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ));
                  }

                  const maxStart = Math.max(1, pageCount - windowSize + 1);
                  const startPage = Math.min(page, maxStart);
                  const endPage = Math.min(
                    startPage + windowSize - 1,
                    pageCount
                  );

                  return Array.from(
                    { length: endPage - startPage + 1 },
                    (_, index) => {
                      const pageNumber = startPage + index;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            isActive={page === pageNumber}
                            onClick={() => onPageChange(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  );
                })()}
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
            <p className="text-sm text-muted-foreground text-center">
              Página {page} de {pageCount}
            </p>
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
