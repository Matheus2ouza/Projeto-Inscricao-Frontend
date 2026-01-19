"use client";

import type { DashboardAdminResponse } from "@/features/home/api/admin/dashboard";
import type { DashboardMetric } from "@/features/home/hook/admin/useAdminDashboard";
import { useEventDates } from "@/features/home/hook/admin/useEventDates";
import DismissibleAlert from "@/shared/components/DismissibleAlert";
import { Badge } from "@/shared/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { getConvertStatusEvent } from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
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
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Info, RefreshCcw, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type AdminManagerHomeDashboardProps = {
  data?: DashboardAdminResponse;
  loading?: boolean;
  isFetching?: boolean;
  refreshingMetric?: DashboardMetric | null;
  onRefreshMetric?: (metric: DashboardMetric) => void;
};

export default function AdminManagerHomeDashboard({
  data,
  loading = false,
  isFetching = false,
  refreshingMetric = null,
  onRefreshMetric,
}: AdminManagerHomeDashboardProps) {
  const [infoOpen, setInfoOpen] = useState<DashboardMetric | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const eventDates = useEventDates();
  const statusColors: Record<string, string> = {
    OPEN: "bg-emerald-500",
    CLOSE: "bg-amber-500",
    FINALIZED: "bg-slate-400",
    "EM ANDAMENTO": "bg-blue-500",
  };
  const infoTexts: Record<DashboardMetric, string> = {
    totalCollected:
      "Valor total arrecadado pelas inscrições do evento mais próximo (inclui somente pagamentos aprovados).",

    totalDebt:
      "Soma de todos os valores pendentes das inscrições ainda não pagas no evento mais próximo.",

    activeEvents:
      "Quantidade de eventos ativos e publicados atualmente na região.",

    activeParticipants:
      "Número total de participantes confirmados no evento mais próximo (inclui apenas inscrições ativas).",
  };

  const cards: {
    title: string;
    subtitle: string;
    stripe: { color: string; bg: string; border: string };
    textColor: string;
    metric: DashboardMetric;
    value: string;
    detailLabel: string;
  }[] = [
    {
      title: "Total recebido",
      subtitle: "Recebimentos confirmados",
      stripe: {
        color: "rgba(16, 185, 129, 0.5)",
        bg: "rgba(16, 185, 129, 0.15)",
        border: "border-emerald-200",
      },
      textColor: "text-emerald-600",
      metric: "totalCollected",
      value: getFormatCurrency(data?.totalCollected ?? 0),
      detailLabel: "Recebido",
    },
    {
      title: "A receber",
      subtitle: "Inscrições em aberto",
      stripe: {
        color: "rgba(248, 113, 113, 0.55)",
        bg: "rgba(248, 113, 113, 0.16)",
        border: "border-rose-200",
      },
      textColor: "text-rose-600",
      metric: "totalDebt",
      value: getFormatCurrency(data?.totalDebt ?? 0),
      detailLabel: "Em aberto",
    },
    {
      title: "Eventos ativos",
      subtitle: "Eventos publicados",
      stripe: {
        color: "rgba(59, 130, 246, 0.5)",
        bg: "rgba(59, 130, 246, 0.15)",
        border: "border-blue-200",
      },
      textColor: "text-blue-700",
      metric: "activeEvents",
      value: `${data?.activeEvents ?? 0} evento(s)`,
      detailLabel: "Eventos",
    },
    {
      title: "Participantes",
      subtitle: "Participantes inscritos",
      stripe: {
        color: "rgba(245, 158, 11, 0.55)",
        bg: "rgba(245, 158, 11, 0.16)",
        border: "border-amber-200",
      },
      textColor: "text-amber-700",
      metric: "activeParticipants",
      value: `${data?.activeParticipants ?? 0} participante(s)`,
      detailLabel: "Participantes",
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
      const normalizedStatus = (evt.status ?? "OPEN").toUpperCase();
      const displayStatus = isWithinInterval(today, { start, end })
        ? "EM ANDAMENTO"
        : normalizedStatus;

      let cursor = start;
      while (cursor <= end) {
        const key = format(cursor, "yyyy-MM-dd");
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
    eventsByDay.get(format(selectedDate, "yyyy-MM-dd")) ?? [];

  return (
    <>
      {/* Aviso sobre desenvolvimento */}
      <DismissibleAlert
        id="system-development-warning"
        title="Sistema em Desenvolvimento"
        variant="warning"
        asModal={true}
      >
        O sistema ainda está em fase de desenvolvimento, e algumas
        funcionalidades podem não estar finalizadas ou funcionar de forma
        diferente do esperado. Recomendamos utilizá-lo em um{" "}
        <strong>computador (desktop)</strong> para uma melhor experiência, mas
        ele também pode ser acessado pelo celular.
      </DismissibleAlert>

      <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Situação das cobranças
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card) => {
            const isRefreshing =
              loading || isFetching || refreshingMetric === card.metric;

            return (
              <div
                key={card.metric}
                className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-xs flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                      {card.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {card.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Atualizar card"
                      className="p-1.5 rounded-full hover:bg-muted transition-colors"
                      onClick={() => onRefreshMetric?.(card.metric)}
                      disabled={isRefreshing}
                    >
                      <RefreshCcw
                        className={`w-4 h-4 ${
                          isRefreshing
                            ? "animate-spin text-primary"
                            : "text-gray-500"
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
                          className="p-1.5 rounded-full hover:bg-muted transition-colors"
                        >
                          <Info className="w-4 h-4 text-blue-500" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 rounded-2xl shadow-lg border bg-white dark:bg-gray-900">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {card.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {infoTexts[card.metric]}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label="Fechar"
                            className="p-1 rounded-full hover:bg-muted transition-colors"
                            onClick={() => setInfoOpen(null)}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {isRefreshing ? "..." : card.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {card.detailLabel}
                  </p>
                </div>
                <div
                  className={`h-3 w-full rounded-full overflow-hidden border ${card.stripe.border}`}
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, ${card.stripe.color}, ${card.stripe.color} 10px, ${card.stripe.bg} 10px, ${card.stripe.bg} 20px)`,
                  }}
                />
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Calendário de eventos
              </h3>
              <p className="text-sm text-muted-foreground">
                Visualize rapidamente os eventos ativos por período.
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
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
              className="p-2 rounded-full hover:bg-muted transition-colors"
              onClick={() => eventDates.refetch()}
              aria-label="Atualizar calendário"
            >
              <RefreshCcw
                className={`w-4 h-4 ${
                  eventDates.loading || eventDates.isFetching
                    ? "animate-spin text-primary"
                    : "text-gray-500"
                }`}
              />
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                aria-label="Mês anterior"
                className="p-2 rounded-full hover:bg-muted transition-colors"
                onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              >
                <span className="text-lg">&lt;</span>
              </button>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {format(currentMonth, "LLLL yyyy", { locale: ptBR })}
              </div>
              <button
                type="button"
                aria-label="Próximo mês"
                className="p-2 rounded-full hover:bg-muted transition-colors"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <span className="text-lg">&gt;</span>
              </button>
            </div>
            <div className="flex justify-end mb-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm text-blue-700 hover:underline"
                onClick={() => {
                  const today = new Date();
                  setCurrentMonth(today);
                  setSelectedDate(today);
                }}
              >
                <CalendarIcon className="w-4 h-4" />
                Hoje
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs font-semibold text-blue-700 mb-2">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-sm">
              {calendarDays.map((day) => {
                const eventsDay =
                  eventsByDay.get(format(day, "yyyy-MM-dd")) ?? [];
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = isSameDay(day, selectedDate);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    className={`relative rounded-lg py-2 text-center transition-colors ${
                      isSelected
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "hover:bg-muted"
                    } ${!isCurrentMonth ? "text-muted-foreground/70" : ""}`}
                    aria-label={format(day, "dd 'de' LLLL yyyy", {
                      locale: ptBR,
                    })}
                    onClick={() => setSelectedDate(day)}
                  >
                    <span>{format(day, "d")}</span>
                    {eventsDay.length > 0 && (
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {eventsDay.slice(0, 3).map((evt) => (
                          <span
                            key={evt.id}
                            className={`h-1.5 w-1.5 rounded-full ${statusColors[evt.displayStatus] ?? "bg-emerald-500"}`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="flex items-center gap-2 text-blue-700 font-semibold">
              <CalendarIcon className="w-4 h-4" />
              {format(selectedDate, "dd/MM/yyyy")}
            </div>
            <div className="mt-2 space-y-2">
              {eventsSelectedDay.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum evento agendado para esta data.
                </p>
              )}
              {eventsSelectedDay.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm flex items-center justify-between"
                >
                  <Link
                    href={`/admin/events/manager/${evt.id}`}
                    className="font-semibold text-foreground hover:underline cursor-pointer"
                  >
                    {evt.name}
                  </Link>
                  <Badge
                    variant="outline"
                    className={`text-xs gap-1 border ${statusColors[evt.displayStatus] ? "border-transparent" : ""}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${statusColors[evt.displayStatus] ?? "bg-emerald-500"}`}
                    />
                    {getConvertStatusEvent(evt.displayStatus)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Benefícios
          </h3>
          <p className="text-sm text-muted-foreground">
            Conteúdos e destaques em breve.
          </p>
          <div className="mt-4 h-32 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-sm text-muted-foreground">
            Em construção
          </div>
        </div>
      </div>
    </>
  );
}
