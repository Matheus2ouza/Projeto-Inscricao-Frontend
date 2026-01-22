"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { getGradientClass } from "@/shared/utils/getGenerateGradient";
import { getInitial } from "@/shared/utils/getInitials";
import {
  Banknote,
  CalendarDays,
  CreditCard,
  Smartphone,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { ReportFinancialResponse } from "../../types/reportFinancial/reportFinancialTypes";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface ReportDetailsProps {
  data: ReportFinancialResponse | null;
  showDetails: boolean;
  onToggleDetails: (checked: boolean) => void;
  loading: boolean;
}

export default function ReportFinancialDetails({
  data,
  showDetails,
  onToggleDetails,
  loading,
}: ReportDetailsProps) {
  if (!data) return null;

  const gradientClass = getGradientClass(data.name);

  // Helper function for summary cards
  const renderSummaryCard = (
    label: string,
    value: string,
    valueColor: string,
    bgColor: string,
    borderColor: string,
    icon?: React.ReactNode,
    fullWidth: boolean = false,
  ) => (
    <div
      className={`rounded-xl border ${borderColor} ${bgColor} p-5 shadow-sm ${fullWidth ? "col-span-1 lg:col-span-2" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      {/* Header do Evento */}
      <div className="relative bg-gradient-to-br from-slate-50 to-white border-b">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Imagem do Evento */}
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

            {/* Informações do Evento */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
                  <Switch
                    id="show-details"
                    checked={showDetails}
                    onCheckedChange={onToggleDetails}
                    disabled={loading}
                  />
                  <Label
                    htmlFor="show-details"
                    className="text-sm font-medium text-slate-600 cursor-pointer"
                  >
                    Exibir Detalhes
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      <CardContent className="p-6 lg:p-8 space-y-8">
        {/* Resumo Financeiro Geral */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Wallet className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-800">
              Resumo Financeiro
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderSummaryCard(
              "Total Geral",
              currencyFormatter.format(data.totalGeral),
              "text-emerald-600",
              "bg-gradient-to-br from-emerald-50 to-white",
              "border-emerald-100",
              <Wallet className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Total Dinheiro",
              currencyFormatter.format(data.totalCash),
              "text-blue-600",
              "bg-gradient-to-br from-blue-50 to-white",
              "border-blue-100",
              <Banknote className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Total Cartão",
              currencyFormatter.format(data.totalCard),
              "text-indigo-600",
              "bg-gradient-to-br from-indigo-50 to-white",
              "border-indigo-100",
              <CreditCard className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Total Pix",
              currencyFormatter.format(data.totalPix),
              "text-violet-600",
              "bg-gradient-to-br from-violet-50 to-white",
              "border-violet-100",
              <Smartphone className="w-5 h-5" />,
            )}
          </div>

          {/* Total Gasto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {renderSummaryCard(
              "Total Gastos",
              currencyFormatter.format(data.totalSpent),
              "text-rose-600",
              "bg-gradient-to-br from-rose-50 to-white",
              "border-rose-100",
              <Wallet className="w-5 h-5" />,
              true,
            )}
          </div>
        </section>

        {/* Inscrições */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-700">Inscrições</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderSummaryCard(
              "Participantes",
              data.inscription.countParticipants.toString(),
              "text-slate-800",
              "bg-gradient-to-br from-slate-50 to-white",
              "border-slate-100",
              <Users className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Dinheiro",
              currencyFormatter.format(data.inscription.totalCash),
              "text-blue-600",
              "bg-gradient-to-br from-blue-50 to-white",
              "border-blue-100",
              <Banknote className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Cartão",
              currencyFormatter.format(data.inscription.totalCard),
              "text-indigo-600",
              "bg-gradient-to-br from-indigo-50 to-white",
              "border-indigo-100",
              <CreditCard className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Pix",
              currencyFormatter.format(data.inscription.totalPix),
              "text-violet-600",
              "bg-gradient-to-br from-violet-50 to-white",
              "border-violet-100",
              <Smartphone className="w-5 h-5" />,
            )}
          </div>

          {/* Detalhes das Inscrições */}
          {showDetails &&
            data.inscription.details &&
            data.inscription.details.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  Detalhes das Inscrições
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Total Pago
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Dinheiro
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Cartão
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Pix
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.inscription.details.map((detail) => (
                        <tr
                          key={detail.id}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {new Date(detail.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-slate-800">
                            {currencyFormatter.format(detail.totalPaid)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {currencyFormatter.format(detail.paidCash)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {currencyFormatter.format(detail.paidCard)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {currencyFormatter.format(detail.paidPix)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </section>

        {/* Inscrições Avulsas */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-700">
              Inscrições Avulsas
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderSummaryCard(
              "Participantes",
              data.inscriptionAvuls.countParticipants.toString(),
              "text-slate-800",
              "bg-gradient-to-br from-slate-50 to-white",
              "border-slate-100",
              <Users className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Dinheiro",
              currencyFormatter.format(data.inscriptionAvuls.totalCash),
              "text-blue-600",
              "bg-gradient-to-br from-blue-50 to-white",
              "border-blue-100",
              <Banknote className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Cartão",
              currencyFormatter.format(data.inscriptionAvuls.totalCard),
              "text-indigo-600",
              "bg-gradient-to-br from-indigo-50 to-white",
              "border-indigo-100",
              <CreditCard className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Pix",
              currencyFormatter.format(data.inscriptionAvuls.totalPix),
              "text-violet-600",
              "bg-gradient-to-br from-violet-50 to-white",
              "border-violet-100",
              <Smartphone className="w-5 h-5" />,
            )}
          </div>

          {/* Detalhes das Inscrições Avulsas */}
          {showDetails &&
            data.inscriptionAvuls.details &&
            data.inscriptionAvuls.details.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  Detalhes das Inscrições Avulsas
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Total Pago
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Dinheiro
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Cartão
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Pix
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.inscriptionAvuls.details.map((detail) => (
                        <tr
                          key={detail.id}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {new Date(detail.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-slate-800">
                            {currencyFormatter.format(detail.totalPaid)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {currencyFormatter.format(detail.paidCash)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {currencyFormatter.format(detail.paidCard)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {currencyFormatter.format(detail.paidPix)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </section>

        {/* Gastos */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-700">Gastos</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {renderSummaryCard(
              "Dinheiro",
              currencyFormatter.format(data.spent.totalCash),
              "text-blue-600",
              "bg-gradient-to-br from-blue-50 to-white",
              "border-blue-100",
              <Banknote className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Cartão",
              currencyFormatter.format(data.spent.totalCard),
              "text-indigo-600",
              "bg-gradient-to-br from-indigo-50 to-white",
              "border-indigo-100",
              <CreditCard className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Pix",
              currencyFormatter.format(data.spent.totalPix),
              "text-violet-600",
              "bg-gradient-to-br from-violet-50 to-white",
              "border-violet-100",
              <Smartphone className="w-5 h-5" />,
            )}
          </div>

          {/* Detalhes dos Gastos */}
          {showDetails &&
            data.spent.spentDetails &&
            data.spent.spentDetails.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  Detalhes dos Gastos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.spent.spentDetails.map((detail) => (
                    <div
                      key={detail.id}
                      className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-slate-700">
                          Gasto
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(detail.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-800">
                        {currencyFormatter.format(detail.totalSpent)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </section>
      </CardContent>
    </Card>
  );
}
