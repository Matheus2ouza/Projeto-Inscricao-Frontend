"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { Download, Loader2, RefreshCcw } from "lucide-react";
import { useMemo } from "react";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const periodFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const formatCurrency = (value: number) => currencyFormatter.format(value || 0);
const numberFormatter = new Intl.NumberFormat("pt-BR");
const formatNumber = (value: number) => numberFormatter.format(value || 0);
const formatDateTime = (value: Date) => dateFormatter.format(value);
const formatDateRange = (start: Date, end: Date) =>
  `${periodFormatter.format(start)} - ${periodFormatter.format(end)}`;

type Metric = {
  label: string;
  value: number;
  highlight?: boolean;
  formatter?: (value: number) => string;
};

const SummaryMetric = ({
  label,
  value,
  highlight = false,
  formatter = formatCurrency,
}: Metric) => {
  const baseClasses =
    "rounded-lg border border-border bg-background px-4 py-3 transition-all";
  const hoverClasses = highlight
    ? "hover:border-primary/50 hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
    : "hover:border-border/70 hover:bg-muted/30 hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)]";

  return (
    <div className={cn(baseClasses, "hover:-translate-y-[2px]", hoverClasses)}>
      <span className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
        {label}
      </span>
      <p className="mt-2 text-lg font-semibold text-foreground">
        {formatter(value)}
      </p>
    </div>
  );
};

const SectionSummary = ({
  total,
  totalDinheiro,
  totalPix,
  totalCartao,
}: {
  total: number;
  totalDinheiro: number;
  totalPix: number;
  totalCartao: number;
}) => {
  const metrics = [
    { label: "Total", value: total, highlight: true },
    { label: "Dinheiro", value: totalDinheiro, highlight: true },
    { label: "PIX", value: totalPix, highlight: true },
    { label: "Cartão", value: totalCartao, highlight: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <SummaryMetric
          key={metric.label}
          label={metric.label}
          value={metric.value}
          highlight={metric.highlight}
        />
      ))}
    </div>
  );
};

interface ReportDetailsProps {
  data: any;
  loading: boolean;
  isFetching: boolean;
  error: string | null;
  eventId: string;
  listPath: string;
  isDownloading: boolean;
  onDownload: () => Promise<void>;
  onRefresh: () => void;
}

export default function ReportDetails({
  data,
  loading,
  isFetching,
  error,
  eventId,
  listPath,
  isDownloading,
  onDownload,
  onRefresh,
}: ReportDetailsProps) {
  const hasData = Boolean(data);

  const financialMetrics = useMemo(
    () =>
      data
        ? [
            {
              label: "Total Geral",
              value: data.totais.totalGeral,
              highlight: true,
            },
            {
              label: "Montante Arrecadado",
              value: data.totais.totalArrecadado,
              highlight: true,
            },
            {
              label: "Total em Dinheiro",
              value: data.totais.totalDinheiro,
              highlight: true,
            },
            {
              label: "Total em PIX",
              value: data.totais.totalPix,
              highlight: true,
            },
            {
              label: "Total em Cartão",
              value: data.totais.totalCartao,
              highlight: true,
            },
            {
              label: "Total de Gastos",
              value: data.totais.totalGastos,
              highlight: true,
            },
          ]
        : [],
    [data]
  );

  const registrationMetrics = useMemo(
    () =>
      data
        ? [
            {
              label: "Inscrições (Grupos)",
              value: data.totais.totalInscricoesGrupo,
              highlight: true,
              formatter: formatNumber,
            },
            {
              label: "Participantes (Grupos)",
              value: data.totais.totalParticipantesGrupo,
              highlight: true,
              formatter: formatNumber,
            },
            {
              label: "Inscrições Avulsas",
              value: data.totais.totalInscricoesAvulsas,
              highlight: true,
              formatter: formatNumber,
            },
            {
              label: "Participantes Avulsos",
              value: data.totais.totalParticipantesAvulsos,
              highlight: true,
              formatter: formatNumber,
            },
            {
              label: "Participantes Totais",
              value: data.totais.totalParticipantes,
              highlight: true,
              formatter: formatNumber,
            },
          ]
        : [],
    [data]
  );

  const additionalMetrics = useMemo(
    () =>
      data
        ? [
            {
              label: "Tickets vendidos",
              value: data.tickets.vendas.reduce(
                (total: number, venda: any) => total + venda.quantitySold,
                0
              ),
              highlight: true,
              formatter: formatNumber,
            },
            {
              label: "Vendas de Tickets",
              value: data.tickets.vendas.length,
              highlight: true,
              formatter: formatNumber,
            },
            {
              label: "Gastos Registrados",
              value: data.gastos.gastos.length,
              highlight: true,
              formatter: formatNumber,
            },
          ]
        : [],
    [data]
  );

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-7xl px-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => void onDownload()}
              disabled={isDownloading}
              className="flex items-center gap-2"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isDownloading ? "Gerando..." : "Baixar relatório"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onRefresh();
              }}
              disabled={isFetching || loading}
              className="flex items-center gap-2"
            >
              {isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Atualizar
            </Button>
          </div>
        </div>

        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-xl" />
            ))}
          </div>
        )}

        {!loading && error && (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <p className="text-red-600 dark:text-red-400">
                {error ||
                  "Não foi possível carregar o relatório. Tente novamente."}
              </p>
              <Button onClick={() => onRefresh()} size="sm">
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {hasData && (
          <div className="space-y-6">
            <SectionSummary
              total={data.totais.totalGeral}
              totalDinheiro={data.totais.totalDinheiro}
              totalPix={data.totais.totalPix}
              totalCartao={data.totais.totalCartao}
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {financialMetrics.map((metric) => (
                <SummaryMetric key={metric.label} {...metric} />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {registrationMetrics.map((metric) => (
                <SummaryMetric key={metric.label} {...metric} />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {additionalMetrics.map((metric) => (
                <SummaryMetric key={metric.label} {...metric} />
              ))}
            </div>
            <div className="border-t border-border pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Formas</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.gastos.gastos.map((expense: any) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <span className="font-semibold">
                          {expense.description}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {expense.responsible}
                        </p>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(expense.value)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {expense.paymentMethod}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(new Date(expense.createdAt))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
