"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Switch } from "@/shared/components/ui/switch";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getGradientClass } from "@/shared/utils/getGenerateGradient";
import { getInitial } from "@/shared/utils/getInitials";
import {
  Banknote,
  CalendarDays,
  CreditCard,
  Download,
  Loader2,
  Smartphone,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { ReportFinancialResponse } from "../../types/reportFinancial/reportFinancialTypes";

interface ReportDetailsProps {
  data: ReportFinancialResponse | null;
  showDetails: boolean;
  loading: boolean;
  isDownloading: boolean;
  detailsPdf: boolean;
  onToggleDetails: (checked: boolean) => void;
  onTogglePdfDetails: (checked: boolean) => void;
  onDownload: (details: boolean) => Promise<void>;
}

export default function ReportFinancialDetails({
  data,
  showDetails,
  loading,
  isDownloading,
  detailsPdf,
  onToggleDetails,
  onTogglePdfDetails,
  onDownload,
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

                <div className="flex items-center gap-3">
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

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 gap-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        disabled={isDownloading || loading}
                      >
                        {isDownloading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        {isDownloading ? "Baixando..." : "Baixar PDF"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            Opções de Download
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Configure o conteúdo do arquivo PDF.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-3 bg-slate-50">
                          <Switch
                            id="pdf-details"
                            checked={detailsPdf}
                            onCheckedChange={onTogglePdfDetails}
                          />
                          <Label
                            htmlFor="pdf-details"
                            className="text-sm font-medium cursor-pointer"
                          >
                            Incluir detalhes (tabelas)
                          </Label>
                        </div>
                        <Button
                          onClick={() => onDownload(detailsPdf)}
                          disabled={isDownloading}
                          className="w-full"
                        >
                          {isDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Download className="w-4 h-4 mr-2" />
                          )}
                          Confirmar Download
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
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
              getFormatCurrency(data.totalGeral),
              "text-emerald-600",
              "bg-gradient-to-br from-emerald-50 to-white",
              "border-emerald-100",
              <Wallet className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Total Dinheiro",
              getFormatCurrency(data.totalCash),
              "text-blue-600",
              "bg-gradient-to-br from-blue-50 to-white",
              "border-blue-100",
              <Banknote className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Total Cartão",
              getFormatCurrency(data.totalCard),
              "text-indigo-600",
              "bg-gradient-to-br from-indigo-50 to-white",
              "border-indigo-100",
              <CreditCard className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Total Pix",
              getFormatCurrency(data.totalPix),
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
              getFormatCurrency(data.totalSpent),
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
            <h3 className="text-xl font-semibold text-slate-700">Inscrições</h3>
            <span className="text-sm text-slate-600 font-medium">
              Total: {getFormatCurrency(data.inscription.totalGeral)}
            </span>
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
              getFormatCurrency(data.inscription.totalCash),
              "text-blue-600",
              "bg-gradient-to-br from-blue-50 to-white",
              "border-blue-100",
              <Banknote className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Cartão",
              getFormatCurrency(data.inscription.totalCard),
              "text-indigo-600",
              "bg-gradient-to-br from-indigo-50 to-white",
              "border-indigo-100",
              <CreditCard className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Pix",
              getFormatCurrency(data.inscription.totalPix),
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
                            {getFormatCurrency(detail.totalPaid)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {getFormatCurrency(detail.paidCash)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {getFormatCurrency(detail.paidCard)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {getFormatCurrency(detail.paidPix)}
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
            <h3 className="text-xl font-semibold text-slate-700">
              Inscrições Avulsas
            </h3>
            <span className="text-sm text-slate-600 font-medium">
              Total: {getFormatCurrency(data.inscriptionAvuls.totalGeral)}
            </span>
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
              getFormatCurrency(data.inscriptionAvuls.totalCash),
              "text-blue-600",
              "bg-gradient-to-br from-blue-50 to-white",
              "border-blue-100",
              <Banknote className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Cartão",
              getFormatCurrency(data.inscriptionAvuls.totalCard),
              "text-indigo-600",
              "bg-gradient-to-br from-indigo-50 to-white",
              "border-indigo-100",
              <CreditCard className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Pix",
              getFormatCurrency(data.inscriptionAvuls.totalPix),
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
                            {getFormatCurrency(detail.totalPaid)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {getFormatCurrency(detail.paidCash)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {getFormatCurrency(detail.paidCard)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {getFormatCurrency(detail.paidPix)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </section>

        {/* Venda de Tickets */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-700">
              Venda de Tickets
            </h3>
            <span className="text-sm text-slate-600 font-medium">
              Total: {getFormatCurrency(data.ticketsSale.totalGeral)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderSummaryCard(
              "Tickets Vendidos",
              data.ticketsSale.countTickets.toString(),
              "text-slate-800",
              "bg-gradient-to-br from-slate-50 to-white",
              "border-slate-100",
              <Users className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Dinheiro",
              getFormatCurrency(data.ticketsSale.totalCash),
              "text-blue-600",
              "bg-gradient-to-br from-blue-50 to-white",
              "border-blue-100",
              <Banknote className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Cartão",
              getFormatCurrency(data.ticketsSale.totalCard),
              "text-indigo-600",
              "bg-gradient-to-br from-indigo-50 to-white",
              "border-indigo-100",
              <CreditCard className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Pix",
              getFormatCurrency(data.ticketsSale.totalPix),
              "text-violet-600",
              "bg-gradient-to-br from-violet-50 to-white",
              "border-violet-100",
              <Smartphone className="w-5 h-5" />,
            )}
          </div>

          {/* Detalhes da Venda de Tickets */}
          {showDetails &&
            data.ticketsSale.details &&
            data.ticketsSale.details.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  Detalhes dos Tickets
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Total
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
                      {data.ticketsSale.details.map((detail) => (
                        <tr
                          key={detail.id}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >
                          <td className="py-3 px-4 text-sm font-semibold text-slate-800">
                            {getFormatCurrency(detail.total)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {getFormatCurrency(detail.totalCash)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {getFormatCurrency(detail.totalCard)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {getFormatCurrency(detail.totalPix)}
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
            <h3 className="text-xl font-semibold text-slate-700">Gastos</h3>
            <span className="text-sm text-slate-600 font-medium">
              Total: {getFormatCurrency(data.spent.totalGeral)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {renderSummaryCard(
              "Dinheiro",
              getFormatCurrency(data.spent.totalCash),
              "text-blue-600",
              "bg-gradient-to-br from-blue-50 to-white",
              "border-blue-100",
              <Banknote className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Cartão",
              getFormatCurrency(data.spent.totalCard),
              "text-indigo-600",
              "bg-gradient-to-br from-indigo-50 to-white",
              "border-indigo-100",
              <CreditCard className="w-5 h-5" />,
            )}
            {renderSummaryCard(
              "Pix",
              getFormatCurrency(data.spent.totalPix),
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Responsável
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Método
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Valor
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.spent.spentDetails.map((detail) => (
                        <tr
                          key={detail.id}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {new Date(detail.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-800">
                            {detail.responsible}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {detail.paymentMethod}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-slate-800">
                            {getFormatCurrency(detail.totalSpent)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </section>
      </CardContent>
    </Card>
  );
}
