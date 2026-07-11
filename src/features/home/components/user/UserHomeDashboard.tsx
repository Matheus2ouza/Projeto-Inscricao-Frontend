'use client';

import type { GetDashboardUserResponse } from '@/features/home/apis/user/dashboard';
import type { DashboardUserMetric } from '@/features/home/hooks/user/useDashboardUser';
import { useDates } from '@/features/home/hooks/user/useDates';
import DismissibleAlert from '@/shared/components/DismissibleAlert';
import { Badge } from '@/shared/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { getConvertStatusEvent } from '@/shared/utils/getConvertStatus';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarIcon,
  Clock3,
  Info,
  Percent,
  RefreshCcw,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState, type ElementType } from 'react';

type UserHomeDashboardProps = {
  data?: GetDashboardUserResponse;
  loading?: boolean;
  isFetching?: boolean;
  refreshingMetric?: DashboardUserMetric | null;
  onRefreshMetric?: (metric: DashboardUserMetric) => void;
};

export default function UserHomeDashboard({
  data,
  loading = false,
  isFetching = false,
  refreshingMetric = null,
  onRefreshMetric,
}: UserHomeDashboardProps) {
  const [infoOpen, setInfoOpen] = useState<DashboardUserMetric | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const eventDates = useDates();

  const statusColors: Record<string, string> = {
    OPEN: 'bg-emerald-500',
    CLOSE: 'bg-amber-500',
    FINALIZED: 'bg-slate-400',
    'EM ANDAMENTO': 'bg-blue-500',
  };

  const infoTexts: Record<DashboardUserMetric, string> = {
    events: 'Quantidade de eventos ativos e publicados na sua região.',
    inscriptions:
      'Total de inscrições que você possui no evento mais próximo, incluindo participantes e pendências.',
    payments:
      'Resumo dos valores já pagos e pendentes das suas inscrições no evento mais próximo.',
  };

  const cards: {
    title: string;
    subtitle: string;
    stripe: { color: string; bg: string; border: string };
    textColor: string;
    metric: DashboardUserMetric;
    value: string;
    detail?: string;
    subItems?: {
      icon: ElementType;
      iconColor?: string;
      label: string;
      value: string;
    }[];
  }[] = [
    {
      title: 'Eventos ativos',
      subtitle: 'Eventos publicados',
      stripe: {
        color: 'rgba(59, 130, 246, 0.5)',
        bg: 'rgba(59, 130, 246, 0.15)',
        border: 'border-blue-200',
      },
      textColor: 'text-blue-700',
      metric: 'events',
      value: `${data?.events?.activeEvents ?? 0} evento(s)`,
    },
    {
      title: 'Minhas inscrições',
      subtitle: 'Resumo geral',
      stripe: {
        color: 'rgba(16, 185, 129, 0.5)',
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'border-emerald-200',
      },
      textColor: 'text-emerald-700',
      metric: 'inscriptions',
      value: `${data?.inscriptions?.countTotalInscriptions ?? 0} inscrição(ões)`,
      subItems: [
        {
          icon: Users,
          iconColor: 'text-emerald-600',
          label: 'Participantes',
          value: `${data?.inscriptions?.countTotalParticipants ?? 0}`,
        },
        {
          icon: Clock3,
          iconColor: 'text-amber-500',
          label: 'Pendentes',
          value: `${data?.inscriptions?.countPendingInscriptions ?? 0}`,
        },
      ],
    },
    {
      title: 'Pagamentos',
      subtitle: 'Acompanhamento',
      stripe: {
        color: 'rgba(248, 113, 113, 0.55)',
        bg: 'rgba(248, 113, 113, 0.16)',
        border: 'border-rose-200',
      },
      textColor: 'text-rose-700',
      metric: 'payments',
      value: getFormatCurrency(data?.payments?.countTotalDebt ?? 0),
      subItems: [
        {
          icon: Wallet,
          iconColor: 'text-emerald-600',
          label: 'Pago',
          value: getFormatCurrency(data?.payments?.countTotalPaid ?? 0),
        },
        {
          icon: Percent,
          iconColor: 'text-blue-600',
          label: 'Concluído',
          value: `${data?.payments?.debtCompletionPercentage ?? 0}%`,
        },
      ],
    },
  ];

  const eventsByDay = useMemo(() => {
    const events = eventDates.events ?? [];
    const map = new Map<
      string,
      { id: string; name: string; status: string; displayStatus: string }[]
    >();

    const today = new Date();

    events.forEach((evt) => {
      const start = new Date(evt.startDate);
      const end = new Date(evt.endDate);
      const normalizedStatus = (evt.status ?? 'OPEN').toUpperCase();
      const displayStatus = isWithinInterval(today, { start, end })
        ? 'EM ANDAMENTO'
        : normalizedStatus;

      let cursor = start;
      while (cursor <= end) {
        const key = format(cursor, 'yyyy-MM-dd');
        const list = map.get(key) ?? [];
        list.push({
          id: evt.id,
          name: evt.name,
          status: normalizedStatus,
          displayStatus,
        });
        map.set(key, list);
        cursor = addDays(cursor, 1);
      }
    });

    return map;
  }, [eventDates.events]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });

    const days: Date[] = [];
    let cursor = start;
    while (cursor <= end) {
      days.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return days;
  }, [currentMonth]);

  const eventsSelectedDay =
    eventsByDay.get(format(selectedDate, 'yyyy-MM-dd')) ?? [];

  return (
    <>
      <DismissibleAlert
        id="system-documentation-available"
        title="Documentação Disponível"
        asModal={true}
      >
        Agora você pode consultar a documentação completa do sistema para tirar
        suas dúvidas sobre inscrições, pagamentos e eventos.
        <Link
          href="/documentation"
          className="ml-1 font-semibold underline underline-offset-2"
        >
          Acesse a documentação
        </Link>
      </DismissibleAlert>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
          Resumo
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const isRefreshing =
              loading || isFetching || refreshingMetric === card.metric;

            return (
              <div
                key={card.metric}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                      {card.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {card.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Atualizar card"
                      className="hover:bg-muted rounded-full p-1.5 transition-colors"
                      onClick={() => onRefreshMetric?.(card.metric)}
                      disabled={isRefreshing}
                    >
                      <RefreshCcw
                        className={`h-4 w-4 ${
                          isRefreshing
                            ? 'text-primary animate-spin'
                            : 'text-gray-500'
                        }`}
                      />
                    </button>
                    <Popover
                      open={infoOpen === card.metric}
                      onOpenChange={(open) =>
                        setInfoOpen(open ? card.metric : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          aria-label="Abrir detalhes do card"
                          className="hover:bg-muted rounded-full p-1.5 transition-colors"
                        >
                          <Info className="h-4 w-4 text-blue-500" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 rounded-2xl border bg-white shadow-lg dark:bg-gray-900">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-foreground text-sm font-semibold">
                              {card.title}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {infoTexts[card.metric]}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label="Fechar"
                            className="hover:bg-muted rounded-full p-1 transition-colors"
                            onClick={() => setInfoOpen(null)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {isRefreshing ? '...' : card.value}
                  </p>
                  {card.detail && (
                    <p className="text-muted-foreground text-sm">
                      {card.detail}
                    </p>
                  )}
                </div>
                <div
                  className={`h-3 w-full overflow-hidden rounded-full border ${card.stripe.border}`}
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, ${card.stripe.color}, ${card.stripe.color} 10px, ${card.stripe.bg} 10px, ${card.stripe.bg} 20px)`,
                  }}
                />
                {card.subItems && (
                  <div className="text-muted-foreground space-y-2 text-sm">
                    {card.subItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              className={`h-4 w-4 ${item.iconColor ?? 'text-muted-foreground'}`}
                            />
                            <span>{item.label}</span>
                          </div>
                          <span className="text-foreground font-semibold">
                            {item.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-8 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Calendário de eventos
              </h3>
              <p className="text-muted-foreground text-sm">
                Visualize rapidamente os eventos ativos por período.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Badge
                  variant="outline"
                  className="gap-2 border-emerald-300 bg-emerald-50 text-emerald-700"
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Ativos
                </Badge>
                <Badge
                  variant="outline"
                  className="gap-2 border-blue-300 bg-blue-50 text-blue-700"
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                  Período
                </Badge>
              </div>
            </div>
            <button
              type="button"
              className="hover:bg-muted rounded-full p-2 transition-colors"
              onClick={() => eventDates.refetch()}
              aria-label="Atualizar calendário"
            >
              <RefreshCcw
                className={`h-4 w-4 ${
                  eventDates.loading || eventDates.isFetching
                    ? 'text-primary animate-spin'
                    : 'text-gray-500'
                }`}
              />
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                aria-label="Mês anterior"
                className="hover:bg-muted rounded-full p-2 transition-colors"
                onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              >
                <span className="text-lg">&lt;</span>
              </button>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {format(currentMonth, 'LLLL yyyy', { locale: ptBR })}
              </div>
              <button
                type="button"
                aria-label="Próximo mês"
                className="hover:bg-muted rounded-full p-2 transition-colors"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <span className="text-lg">&gt;</span>
              </button>
            </div>
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm text-blue-700 hover:underline"
                onClick={() => {
                  const today = new Date();
                  setCurrentMonth(today);
                  setSelectedDate(today);
                }}
              >
                <CalendarIcon className="h-4 w-4" />
                Hoje
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-blue-700">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-sm">
              {calendarDays.map((day) => {
                const eventsDay =
                  eventsByDay.get(format(day, 'yyyy-MM-dd')) ?? [];
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = isSameDay(day, selectedDate);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    className={`relative rounded-lg py-2 text-center transition-colors ${
                      isSelected
                        ? 'bg-blue-100 font-semibold text-blue-700'
                        : 'hover:bg-muted'
                    } ${!isCurrentMonth ? 'text-muted-foreground/70' : ''}`}
                    aria-label={format(day, "dd 'de' LLLL yyyy", {
                      locale: ptBR,
                    })}
                    onClick={() => setSelectedDate(day)}
                  >
                    <span>{format(day, 'd')}</span>
                    {eventsDay.length > 0 && (
                      <div className="mt-1 flex items-center justify-center gap-0.5">
                        {eventsDay.slice(0, 3).map((evt) => (
                          <span
                            key={evt.id}
                            className={`h-1.5 w-1.5 rounded-full ${
                              statusColors[evt.displayStatus] ??
                              'bg-emerald-500'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
            <div className="flex items-center gap-2 font-semibold text-blue-700">
              <CalendarIcon className="h-4 w-4" />
              {format(selectedDate, 'dd/MM/yyyy')}
            </div>
            <div className="mt-2 space-y-2">
              {eventsSelectedDay.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Nenhum evento agendado para esta data.
                </p>
              )}
              {eventsSelectedDay.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-800"
                >
                  <Link
                    href={`/user/events/${evt.id}`}
                    className="text-foreground cursor-pointer font-semibold hover:underline"
                  >
                    {evt.name}
                  </Link>
                  <Badge
                    variant="outline"
                    className={`gap-1 border text-xs ${
                      statusColors[evt.displayStatus]
                        ? 'border-transparent'
                        : ''
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        statusColors[evt.displayStatus] ?? 'bg-emerald-500'
                      }`}
                    />
                    {getConvertStatusEvent(evt.displayStatus)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Destaque
          </h3>
          <p className="text-muted-foreground text-sm">
            Conteúdos e destaques em breve.
          </p>
          <div className="text-muted-foreground mt-4 flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-300 text-sm dark:border-gray-700">
            Em construção
          </div>
        </div>
      </div>
    </>
  );
}
