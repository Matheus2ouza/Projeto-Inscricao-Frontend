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
import { getFontSizeClass } from "@/shared/utils/getFontSizeClass";
import { Plus, Ticket, TrendingUp, Users, Wallet } from "lucide-react";
import Image from "next/image";
import { BaseSyntheticEvent, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CreateTicketFormType } from "../hooks/useCreateTicket";
import { TicketsByEventResponse } from "../types/ticketsTypes";

interface TicketsByEventProps {
  tickets?: TicketsByEventResponse;
  loading: boolean;
  form: UseFormReturn<CreateTicketFormType>;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<boolean | void> | void;
  submitting: boolean;
  onViewSales: (ticketId: string) => void;
}

export default function TicketsByEvent({
  tickets,
  form,
  onSubmit,
  submitting,
  onViewSales,
  loading,
}: TicketsByEventProps) {
  const [openCreate, setOpenCreate] = useState(false);
  const ticketsList = tickets?.tickets ?? [];
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

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-end mb-6">
          <Button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 dark:text-white"
          >
            <Plus className="w-4 h-4" /> Novo Ticket
          </Button>
        </div>

        {tickets && (
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-6 flex flex-col gap-6 md:flex-row md:items-center">
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
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-card">
                  <p className="text-sm text-muted-foreground">Evento</p>
                  <p className="text-xl font-semibold">{tickets.name}</p>
                </div>
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
                <div className="p-4 rounded-xl border bg-card flex items-center gap-3 sm:col-span-2">
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
            </CardContent>
          </Card>
        )}

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

        {loading && !hasTickets && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center text-muted-foreground">
              Carregando tickets...
            </CardContent>
          </Card>
        )}

        {!loading && (!tickets || !hasTickets) && (
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

        {!loading && hasTickets && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ticketsList.map((t) => (
              <Card
                key={t.id}
                className="h-full border border-border/40 shadow-sm hover:shadow-md transition-shadow rounded-2xl flex flex-col"
              >
                <CardContent className="flex flex-col h-full flex-1">
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
                          t.available > 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        )}
                      >
                        {t.available} disp.
                      </span>
                    </div>

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
                          {dateFormatter.format(new Date(t.expirationDate))}
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
                  </div>

                  <div className="mt-auto pt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewSales(t.id)}
                    >
                      Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
