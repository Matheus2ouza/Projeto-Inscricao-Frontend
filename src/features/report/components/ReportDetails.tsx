"use client";

import {
  ExpenseDetail,
  ExpensesReport,
  ReportGeneralResponse,
  TicketSaleByPaymentMethod,
} from "@/features/report/types/reportTypes";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Image from "next/image";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface ReportDetailsProps {
  data: ReportGeneralResponse | null;
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
  isDownloading,
  onDownload,
}: ReportDetailsProps) {
  if (loading || isFetching) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 text-center text-destructive font-semibold">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card className="border-0 shadow-sm space-y-6">
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative h-28 w-full overflow-hidden rounded-3xl border border-border/40 bg-muted lg:w-1/3">
            {data.image ? (
              <Image
                src={data.image}
                alt={data.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 280px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                {data.name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Evento
            </span>
            <p className="text-2xl font-semibold">{data.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(data.startDate).toLocaleDateString("pt-BR")} -{" "}
              {new Date(data.endDate).toLocaleDateString("pt-BR")}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button size="sm" onClick={onDownload} disabled={isDownloading}>
                {isDownloading ? "Gerando PDF..." : "Baixar PDF"}
              </Button>
            </div>
          </div>
        </div>
        <div className="pt-4">
          <p className="text-lg font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Inscrições
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Total arrecadado
            </span>
            <p className="mt-2 font-semibold">
              {currencyFormatter.format(data.totalValue)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Débitos totais
            </span>
            <p className="mt-2 font-semibold text-destructive">
              {currencyFormatter.format(data.totalDebt)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Inscrições
            </span>
            <p className="mt-2 font-semibold">{data.totalInscriptions}</p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Participantes
            </span>
            <p className="mt-2 font-semibold">{data.countParticipants}</p>
          </div>
        </div>
        {data.typeInscription.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Tipos de inscrição ({data.countTypeInscription} tipos)
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.typeInscription.map((type) => (
                <div
                  key={type.id}
                  className="rounded-lg border border-border/50 bg-white/80 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{type.description}</span>
                    <span>{type.countParticipants} participantes</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Valor por participante
                    </p>
                    <p className="text-base font-semibold">
                      {currencyFormatter.format(type.amount)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Total: {currencyFormatter.format(type.totalValue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.inscriptionAvuls && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Inscrição avulsa
              </p>
              <span className="text-xs text-muted-foreground">
                Total:{" "}
                {currencyFormatter.format(data.inscriptionAvuls.totalValue)}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border/50 bg-white/80 p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Participantes
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {data.inscriptionAvuls.countParticipants}
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-white/80 p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Valor arrecadado
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {currencyFormatter.format(data.inscriptionAvuls.totalValue)}
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-white/80 p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Métodos de pagamento
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {data.inscriptionAvuls.byPaymentMethod.length} registrado(s)
                </p>
              </div>
            </div>
            {data.inscriptionAvuls.byPaymentMethod.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.inscriptionAvuls.byPaymentMethod.map((method) => (
                  <div
                    key={method.paymentMethod}
                    className="rounded-lg border border-border/50 bg-white/80 p-4 shadow-sm"
                  >
                    <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {method.paymentMethod}
                    </div>
                    <p className="mt-1 text-lg font-semibold">
                      {currencyFormatter.format(method.totalValue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {method.countParticipants} participantes
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {data.ticketSale && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Vendas de ticket
              </p>
              <span className="text-xs text-muted-foreground">
                Total: {currencyFormatter.format(data.ticketSale.totalSales)}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border/50 bg-white/80 p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Valor vendido
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {currencyFormatter.format(data.ticketSale.totalSales)}
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-white/80 p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Tickets vendidos
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {data.ticketSale.totalTicketsSold}
                </p>
              </div>
            </div>
            {data.ticketSale.byTicket.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Por ticket
                </p>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {data.ticketSale.byTicket.map((ticket) => (
                    <div
                      key={ticket.ticketId}
                      className="rounded-lg border border-border/50 bg-white/80 p-4 shadow-sm"
                    >
                      <div className="text-sm font-semibold text-foreground">
                        {ticket.ticketName}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Quantidade: {ticket.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total: {currencyFormatter.format(ticket.totalValue)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.ticketSale.byPaymentMethod.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Por método de pagamento
                </p>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {data.ticketSale.byPaymentMethod.map(
                    (method: TicketSaleByPaymentMethod) => (
                      <div
                        key={method.paymentMethod}
                        className="rounded-lg border border-border/50 bg-white/80 p-4 shadow-sm"
                      >
                        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          {method.paymentMethod.toUpperCase()}
                        </div>
                        <p className="text-base font-semibold">
                          {currencyFormatter.format(method.totalValue)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {method.count} venda(s)
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {data.expenses && (
          <ExpensesSection title="Despesas" report={data.expenses} />
        )}
        {data.gastos && <ExpensesSection title="Gastos" report={data.gastos} />}
      </CardContent>
    </Card>
  );
}

function ExpensesSection({
  title,
  report,
}: {
  title: string;
  report: ExpensesReport;
}) {
  const paymentMethods: [string, number][] = [
    ["Dinheiro", report.totalDinheiro],
    ["Pix", report.totalPix],
    ["Cartão", report.totalCartao],
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {title}
        </p>
        <span className="text-xs text-muted-foreground">
          Total: {currencyFormatter.format(report.total)}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {paymentMethods.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-border/50 bg-white/80 p-4 shadow-sm"
          >
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {label}
            </div>
            <p className="mt-1 text-lg font-semibold">
              {currencyFormatter.format(value)}
            </p>
          </div>
        ))}
      </div>
      {report.gastos.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Detalhes
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {report.gastos.map((expense: ExpenseDetail) => (
              <div
                key={expense.id}
                className="rounded-lg border border-border/50 bg-white/80 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {expense.paymentMethod}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(expense.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <p className="text-base font-semibold mt-2">
                  {currencyFormatter.format(expense.value)}
                </p>
                <p className="text-sm">{expense.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {expense.responsible}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
