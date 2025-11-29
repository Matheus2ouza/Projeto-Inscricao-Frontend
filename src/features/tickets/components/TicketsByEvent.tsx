"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { getAvailabilityState } from "@/shared/utils/getAvailabilityState";
import { getFontSizeClass } from "@/shared/utils/getFontSizeClass";
import {
  Check,
  Copy,
  Frown,
  Plus,
  Ticket,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { BaseSyntheticEvent, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CreateTicketFormType } from "../hooks/useCreateTicket";
import { TicketsByEventResponse } from "../types/ticketsTypes";

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
  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  });

  const [copied, setCopied] = useState(false);

  const ticketPageUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return `${window.location.origin}/events/tickets/${eventId}`;
  }, [eventId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ticketPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Falha ao copiar link de tickets", error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-6 flex flex-col gap-6">
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
                  <div className="h-48 w-full rounded-xl bg-muted flex items-center justify-center">
                    <Ticket className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Evento</p>
                    <p className="text-2xl font-semibold">{tickets.name}</p>
                  </div>
                  {onToggleTicketSale && (
                    <div className="flex flex-col gap-2 sm:items-end">
                      <span
                        className={cn(
                          "px-3 py-1 text-xs font-semibold rounded-full w-fit",
                          tickets.ticketEnabled
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                        )}
                      >
                        {tickets.ticketEnabled
                          ? "Vendas ativas"
                          : "Vendas encerradas"}
                      </span>
                      <Button
                        onClick={onToggleTicketSale}
                        disabled={ticketSaleLoading}
                        variant={tickets.ticketEnabled ? "outline" : "default"}
                        className="dark:text-white"
                      >
                        {ticketSaleLoading
                          ? "Atualizando..."
                          : tickets.ticketEnabled
                            ? "Encerrar vendas"
                            : "Abrir vendas"}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                      <Users className="w-5 h-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tickets vendidos
                      </p>
                      <p className="text-xl font-semibold">
                        {tickets.quantityTicketSale}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Faturamento total
                      </p>
                      <p className="text-xl font-semibold">
                        {currencyFormatter.format(tickets.totalSalesValue)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Link Público
                  </span>
                  <div className="flex-1 min-w-0">
                    <input
                      readOnly
                      value={ticketPageUrl}
                      className="w-full text-xs bg-transparent border rounded px-2 py-1 truncate"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(
                      "p-1 h-7 w-7 sm:h-8 sm:w-8 transition-all duration-300",
                      copied
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                    )}
                    onClick={handleCopyLink}
                    title={copied ? "Copiado!" : "Copiar link"}
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
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                          className="resize-none h-20"
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
                    {submitting ? "Criando..." : "Criar Ticket"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-end mb-6">
          <Button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 dark:text-white"
          >
            <Plus className="w-4 h-4" /> Novo Ticket
          </Button>
        </div>

        {!hasTickets && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Ticket className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Nenhum ticket criado
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Você ainda não criou nenhum ticket para este evento. Comece
                    criando seu primeiro ticket.
                  </p>
                </div>
                <Button
                  onClick={() => setOpenCreate(true)}
                  className="flex items-center gap-2 mt-4"
                  size="lg"
                >
                  Criar primeiro ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {hasTickets && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ticketsList.map((t) => {
              const availabilityState = getAvailabilityState(
                t.available,
                t.quantity
              );
              const isSoldOut = availabilityState.isSoldOut;

              return (
                <Card
                  key={t.id}
                  className={cn(
                    "h-full border border-border/40 shadow-sm hover:shadow-md transition-shadow rounded-2xl flex flex-col",
                    isSoldOut &&
                      "bg-muted/30 dark:bg-zinc-900/30 border-dashed border-border/60"
                  )}
                >
                  <CardContent
                    className={cn(
                      "flex flex-col h-full flex-1",
                      isSoldOut && "opacity-80"
                    )}
                  >
                    <div className="flex flex-col gap-4 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-full bg-primary/10 text-primary">
                            <Ticket className="w-4 h-4" />
                          </span>
                          <h3
                            className={cn(
                              "font-semibold leading-tight",
                              getFontSizeClass(t.name, true)
                            )}
                          >
                            {t.name}
                          </h3>
                        </div>
                        <span
                          className={cn(
                            "px-2 py-1 text-xs rounded-md",
                            availabilityState.badgeClass
                          )}
                        >
                          {availabilityState.label}
                        </span>
                      </div>

                      {isSoldOut ? (
                        <div className="mt-6 flex-1 flex items-center">
                          <div className="w-full rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
                            <Frown className="w-8 h-8 text-muted-foreground" />
                            <span>Não há mais tickets disponíveis.</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <dl className="grid gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center justify-between">
                              <dt>Quantidade:</dt>
                              <dd className="font-medium text-foreground">
                                {t.quantity}
                              </dd>
                            </div>
                            <div className="flex items-center justify-between">
                              <dt>Validade:</dt>
                              <dd className="font-medium text-foreground">
                                {dateFormatter.format(
                                  new Date(t.expirationDate)
                                )}
                              </dd>
                            </div>
                            <div className="flex items-center justify-between">
                              <dt>Preço:</dt>
                              <dd className="font-medium text-foreground flex items-center gap-1">
                                <Wallet className="w-4 h-4" />
                                {currencyFormatter.format(t.price)}
                              </dd>
                            </div>
                          </dl>

                          <div className="mt-auto pt-4 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewSales(t.id)}
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
