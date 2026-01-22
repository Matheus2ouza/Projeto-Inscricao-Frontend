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
const getPaymentIcon = (method: string) => {
  switch (method) {
    case "DINHEIRO":
      return <Banknote className="w-6 h-6" />;
    case "PIX":
      return <Smartphone className="w-6 h-6" />;
    case "CARTAO":
      return <CreditCard className="w-6 h-6" />;
    default:
      return <CreditCard className="w-6 h-6" />;
  }
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

              {/* Botão de Download */}
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
        {/* Resumo de Inscrições */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-gray-500" />
            <h2 className="text-2xl font-bold text-slate-800">Inscrições</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Arrecadado */}
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

            {/* Débitos Totais */}
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

            {/* Total de Inscrições */}
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

            {/* Participantes */}
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

        {/* Tipos de Inscrição */}
        {data.typeInscription.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-700">
                Tipos de Inscrição
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({data.countTypeInscription} tipos)
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.typeInscription.map((type) => (
                <div
                  key={type.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-slate-800">
                      {type.description}
                    </h4>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      {type.countParticipants} participantes
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Valor por participante
                      </p>
                      <p className="text-lg font-semibold text-slate-800">
                        {getFormatCurrency(type.amount)}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-sm text-slate-600">
                        Total:{" "}
                        <span className="font-semibold">
                          {getFormatCurrency(type.totalValue)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Inscrição Avulsa */}
        {data.inscriptionAvuls && (
          <section className="space-y-6">
            <div className="flex items-center justify-start">
              <h3 className="text-lg font-semibold text-slate-700">
                Inscrição Avulsa
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Participantes */}
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

              {/* Valor Arrecadado */}
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

              {/* Métodos de Pagamento */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                      Métodos de Pagamento
                    </p>
                    <p className="text-xl font-bold text-slate-800">
                      {data.inscriptionAvuls.byPaymentMethod.length}{" "}
                      registrado(s)
                    </p>
                  </div>
                  <div className="text-slate-400">
                    <CreditCard className="w-6 h-6" />
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
                  {data.inscriptionAvuls.byPaymentMethod.map((method) => (
                    <div
                      key={method.paymentMethod}
                      className="rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-slate-600">
                          {getPaymentIcon(method.paymentMethod)}
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {method.paymentMethod.charAt(0) +
                            method.paymentMethod.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-800 mb-1">
                        {getFormatCurrency(method.totalValue)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {method.countParticipants} participante(s)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Vendas de Ticket */}
        {data.ticketSale && (
          <section className="space-y-6">
            <div className="flex items-center justify-start">
              <h3 className="text-lg font-semibold text-slate-700">
                Vendas de Ticket
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Valor Vendido */}
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

              {/* Tickets Vendidos */}
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

            {/* Por Ticket */}
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
                          <span className="font-medium">{ticket.quantity}</span>
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

            {/* Por Método de Pagamento */}
            {data.ticketSale.byPaymentMethod.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  Por Método de Pagamento
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.ticketSale.byPaymentMethod.map((method) => (
                    <div
                      key={method.paymentMethod}
                      className="rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-slate-600">
                          {getPaymentIcon(method.paymentMethod)}
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {method.paymentMethod.charAt(0) +
                            method.paymentMethod.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-800 mb-1">
                        {getFormatCurrency(method.totalValue)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {method.count} venda(s)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Despesas */}
        {data.expenses && (
          <section className="space-y-6">
            <div className="flex items-center justify-start">
              <h3 className="text-lg font-semibold text-slate-700">Despesas</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Dinheiro */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-slate-600">
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

              {/* Pix */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-slate-600">
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

              {/* Cartão */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-slate-600">
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
                  {data.expenses.gastos.map((expense: ExpenseDetail) => (
                    <div
                      key={expense.id}
                      className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded flex items-center gap-1">
                          {expense.paymentMethod === "DINHEIRO" && (
                            <Banknote className="w-3 h-3" />
                          )}
                          {expense.paymentMethod === "PIX" && (
                            <Smartphone className="w-3 h-3" />
                          )}
                          {expense.paymentMethod === "CARTAO" && (
                            <CreditCard className="w-3 h-3" />
                          )}
                          {expense.paymentMethod}
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
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </CardContent>
    </Card>
  );
}
