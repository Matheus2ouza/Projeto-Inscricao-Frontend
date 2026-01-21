"use client";

import {
  CreatePaymentResponse,
  Inscription,
  StatusPayment,
} from "@/features/payment/types/registerPayment/registerPaymentTypes";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
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
import {
  getConvertStatusInscription,
  getConvertStatusPayment,
} from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import { CheckCircle, CreditCard, Eye, HelpCircle, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import RegisterPaymentDialog from "./RegisterPaymentDialog";

type RegisterPaymentTableProps = {
  eventId: string;
  inscriptions: Inscription[];
  allowCard: boolean;
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onViewPayment: () => void;
  onViewPaymentDetails: (paymentId: string) => void;
};

export default function RegisterPaymentTable({
  eventId,
  inscriptions,
  allowCard,
  total,
  page,
  pageCount,
  onPageChange,
  pageSize = 10,
  onViewPayment,
  onViewPaymentDetails,
}: RegisterPaymentTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentResult, setPaymentResult] =
    useState<CreatePaymentResponse | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  // Calcular o total das inscrições selecionadas (Valor Total - Valor Pago)
  const selectedTotal = selectedIds.reduce((sum, id) => {
    const inscription = inscriptions.find((ins) => ins.id === id);
    const remaining =
      (inscription?.totalValue || 0) - (inscription?.totalPaid || 0);
    return sum + remaining;
  }, 0);

  // Preparar o array de inscrições selecionadas para o dialog
  const selectedInscriptions = selectedIds.map((id) => ({ id }));

  // Função para calcular o índice global
  const calculateGlobalIndex = (localIndex: number): number => {
    return (page - 1) * pageSize + localIndex + 1;
  };

  // Função para alternar seleção de uma inscrição
  const toggleInscription = (id: string) => {
    const inscription = inscriptions.find((ins) => ins.id === id);
    if (!inscription || !inscription.canPay) {
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Função para alternar seleção de todas as inscrições da página
  const toggleAll = () => {
    if (selectedIds.length === inscriptions.length) {
      setSelectedIds([]);
    } else {
      // Apenas selecionar inscrições que podem ser pagas
      const payableInscriptions = inscriptions.filter((ins) => ins.canPay);
      setSelectedIds(payableInscriptions.map((ins) => ins.id));
    }
  };

  // Função para lidar com o pagamento
  const handlePayment = () => {
    if (selectedIds.length === 0) {
      toast.error("Selecione pelo menos uma inscrição para pagar");
      return;
    }

    setIsPaymentDialogOpen(true);
  };

  const handlePaymentRegistered = (payment: CreatePaymentResponse) => {
    setSelectedIds([]);
    setPaymentResult(payment);
    setIsSuccessDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 sm:px-6">
        {/* Card de Ajuda para Desktop */}
        <div className="hidden md:block mb-6">
          <Card className="w-full border-blue-100 dark:border-blue-900 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/30 dark:to-background">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                    <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-300">
                      Precisa de ajuda com registro de pagamentos?
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Aprenda a gerenciar pagamentos de inscrições de forma
                      eficiente.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                >
                  <Link href="/documentation/payment/register">
                    Ver Documentação
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card de Ajuda para Mobile */}
        <div className="md:hidden mb-6">
          <Card className="w-full border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-blue-700 dark:text-blue-300 truncate">
                    Precisa de ajuda com pagamentos?
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    Consulte nossa documentação
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-2 py-1 h-auto"
                >
                  <Link href="/documentation/payment/register">Ver</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cabeçalho responsivo */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden mb-6">
          <div className="p-4 sm:p-6">
            {/* Layout desktop: lado a lado */}
            <div className="hidden sm:flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2 flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Inscrições Pendentes
                </h2>
                <p className="text-muted-foreground">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} inscrição${selectedIds.length > 1 ? "s" : ""} selecionada${selectedIds.length > 1 ? "s" : ""}`
                    : "Selecione as inscrições que deseja pagar"}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3 min-w-[200px]">
                {selectedIds.length > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Valor total
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {getFormatCurrency(selectedTotal)}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={selectedIds.length === 0}
                  className="gap-2 w-full sm:w-auto"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4" />
                  {selectedIds.length > 0
                    ? `Pagar ${selectedIds.length} Inscrição${selectedIds.length > 1 ? "ões" : ""}`
                    : "Selecionar para Pagar"}
                </Button>
              </div>
            </div>

            {/* Layout mobile: empilhado */}
            <div className="sm:hidden">
              {/* Título e descrição */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Inscrições Pendentes
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} inscrição${selectedIds.length > 1 ? "s" : ""} selecionada${selectedIds.length > 1 ? "s" : ""}`
                    : "Selecione as inscrições que deseja pagar"}
                </p>
              </div>

              {/* Valor total (se houver seleção) */}
              {selectedIds.length > 0 && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    Valor total
                  </p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {getFormatCurrency(selectedTotal)}
                  </p>
                </div>
              )}

              {/* Botão de pagamento */}
              <Button
                onClick={handlePayment}
                disabled={selectedIds.length === 0}
                className="gap-2 w-full"
                size="lg"
              >
                <CreditCard className="h-4 w-4" />
                {selectedIds.length > 0
                  ? `Pagar ${selectedIds.length} Inscrição${selectedIds.length > 1 ? "ões" : ""}`
                  : "Selecionar para Pagar"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabela de inscrições - Versão mobile com cards */}
        <div className="block sm:hidden">
          {inscriptions.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
              Nenhuma inscrição pendente encontrada
            </div>
          ) : (
            <div className="space-y-3">
              {inscriptions.map((inscription, idx) => {
                const isSelected = selectedIds.includes(inscription.id);
                return (
                  <div
                    key={inscription.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      isSelected ? "bg-primary/5 border-primary/20" : ""
                    } ${!inscription.canPay ? "opacity-50 bg-muted/20" : ""}`}
                  >
                    {/* Primeira linha: Checkbox, número e valor */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            toggleInscription(inscription.id)
                          }
                          aria-label={`Selecionar inscrição ${inscription.id}`}
                          disabled={!inscription.canPay}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            #
                          </span>
                          <span className="font-semibold">
                            {calculateGlobalIndex(idx)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div>
                          <p className="text-xs text-muted-foreground">Valor</p>
                          <p className="text-lg font-bold">
                            {getFormatCurrency(inscription.totalValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Pago</p>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            {getFormatCurrency(inscription.totalPaid)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Segunda linha: Status e data */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            inscription.status,
                          )}`}
                        >
                          {getConvertStatusInscription(inscription.status)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Criado em
                        </p>
                        <p className="text-sm font-medium">
                          {formatDateTime(inscription.createAt)}
                        </p>
                      </div>
                    </div>

                    {/* Terceira linha: ID da inscrição */}
                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">
                        ID da Inscrição
                      </p>
                      <div className="flex items-center justify-between">
                        <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                          {inscription.id.substring(0, 12)}...
                        </code>
                      </div>
                    </div>

                    {/* Mensagem de pagamento indisponível */}
                    {!inscription.canPay && (
                      <div className="mt-4 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-800 dark:text-amber-300">
                        ⚠️ Pagamento não disponível para esta inscrição
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tabela de inscrições - Versão desktop usando ShadCN Table */}
        <div className="hidden sm:block rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={
                      inscriptions.length > 0 &&
                      selectedIds.length ===
                        inscriptions.filter((ins) => ins.canPay).length
                    }
                    onCheckedChange={toggleAll}
                    aria-label="Selecionar todas as inscrições"
                    disabled={inscriptions.every((ins) => !ins.canPay)}
                  />
                </TableHead>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Valor</TableHead>
                <TableHead className="text-center">Total Pago</TableHead>
                <TableHead className="text-center">Criado em</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inscriptions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Nenhuma inscrição pendente encontrada
                  </TableCell>
                </TableRow>
              ) : (
                inscriptions.map((inscription, idx) => {
                  const isSelected = selectedIds.includes(inscription.id);
                  return (
                    <TableRow
                      key={inscription.id}
                      className={`${
                        isSelected ? "bg-primary/5" : ""
                      } ${!inscription.canPay ? "opacity-50 bg-muted/20" : ""}`}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            toggleInscription(inscription.id)
                          }
                          aria-label={`Selecionar inscrição ${inscription.id}`}
                          disabled={!inscription.canPay}
                        />
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {calculateGlobalIndex(idx)}
                      </TableCell>
                      <TableCell>
                        <code className="font-mono text-xs">
                          {inscription.id.substring(0, 8)}...
                        </code>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            inscription.status,
                          )}`}
                        >
                          {getConvertStatusInscription(inscription.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {getFormatCurrency(inscription.totalValue)}
                      </TableCell>
                      <TableCell className="text-center font-medium text-green-600 dark:text-green-400">
                        {getFormatCurrency(inscription.totalPaid)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDateTime(inscription.createAt)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          title="Visualizar"
                          onClick={() => onViewPaymentDetails(inscription.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <Pagination className="sm:order-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  href={page > 1 ? "#" : undefined}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
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

        {/* Dialog de Registro de Pagamento */}
        <RegisterPaymentDialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          selectedInscriptions={selectedInscriptions}
          eventId={eventId}
          totalValue={selectedTotal}
          onPaymentRegistered={handlePaymentRegistered}
        />

        {/* Dialog de Sucesso no Registro de Pagamento */}
        <Dialog
          open={isSuccessDialogOpen}
          onOpenChange={(open) => {
            setIsSuccessDialogOpen(open);
            if (!open) {
              setPaymentResult(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex flex-col items-center text-center space-y-4">
              {/* Ícone de sucesso com animação */}
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-200 rounded-full opacity-75"></div>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>

              <div className="space-y-2">
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Pagamento registrado
                </DialogTitle>
                <DialogDescription className="text-base">
                  O pagamento foi registrado e está aguardando análise.
                </DialogDescription>
              </div>
            </DialogHeader>

            {paymentResult && (
              <div className="mt-6 space-y-4">
                {/* Card com resumo do pagamento */}
                <div className="rounded-lg border bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        ID do pagamento
                      </span>
                      <span className="text-sm font-medium">
                        {paymentResult.id.substring(0, 12)}...
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Valor total
                      </span>
                      <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                        {getFormatCurrency(paymentResult.totalValue)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Status
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          paymentResult.status === StatusPayment.UNDER_REVIEW
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                        }`}
                      >
                        {getConvertStatusPayment(paymentResult.status)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Criado em
                      </span>
                      <span className="text-sm font-medium">
                        {formatDateTime(paymentResult.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informação adicional */}
                <div className="rounded-lg border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-400 flex items-start gap-2">
                    <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />O pagamento
                    será processado e você receberá uma confirmação por email em
                    breve.
                  </p>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSuccessDialogOpen(false)}
                className="flex-1"
              >
                Fechar
              </Button>

              <Button
                type="button"
                onClick={() => {
                  if (paymentResult?.id) {
                    onViewPayment();
                    setIsSuccessDialogOpen(false);
                  }
                }}
                className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Eye className="h-4 w-4" />
                Visualizar pagamentos
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
