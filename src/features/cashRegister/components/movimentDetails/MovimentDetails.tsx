"use client";

import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatDateTime } from "@/shared/utils/formatDate";
import { getConvertCashEntryOrigin } from "@/shared/utils/getConvertCashEntryOrigin";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { Image, Splitter } from "antd";
import {
  Calendar,
  CreditCard,
  DollarSign,
  FileImage,
  FileText,
  Smartphone,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  CashEntryType,
  PaymentMethod,
  type MovimentDetailsBase,
  type Reference,
  type ReferenceParticipant,
} from "../../types/movimentDetails/movimentDetailsTypes";

interface MovimentDetailsProps {
  movimentDetails: MovimentDetailsBase | null;
  reference?: Reference | null;
  referenceId?: string | null;
}

export default function MovimentDetailsContent({
  movimentDetails,
  reference = null,
  referenceId = null,
}: MovimentDetailsProps) {
  const movimentTypeLabel = (type: CashEntryType) => {
    if (type === CashEntryType.INCOME) return "Entrada";
    if (type === CashEntryType.EXPENSE) return "Despesa";
    return "Retirada";
  };

  const movimentTypeValueClass = (type: CashEntryType) => {
    if (type === CashEntryType.INCOME)
      return "text-green-600 dark:text-green-400";
    if (type === CashEntryType.EXPENSE)
      return "text-rose-600 dark:text-rose-400";
    return "text-amber-600 dark:text-amber-400";
  };

  const movimentTypeBadgeClass = (type: CashEntryType) => {
    if (type === CashEntryType.INCOME) {
      return "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    }
    if (type === CashEntryType.EXPENSE) {
      return "bg-rose-500/15 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
    }
    return "bg-amber-500/15 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    const iconMap: Record<PaymentMethod, ReactNode> = {
      DINHEIRO: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      PIX: <Smartphone className="h-4 w-4 text-muted-foreground" />,
      CARTAO: <CreditCard className="h-4 w-4 text-muted-foreground" />,
    };
    return (
      iconMap[method] || (
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      )
    );
  };

  if (!movimentDetails) return null;

  const methodIcon = getPaymentMethodIcon(movimentDetails.method);
  const typeLabel = movimentTypeLabel(movimentDetails.type);
  const originLabel = getConvertCashEntryOrigin(movimentDetails.origin);

  const getReferenceLabel = (kind?: Reference["kind"]) => {
    switch (kind) {
      case "INSCRIPTION":
        return "Inscrição";
      case "ONSITE_REGISTRATION":
        return "Inscrição presencial";
      case "EVENT_EXPENSE":
        return "Despesa";
      case "TICKET_SALE":
        return "Venda de ingresso";
      case "UNKNOWN":
        return "Referência";
      default:
        return "Referência";
    }
  };

  const renderParticipants = (participants: ReferenceParticipant[]) => {
    if (!participants.length) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {participants.map((p, idx) => {
          const label = p.preferredName
            ? `${p.preferredName} (${p.name})`
            : p.name;
          return (
            <Badge key={`${p.name}-${idx}`} variant="outline">
              {label}
            </Badge>
          );
        })}
      </div>
    );
  };

  const renderReferenceDetails = () => {
    if (!reference) return null;

    switch (reference.kind) {
      case "INSCRIPTION": {
        const inscription = reference.inscription;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border bg-muted/10 p-3">
                <p className="text-xs text-muted-foreground">Parcela</p>
                <p className="font-mono break-all">
                  {reference.paymentInstallmentId}
                </p>
              </div>
              {inscription?.id && (
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Inscrição</p>
                  <p className="font-mono break-all">{inscription.id}</p>
                </div>
              )}
            </div>

            {inscription && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-semibold">{inscription.status}</p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Criado em</p>
                  <p className="font-semibold">
                    {formatDateTime(inscription.createdAt)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Valor total</p>
                  <p className="font-semibold">
                    {getFormatCurrency(inscription.totalValue)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Total pago</p>
                  <p className="font-semibold">
                    {getFormatCurrency(inscription.totalPaid)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <p className="font-semibold">
                    {inscription.isGuest ? "Convidado" : "Conta"}
                    {inscription.isGuest && inscription.guestName
                      ? ` • ${inscription.guestName}`
                      : ""}
                    {inscription.isGuest && inscription.guestEmail
                      ? ` • ${inscription.guestEmail}`
                      : ""}
                  </p>
                </div>
              </div>
            )}

            {inscription?.participants?.length ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Participantes
                </p>
                {renderParticipants(inscription.participants)}
              </div>
            ) : null}
          </div>
        );
      }
      case "ONSITE_REGISTRATION": {
        const reg = reference.onSiteRegistration;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border bg-muted/10 p-3">
                <p className="text-xs text-muted-foreground">
                  Inscrição presencial
                </p>
                <p className="font-mono break-all">
                  {reference.onSiteRegistrationId}
                </p>
              </div>
              {reg?.id && (
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Registro</p>
                  <p className="font-mono break-all">{reg.id}</p>
                </div>
              )}
            </div>
            {reg && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-semibold">{reg.status}</p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Criado em</p>
                  <p className="font-semibold">
                    {formatDateTime(reg.createdAt)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Valor</p>
                  <p className="font-semibold">
                    {getFormatCurrency(reg.totalValue)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Responsável</p>
                  <p className="font-semibold">{reg.responsible}</p>
                </div>
              </div>
            )}
          </div>
        );
      }
      case "EVENT_EXPENSE": {
        const exp = reference.eventExpense;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border bg-muted/10 p-3">
                <p className="text-xs text-muted-foreground">Despesa</p>
                <p className="font-mono break-all">
                  {reference.eventExpenseId}
                </p>
              </div>
              {exp?.id && (
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Registro</p>
                  <p className="font-mono break-all">{exp.id}</p>
                </div>
              )}
            </div>
            {exp && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border bg-muted/10 p-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Descrição</p>
                  <p className="font-semibold">{exp.description}</p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Valor</p>
                  <p className="font-semibold">
                    {getFormatCurrency(exp.value)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Método</p>
                  <p className="font-semibold">{exp.paymentMethod}</p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Responsável</p>
                  <p className="font-semibold">{exp.responsible}</p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Criado em</p>
                  <p className="font-semibold">
                    {formatDateTime(exp.createdAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      }
      case "TICKET_SALE": {
        const sale = reference.ticketSale;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border bg-muted/10 p-3">
                <p className="text-xs text-muted-foreground">Venda</p>
                <p className="font-mono break-all">{reference.ticketSaleId}</p>
              </div>
              {sale?.id && (
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Registro</p>
                  <p className="font-mono break-all">{sale.id}</p>
                </div>
              )}
            </div>
            {sale && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border bg-muted/10 p-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Comprador</p>
                  <p className="font-semibold">
                    {sale.name}
                    {sale.email ? ` • ${sale.email}` : ""}
                    {sale.phone ? ` • ${sale.phone}` : ""}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-semibold">{sale.status}</p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Valor total</p>
                  <p className="font-semibold">
                    {getFormatCurrency(sale.totalValue)}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Criado em</p>
                  <p className="font-semibold">
                    {formatDateTime(sale.createdAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      }
      case "UNKNOWN":
        return (
          <div className="rounded-md border bg-muted/10 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Referência</p>
            <p className="font-mono break-all">{reference.id}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-6">
            <div className="space-y-4 flex-1">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalhes da Movimentação
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide truncate">
                    {movimentDetails.responsible || "-"}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`h-5 px-2 text-[10px] ${movimentTypeBadgeClass(movimentDetails.type)}`}
                  >
                    {typeLabel.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary" className="h-5 px-2 text-[10px]">
                    {originLabel}
                  </Badge>
                </div>
                <div className="mt-2 font-mono text-xs text-muted-foreground break-all">
                  {movimentDetails.id}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Valor</span>
                  </div>
                  <p
                    className={`text-xl font-bold ${movimentTypeValueClass(movimentDetails.type)}`}
                  >
                    {getFormatCurrency(movimentDetails.value)}
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Tipo</span>
                  </div>
                  <Badge
                    className={`${movimentTypeBadgeClass(movimentDetails.type)} border-0 w-fit`}
                  >
                    {typeLabel}
                  </Badge>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {methodIcon}
                    <span className="text-sm font-medium">Método</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {movimentDetails.method}
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Registrado em</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatDateTime(movimentDetails.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 lg:hidden">
        {movimentDetails.description ? (
          <Card className="border-muted/20 bg-muted/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <FileText className="h-5 w-5" />
                Descrição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-white dark:bg-gray-800 border border-muted/20 rounded-md">
                <p className="text-muted-foreground">
                  {movimentDetails.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {reference ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Referências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">
                  {getReferenceLabel(reference.kind)}
                </Badge>
                {referenceId ? (
                  <Badge variant="outline" className="font-mono">
                    {referenceId}
                  </Badge>
                ) : null}
                {movimentDetails.eventId ? (
                  <Badge variant="outline" className="font-mono">
                    {movimentDetails.eventId}
                  </Badge>
                ) : null}
              </div>
              {renderReferenceDetails()}
            </CardContent>
          </Card>
        ) : null}

        {movimentDetails.imageUrl ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Comprovante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="max-w-lg">
                  <div className="w-5xs aspect-square overflow-hidden rounded-lg border bg-muted flex justify-center">
                    <Image
                      src={movimentDetails.imageUrl}
                      alt="Comprovante"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                      preview
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <div className="hidden lg:block">
        <Splitter>
          <Splitter.Panel defaultSize="60%" min="320">
            <div className="pr-3 space-y-6">
              {movimentDetails.description ? (
                <Card className="border-muted/20 bg-muted/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <FileText className="h-5 w-5" />
                      Descrição
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-white dark:bg-gray-800 border border-muted/20 rounded-md">
                      <p className="text-muted-foreground">
                        {movimentDetails.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {reference && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Referências
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">
                        {getReferenceLabel(reference.kind)}
                      </Badge>
                      {referenceId ? (
                        <Badge variant="outline" className="font-mono">
                          {referenceId}
                        </Badge>
                      ) : null}
                      {movimentDetails.eventId ? (
                        <Badge variant="outline" className="font-mono">
                          {movimentDetails.eventId}
                        </Badge>
                      ) : null}
                    </div>
                    {renderReferenceDetails()}
                  </CardContent>
                </Card>
              )}
            </div>
          </Splitter.Panel>
          <Splitter.Panel defaultSize="40%" min="320">
            <div className="pl-3">
              {movimentDetails.imageUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileImage className="h-5 w-5" />
                      Comprovante
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="max-w-lg">
                        <div className="w-5xs aspect-square overflow-hidden rounded-lg border bg-muted flex justify-center">
                          <Image
                            src={movimentDetails.imageUrl}
                            alt="Comprovante"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                            preview
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
    </div>
  );
}
