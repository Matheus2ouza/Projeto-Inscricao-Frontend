'use client';

import { cn } from '@/lib/utils';
import { TicketPurchaseModal } from '@/shared/components/TicketPurchaseModal';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Copy, Ticket, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { TicketsByEventResponse } from '../../../types/analysis/ticketsTypes';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

type TicketsPageContentProps = {
  eventId: string;
  event: TicketsByEventResponse;
};

export function SelectedTickets({ eventId, event }: TicketsPageContentProps) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tickets = event?.tickets ?? [];
  const publicTicketLink = useMemo(() => {
    if (typeof window === 'undefined' || !eventId) {
      return '';
    }
    return `${window.location.origin}/events/tickets/${eventId}`;
  }, [eventId]);

  const internalTicketLink = useMemo(() => {
    if (typeof window === 'undefined' || !event?.id) {
      return '';
    }
    return `${window.location.origin}/user/tickets/${event.id}`;
  }, [event?.id]);

  const purchaseItems = useMemo(() => {
    return tickets
      .map((ticket) => ({
        id: ticket.id,
        name: ticket.name,
        quantity: quantities[ticket.id] || 0,
        price: ticket.price,
      }))
      .filter((item) => item.quantity > 0);
  }, [tickets, quantities]);

  const totalAmount = purchaseItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  const totalQuantity = purchaseItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const canProceed = purchaseItems.length > 0;

  const handleQuantityChange = (
    ticketId: string,
    value: number,
    max: number,
  ) => {
    if (Number.isNaN(value)) return;
    const clamped = Math.max(0, Math.min(value, max));
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: clamped,
    }));
  };

  const handlePurchase = () => {
    if (!canProceed) return;
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (!canProceed || !eventId) {
      return;
    }

    const selectedTickets = purchaseItems.map((item) => ({
      ticketId: item.id,
      quantity: item.quantity,
    }));

    const params = new URLSearchParams();
    params.set('tickets', JSON.stringify(selectedTickets));

    router.push(`/events/tickets/${eventId}/checkout?${params.toString()}`);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-stretch">
              <div className="relative w-full md:w-1/2">
                {event.imageUrl ? (
                  <div className="relative h-60 w-full overflow-hidden rounded-xl">
                    <Image
                      src={event.imageUrl}
                      alt={event.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw,
                        (max-width: 1200px) 70vw,
                        50vw"
                    />
                  </div>
                ) : (
                  <div className="bg-muted flex h-60 w-full items-center justify-center rounded-xl">
                    <Ticket className="text-muted-foreground h-12 w-12" />
                  </div>
                )}
                <Badge
                  className={cn(
                    'absolute top-4 right-4 shadow-sm',
                    event.ticketEnabled
                      ? 'bg-green-600 text-white'
                      : 'bg-amber-500 text-white',
                  )}
                >
                  {event.ticketEnabled
                    ? 'Vendas disponíveis'
                    : 'Vendas indisponíveis'}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col space-y-4">
                <div>
                  <h1 className="text-2xl font-semibold">{event.name}</h1>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    Abaixo você verá os tickets disponíveis para compra. Também
                    encontrará um link
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground text-xs tracking-wide uppercase">
                    Link Público
                  </span>
                  <div className="min-w-0 flex-1">
                    <input
                      readOnly
                      value={internalTicketLink}
                      className="w-full truncate rounded border bg-transparent px-2 py-1 text-xs"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 border-blue-200 bg-blue-50 p-1 text-blue-600 hover:bg-blue-100 sm:h-8 sm:w-8"
                    onClick={() => {
                      if (!internalTicketLink) return;
                      navigator.clipboard.writeText(internalTicketLink);
                      toast.success('Link interno copiado');
                    }}
                    title="Copiar link"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tickets disponíveis</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {tickets.map((ticket) => {
                const quantity = quantities[ticket.id] ?? 0;
                return (
                  <Card
                    key={ticket.id}
                    className="border-border/40 flex flex-col rounded-2xl border shadow-sm"
                  >
                    <CardContent className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {ticket.name}
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            Até {ticket.available} disponíveis
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            ticket.available > 0
                              ? 'border-green-300 text-green-600'
                              : 'border-red-300 text-red-600',
                          )}
                        >
                          {ticket.available} disp.
                        </Badge>
                      </div>
                      <dl className="text-muted-foreground space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <dt>Preço</dt>
                          <dd className="text-foreground flex items-center gap-1 font-medium">
                            <Wallet className="h-4 w-4" />
                            {currencyFormatter.format(ticket.price)}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-foreground font-medium">
                            Quantidade
                          </dt>
                          <Input
                            type="number"
                            min={0}
                            max={ticket.available}
                            value={quantity === 0 ? '' : quantity}
                            onChange={(event) =>
                              handleQuantityChange(
                                ticket.id,
                                Number(event.target.value),
                                ticket.available,
                              )
                            }
                            className="w-24 text-right"
                            placeholder="0"
                          />
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <aside>
          <Card className="sticky top-6 border-0 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div className="space-y-3">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Resumo da compra
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Tickets selecionados detalhados
                  </p>
                </div>
                {purchaseItems.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Selecione ao menos um ticket para ver o resumo.
                  </p>
                ) : (
                  <div className="border-border/50 space-y-2 rounded-lg border p-3">
                    {purchaseItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="text-foreground font-medium">
                            {item.name}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {item.quantity}x{' '}
                            {currencyFormatter.format(item.price)}
                          </span>
                        </div>
                        <span className="text-foreground font-semibold">
                          {currencyFormatter.format(item.quantity * item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Tickets selecionados
                  </p>
                  <p className="ml-2 text-2xl font-semibold">{totalQuantity}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-muted-foreground text-sm">
                    Total estimado
                  </p>
                  <p className="text-2xl font-semibold">
                    {currencyFormatter.format(totalAmount)}
                  </p>
                </div>
              </div>
              <Button
                className="flex w-full items-center gap-2"
                disabled={!canProceed}
                onClick={handlePurchase}
              >
                Revisar compra
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      <TicketPurchaseModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        items={purchaseItems}
        totalAmount={totalAmount}
        onConfirm={handleConfirmPurchase}
        confirmLabel="Ir para checkout"
      />
    </>
  );
}
