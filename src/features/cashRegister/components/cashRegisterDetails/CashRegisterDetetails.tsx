'use client';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { formatDateTime } from '@/shared/utils/formatDate';
import { getConvertCashEntryOrigin } from '@/shared/utils/getConvertCashEntryOrigin';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Pagination } from 'antd';
import {
  Banknote,
  BarChart3,
  CreditCard,
  DollarSign,
  Download,
  Smartphone,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import type { FutureRelease } from '../../types/cashRegisterDetails/actions/futureReleasesTypes';
import type { generatePdfResponse } from '../../types/cashRegisterDetails/actions/generatePdfTypes';
import {
  CashEntryType,
  CashRegister,
  CashRegisterStatus,
  Moviment,
} from '../../types/cashRegisterDetails/cashRegisterDetailsType';
import { FutureReleasesChart } from './FutureReleasesChart';

interface CashRegisterDetailsProps {
  cashRegister: CashRegister | null;
  onOpenCreateNewRegister?: () => void;
  cashRegisterLoading: boolean;
  cashRegisterFetching: boolean;
  cashRegisterError: string | null;
  onRefetchCashRegister: () => void;
  onGenerateReport: () => Promise<generatePdfResponse>;
  generatingReport: boolean;
  moviments: Moviment[] | null;
  totalMoviments: number;
  page: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  movimentsLoading: boolean;
  movimentsError: string | null;
  onRefetchMoviments: () => void;
  onViewMoviment: (movimentId: string) => void;
  futureReleases?: FutureRelease[];
  futureReleasesLoading?: boolean;
  futureReleasesError?: string | null;
  onRefetchFutureReleases?: () => void;
}

export default function CashRegisterDetails({
  cashRegister,
  onOpenCreateNewRegister,
  cashRegisterLoading,
  cashRegisterFetching,
  cashRegisterError,
  onRefetchCashRegister,
  onGenerateReport,
  generatingReport,
  moviments,
  totalMoviments,
  page,
  pageCount,
  pageSize,
  onPageChange,
  movimentsLoading,
  movimentsError,
  onRefetchMoviments,
  onViewMoviment,
  futureReleases = [],
  futureReleasesLoading = false,
  futureReleasesError = null,
  onRefetchFutureReleases,
}: CashRegisterDetailsProps) {
  const statusInfo = (status?: CashRegisterStatus | null) => {
    if (status === CashRegisterStatus.OPEN) {
      return {
        label: 'ABERTO',
        className:
          'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      };
    }
    if (status === CashRegisterStatus.CLOSED) {
      return {
        label: 'FECHADO',
        className:
          'bg-zinc-200/70 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200',
      };
    }
    return {
      label: 'Desconhecido',
      className: 'bg-muted text-muted-foreground',
    };
  };

  const movimentTypeLabel = (type: CashEntryType) => {
    if (type === CashEntryType.INCOME) return 'Entrada';
    if (type === CashEntryType.EXPENSE) return 'Despesa';
    return 'Retirada';
  };

  const movimentTypeClass = (type: CashEntryType) => {
    if (type === CashEntryType.INCOME) return 'text-emerald-600';
    if (type === CashEntryType.EXPENSE) return 'text-rose-600';
    return 'text-amber-600';
  };

  const movimentTypeBorderClass = (type: CashEntryType) => {
    if (type === CashEntryType.INCOME) return 'border-l-emerald-500';
    if (type === CashEntryType.EXPENSE) return 'border-l-rose-500';
    return 'border-l-amber-500';
  };

  const movimentTypeDotClass = (type: CashEntryType) => {
    if (type === CashEntryType.INCOME) return 'bg-emerald-500';
    if (type === CashEntryType.EXPENSE) return 'bg-rose-500';
    return 'bg-amber-500';
  };

  const paymentMethodBadge = (method: string) => {
    if (method === 'DINHEIRO') {
      return {
        icon: <Banknote className="h-3.5 w-3.5" />,
        className:
          'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300',
      };
    }
    if (method === 'PIX') {
      return {
        icon: <Smartphone className="h-3.5 w-3.5" />,
        className:
          'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-900/40 dark:bg-fuchsia-950/30 dark:text-fuchsia-300',
      };
    }
    return {
      icon: <CreditCard className="h-3.5 w-3.5" />,
      className:
        'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/30 dark:text-violet-300',
    };
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-4 sm:p-6 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            {cashRegisterLoading && !cashRegister ? (
              <>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </>
            ) : cashRegister ? (
              <>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h2 className="text-xl font-bold uppercase sm:text-2xl">
                    {cashRegister.name}
                  </h2>
                </div>
                <div className="text-muted-foreground text-xs sm:text-sm">
                  Aberto em: {formatDateTime(cashRegister.openedAt)}
                  {cashRegister.closedAt
                    ? ` • Fechado em: ${formatDateTime(cashRegister.closedAt)}`
                    : ''}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground text-sm">
                Caixa não encontrado.
              </div>
            )}

            {!cashRegisterLoading && cashRegisterError && (
              <div className="text-sm text-red-600 dark:text-red-400">
                {cashRegisterError}
              </div>
            )}
          </div>

          <div className="flex w-full justify-end gap-2 sm:w-auto sm:items-center">
            <Button
              onClick={onRefetchCashRegister}
              icon={<SyncOutlined />}
              loading={cashRegisterFetching && { icon: <SyncOutlined spin /> }}
              className="w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Recarregar</span>
            </Button>

            <Button
              type="primary"
              onClick={onGenerateReport}
              icon={<Download className="h-4 w-4" />}
              loading={generatingReport && { icon: <SyncOutlined spin /> }}
              disabled={!cashRegister}
              className="w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Relatório</span>
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-3 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Saldo
                </p>
                <div className="text-slate-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              {cashRegisterLoading ? (
                <Skeleton className="h-7 w-40" />
              ) : (
                <p className="text-xl font-bold text-emerald-600 sm:text-2xl">
                  {getFormatCurrency(cashRegister?.balance ?? 0)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Status
                </p>
                <div className="text-slate-400">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
              {cashRegisterLoading ? (
                <Skeleton className="h-7 w-28" />
              ) : (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusInfo(cashRegister?.status).className}`}
                >
                  {statusInfo(cashRegister?.status).label}
                </span>
              )}
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-base font-semibold text-slate-700">
              Valores do Assas
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Valor Total (Bruto)
                </p>
                <div className="text-slate-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              {cashRegisterLoading ? (
                <Skeleton className="h-7 w-40" />
              ) : (
                <p className="text-2xl font-bold text-blue-600">
                  {getFormatCurrency(cashRegister?.assasTotalValues ?? 0)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Valor Total (Líquido)
                </p>
                <div className="text-slate-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              {cashRegisterLoading ? (
                <Skeleton className="h-7 w-40" />
              ) : (
                <p className="text-2xl font-bold text-indigo-600">
                  {getFormatCurrency(cashRegister?.assasTotalNetValues ?? 0)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Valor aguardando liberação (bruto)
                </p>
                <div className="text-slate-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              {cashRegisterLoading ? (
                <Skeleton className="h-7 w-40" />
              ) : (
                <p className="text-2xl font-bold text-blue-600">
                  {getFormatCurrency(cashRegister?.assasExpectedValues ?? 0)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Valor aguardando liberação (líquido)
                </p>
                <div className="text-slate-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              {cashRegisterLoading ? (
                <Skeleton className="h-7 w-40" />
              ) : (
                <p className="text-2xl font-bold text-indigo-600">
                  {getFormatCurrency(cashRegister?.assasExpectedNetValues ?? 0)}
                </p>
              )}
            </div>
          </div>

          {(futureReleasesLoading ||
            Boolean(futureReleasesError) ||
            futureReleases.length > 0) && (
            <FutureReleasesChart
              futureReleases={futureReleases}
              loading={futureReleasesLoading}
              error={futureReleasesError}
              onRefetch={onRefetchFutureReleases}
            />
          )}

          <div className="pt-2">
            <h4 className="text-base font-semibold text-slate-700">
              Totais por Categoria
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Entradas
                </p>
                <div className="text-slate-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              {cashRegisterLoading ? (
                <Skeleton className="h-7 w-40" />
              ) : (
                <p className="text-2xl font-bold text-emerald-600">
                  {getFormatCurrency(cashRegister?.totalIncome ?? 0)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Saídas
                </p>
                <div className="text-slate-400">
                  <TrendingDown className="h-5 w-5" />
                </div>
              </div>
              {cashRegisterLoading ? (
                <Skeleton className="h-7 w-40" />
              ) : (
                <p className="text-2xl font-bold text-rose-600">
                  {getFormatCurrency(cashRegister?.totalExpense ?? 0)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 to-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Pix
                </p>
                <div className="text-slate-400">
                  <Smartphone className="h-5 w-5" />
                </div>
              </div>
              {cashRegisterLoading ? (
                <Skeleton className="h-7 w-40" />
              ) : (
                <p className="text-2xl font-bold text-fuchsia-600">
                  {getFormatCurrency(cashRegister?.totalPix ?? 0)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Cartão
                </p>
                <div className="text-slate-400">
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>
              {cashRegisterLoading ? (
                <Skeleton className="h-7 w-40" />
              ) : (
                <p className="text-2xl font-bold text-violet-600">
                  {getFormatCurrency(cashRegister?.totalCard ?? 0)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Dinheiro
                </p>
                <div className="text-slate-400">
                  <Banknote className="h-5 w-5" />
                </div>
              </div>
              {cashRegisterLoading ? (
                <Skeleton className="h-7 w-40" />
              ) : (
                <p className="text-2xl font-bold text-emerald-600">
                  {getFormatCurrency(cashRegister?.totalCash ?? 0)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-4 sm:p-6 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Movimentações</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {`${totalMoviments} movimentações encontradas.`}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            {onOpenCreateNewRegister && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onOpenCreateNewRegister}
                disabled={
                  !cashRegister ||
                  cashRegister.status !== CashRegisterStatus.OPEN
                }
                className="w-full sm:w-auto"
              >
                Nova movimentação
              </Button>
            )}

            <Button
              onClick={onRefetchMoviments}
              icon={<SyncOutlined />}
              className="w-full sm:w-auto"
            >
              Recarregar
            </Button>
          </div>
        </div>

        {movimentsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3 shadow-sm sm:p-5 dark:border-zinc-800 dark:from-zinc-950/40 dark:to-zinc-950/10"
              >
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : movimentsError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            {movimentsError}
          </div>
        ) : !moviments || moviments.length === 0 ? (
          <div className="text-muted-foreground rounded-lg border p-4 text-center text-sm">
            Nenhuma movimentação encontrada.
          </div>
        ) : (
          <div className="space-y-3">
            {moviments.map((m) => {
              const methodBadge = paymentMethodBadge(m.method);

              return (
                <div
                  key={m.id}
                  className={`rounded-xl border border-l-4 border-slate-200 dark:border-zinc-800 ${movimentTypeBorderClass(m.type)} bg-gradient-to-br from-white to-slate-50 p-3 shadow-sm transition-shadow hover:shadow-md sm:p-5 dark:from-zinc-950/40 dark:to-zinc-950/10`}
                >
                  {/* Mobile Layout */}
                  <div className="md:hidden">
                    <div className="mb-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 dark:text-zinc-400">
                            Tipo:
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 font-semibold ${movimentTypeClass(m.type)}`}
                          >
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${movimentTypeDotClass(m.type)}`}
                            />
                            {movimentTypeLabel(m.type)}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${methodBadge.className}`}
                        >
                          {methodBadge.icon}
                          <span className="tracking-wider uppercase">
                            {m.method}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div>
                          <span className="text-slate-500 dark:text-zinc-400">
                            Origem:{' '}
                          </span>
                          <span className="font-medium text-slate-700 dark:text-zinc-200">
                            {getConvertCashEntryOrigin(m.origin)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-zinc-400">
                            Data:{' '}
                          </span>
                          <span className="font-medium text-slate-700 dark:text-zinc-200">
                            {formatDateTime(m.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-zinc-400">
                          Valor:
                        </span>
                        <span
                          className={`text-lg font-bold ${movimentTypeClass(m.type)}`}
                        >
                          {getFormatCurrency(m.value)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end border-t border-slate-200 pt-3 dark:border-zinc-700">
                      <Button
                        size="small"
                        className="!text-black hover:!border-slate-300 hover:!bg-slate-50 hover:!text-black active:!bg-slate-100"
                        onClick={() => onViewMoviment(m.id)}
                      >
                        Detalhes
                      </Button>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex md:flex-col md:gap-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase">
                          Tipo
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${movimentTypeClass(m.type)} w-fit`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${movimentTypeDotClass(m.type)}`}
                          />
                          {movimentTypeLabel(m.type)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase">
                          Origem
                        </span>
                        <span className="font-medium text-slate-700 dark:text-zinc-200">
                          {getConvertCashEntryOrigin(m.origin)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase">
                          Data
                        </span>
                        <span className="font-medium text-slate-700 dark:text-zinc-200">
                          {formatDateTime(m.createdAt)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase">
                          Valor
                        </span>
                        <span
                          className={`text-lg font-bold ${movimentTypeClass(m.type)}`}
                        >
                          {getFormatCurrency(m.value)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase">
                          Método
                        </span>
                        <span
                          className={`inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${methodBadge.className}`}
                        >
                          {methodBadge.icon}
                          <span className="tracking-wider uppercase">
                            {m.method}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end border-t border-slate-200 pt-3 dark:border-zinc-700">
                      <Button
                        size="small"
                        className="!text-black hover:!border-slate-300 hover:!bg-slate-50 hover:!text-black active:!bg-slate-100"
                        onClick={() => onViewMoviment(m.id)}
                      >
                        Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pageCount > 1 && (
          <div className="py-4">
            <div className="flex flex-col items-center gap-3">
              <Pagination
                current={page}
                total={totalMoviments}
                pageSize={pageSize}
                showSizeChanger={false}
                onChange={(next) => onPageChange(next)}
                responsive
                size="medium"
              />
              <div className="text-foreground text-sm font-semibold">
                Página <span className="font-bold">{page}</span> de{' '}
                <span className="font-bold">{pageCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
