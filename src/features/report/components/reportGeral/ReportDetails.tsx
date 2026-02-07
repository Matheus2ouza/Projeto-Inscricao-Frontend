"use client";

import {
  ExpenseDetail,
  ReportGeneralResponse,
} from "@/features/report/types/reportGeral/reportTypes";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getGradientClass } from "@/shared/utils/getGenerateGradient";
import { getInitial } from "@/shared/utils/getInitials";
import {
  AlertCircle,
  Banknote,
  BarChart3,
  CalendarDays,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Smartphone,
  Ticket,
  TrendingUp,
  Users,
  UsersRound,
} from "lucide-react";
import Image from "next/image";

// Helper para ícones de pagamento
const getPaymentIcon = (method: string, className = "w-6 h-6") => {
  switch (method) {
    case "DINHEIRO":
      return <Banknote className={className} />;
    case "PIX":
      return <Smartphone className={className} />;
    case "CARTAO":
      return <CreditCard className={className} />;
    default:
      return <CreditCard className={className} />;
  }
};

type PaymentMethodTheme = {
  borderLeft: string;
  iconText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
};

const paymentMethodThemes: Record<string, PaymentMethodTheme> = {
  DINHEIRO: {
    borderLeft: "border-l-emerald-500",
    iconText: "text-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",
  },
  PIX: {
    borderLeft: "border-l-fuchsia-500",
    iconText: "text-fuchsia-600",
    badgeBg: "bg-fuchsia-50",
    badgeText: "text-fuchsia-700",
    badgeBorder: "border-fuchsia-200",
  },
  CARTAO: {
    borderLeft: "border-l-violet-500",
    iconText: "text-violet-600",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    badgeBorder: "border-violet-200",
  },
};

const getPaymentMethodTheme = (method: string): PaymentMethodTheme =>
  paymentMethodThemes[method] ?? {
    borderLeft: "border-l-slate-300",
    iconText: "text-slate-600",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-600",
    badgeBorder: "border-slate-200",
  };

type TypeInscriptionTheme = {
  dot: string;
  borderLeft: string;
};

const typeInscriptionThemes: TypeInscriptionTheme[] = [
  { dot: "bg-emerald-500", borderLeft: "border-l-emerald-500" },
  { dot: "bg-blue-500", borderLeft: "border-l-blue-500" },
  { dot: "bg-violet-500", borderLeft: "border-l-violet-500" },
  { dot: "bg-amber-500", borderLeft: "border-l-amber-500" },
  { dot: "bg-rose-500", borderLeft: "border-l-rose-500" },
  { dot: "bg-teal-500", borderLeft: "border-l-teal-500" },
  { dot: "bg-indigo-500", borderLeft: "border-l-indigo-500" },
  { dot: "bg-cyan-500", borderLeft: "border-l-cyan-500" },
];

const hashToIndex = (value: string, mod: number) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return mod === 0 ? 0 : hash % mod;
};

const getTypeInscriptionTheme = (key: string): TypeInscriptionTheme => {
  const idx = hashToIndex(key, typeInscriptionThemes.length);
  return typeInscriptionThemes[idx] ?? typeInscriptionThemes[0]!;
};

interface ReportDetailsProps {
  data: ReportGeneralResponse | null;
  isDownloading: boolean;
  onDownload: () => Promise<void>;
}

