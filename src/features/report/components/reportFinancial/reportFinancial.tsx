'use client';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Switch } from '@/shared/components/ui/switch';
import { generateGradientClass } from '@/shared/utils/generateGradient';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { getInitial } from '@/shared/utils/getInitials';
import {
  Banknote,
  CalendarDays,
  CreditCard,
  Download,
  Loader2,
  Smartphone,
  Users,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import { ReportFinancialResponse } from '../../types/reportFinancial/reportFinancialTypes';

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
  const gradientClass = generateGradientClass();

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
      className={`rounded-xl border ${borderColor} ${bgColor} p-5 shadow-sm ${fullWidth ? 'col-span-1 lg:col-span-2' : ''}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
          {label}
        </p>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {/* Header do Evento */}
      <div className="relative border-b bg-gradient-to-br from-slate-50 to-white">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Imagem do Evento */}
            <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-white shadow-md lg:h-48 lg:w-64">
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
                  className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradientClass}`}
                >
                  <h3 className="text-6xl font-bold tracking-wider text-white lg:text-7xl">
                    {getInitial(data.name)}
                  </h3>
                </div>
              )}
            </div>

            {/* Informações do Evento */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium tracking-wider text-slate-600 uppercase">
                    <CalendarDays className="h-3 w-3" />
                    Evento
                  </div>
                  <h1 className="mb-2 text-3xl font-bold text-slate-800 lg:text-4xl">
                    {data.name}
                  </h1>
                  <div className="flex items-center gap-4 text-slate-600">
                    <span className="text-sm font-medium">
                      {new Date(data.startDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-slate-400">—</span>
                    <span className="text-sm font-medium">
                      {new Date(data.endDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 shadow-sm">
                    <Switch
                      id="show-details"
                      checked={showDetails}
                      onCheckedChange={onToggleDetails}
                      disabled={loading}
                    />
                    <Label
                      htmlFor="show-details"
                      className="cursor-pointer text-sm font-medium text-slate-600"
                    >
                      Exibir Detalhes
                    </Label>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        disabled={isDownloading || loading}
                      >
                        {isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        {isDownloading ? 'Baixando...' : 'Baixar PDF'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="leading-none font-medium">
                            Opções de Download
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Configure o conteúdo do arquivo PDF.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg border bg-slate-50 p-3">
                          <Switch
                            id="pdf-details"
                            checked={detailsPdf}
                            onCheckedChange={onTogglePdfDetails}
                          />
                          <Label
                            htmlFor="pdf-details"
                            className="cursor-pointer text-sm font-medium"
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
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="mr-2 h-4 w-4" />
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

      <CardContent className="space-y-8 p-6 lg:p-8">
        {/* Resumo Financeiro Geral */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Wallet className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-800">
              Resumo Financeiro
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {renderSummaryCard(
              'Total Geral',
              getFormatCurrency(data.totalGeral),
              'text-emerald-600',
              'bg-gradient-to-br from-emerald-50 to-white',
              'border-emerald-100',
              <Wallet className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Total Dinheiro',
              getFormatCurrency(data.totalCash),
              'text-blue-600',
              'bg-gradient-to-br from-blue-50 to-white',
              'border-blue-100',
              <Banknote className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Total Cartão',
              getFormatCurrency(data.totalCard),
              'text-indigo-600',
              'bg-gradient-to-br from-indigo-50 to-white',
              'border-indigo-100',
              <CreditCard className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Total Pix',
              getFormatCurrency(data.totalPix),
              'text-violet-600',
              'bg-gradient-to-br from-violet-50 to-white',
              'border-violet-100',
              <Smartphone className="h-5 w-5" />,
            )}
          </div>

          {/* Total Gasto */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {renderSummaryCard(
              'Total Gastos',
              getFormatCurrency(data.totalSpent),
              'text-rose-600',
              'bg-gradient-to-br from-rose-50 to-white',
              'border-rose-100',
              <Wallet className="h-5 w-5" />,
              true,
            )}
          </div>
        </section>

        {/* Inscrições */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-700">Inscrições</h3>
            <span className="text-sm font-medium text-slate-600">
              Total: {getFormatCurrency(data.inscription.totalGeral)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {renderSummaryCard(
              'Participantes',
              data.inscription.countParticipants.toString(),
              'text-slate-800',
              'bg-gradient-to-br from-slate-50 to-white',
              'border-slate-100',
              <Users className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Dinheiro',
              getFormatCurrency(data.inscription.totalCash),
              'text-blue-600',
              'bg-gradient-to-br from-blue-50 to-white',
              'border-blue-100',
              <Banknote className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Cartão',
              getFormatCurrency(data.inscription.totalCard),
              'text-indigo-600',
              'bg-gradient-to-br from-indigo-50 to-white',
              'border-indigo-100',
              <CreditCard className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Pix',
              getFormatCurrency(data.inscription.totalPix),
              'text-violet-600',
              'bg-gradient-to-br from-violet-50 to-white',
              'border-violet-100',
              <Smartphone className="h-5 w-5" />,
            )}
          </div>

          {/* Detalhes das Inscrições */}
          {showDetails &&
            data.inscription.details &&
            data.inscription.details.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium tracking-wider text-slate-600 uppercase">
                  Detalhes das Inscrições
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Data
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Total Pago
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Dinheiro
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Cartão
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
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
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {new Date(detail.createdAt).toLocaleDateString(
                              'pt-BR',
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                            {getFormatCurrency(detail.totalPaid)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {getFormatCurrency(detail.paidCash)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {getFormatCurrency(detail.paidCard)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
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
            <span className="text-sm font-medium text-slate-600">
              Total: {getFormatCurrency(data.inscriptionAvuls.totalGeral)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {renderSummaryCard(
              'Participantes',
              data.inscriptionAvuls.countParticipants.toString(),
              'text-slate-800',
              'bg-gradient-to-br from-slate-50 to-white',
              'border-slate-100',
              <Users className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Dinheiro',
              getFormatCurrency(data.inscriptionAvuls.totalCash),
              'text-blue-600',
              'bg-gradient-to-br from-blue-50 to-white',
              'border-blue-100',
              <Banknote className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Cartão',
              getFormatCurrency(data.inscriptionAvuls.totalCard),
              'text-indigo-600',
              'bg-gradient-to-br from-indigo-50 to-white',
              'border-indigo-100',
              <CreditCard className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Pix',
              getFormatCurrency(data.inscriptionAvuls.totalPix),
              'text-violet-600',
              'bg-gradient-to-br from-violet-50 to-white',
              'border-violet-100',
              <Smartphone className="h-5 w-5" />,
            )}
          </div>

          {/* Detalhes das Inscrições Avulsas */}
          {showDetails &&
            data.inscriptionAvuls.details &&
            data.inscriptionAvuls.details.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium tracking-wider text-slate-600 uppercase">
                  Detalhes das Inscrições Avulsas
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Data
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Total Pago
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Dinheiro
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Cartão
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
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
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {new Date(detail.createdAt).toLocaleDateString(
                              'pt-BR',
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                            {getFormatCurrency(detail.totalPaid)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {getFormatCurrency(detail.paidCash)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {getFormatCurrency(detail.paidCard)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
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
            <span className="text-sm font-medium text-slate-600">
              Total: {getFormatCurrency(data.ticketsSale.totalGeral)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {renderSummaryCard(
              'Tickets Vendidos',
              data.ticketsSale.countTickets.toString(),
              'text-slate-800',
              'bg-gradient-to-br from-slate-50 to-white',
              'border-slate-100',
              <Users className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Dinheiro',
              getFormatCurrency(data.ticketsSale.totalCash),
              'text-blue-600',
              'bg-gradient-to-br from-blue-50 to-white',
              'border-blue-100',
              <Banknote className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Cartão',
              getFormatCurrency(data.ticketsSale.totalCard),
              'text-indigo-600',
              'bg-gradient-to-br from-indigo-50 to-white',
              'border-indigo-100',
              <CreditCard className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Pix',
              getFormatCurrency(data.ticketsSale.totalPix),
              'text-violet-600',
              'bg-gradient-to-br from-violet-50 to-white',
              'border-violet-100',
              <Smartphone className="h-5 w-5" />,
            )}
          </div>

          {/* Detalhes da Venda de Tickets */}
          {showDetails &&
            data.ticketsSale.details &&
            data.ticketsSale.details.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium tracking-wider text-slate-600 uppercase">
                  Detalhes dos Tickets
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Dinheiro
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Cartão
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
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
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                            {getFormatCurrency(detail.total)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {getFormatCurrency(detail.totalCash)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {getFormatCurrency(detail.totalCard)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
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
            <span className="text-sm font-medium text-slate-600">
              Total: {getFormatCurrency(data.spent.totalGeral)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {renderSummaryCard(
              'Dinheiro',
              getFormatCurrency(data.spent.totalCash),
              'text-blue-600',
              'bg-gradient-to-br from-blue-50 to-white',
              'border-blue-100',
              <Banknote className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Cartão',
              getFormatCurrency(data.spent.totalCard),
              'text-indigo-600',
              'bg-gradient-to-br from-indigo-50 to-white',
              'border-indigo-100',
              <CreditCard className="h-5 w-5" />,
            )}
            {renderSummaryCard(
              'Pix',
              getFormatCurrency(data.spent.totalPix),
              'text-violet-600',
              'bg-gradient-to-br from-violet-50 to-white',
              'border-violet-100',
              <Smartphone className="h-5 w-5" />,
            )}
          </div>

          {/* Detalhes dos Gastos */}
          {showDetails &&
            data.spent.spentDetails &&
            data.spent.spentDetails.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium tracking-wider text-slate-600 uppercase">
                  Detalhes dos Gastos
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Data
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Responsável
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                          Método
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
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
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {new Date(detail.createdAt).toLocaleDateString(
                              'pt-BR',
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-800">
                            {detail.responsible}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {detail.paymentMethod}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800">
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
