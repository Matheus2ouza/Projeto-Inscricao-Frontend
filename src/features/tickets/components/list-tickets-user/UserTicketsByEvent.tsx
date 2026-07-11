'use client';

import type { TicketsByEventResponse } from '@/features/tickets/types/analysis/ticketsTypes';
import { cn } from '@/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { getAvailabilityState } from '@/shared/utils/getAvailabilityState';
import { getFontSizeClass } from '@/shared/utils/getFontSizeClass';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { Check, Copy, ExternalLink, Ticket, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

type UserTicketsByEventProps = {
  event?: TicketsByEventResponse;
  onSelectTicket: (ticketId: string) => void;
};

export function UserTicketsByEvent({
  event,
  onSelectTicket,
}: UserTicketsByEventProps) {
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
  });

  const [copied, setCopied] = useState(false);
  const tickets = event?.tickets ?? [];
  const canPurchase = Boolean(event?.ticketEnabled);

  const ticketPageUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    return `${window.location.origin}/events/tickets/${event?.id}`;
  }, [event?.id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ticketPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Falha ao copiar link de tickets', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-stretch">
          <div className="relative w-full md:w-1/2">
            {event?.imageUrl ? (
              <div className="relative w-full overflow-hidden rounded-xl">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                </AspectRatio>
              </div>
            ) : (
              <div className="bg-muted flex h-56 w-full items-center justify-center rounded-xl">
                <Ticket className="text-muted-foreground h-12 w-12" />
              </div>
            )}
            <Badge
              variant={canPurchase ? 'default' : 'outline'}
              className={cn(
                'absolute top-4 right-4 shadow-sm',
                canPurchase
                  ? 'bg-green-600 text-white hover:bg-green-600'
                  : 'border-amber-400 bg-white/90 text-amber-600 backdrop-blur',
              )}
            >
              {canPurchase ? 'Vendas disponíveis' : 'Vendas indisponíveis'}
            </Badge>
          </div>
          <div className="flex-1 space-y-4 md:flex md:flex-col">
            <div>
              <h1 className={cn('text-2xl font-semibold')}>{event?.name}</h1>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Abaixo você verá os tickets disponíveis para compra. Caso prefira,
              copie o link e compartilhe com os inscritos para que eles mesmos
              possam acessar e adquirir seus tickets.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs tracking-wide uppercase">
                Link Público
              </span>
              <div className="min-w-0 flex-1">
                <input
                  readOnly
                  value={ticketPageUrl}
                  className="w-full truncate rounded border bg-transparent px-2 py-1 text-xs"
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={cn(
                  'h-7 w-7 p-1 transition-all duration-300 sm:h-8 sm:w-8',
                  copied
                    ? 'border-green-200 bg-green-50 text-green-600'
                    : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100',
                )}
                onClick={handleCopyLink}
                title={copied ? 'Copiado!' : 'Copiar link'}
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <div className="flex justify-end">
              <Button
                className="flex items-center gap-2"
                disabled={
                  !canPurchase || tickets.every((t) => t.available <= 0)
                }
                onClick={() => {
                  const availableTicket = tickets.find((t) => t.available > 0);
                  if (availableTicket) {
                    onSelectTicket(availableTicket.id);
                  }
                }}
              >
                <ExternalLink className="h-4 w-4" />
                Comprar ticket
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {tickets.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-muted-foreground p-12 text-center">
            Nenhum ticket disponível para este evento no momento.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => {
            const isUnavailable = ticket.available <= 0 || !canPurchase;
            const availabilityState = getAvailabilityState(
              ticket.available,
              ticket.quantity,
            );
            return (
              <Card
                key={ticket.id}
                className="border-border/40 flex h-full flex-col rounded-2xl border shadow-sm"
              >
                <CardContent className="flex h-full flex-col">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary rounded-full p-2">
                        <Ticket className="h-4 w-4" />
                      </span>
                      <h3
                        className={cn(
                          'text-lg leading-tight font-semibold',
                          getFontSizeClass(ticket.name),
                        )}
                      >
                        {ticket.name}
                      </h3>
                    </div>
                    <span
                      className={cn(
                        'rounded-md px-2 py-1 text-xs',
                        availabilityState.badgeClass,
                      )}
                    >
                      {availabilityState.label}
                    </span>
                  </div>

                  <dl className="text-muted-foreground flex-1 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <dt>Quantidade total</dt>
                      <dd className="text-foreground font-medium">
                        {ticket.quantity}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Validade</dt>
                      <dd className="text-foreground font-medium">
                        {dateFormatter.format(new Date(ticket.expirationDate))}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Preço</dt>
                      <dd className="text-foreground flex items-center gap-1 font-medium">
                        <Wallet className="h-4 w-4" />
                        {currencyFormatter.format(ticket.price)}
                      </dd>
                    </div>
                  </dl>

                  <div className="text-muted-foreground mt-4 text-center text-xs">
                    {isUnavailable
                      ? 'Url indisponível até o ticket ser liberado.'
                      : 'Disponível na tela de compra.'}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
