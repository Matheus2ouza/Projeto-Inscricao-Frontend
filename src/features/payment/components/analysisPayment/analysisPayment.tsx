import {
  Event,
  Payment,
} from "@/features/payment/types/analysisPayment/analysisPayment";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
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
import { calculateGlobalIndex } from "@/shared/utils/calculateGlobalIndex";
import { formatDateTime } from "@/shared/utils/formatDate";
import { getConvertStatusPayment } from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getPaymentStatusInfo } from "@/shared/utils/getPaymentStatusInfo";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import {
  AlertCircle,
  Calendar,
  DollarSign,
  Eye,
  ImageIcon,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface AnalysisPaymentProps {
  event?: Event;
  payments: Payment[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewDetail: (paymentId: string) => void;
}

export default function AnalysisPayment({
  event,
  payments,
  total,
  page,
  pageCount,
  pageSize,
  onPageChange,
  onViewDetail,
}: AnalysisPaymentProps) {
  const [imageError, setImageError] = useState(false);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Evento não encontrado</h3>
        <p className="text-muted-foreground">
          Não foi possível carregar os dados do evento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card do Evento */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Imagem do Evento */}
            <div className="relative w-full sm:w-48 h-48 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {event.imageUrl && !imageError ? (
                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Informações do Evento */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {event.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Análise de pagamentos pendentes
                </p>
              </div>

              {/* Estatísticas do Evento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Pagamentos em Análise
                    </span>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                      <span className="text-2xl font-bold">
                        {event.totalPaymentInAnalysis}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Valor Total em Análise
                    </span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                        {getFormatCurrency(event.totalAmountInAnalysis)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Status do Evento
                    </span>
                    <Badge
                      className={`${getPaymentStatusInfo(event.paymentEnabled).badgeClass} border-0 w-fit`}
                    >
                      {getPaymentStatusInfo(event.paymentEnabled).label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Título da Tabela */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Pagamentos em Análise
        </h2>
        <p className="text-muted-foreground">
          {total} pagamento{total !== 1 ? "s" : ""} em análise no total
        </p>
      </div>

      {/* Tabela de Pagamentos - Versão Mobile com Cards */}
      <div className="block sm:hidden">
        {payments.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
            Nenhum pagamento em análise encontrado
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment, idx) => (
              <div
                key={payment.id}
                className={`p-4 border rounded-lg hover:bg-muted/30 transition-colors ${
                  payment.isGuest
                    ? "border-amber-200 dark:border-amber-900/40"
                    : ""
                }`}
              >
                {/* Primeira linha: Número e Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      #
                    </span>
                    <span className="font-semibold">
                      {calculateGlobalIndex(idx, page, pageSize)}
                    </span>
                  </div>
                  <Badge className={getStatusColor(payment.status)}>
                    {getConvertStatusPayment(payment.status)}
                  </Badge>
                </div>

                {/* Responsável */}
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{payment.responsible || "-"}</p>
                    {payment.isGuest && (
                      <Badge
                        variant="secondary"
                        className="h-5 px-2 text-[10px]"
                      >
                        Convidado
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Segunda linha: Valor e Data */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Valor</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {getFormatCurrency(payment.value)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Data</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {formatDateTime(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terceira linha: ID e Ações */}
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        ID do Pagamento
                      </p>
                      <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {payment.id.substring(0, 12)}...
                      </code>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      title="Analisar Pagamento"
                      onClick={() => onViewDetail(payment.id)}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabela de Pagamentos - Versão Desktop */}
      <div className="hidden sm:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead className="w-[150px]">Responsável</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[120px]">Valor</TableHead>
              <TableHead className="w-[160px]">Data</TableHead>
              <TableHead className="w-[100px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Nenhum pagamento em análise encontrado
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment, idx) => (
                <TableRow
                  key={payment.id}
                  className={`hover:bg-muted/50 ${
                    payment.isGuest ? "bg-amber-50/40 dark:bg-amber-900/10" : ""
                  }`}
                >
                  <TableCell className="font-medium">
                    {calculateGlobalIndex(idx, page, pageSize)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">
                        {payment.responsible || "-"}
                      </span>
                      {payment.isGuest && (
                        <Badge
                          variant="secondary"
                          className="h-5 px-2 text-[10px]"
                        >
                          N/ Associado
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {getConvertStatusPayment(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600 dark:text-green-400">
                    {getFormatCurrency(payment.value)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDateTime(payment.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        title="Analisar Pagamento"
                        onClick={() => onViewDetail(payment.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {pageCount > 1 && (
        <div className="py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Página {page} de {pageCount} • Total: {total} pagamentos
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && onPageChange(page - 1)}
                    href={page > 1 ? "#" : undefined}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {/* Versão mobile - apenas página atual */}
                <div className="sm:hidden">
                  <PaginationItem>
                    <PaginationLink
                      isActive={true}
                      href="#"
                      className="pointer-events-none"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </div>

                {/* Versão desktop - todas as páginas */}
                <div className="hidden sm:flex">
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
                </div>

                <PaginationItem>
                  <PaginationNext
                    onClick={() => page < pageCount && onPageChange(page + 1)}
                    href={page < pageCount ? "#" : undefined}
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
    </div>
  );
}
