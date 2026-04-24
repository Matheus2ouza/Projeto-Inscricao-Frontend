'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/chart';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { SyncOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import type { FutureRelease } from '../../types/cashRegisterDetails/actions/futureReleasesTypes';

interface FutureReleasesChartProps {
  futureReleases?: FutureRelease[];
  loading?: boolean;
  error?: string | null;
  onRefetch?: () => void;
}

const futureReleasesChartConfig: ChartConfig = {
  amount: {
    label: 'Valor',
    color: '#2563eb',
  },
};

export function FutureReleasesChart({
  futureReleases = [],
  loading = false,
  error = null,
  onRefetch,
}: FutureReleasesChartProps) {
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

  const hasData = futureReleasesChartData.length > 0;

  if (!loading && !error && !hasData) return null;

  return (
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
          onClick={onRefetch}
          icon={<SyncOutlined />}
          loading={loading && { icon: <SyncOutlined spin /> }}
          disabled={!onRefetch}
        >
          Recarregar
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-[220px] w-full" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : !hasData ? null : (
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
  );
}

