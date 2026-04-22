'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/chart';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { formatDateTime } from '@/shared/utils/formatDate';
import { getConvertCashEntryOrigin } from '@/shared/utils/getConvertCashEntryOrigin';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { SyncOutlined } from '@ant-design/icons';
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
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import type { FutureRelease } from '../../types/cashRegisterDetails/actions/futureReleasesTypes';
import type { generatePdfResponse } from '../../types/cashRegisterDetails/actions/generatePdfTypes';
import {
  CashEntryType,
  CashRegister,
  CashRegisterStatus,
  Moviment,
} from '../../types/cashRegisterDetails/cashRegisterDetailsType';

interface CashRegisterDetailsProps {
  cashRegister: CashRegister | null;
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

  const futureReleasesChartConfig: ChartConfig = {
    amount: {
      label: 'Valor',
      color: '#2563eb',
    },
  };

  const futureReleasesChartData = (futureReleases ?? [])
    .map((item) => {
      const date =
        item.releaseDate instanceof Date
          ? item.releaseDate
          : new Date(item.releaseDate);
      const dateKey = Number.isNaN(date.getTime()) ? 0 : date.getTime();
      return {
        dateKey,
        dateLabel: dateKey
          ? date.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
            })
          : '—',
        amount: item.amount ?? 0,
      };
    })
    .sort((a, b) => a.dateKey - b.dateKey);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-6 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            {cashRegisterLoading && !cashRegister ? (
              <>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </>
            ) : cashRegister ? (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold uppercase">
                    {cashRegister.name}
                  </h2>
                </div>
                <div className="text-muted-foreground text-sm">
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

          <div className="flex items-center gap-2">
            <Button
              onClick={onRefetchCashRegister}
              icon={<SyncOutlined />}
              loading={cashRegisterFetching && { icon: <SyncOutlined spin /> }}
            >
              Recarregar caixa
            </Button>
            <Button
              type="primary"
              onClick={onGenerateReport}
              icon={<Download className="h-4 w-4" />}
              loading={generatingReport && { icon: <SyncOutlined spin /> }}
              disabled={!cashRegister}
            >
              Gerar relatório
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
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
                <p className="text-2xl font-bold text-emerald-600">
                  {getFormatCurrency(cashRegister?.balance ?? 0)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
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

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-zinc-900">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-zinc-100">
                  Próximas liberações
                </p>
                <p className="text-muted-foreground text-xs">
                  Valores previstos por data para repasse no caixa.
                </p>
              </div>
              <Button
                onClick={onRefetchFutureReleases}
                icon={<SyncOutlined />}
                loading={
                  futureReleasesLoading && { icon: <SyncOutlined spin /> }
                }
                disabled={!onRefetchFutureReleases}
              >
                Recarregar
              </Button>
            </div>

            {futureReleasesLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-[220px] w-full" />
              </div>
            ) : futureReleasesError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                {futureReleasesError}
              </div>
            ) : futureReleasesChartData.length === 0 ? (
              <div className="text-muted-foreground rounded-lg border p-4 text-center text-sm">
                Nenhuma liberação futura encontrada.
              </div>
            ) : (
              <ChartContainer
                className="h-[220px] w-full"
                config={futureReleasesChartConfig}
              >
                <BarChart data={futureReleasesChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="dateLabel"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => (
                          <div className="flex w-full items-center justify-between gap-3">
                            <span className="text-muted-foreground">Valor</span>
                            <span className="text-foreground font-mono font-medium tabular-nums">
                              {getFormatCurrency(Number(value))}
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="amount" fill="var(--color-amount)" radius={6} />
                </BarChart>
              </ChartContainer>
            )}
          </div>

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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      <div className="space-y-4 rounded-xl border bg-white p-6 dark:bg-zinc-900">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Movimentações</h3>
            <p className="text-muted-foreground text-sm">
              {`${totalMoviments} movimentações encontradas.`}
            </p>
          </div>

          <Button onClick={onRefetchMoviments} icon={<SyncOutlined />}>
            Recarregar movimentações
          </Button>
        </div>

        {movimentsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-950/40 dark:to-zinc-950/10"
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
                  className={`rounded-xl border border-l-4 border-slate-200 dark:border-zinc-800 ${movimentTypeBorderClass(m.type)} bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition-shadow hover:shadow-md dark:from-zinc-950/40 dark:to-zinc-950/10`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-x-12">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="shrink-0 text-slate-500 dark:text-zinc-400">
                          Tipo:
                        </span>
                        <span
                          className={`inline-flex items-center gap-2 font-semibold ${movimentTypeClass(m.type)}`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${movimentTypeDotClass(m.type)}`}
                          />
                          {movimentTypeLabel(m.type)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="shrink-0 text-slate-500 dark:text-zinc-400">
                          Origem:
                        </span>
                        <span className="font-medium text-slate-700 dark:text-zinc-200">
                          {getConvertCashEntryOrigin(m.origin)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="shrink-0 text-slate-500 dark:text-zinc-400">
                          Data:
                        </span>
                        <span className="font-medium text-slate-700 dark:text-zinc-200">
                          {formatDateTime(m.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="shrink-0 text-slate-500 dark:text-zinc-400">
                          Valor:
                        </span>
                        <span
                          className={`font-bold ${movimentTypeClass(m.type)}`}
                        >
                          {getFormatCurrency(m.value)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="shrink-0 text-slate-500 dark:text-zinc-400">
                          Método:
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${methodBadge.className}`}
                        >
                          {methodBadge.icon}
                          <span className="tracking-wider uppercase">
                            {m.method}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end">
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
