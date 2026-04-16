'use client';

import { Inscription } from '@/features/payments/types/registerPayment/registerPaymentTypes';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { formatDateTime } from '@/shared/utils/formatDate';
import { getConvertStatusInscription } from '@/shared/utils/getConvertStatus';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { getStatusColor } from '@/shared/utils/getStatusColor';
import { CreditCard, Eye, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

type RegisterPaymentTableProps = {
  inscriptions: Inscription[];
  allowCard: boolean;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onViewPaymentDetails: (paymentId: string) => void;
  onRegisterPaymentPix: (inscriptionIds: string[], totalValue: number) => void;
  onRegisterPaymentCard: (inscriptionIds: string[], totalValue: number) => void;
};

export default function RegisterPaymentTable({
  inscriptions,
  allowCard,
  page,
  pageCount,
  onPageChange,
  pageSize = 10,
  onViewPaymentDetails,
  onRegisterPaymentPix,
  onRegisterPaymentCard,
}: RegisterPaymentTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Calcular o total das inscrições selecionadas (Valor Total - Valor Pago)
  const selectedTotal = selectedIds.reduce((sum, id) => {
    const inscription = inscriptions.find((ins) => ins.id === id);
    const remaining =
      (inscription?.totalValue || 0) - (inscription?.totalPaid || 0);
    return sum + remaining;
  }, 0);

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
      toast.error('Selecione pelo menos uma inscrição para pagar');
      return;
    }
    onRegisterPaymentPix(selectedIds, selectedTotal);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto px-4 sm:px-6">
        {/* Card de Ajuda para Desktop */}
        <div className="mb-6 hidden md:block">
          <Card className="dark:to-background w-full border-blue-100 bg-gradient-to-r from-blue-50 to-white dark:border-blue-900 dark:from-blue-950/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/50">
                    <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                      Precisa de ajuda com registro de pagamentos?
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Aprenda a gerenciar pagamentos de inscrições de forma
                      eficiente.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/50"
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
        <div className="mb-6 md:hidden">
          <Card className="w-full border-blue-100 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-blue-700 dark:text-blue-300">
                    Precisa de ajuda com pagamentos?
                  </p>
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    Consulte nossa documentação
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-auto px-2 py-1 text-blue-600 hover:bg-blue-100 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                >
                  <Link href="/documentation/payment/register">Ver</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cabeçalho responsivo */}
        <div className="mb-6 overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-800">
          <div className="p-4 sm:p-6">
            {/* Layout desktop: lado a lado */}
            <div className="hidden flex-col items-start justify-between gap-6 sm:flex lg:flex-row lg:items-center">
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Inscrições Pendentes
                </h2>
                <p className="text-muted-foreground">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} inscrição${selectedIds.length > 1 ? 's' : ''} selecionada${selectedIds.length > 1 ? 's' : ''}`
                    : 'Selecione as inscrições que deseja pagar'}
                </p>
              </div>

              <div className="flex min-w-[200px] flex-col items-end gap-3">
                {selectedIds.length > 0 && (
                  <div className="text-right">
                    <div className="text-muted-foreground text-sm">
                      Valor total
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {getFormatCurrency(selectedTotal)}
                    </div>
                  </div>
                )}

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button
                    onClick={handlePayment}
                    disabled={selectedIds.length === 0}
                    className="w-full gap-2 sm:w-auto"
                    size="lg"
                  >
                    <CreditCard className="h-4 w-4" />
                    Registrar pagamento Pix
                  </Button>
                  <Button
                    onClick={() =>
                      onRegisterPaymentCard(selectedIds, selectedTotal)
                    }
                    disabled={selectedIds.length === 0 || !allowCard}
                    variant="outline"
                    className="w-full gap-2 sm:w-auto"
                    size="lg"
                    title={
                      !allowCard
                        ? 'Pagamento com cartão indisponível'
                        : 'Pagar com cartão'
                    }
                  >
                    <CreditCard className="h-4 w-4" />
                    Registrar pagamento Cartão
                  </Button>
                </div>
              </div>
            </div>

            {/* Layout mobile: empilhado */}
            <div className="sm:hidden">
              {/* Título e descrição */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Inscrições Pendentes
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} inscrição${selectedIds.length > 1 ? 's' : ''} selecionada${selectedIds.length > 1 ? 's' : ''}`
                    : 'Selecione as inscrições que deseja pagar'}
                </p>
              </div>

              {/* Valor total (se houver seleção) */}
              {selectedIds.length > 0 && (
                <div className="mb-4 rounded-lg border border-green-100 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    Valor total
                  </p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {getFormatCurrency(selectedTotal)}
                  </p>
                </div>
              )}

              {/* Botões de pagamento */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  onClick={handlePayment}
                  disabled={selectedIds.length === 0}
                  className="w-full gap-2"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4" />
                  Registrar pagamento Pix
                </Button>
                <Button
                  onClick={() =>
                    onRegisterPaymentCard(selectedIds, selectedTotal)
                  }
                  disabled={selectedIds.length === 0 || !allowCard}
                  variant="outline"
                  className="w-full gap-2"
                  size="lg"
                  title={
                    !allowCard
                      ? 'Pagamento com cartão indisponível'
                      : 'Pagar com cartão'
                  }
                >
                  <CreditCard className="h-4 w-4" />
                  Registrar pagamento Cartão
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de inscrições - Versão mobile com cards */}
        <div className="block sm:hidden">
          {inscriptions.length === 0 ? (
            <div className="text-muted-foreground rounded-lg border px-4 py-8 text-center">
              Nenhuma inscrição pendente encontrada
            </div>
          ) : (
            <div className="space-y-3">
              {inscriptions.map((inscription, idx) => {
                const isSelected = selectedIds.includes(inscription.id);
                return (
                  <div
                    key={inscription.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      isSelected ? 'bg-primary/5 border-primary/20' : ''
                    } ${!inscription.canPay ? 'bg-muted/20 opacity-50' : ''}`}
                  >
                    {/* Primeira linha: Checkbox, número e valor */}
                    <div className="mb-4 flex items-center justify-between">
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
                          <span className="text-muted-foreground text-sm font-medium">
                            #
                          </span>
                          <span className="font-semibold">
                            {calculateGlobalIndex(idx)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div>
                          <p className="text-muted-foreground text-xs">Valor</p>
                          <p className="text-lg font-bold">
                            {getFormatCurrency(inscription.totalValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Pago</p>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            {getFormatCurrency(inscription.totalPaid)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Segunda linha: Status e data */}
                    <div className="mb-3 grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Status</p>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(
                            inscription.status,
                          )}`}
                        >
                          {getConvertStatusInscription(inscription.status)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">
                          Criado em
                        </p>
                        <p className="text-sm font-medium">
                          {formatDateTime(inscription.createAt)}
                        </p>
                      </div>
                    </div>

                    {/* Terceira linha: ID da inscrição */}
                    <div className="border-t pt-3">
                      <p className="text-muted-foreground mb-1 text-xs">
                        ID da Inscrição
                      </p>
                      <div className="flex items-center justify-between">
                        <code className="bg-muted rounded px-2 py-1 font-mono text-xs">
                          {inscription.id.substring(0, 12)}...
                        </code>
                      </div>
                    </div>

                    {/* Mensagem de pagamento indisponível */}
                    {!inscription.canPay && (
                      <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
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
        <div className="hidden rounded-lg border sm:block">
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
                    className="text-muted-foreground px-4 py-8 text-center"
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
                        isSelected ? 'bg-primary/5' : ''
                      } ${!inscription.canPay ? 'bg-muted/20 opacity-50' : ''}`}
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
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
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
                          className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
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
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Pagination className="sm:order-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  href={page > 1 ? '#' : undefined}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
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
                  href={page < pageCount ? '#' : undefined}
                  className={
                    page === pageCount ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
