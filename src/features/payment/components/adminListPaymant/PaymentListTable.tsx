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
import { formatDateTime } from "@/shared/utils/formatDate";
import { getConvertStatusPayment } from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import {
  CircleDollarSign,
  CreditCard,
  Eye,
  Hourglass,
  Info,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import {
  Payment,
  PaymentsSummary,
} from "../../types/adminListPaymants/listPayments.types";

interface PaymentsListTableProps {
  summary: PaymentsSummary;
  payments: Payment[];
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onViewDetails: (paymentId: string) => void;
}

export default function PaymentListTable({
  summary,
  payments,
  total,
  page,
  pageCount,
  onPageChange,
  onViewDetails,
}: PaymentsListTableProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImage, setViewerImage] = useState<{
    url: string;
    title?: string;
    description?: string;
  } | null>(null);

  const handleOpenViewer = (payment: Payment) => {
    if (!payment.imageUrl) {
      return;
    }

    setViewerImage({
      url: payment.imageUrl,
      title: `Comprovante ${payment.id.slice(0, 8)}`,
      description: formatDateTime(payment.createdAt),
    });
    setViewerOpen(true);
  };

  if (payments.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-foreground" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pagamentos</p>
              <p className="text-2xl font-semibold">{summary.totalPayments}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valor pago</p>
              <p
                className={`text-2xl font-semibold ${summary.totalPaidValue > 0 ? "text-green-600" : ""}`}
              >
                {getFormatCurrency(summary.totalPaidValue)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CircleDollarSign className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Em análise</p>
              <p
                className={`text-2xl font-semibold ${summary.totalUnderReviewValue > 0 ? "text-amber-600" : ""}`}
              >
                {getFormatCurrency(summary.totalUnderReviewValue)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Hourglass className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Recusados</p>
              <p
                className={`text-2xl font-semibold ${summary.totalRefusedValue > 0 ? "text-red-600" : ""}`}
              >
                {getFormatCurrency(summary.totalRefusedValue)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-dashed">
          <div>
            <CardTitle className="text-xl">Pagamentos</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Mostrando {payments.length} de {total} pagamento
              {total === 1 ? "" : "s"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <div className="overflow-x-auto">
            <Table className="min-w-full table-fixed divide-y divide-muted/20">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left w-[180px] min-w-[180px]">
                    ID
                  </TableHead>
                  <TableHead className="text-left w-[140px] min-w-[140px]">
                    Status
                  </TableHead>
                  <TableHead className="text-left w-[140px] min-w-[140px]">
                    Valor
                  </TableHead>
                  <TableHead className="text-left w-[220px] min-w-[220px]">
                    Data
                  </TableHead>
                  <TableHead className="text-center w-[120px] min-w-[120px]">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm text-left">
                      {payment.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="text-left">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getStatusColor(
                          payment.status ?? "pending",
                        )}`}
                      >
                        {getConvertStatusPayment(payment.status)}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-left">
                      {getFormatCurrency(payment.totalValue)}
                    </TableCell>
                    <TableCell className="text-left">
                      {formatDateTime(payment.createdAt)}
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
                    pageCount,
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
                    },
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
