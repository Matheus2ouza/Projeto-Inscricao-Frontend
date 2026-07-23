'use client';

import { LocalityToAccountCombobox } from '@/features/locality/components/LocalityToAccountCombobox';
import { useListPaymentPending } from '@/features/payments/hooks/registerPayment/useListPaymentPending';
import { CustomPagination } from '@/shared/components/CustomPagination';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
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
import { IconAlertTriangle } from '@tabler/icons-react';
import { CreditCard, Eye, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { RegisterPaymentEmptyState } from './RegisterPaymentEmptyState';
import { RegisterPaymentErrorState } from './RegisterPaymentErrorState';
import { RegisterPaymentTableSkeleton } from './RegisterPaymentTableSkeleton';

type RegisterPaymentTableProps = {
  eventId: string;
  onViewPaymentDetails: (paymentId: string) => void;
  onRegisterPaymentPix: (inscriptionIds: string[], totalValue: number) => void;
  onRegisterPaymentCard: (inscriptionIds: string[], totalValue: number) => void;
  pageSize?: number;
};

const PAGE_SIZE = 10;

export default function RegisterPaymentTable({
  eventId,
  onViewPaymentDetails,
  onRegisterPaymentPix,
  onRegisterPaymentCard,
  pageSize = 10,
}: RegisterPaymentTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedLocalityId, setSelectedLocalityId] = useState<string>('');

  const {
    inscriptions,
    allowCard,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refresh,
  } = useListPaymentPending({
    eventId,
    initialPage: 1,
    pageSize,
    localityId: selectedLocalityId || undefined,
  });

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

  // Função para limpar o filtro de localidade
  const handleClearLocalityFilter = () => {
    setSelectedLocalityId('');
    setSelectedIds([]); // Limpa seleções ao mudar o filtro
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

  // Renderiza o estado de erro
  if (error) {
    return <RegisterPaymentErrorState error={error} onRetry={refresh} />;
  }

  // Renderiza o estado de loading
  if (loading) {
    return <RegisterPaymentTableSkeleton />;
  }

  // Se não houver inscrições
  if (inscriptions.length === 0) {
    return (
      <RegisterPaymentEmptyState
        hasFilter={!!selectedLocalityId}
        onClearFilter={handleClearLocalityFilter}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Card de Ajuda para Desktop */}
      <div className="mb-6 hidden md:block">
        <Card className="border-riodavida/20 from-riodavida/5 dark:border-riodavida/20 dark:from-riodavida/10 dark:to-background w-full bg-gradient-to-r to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-riodavida/10 dark:bg-riodavida/20 rounded-lg p-3">
                  <HelpCircle className="text-riodavida dark:text-riodavida h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray text-lg font-semibold">
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
                className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:border-riodavida/30 dark:text-riodavida dark:hover:bg-riodavida/20 dark:hover:text-riodavida-light"
              >
                <Link href="/documentation/payment/register">
                  Ver Documentação
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto px-4 sm:px-6">
        {/* Card de Ajuda para Mobile */}
        <div className="mb-6 md:hidden">
          <Card className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 w-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="text-riodavida dark:text-riodavida h-5 w-5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-riodavida dark:text-riodavida truncate text-sm font-medium">
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
                  className="text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:text-riodavida dark:hover:bg-riodavida/20 dark:hover:text-riodavida-light h-auto px-2 py-1"
                >
                  <Link href="/documentation/payment/register">Ver</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtro de localidade */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-full max-w-sm">
            <LocalityToAccountCombobox
              value={selectedLocalityId}
              onChange={(value) => {
                setSelectedLocalityId(value);
                setSelectedIds([]);
              }}
              placeholder="Selecione uma localidade"
            />
            {!selectedLocalityId && (
              <p className="text-muted-foreground mt-2 text-sm">
                Selecione uma localidade para filtrar as inscrições pendentes.
              </p>
            )}
          </div>
          {selectedLocalityId && (
            <Button variant="primary" onClick={handleClearLocalityFilter}>
              Limpar filtro
            </Button>
          )}
        </div>

        {/* Cabeçalho responsivo */}
        <div className="liquid-card mb-6 overflow-hidden rounded-lg border-0">
          <div className="p-4 sm:p-6">
            {/* Layout desktop: lado a lado */}
            <div className="hidden flex-col items-start justify-between gap-6 sm:flex lg:flex-row lg:items-center">
              <div className="flex-1 space-y-2">
                <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray text-2xl font-bold">
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
                    <div className="text-riodavida-secondary dark:text-riodavida-muted-light text-2xl font-bold">
                      {getFormatCurrency(selectedTotal)}
                    </div>
                  </div>
                )}

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button
                    onClick={handlePayment}
                    disabled={selectedIds.length === 0}
                    className="bg-riodavida hover:bg-riodavida-dark w-full gap-2 text-white sm:w-auto"
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
                    className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark w-full gap-2 sm:w-auto"
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
              <div className="mb-4">
                <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-bold">
                  Inscrições Pendentes
                  {selectedLocalityId && (
                    <span className="text-muted-foreground ml-2 text-xs font-normal">
                      (filtradas)
                    </span>
                  )}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} inscrição${selectedIds.length > 1 ? 's' : ''} selecionada${selectedIds.length > 1 ? 's' : ''}`
                    : 'Selecione as inscrições que deseja pagar'}
                </p>
              </div>

              {selectedIds.length > 0 && (
                <div className="border-riodavida-secondary/20 bg-riodavida-secondary/5 dark:border-riodavida-secondary/20 dark:bg-riodavida-secondary/10 mb-4 rounded-lg border p-3">
                  <p className="text-riodavida-secondary dark:text-riodavida-muted-light text-sm">
                    Valor total
                  </p>
                  <p className="text-riodavida-secondary dark:text-riodavida-muted-light text-xl font-bold">
                    {getFormatCurrency(selectedTotal)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  onClick={handlePayment}
                  disabled={selectedIds.length === 0}
                  className="bg-riodavida hover:bg-riodavida-dark w-full gap-2 text-white"
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
                  className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark w-full gap-2"
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
            <div className="border-riodavida/20 text-muted-foreground rounded-lg border px-4 py-8 text-center">
              Nenhuma inscrição pendente encontrada
            </div>
          ) : (
            <div className="space-y-3">
              {inscriptions.map((inscription, idx) => {
                const isSelected = selectedIds.includes(inscription.id);
                return (
                  <div
                    key={inscription.id}
                    className={`liquid-card rounded-lg border-0 p-4 transition-colors ${
                      isSelected ? 'bg-riodavida/10 border-riodavida/20' : ''
                    } ${!inscription.canPay ? 'opacity-50' : ''}`}
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
                          className="border-riodavida/30 data-[state=checked]:bg-riodavida data-[state=checked]:text-white"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm font-medium">
                            #
                          </span>
                          <span className="text-riodavida-gray-dark dark:text-riodavida-gray font-semibold">
                            {calculateGlobalIndex(idx)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div>
                          <p className="text-muted-foreground text-xs">Valor</p>
                          <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-lg font-bold">
                            {getFormatCurrency(inscription.totalValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Pago</p>
                          <p className="text-riodavida-secondary dark:text-riodavida-muted-light text-sm font-medium">
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
                        <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium">
                          {formatDateTime(inscription.createAt)}
                        </p>
                      </div>
                    </div>

                    {/* Terceira linha: ID da inscrição */}
                    <div className="border-riodavida/10 border-t pt-3">
                      <p className="text-muted-foreground mb-1 text-xs">
                        ID da Inscrição
                      </p>
                      <div className="flex items-center justify-between">
                        <code className="bg-riodavida/5 dark:bg-riodavida/10 rounded px-2 py-1 font-mono text-xs">
                          {inscription.id.substring(0, 12)}...
                        </code>
                      </div>
                    </div>

                    {/* Mensagem de pagamento indisponível */}
                    {!inscription.canPay && (
                      <div className="mt-4 flex items-center gap-2 rounded border border-amber-200/50 bg-amber-50/80 p-2 text-xs text-amber-800 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-300">
                        <IconAlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <span>
                          Pagamento não disponível para esta inscrição
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tabela de inscrições - Versão desktop */}
        <div className="liquid-card hidden overflow-hidden rounded-lg border-0 sm:block">
          <Table>
            <TableHeader className="bg-riodavida/50 dark:bg-riodavida/30">
              <TableRow>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-12 text-center">
                  <Checkbox
                    checked={
                      inscriptions.length > 0 &&
                      selectedIds.length ===
                        inscriptions.filter((ins) => ins.canPay).length
                    }
                    onCheckedChange={toggleAll}
                    aria-label="Selecionar todas as inscrições"
                    disabled={inscriptions.every((ins) => !ins.canPay)}
                    className="border-riodavida/30 data-[state=checked]:bg-riodavida data-[state=checked]:text-white"
                  />
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-12 text-center">
                  #
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray">
                  ID
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray text-center">
                  Status
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray text-center">
                  Valor
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray text-center">
                  Total Pago
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray text-center">
                  Criado em
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray text-center">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="liquid-card">
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
                      className={`bg-riodavida/5 dark:bg-riodavida/10 hover:bg-riodavida/20 dark:hover:bg-riodavida/30 transition-colors ${
                        isSelected ? 'bg-riodavida/10 dark:bg-riodavida/20' : ''
                      } ${!inscription.canPay ? 'opacity-50' : ''}`}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            toggleInscription(inscription.id)
                          }
                          aria-label={`Selecionar inscrição ${inscription.id}`}
                          disabled={!inscription.canPay}
                          className="border-riodavida/30 data-[state=checked]:bg-riodavida data-[state=checked]:text-white"
                        />
                      </TableCell>
                      <TableCell className="text-riodavida-gray-dark dark:text-riodavida-gray text-center font-medium">
                        {calculateGlobalIndex(idx)}
                      </TableCell>
                      <TableCell className="text-riodavida-gray-dark dark:text-riodavida-gray">
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
                      <TableCell className="text-riodavida-gray-dark dark:text-riodavida-gray text-center font-medium">
                        {getFormatCurrency(inscription.totalValue)}
                      </TableCell>
                      <TableCell className="text-riodavida-secondary dark:text-riodavida-muted-light text-center font-medium">
                        {getFormatCurrency(inscription.totalPaid)}
                      </TableCell>
                      <TableCell className="text-riodavida-gray-dark dark:text-riodavida-gray text-center">
                        {formatDateTime(inscription.createAt)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:text-riodavida dark:hover:bg-riodavida/20 h-8 w-8 p-0"
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

        {/* Paginação com CustomPagination */}
        <CustomPagination
          page={page}
          pageCount={pageCount}
          total={inscriptions.length}
          onPageChange={setPage}
          label="inscrições pendentes"
        />
      </div>
    </div>
  );
}
