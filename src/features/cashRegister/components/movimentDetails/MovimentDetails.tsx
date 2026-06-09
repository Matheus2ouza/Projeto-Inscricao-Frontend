'use client';

import ImageViewer from '@/shared/components/ImageViewer';
import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { formatDateTime } from '@/shared/utils/formatDate';
import { getConvertCashEntryOrigin } from '@/shared/utils/getConvertCashEntryOrigin';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import {
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Smartphone,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
  CashEntryType,
  PaymentMethod,
  type MovimentDetailsBase,
  type Reference,
  type ReferenceParticipant,
} from '../../types/movimentDetails/movimentDetailsTypes';

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
    if (type === CashEntryType.INCOME) return 'Entrada';
    if (type === CashEntryType.EXPENSE) return 'Despesa';
    return 'Retirada';
  };

  const movimentTypeValueClass = (type: CashEntryType) => {
    if (type === CashEntryType.INCOME)
      return 'text-green-600 dark:text-green-400';
    if (type === CashEntryType.EXPENSE)
      return 'text-rose-600 dark:text-rose-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  const movimentTypeBadgeClass = (type: CashEntryType) => {
    if (type === CashEntryType.INCOME) {
      return 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
    }
    if (type === CashEntryType.EXPENSE) {
      return 'bg-rose-500/15 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300';
    }
    return 'bg-amber-500/15 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    const iconMap: Record<PaymentMethod, ReactNode> = {
      DINHEIRO: <DollarSign className="text-muted-foreground h-4 w-4" />,
      PIX: <Smartphone className="text-muted-foreground h-4 w-4" />,
      CARTAO: <CreditCard className="text-muted-foreground h-4 w-4" />,
    };
    return (
      iconMap[method] || (
        <DollarSign className="text-muted-foreground h-4 w-4" />
      )
    );
  };

  if (!movimentDetails) return null;

  const methodIcon = getPaymentMethodIcon(movimentDetails.method);
  const typeLabel = movimentTypeLabel(movimentDetails.type);
  const originLabel = getConvertCashEntryOrigin(movimentDetails.origin);
  const imageUrls = movimentDetails.imageUrls || [];

  const getReferenceLabel = (kind?: Reference['kind']) => {
    switch (kind) {
      case 'INSCRIPTION':
        return 'Inscrição';
      case 'ONSITE_REGISTRATION':
        return 'Inscrição presencial';
      case 'EVENT_EXPENSE':
        return 'Despesa';
      case 'TICKET_SALE':
        return 'Venda de ingresso';
      case 'UNKNOWN':
        return 'Referência';
      default:
        return 'Referência';
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
      case 'INSCRIPTION': {
        const inscription = reference.inscription;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="bg-muted/10 rounded-md border p-3">
                <p className="text-muted-foreground text-xs">Parcela</p>
                <p className="font-mono break-all">
                  {reference.paymentInstallmentId}
                </p>
              </div>
              {inscription?.id && (
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Inscrição</p>
                  <p className="font-mono break-all">{inscription.id}</p>
                </div>
              )}
            </div>

            {inscription && (
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Status</p>
                  <p className="font-semibold">{inscription.status}</p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Criado em</p>
                  <p className="font-semibold">
                    {formatDateTime(inscription.createdAt)}
                  </p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Valor total</p>
                  <p className="font-semibold">
                    {getFormatCurrency(inscription.totalValue)}
                  </p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Total pago</p>
                  <p className="font-semibold">
                    {getFormatCurrency(inscription.totalPaid)}
                  </p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3 sm:col-span-2">
                  <p className="text-muted-foreground text-xs">Tipo</p>
                  <p className="font-semibold">
                    {inscription.isGuest ? 'Convidado' : 'Conta'}
                    {inscription.isGuest && inscription.guestName
                      ? ` • ${inscription.guestName}`
                      : ''}
                    {inscription.isGuest && inscription.guestEmail
                      ? ` • ${inscription.guestEmail}`
                      : ''}
                  </p>
                </div>
              </div>
            )}

            {inscription?.participants?.length ? (
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Participantes
                </p>
                {renderParticipants(inscription.participants)}
              </div>
            ) : null}
          </div>
        );
      }
      case 'ONSITE_REGISTRATION': {
        const reg = reference.onSiteRegistration;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="bg-muted/10 rounded-md border p-3">
                <p className="text-muted-foreground text-xs">
                  Inscrição presencial
                </p>
                <p className="font-mono break-all">
                  {reference.onSiteRegistrationId}
                </p>
              </div>
              {reg?.id && (
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Registro</p>
                  <p className="font-mono break-all">{reg.id}</p>
                </div>
              )}
            </div>
            {reg && (
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Status</p>
                  <p className="font-semibold">{reg.status}</p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Criado em</p>
                  <p className="font-semibold">
                    {formatDateTime(reg.createdAt)}
                  </p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Valor</p>
                  <p className="font-semibold">
                    {getFormatCurrency(reg.totalValue)}
                  </p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Responsável</p>
                  <p className="font-semibold">{reg.responsible}</p>
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'EVENT_EXPENSE': {
        const exp = reference.eventExpense;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="bg-muted/10 rounded-md border p-3">
                <p className="text-muted-foreground text-xs">Despesa</p>
                <p className="font-mono break-all">
                  {reference.eventExpenseId}
                </p>
              </div>
              {exp?.id && (
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Registro</p>
                  <p className="font-mono break-all">{exp.id}</p>
                </div>
              )}
            </div>
            {exp && (
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="bg-muted/10 rounded-md border p-3 sm:col-span-2">
                  <p className="text-muted-foreground text-xs">Descrição</p>
                  <p className="font-semibold">{exp.description}</p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Valor</p>
                  <p className="font-semibold">
                    {getFormatCurrency(exp.value)}
                  </p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Método</p>
                  <p className="font-semibold">{exp.paymentMethod}</p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Responsável</p>
                  <p className="font-semibold">{exp.responsible}</p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Criado em</p>
                  <p className="font-semibold">
                    {formatDateTime(exp.createdAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'TICKET_SALE': {
        const sale = reference.ticketSale;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="bg-muted/10 rounded-md border p-3">
                <p className="text-muted-foreground text-xs">Venda</p>
                <p className="font-mono break-all">{reference.ticketSaleId}</p>
              </div>
              {sale?.id && (
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Registro</p>
                  <p className="font-mono break-all">{sale.id}</p>
                </div>
              )}
            </div>
            {sale && (
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="bg-muted/10 rounded-md border p-3 sm:col-span-2">
                  <p className="text-muted-foreground text-xs">Comprador</p>
                  <p className="font-semibold">
                    {sale.name}
                    {sale.email ? ` • ${sale.email}` : ''}
                    {sale.phone ? ` • ${sale.phone}` : ''}
                  </p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Status</p>
                  <p className="font-semibold">{sale.status}</p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Valor total</p>
                  <p className="font-semibold">
                    {getFormatCurrency(sale.totalValue)}
                  </p>
                </div>
                <div className="bg-muted/10 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">Criado em</p>
                  <p className="font-semibold">
                    {formatDateTime(sale.createdAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'UNKNOWN':
        return (
          <div className="bg-muted/10 rounded-md border p-3 text-sm">
            <p className="text-muted-foreground text-xs">Referência</p>
            <p className="font-mono break-all">{reference.id}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Card principal do gasto */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="p-6">
          <div className="flex flex-col items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalhes da Movimentação
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="text-muted-foreground truncate text-sm font-medium tracking-wide uppercase">
                    {movimentDetails.responsible || '-'}
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
                <div className="text-muted-foreground mt-2 font-mono text-xs break-all">
                  {movimentDetails.id}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <DollarSign className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Valor</span>
                  </div>
                  <p
                    className={`text-xl font-bold ${movimentTypeValueClass(movimentDetails.type)}`}
                  >
                    {getFormatCurrency(movimentDetails.value)}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Tipo</span>
                  </div>
                  <Badge
                    className={`${movimentTypeBadgeClass(movimentDetails.type)} w-fit border-0`}
                  >
                    {typeLabel}
                  </Badge>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    {methodIcon}
                    <span className="text-sm font-medium">Método</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {movimentDetails.method}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
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

      {/* Descrição */}
      {movimentDetails.description && (
        <Card className="border-muted/20 bg-muted/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <FileText className="h-5 w-5" />
              Descrição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-muted/20 rounded-md border bg-white p-3 dark:bg-gray-800">
              <p className="text-muted-foreground">
                {movimentDetails.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referências */}
      {reference && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Referências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="outline">
                {getReferenceLabel(reference.kind)}
              </Badge>
              {referenceId && (
                <Badge variant="outline" className="font-mono">
                  {referenceId}
                </Badge>
              )}
              {movimentDetails.eventId && (
                <Badge variant="outline" className="font-mono">
                  {movimentDetails.eventId}
                </Badge>
              )}
            </div>
            {renderReferenceDetails()}
          </CardContent>
        </Card>
      )}

      {/* Imagens/Comprovantes */}
      {imageUrls.length > 0 && (
        <ImageViewer images={imageUrls} size="small" title="Comprovantes" />
      )}
    </div>
  );
}
