"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatDateTime } from "@/shared/utils/formatDate";
import { getConvertCashEntryOrigin } from "@/shared/utils/getConvertCashEntryOrigin";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { SyncOutlined } from "@ant-design/icons";
import { Button } from "antd";
import {
  CashEntryType,
  CashRegister,
  CashRegisterStatus,
  Moviment,
} from "../../types/cashRegisterDetails/cashRegisterDetailsType";

interface CashRegisterDetailsProps {
  cashRegister: CashRegister | null;
  cashRegisterLoading: boolean;
  cashRegisterFetching: boolean;
  cashRegisterError: string | null;
  onRefetchCashRegister: () => void;
  moviments: Moviment[] | null;
  totalMoviments: number;
  totalIncome: number;
  totalExpense: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  movimentsLoading: boolean;
  movimentsFetching: boolean;
  movimentsError: string | null;
  onRefetchMoviments: () => void;
}

export default function CashRegisterDetails({
  cashRegister,
  cashRegisterLoading,
  cashRegisterFetching,
  cashRegisterError,
  onRefetchCashRegister,
  moviments,
  totalMoviments,
  totalIncome,
  totalExpense,
  page,
  pageCount,
  onPageChange,
  movimentsLoading,
  movimentsFetching,
  movimentsError,
  onRefetchMoviments,
}: CashRegisterDetailsProps) {
  const statusInfo = (status?: CashRegisterStatus | null) => {
    if (status === CashRegisterStatus.OPEN) {
      return {
        label: "Aberto",
        className:
          "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      };
    }
    if (status === CashRegisterStatus.CLOSED) {
      return {
        label: "Fechado",
        className:
          "bg-zinc-200/70 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200",
      };
    }
    return {
      label: "Desconhecido",
      className: "bg-muted text-muted-foreground",
    };
  };

  const movimentTypeLabel = (type: CashEntryType) => {
    if (type === CashEntryType.INCOME) return "Entrada";
    if (type === CashEntryType.EXPENSE) return "Despesa";
    return "Retirada";
  };

  const movimentTypeClass = (type: CashEntryType) => {
    if (type === CashEntryType.INCOME) return "text-emerald-600";
    if (type === CashEntryType.EXPENSE) return "text-rose-600";
    return "text-amber-600";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            {cashRegisterLoading ? (
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
                <div className="text-sm text-muted-foreground">
                  Aberto em: {formatDateTime(cashRegister.openedAt)}
                  {cashRegister.closedAt
                    ? ` • Fechado em: ${formatDateTime(cashRegister.closedAt)}`
                    : ""}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                Caixa não encontrado.
              </div>
            )}

            {!cashRegisterLoading && cashRegisterError && (
              <div className="text-sm text-red-600 dark:text-red-400">
                {cashRegisterError}
              </div>
            )}
          </div>

          <Button
            onClick={onRefetchCashRegister}
            icon={<SyncOutlined />}
            loading={cashRegisterFetching && { icon: <SyncOutlined spin /> }}
          >
            Recarregar caixa
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Saldo
              </div>
              <div className="mt-2 text-lg font-semibold">
                {cashRegisterLoading ? (
                  <Skeleton className="h-6 w-32" />
                ) : (
                  getFormatCurrency(cashRegister?.balance ?? 0)
                )}
              </div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Status
              </div>
              <div className="mt-2 text-lg font-semibold">
                {cashRegisterLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  statusInfo(cashRegister?.status).label
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Total
              </div>
              <div className="mt-2 text-lg font-semibold">
                {movimentsLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  String(totalMoviments)
                )}
              </div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Entradas
              </div>
              <div className="mt-2 text-lg font-semibold">
                {movimentsLoading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  String(totalIncome)
                )}
              </div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Saídas
              </div>
              <div className="mt-2 text-lg font-semibold">
                {movimentsLoading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  String(totalExpense)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Movimentações</h3>
          </div>

          <Button
            onClick={onRefetchMoviments}
            icon={<SyncOutlined />}
            loading={movimentsFetching && { icon: <SyncOutlined spin /> }}
          >
            Recarregar movimentações
          </Button>
        </div>

        {movimentsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-12 w-full" />
            ))}
          </div>
        ) : movimentsError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300 p-4">
            {movimentsError}
          </div>
        ) : !moviments || moviments.length === 0 ? (
          <div className="text-sm text-muted-foreground border rounded-lg p-4 text-center">
            Nenhuma movimentação encontrada.
          </div>
        ) : (
          <div className="space-y-2">
            {moviments.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border p-4 flex flex-col gap-2"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(m.createdAt)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${movimentTypeClass(m.type)}`}
                    >
                      {movimentTypeLabel(m.type)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {getConvertCashEntryOrigin(m.origin)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {m.method}
                    </span>
                    <span className="text-sm font-semibold">
                      {getFormatCurrency(m.value)}
                    </span>
                  </div>
                </div>
                {(m.description || m.responsible) && (
                  <div className="text-sm text-muted-foreground">
                    {m.description ? m.description : ""}
                    {m.description && m.responsible ? " • " : ""}
                    {m.responsible ? `Responsável: ${m.responsible}` : ""}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <div className="pt-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && onPageChange(page - 1)}
                    className={
                      page <= 1
                        ? "pointer-events-none opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={page === p}
                      onClick={() => onPageChange(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => page < pageCount && onPageChange(page + 1)}
                    className={
                      page >= pageCount
                        ? "pointer-events-none opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