export default function ReportDetails({
  data,
  isDownloading,
  onDownload,
}: ReportDetailsProps) {
  if (!data) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </CardContent>
      </Card>
    );
  }

  const gradientClass = getGradientClass(data.name);
  const formatPaymentMethodLabel = (method: string) =>
    method.charAt(0) + method.slice(1).toLowerCase();
  const paymentMethodOrder = ["DINHEIRO", "PIX", "CARTAO"];
  const aggregateByPaymentMethod = (
    groups: Array<{
      byPaymentMethod: Array<{
        paymentMethod: string;
        countParticipants: number;
        totalValue: number;
      }>;
    }>,
  ) => {
    const map = new Map<
      string,
      { paymentMethod: string; countParticipants: number; totalValue: number }
    >();

    for (const group of groups) {
      for (const item of group.byPaymentMethod ?? []) {
        const current = map.get(item.paymentMethod);
        if (!current) {
          map.set(item.paymentMethod, {
            paymentMethod: item.paymentMethod,
            countParticipants: item.countParticipants,
            totalValue: item.totalValue,
          });
          continue;
        }

        map.set(item.paymentMethod, {
          paymentMethod: item.paymentMethod,
          countParticipants: current.countParticipants + item.countParticipants,
          totalValue: current.totalValue + item.totalValue,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const idxA = paymentMethodOrder.indexOf(a.paymentMethod);
      const idxB = paymentMethodOrder.indexOf(b.paymentMethod);
      const ordA = idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA;
      const ordB = idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB;
      if (ordA !== ordB) return ordA - ordB;
      return a.paymentMethod.localeCompare(b.paymentMethod);
    });
  };

  const normalCountParticipants = data.inscriptions.reduce(
    (acc, item) => acc + item.countParticipants,
    0,
  );
  const normalTotalValue = data.inscriptions.reduce(
    (acc, item) => acc + item.totalValue,
    0,
  );
  const normalByPaymentMethod = aggregateByPaymentMethod(data.inscriptions);

  const guestCountParticipants = data.guestInscriptions.reduce(
    (acc, item) => acc + item.countParticipants,
    0,
  );
  const guestTotalValue = data.guestInscriptions.reduce(
    (acc, item) => acc + item.totalValue,
    0,
  );
  const guestByPaymentMethod = aggregateByPaymentMethod(data.guestInscriptions);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="relative bg-gradient-to-br from-slate-50 to-white border-b">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="relative h-48 w-full lg:w-64 lg:h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-gradient-to-br from-slate-100 to-white">
                {data.image ? (
                  <Image
                    src={data.image}
                    alt={data.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 256px"
                    priority
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradientClass}`}
                  >
                    <h3 className="text-white text-6xl lg:text-7xl font-bold tracking-wider">
                      {getInitial(data.name)}
                    </h3>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium uppercase tracking-wider mb-3">
                    <CalendarDays className="w-3 h-3" />
                    Evento
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                    {data.name}
                  </h1>
                  <div className="flex items-center gap-4 text-slate-600">
                    <span className="text-sm font-medium">
                      {new Date(data.startDate).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-slate-400">—</span>
                    <span className="text-sm font-medium">
                      {new Date(data.endDate).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={onDownload}
                    disabled={isDownloading}
                    className="shadow-md"
                    size="lg"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading ? "Gerando PDF..." : "Baixar Relatório PDF"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </div>

        <CardContent className="p-6 lg:p-8 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-gray-500" />
              <h2 className="text-2xl font-bold text-slate-800">Inscrições</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total Arrecadado
                  </p>
                  <div className="text-slate-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-emerald-600">
                  {getFormatCurrency(data.totalValue)}
                </p>
              </div>

              <div className="rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Débitos Totais
                  </p>
                  <div className="text-slate-400">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-rose-600">
                  {getFormatCurrency(data.totalDebt)}
                </p>
              </div>

              <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total de Inscrições
                  </p>
                  <div className="text-slate-400">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {data.totalInscriptions.toString()}
                </p>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Participantes
                  </p>
                  <div className="text-slate-400">
                    <UsersRound className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-indigo-600">
                  {data.countParticipants.toString()}
                </p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>

      {data.typeInscriptions.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 lg:p-8 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-700">
                  Tipos de Inscrição Disponíveis
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({data.countTypeInscription} tipos)
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.typeInscriptions.map((type) => {
                  const theme = getTypeInscriptionTheme(type.id);

                  return (
                    <div
                      key={type.id}
                      className={`rounded-xl border border-slate-200 border-l-4 ${theme.borderLeft} bg-white p-5 shadow-sm hover:shadow-md transition-shadow`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${theme.dot}`}
                            />
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Tipo
                            </p>
                          </div>
                          <p className="font-medium text-slate-800 text-right truncate">
                            {type.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Valor unitário
                            </p>
                            <p className="text-lg font-semibold text-slate-800 whitespace-nowrap">
                              {getFormatCurrency(type.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </CardContent>
        </Card>
      )}

      {data.typeInscriptions.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 lg:p-8 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center justify-start">
                <h3 className="text-lg font-semibold text-slate-700">
                  Inscrições Normais
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Participantes
                      </p>
                      <p className="text-xl font-bold text-slate-800">
                        {normalCountParticipants.toString()}
                      </p>
                    </div>
                    <div className="text-slate-400">
                      <UsersRound className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Valor Arrecadado
                      </p>
                      <p className="text-xl font-bold text-slate-800">
                        {getFormatCurrency(normalTotalValue)}
                      </p>
                    </div>
                    <div className="text-slate-400">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              {normalByPaymentMethod.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                    Por Método de Pagamento
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {normalByPaymentMethod.map((method) => {
                      const theme = getPaymentMethodTheme(method.paymentMethod);

                      return (
                        <div
                          key={method.paymentMethod}
                          className={`rounded-lg border border-slate-200 border-l-4 ${theme.borderLeft} bg-white p-4`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={theme.iconText}>
                              {getPaymentIcon(method.paymentMethod)}
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {formatPaymentMethodLabel(method.paymentMethod)}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-slate-800 mb-1">
                            {getFormatCurrency(method.totalValue)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {method.countParticipants} participante(s)
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  Por Tipo de Inscrição
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.typeInscriptions.map((type, idx) => {
                  const theme = getTypeInscriptionTheme(type.id);
                  const inscription = data.inscriptions[idx];
                  const countParticipants = inscription?.countParticipants ?? 0;
                  const totalValue = inscription?.totalValue ?? 0;

                  return (
                    <div
                      key={type.id}
                      className={`rounded-xl border border-slate-200 border-l-4 ${theme.borderLeft} bg-white p-5 shadow-sm hover:shadow-md transition-shadow`}
                    >
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${theme.dot}`}
                          />
                          <h5 className="font-medium text-slate-800 truncate">
                            {type.description}
                          </h5>
                        </div>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full whitespace-nowrap">
                          {countParticipants} participante
                          {countParticipants !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Total
                          </p>
                          <p className="text-lg font-bold text-slate-800">
                            {getFormatCurrency(totalValue)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </CardContent>
        </Card>
      )}

      {data.typeInscriptions.length > 0 &&
        data.guestInscriptions.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 lg:p-8 space-y-8">
              <section className="space-y-6">
                <div className="flex items-center justify-start">
                  <h3 className="text-lg font-semibold text-slate-700">
                    Inscrições não associadas
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                          Participantes
                        </p>
                        <p className="text-xl font-bold text-slate-800">
                          {guestCountParticipants.toString()}
                        </p>
                      </div>
                      <div className="text-slate-400">
                        <UsersRound className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                          Valor Arrecadado
                        </p>
                        <p className="text-xl font-bold text-slate-800">
                          {getFormatCurrency(guestTotalValue)}
                        </p>
                      </div>
                      <div className="text-slate-400">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {guestByPaymentMethod.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                      Por Método de Pagamento
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {guestByPaymentMethod.map((method) => {
                        const theme = getPaymentMethodTheme(
                          method.paymentMethod,
                        );

                        return (
                          <div
                            key={method.paymentMethod}
                            className={`rounded-lg border border-slate-200 border-l-4 ${theme.borderLeft} bg-white p-4`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className={theme.iconText}>
                                {getPaymentIcon(method.paymentMethod)}
                              </div>
                              <span className="text-sm font-medium text-slate-700">
                                {formatPaymentMethodLabel(method.paymentMethod)}
                              </span>
                            </div>
                            <p className="text-lg font-bold text-slate-800 mb-1">
                              {getFormatCurrency(method.totalValue)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {method.countParticipants} participante(s)
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                    Por Tipo de Inscrição
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.typeInscriptions.map((type, idx) => {
                    const theme = getTypeInscriptionTheme(type.id);
                    const inscription = data.guestInscriptions[idx];
                    const countParticipants =
                      inscription?.countParticipants ?? 0;
                    const totalValue = inscription?.totalValue ?? 0;

                    return (
                      <div
                        key={type.id}
                        className={`rounded-xl border border-slate-200 border-l-4 ${theme.borderLeft} bg-white p-5 shadow-sm hover:shadow-md transition-shadow`}
                      >
                        <div className="flex justify-between items-start gap-3 mb-4">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${theme.dot}`}
                            />
                            <h5 className="font-medium text-slate-800 truncate">
                              {type.description}
                            </h5>
                          </div>
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full whitespace-nowrap">
                            {countParticipants} participante
                            {countParticipants !== 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-slate-100">
                          <div className="flex items-baseline justify-between gap-4">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Total
                            </p>
                            <p className="text-lg font-bold text-slate-800">
                              {getFormatCurrency(totalValue)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </CardContent>
          </Card>
        )}

      {data.inscriptionAvuls && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 lg:p-8 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center justify-start">
                <h3 className="text-lg font-semibold text-slate-700">
                  Inscrição Avulsa
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Participantes
                      </p>
                      <p className="text-xl font-bold text-slate-800">
                        {data.inscriptionAvuls.countParticipants.toString()}
                      </p>
                    </div>
                    <div className="text-slate-400">
                      <UsersRound className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Valor Arrecadado
                      </p>
                      <p className="text-xl font-bold text-slate-800">
                        {getFormatCurrency(data.inscriptionAvuls.totalValue)}
                      </p>
                    </div>
                    <div className="text-slate-400">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              {data.inscriptionAvuls.byPaymentMethod.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                    Por Método de Pagamento
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.inscriptionAvuls.byPaymentMethod.map((method) => {
                      const theme = getPaymentMethodTheme(method.paymentMethod);

                      return (
                        <div
                          key={method.paymentMethod}
                          className={`rounded-lg border border-slate-200 border-l-4 ${theme.borderLeft} bg-white p-4`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={theme.iconText}>
                              {getPaymentIcon(method.paymentMethod)}
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {formatPaymentMethodLabel(method.paymentMethod)}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-slate-800 mb-1">
                            {getFormatCurrency(method.totalValue)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {method.countParticipants} participante(s)
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </CardContent>
        </Card>
      )}

      {data.ticketSale && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 lg:p-8 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center justify-start">
                <h3 className="text-lg font-semibold text-slate-700">
                  Vendas de Ticket
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Valor Vendido
                      </p>
                      <p className="text-xl font-bold text-slate-800">
                        {getFormatCurrency(data.ticketSale.totalSales)}
                      </p>
                    </div>
                    <div className="text-slate-400">
                      <Ticket className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Tickets Vendidos
                      </p>
                      <p className="text-xl font-bold text-slate-800">
                        {data.ticketSale.totalTicketsSold.toString()}
                      </p>
                    </div>
                    <div className="text-slate-400">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              {data.ticketSale.byTicket.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                    Por Ticket
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.ticketSale.byTicket.map((ticket) => (
                      <div
                        key={ticket.ticketId}
                        className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
                      >
                        <h5 className="font-medium text-slate-800 mb-2">
                          {ticket.ticketName}
                        </h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Quantidade:</span>
                            <span className="font-medium">
                              {ticket.quantity}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Total:</span>
                            <span className="font-semibold text-slate-800">
                              {getFormatCurrency(ticket.totalValue)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.ticketSale.byPaymentMethod.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                    Por Método de Pagamento
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.ticketSale.byPaymentMethod.map((method) => {
                      const theme = getPaymentMethodTheme(method.paymentMethod);

                      return (
                        <div
                          key={method.paymentMethod}
                          className={`rounded-lg border border-slate-200 border-l-4 ${theme.borderLeft} bg-white p-4`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={theme.iconText}>
                              {getPaymentIcon(method.paymentMethod)}
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {formatPaymentMethodLabel(method.paymentMethod)}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-slate-800 mb-1">
                            {getFormatCurrency(method.totalValue)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {method.count} venda(s)
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </CardContent>
        </Card>
      )}

      {data.expenses && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 lg:p-8 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center justify-start">
                <h3 className="text-lg font-semibold text-slate-700">
                  Despesas
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className={`rounded-xl border border-slate-200 border-l-4 ${getPaymentMethodTheme("DINHEIRO").borderLeft} bg-white p-5`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={getPaymentMethodTheme("DINHEIRO").iconText}>
                      <Banknote className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      Dinheiro
                    </span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">
                    {getFormatCurrency(data.expenses.totalDinheiro)}
                  </p>
                </div>

                <div
                  className={`rounded-xl border border-slate-200 border-l-4 ${getPaymentMethodTheme("PIX").borderLeft} bg-white p-5`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={getPaymentMethodTheme("PIX").iconText}>
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      Pix
                    </span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">
                    {getFormatCurrency(data.expenses.totalPix)}
                  </p>
                </div>

                <div
                  className={`rounded-xl border border-slate-200 border-l-4 ${getPaymentMethodTheme("CARTAO").borderLeft} bg-white p-5`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={getPaymentMethodTheme("CARTAO").iconText}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      Cartão
                    </span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">
                    {getFormatCurrency(data.expenses.totalCartao)}
                  </p>
                </div>
              </div>

              {data.expenses.gastos.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                    Detalhes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.expenses.gastos.map((expense: ExpenseDetail) => {
                      const theme = getPaymentMethodTheme(
                        expense.paymentMethod,
                      );

                      return (
                        <div
                          key={expense.id}
                          className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded border flex items-center gap-1 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
                            >
                              {getPaymentIcon(expense.paymentMethod, "w-3 h-3")}
                              {formatPaymentMethodLabel(expense.paymentMethod)}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {new Date(expense.createdAt).toLocaleDateString(
                                "pt-BR",
                              )}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-slate-800 mb-2">
                            {getFormatCurrency(expense.value)}
                          </p>
                          <p className="text-sm text-slate-600">
                            {expense.description}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            Responsável: {expense.responsible}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
