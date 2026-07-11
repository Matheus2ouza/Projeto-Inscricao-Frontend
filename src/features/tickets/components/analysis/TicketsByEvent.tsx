'use client';

import { CreateTicketFormType } from '@/features/tickets/hooks/analysis/createTicket/useCreateTicket';
import { TicketsByEventResponse } from '@/features/tickets/types/analysis/ticketsTypes';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { getAvailabilityState } from '@/shared/utils/getAvailabilityState';
import { getFontSizeClass } from '@/shared/utils/getFontSizeClass';
import {
  Check,
  Copy,
  Frown,
  Plus,
  Ticket,
  TrendingUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { BaseSyntheticEvent, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface TicketsByEventProps {
  eventId: string;
  tickets?: TicketsByEventResponse;
  form: UseFormReturn<CreateTicketFormType>;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<boolean | void> | void;
  submitting: boolean;
  onViewSales: (ticketId: string) => void;
  onToggleTicketSale?: () => void;
  ticketSaleLoading?: boolean;
}

export default function TicketsByEvent({
  eventId,
  tickets,
  form,
  onSubmit,
  submitting,
  onViewSales,
  onToggleTicketSale,
  ticketSaleLoading,
}: TicketsByEventProps) {
  if (!tickets) {
    return null;
  }

  const [openCreate, setOpenCreate] = useState(false);
  const ticketsList = tickets.tickets ?? [];
  const hasTickets = ticketsList.length > 0;
  const handleFormSubmit = async (event?: BaseSyntheticEvent) => {
    const result = await onSubmit(event);
    if (result) {
      setOpenCreate(false);
    }
  };
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
  });

  const [copied, setCopied] = useState(false);

  const ticketPageUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    return `${window.location.origin}/events/tickets/${eventId}`;
  }, [eventId]);

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
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6">
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="w-full md:w-1/3">
                {tickets.imageUrl ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-xl">
                    <Image
                      src={tickets.imageUrl}
                      alt={tickets.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw,
                        (max-width: 1200px) 50vw,
                        33vw"
                    />
                  </div>
                ) : (
                  <div className="bg-muted flex h-48 w-full items-center justify-center rounded-xl">
                    <Ticket className="text-muted-foreground h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Evento</p>
                    <p className="text-2xl font-semibold">{tickets.name}</p>
                  </div>
                  {onToggleTicketSale && (
                    <div className="flex flex-col gap-2 sm:items-end">
                      <span
                        className={cn(
                          'w-fit rounded-full px-3 py-1 text-xs font-semibold',
                          tickets.ticketEnabled
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
                        )}
                      >
                        {tickets.ticketEnabled
                          ? 'Vendas ativas'
                          : 'Vendas encerradas'}
                      </span>
                      <Button
                        onClick={onToggleTicketSale}
                        disabled={ticketSaleLoading || !hasTickets}
                        variant={tickets.ticketEnabled ? 'outline' : 'default'}
                        className="dark:text-white"
                      >
                        {ticketSaleLoading
                          ? 'Atualizando...'
                          : tickets.ticketEnabled
                            ? 'Encerrar vendas'
                            : 'Abrir vendas'}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-card flex items-center gap-3 rounded-xl border p-4">
                    <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                      <Users className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Tickets vendidos
                      </p>
                      <p className="text-xl font-semibold">
                        {tickets.quantityTicketSale}
                      </p>
                    </div>
                  </div>
                  <div className="bg-card flex items-center gap-3 rounded-xl border p-4">
                    <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Faturamento total
                      </p>
                      <p className="text-xl font-semibold">
                        {currencyFormatter.format(tickets.totalSalesValue)}
                      </p>
                    </div>
                  </div>
                </div>

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
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Ticket</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={handleFormSubmit}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do ticket" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validade</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição (opcional)"
                          className="h-20 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="md:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenCreate(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="dark:text-white"
                  >
                    {submitting ? 'Criando...' : 'Criar Ticket'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <div className="mb-6 flex items-center justify-end">
          <Button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 dark:text-white"
          >
            <Plus className="h-4 w-4" /> Novo Ticket
          </Button>
        </div>

        {!hasTickets && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                  <Ticket className="text-muted-foreground h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Nenhum ticket criado
                  </h3>
                  <p className="text-muted-foreground mx-auto max-w-sm">
                    Você ainda não criou nenhum ticket para este evento. Comece
                    criando seu primeiro ticket.
                  </p>
                </div>
                <Button
                  onClick={() => setOpenCreate(true)}
                  className="mt-4 flex items-center gap-2"
                  size="lg"
                >
                  Criar primeiro ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {hasTickets && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ticketsList.map((ticket) => {
              const availabilityState = getAvailabilityState(
                ticket.available,
                ticket.quantity,
              );

              return (
                <Card
                  key={ticket.id}
                  className={cn(
                    'border-border/40 flex h-full flex-col rounded-2xl border shadow-sm transition-shadow hover:shadow-md',
                    availabilityState.isSoldOut &&
                      'bg-muted/30 border-border/60 border-dashed dark:bg-zinc-900/30',
                  )}
                >
                  <CardContent
                    className={cn(
                      'flex h-full flex-1 flex-col',
                      availabilityState.isSoldOut && 'opacity-80',
                    )}
                  >
                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary rounded-full p-2">
                            <Ticket className="h-4 w-4" />
                          </span>
                          <h3
                            className={cn(
                              'leading-tight font-semibold',
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

                      {availabilityState.isSoldOut ? (
                        <div className="mt-6 flex flex-1 items-center">
                          <div className="border-border/60 text-muted-foreground flex w-full flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-6 text-center text-sm">
                            <Frown className="text-muted-foreground h-8 w-8" />
                            <span>Não há mais tickets disponíveis.</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <dl className="text-muted-foreground grid gap-3 text-sm">
                            <div className="flex items-center justify-between">
                              <dt>Quantidade:</dt>
                              <dd className="text-foreground font-medium">
                                {ticket.quantity}
                              </dd>
                            </div>
                            <div className="flex items-center justify-between">
                              <dt>Validade:</dt>
                              <dd className="text-foreground font-medium">
                                {dateFormatter.format(
                                  new Date(ticket.expirationDate),
                                )}
                              </dd>
                            </div>
                            <div className="flex items-center justify-between">
                              <dt>Preço:</dt>
                              <dd className="text-foreground flex items-center gap-1 font-medium">
                                {currencyFormatter.format(ticket.price)}
                              </dd>
                            </div>
                          </dl>

                          <div className="mt-auto flex justify-end pt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewSales(ticket.id)}
                            >
                              Detalhes
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
