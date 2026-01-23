"use client";

import { ticketSaleRegisterSchema } from "@/features/tickets/schema/register-sale/sale/ticketSaleRegisterSchema";
import type {
  PaymentMethod,
  SaleGrupRequest,
  TicketSaleHistoryItem,
  TicketSummary,
} from "@/features/tickets/types/register-sale/ticketSaleRegisterTypes";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const paymentMethods: PaymentMethod[] = ["DINHEIRO", "PIX", "CARTAO"];
const defaultQuantities: Record<PaymentMethod, number> = {
  DINHEIRO: 0,
  PIX: 0,
  CARTAO: 0,
};

enum TabValue {
  REGISTER = "register",
  HISTORY = "history",
}

interface TicketSaleDetailsContentProps {
  eventId: string;
  ticket: TicketSummary;
  history: TicketSaleHistoryItem[];
  onRegisterSubmit?: (payload: SaleGrupRequest) => void;
}

export default function TicketSaleDetailsContent({
  eventId,
  ticket,
  history,
  onRegisterSubmit,
}: TicketSaleDetailsContentProps) {
  const [activeTab, setActiveTab] = useState<TabValue>(TabValue.REGISTER);
  const totalSold = ticket.quantity - ticket.available;
  const form = useForm<{
    name: string;
    quantities: Record<PaymentMethod, number>;
  }>({
    resolver: zodResolver(ticketSaleRegisterSchema),
    defaultValues: {
      name: "",
      quantities: defaultQuantities,
    },
  });

  const quantities = form.watch("quantities");
  const buyerName = form.watch("name") ?? "";
  const totalUnits = paymentMethods.reduce(
    (total, method) => total + (Number(quantities[method]) || 0),
    0,
  );
  const exceedsAvailability = totalUnits > ticket.available;
  const { isSubmitting } = form.formState;

  const handleRegister = form.handleSubmit(async (values) => {
    if (!onRegisterSubmit) return;

    const submittedTotalUnits = paymentMethods.reduce(
      (total, method) => total + (values.quantities[method] ?? 0),
      0,
    );

    const items = [
      {
        ticketId: ticket.id,
        quantity: submittedTotalUnits,
        unitValue: ticket.price,
      },
    ];

    const payments = paymentMethods
      .map((paymentMethod) => ({
        paymentMethod,
        quantity: values.quantities[paymentMethod] ?? 0,
      }))
      .filter(({ quantity }) => quantity > 0)
      .map(({ paymentMethod, quantity }) => ({
        paymentMethod,
        value: quantity * ticket.price,
      }));

    const payload: SaleGrupRequest = {
      eventId,
      name: values.name.trim(),
      items,
      payments,
    };

    try {
      await onRegisterSubmit(payload);
      form.reset();
    } catch {
      // o hook de registro já exibe feedback
    }
  });

  return (
    <div className="space-y-6">
      <Card className="border border-muted/30 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg font-semibold text-foreground">
              {ticket.name}
            </CardTitle>
            <span
              className={`inline-flex items-center px-2 py-0.5 text-base font-semibold rounded-full ${
                ticket.isActive
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                  : "bg-red-500/10 text-red-500 border border-red-500/30"
              }`}
            >
              {ticket.isActive ? "Ativo" : "Inativo"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{ticket.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Preço</p>
              <p className="text-lg font-semibold">
                {currencyFormatter.format(ticket.price)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">
                Disponíveis
              </p>
              <p className="text-lg font-semibold">
                {ticket.available} de {ticket.quantity}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">
                Expira em
              </p>
              <p className="text-lg font-semibold">
                {new Date(ticket.expirationDate).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">
                Total vendido
              </p>
              <p className="text-lg font-semibold">{totalSold}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        className="border border-muted/20 rounded-xl bg-muted/30 p-1"
      >
        <TabsList>
          <TabsTrigger value={TabValue.REGISTER}>Registrar venda</TabsTrigger>
          <TabsTrigger value={TabValue.HISTORY}>Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value={TabValue.REGISTER} className="space-y-4 mt-4">
          <Card className="border border-muted/30 shadow-sm">
            <CardContent className="space-y-4">
              <Form {...form}>
                <form className="space-y-4" onSubmit={handleRegister}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Nome do comprador
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nome completo"
                            className="bg-white dark:bg-zinc-900"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 md:grid-cols-3">
                    {paymentMethods.map((method) => (
                      <FormField
                        key={method}
                        control={form.control}
                        name={`quantities.${method}` as const}
                        render={({ field }) => (
                          <FormItem className="space-y-2 border rounded-2xl border-muted/30 p-4 bg-muted/40 dark:bg-muted/60">
                            <FormLabel className="text-sm font-semibold">
                              {method}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step={1}
                                placeholder="Quantidade"
                                value={field.value === 0 ? "" : field.value}
                                onChange={(event) => {
                                  const next = event.target.value;
                                  field.onChange(
                                    next === "" ? 0 : Number(next),
                                  );
                                }}
                                className="bg-white dark:bg-zinc-900"
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Valor total:{" "}
                              {currencyFormatter.format(
                                field.value * ticket.price,
                              )}
                            </p>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      Total de unidades: {totalUnits}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({ticket.available} disponíveis)
                      </span>
                      {exceedsAvailability && (
                        <span className="ml-2 text-xs text-red-600 font-semibold uppercase">
                          ultrapassou a quantidade disponível
                        </span>
                      )}
                    </p>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={
                          !Boolean(buyerName.trim()) ||
                          totalUnits === 0 ||
                          ticket.isActive === false ||
                          exceedsAvailability
                        }
                      >
                        {isSubmitting ? "Registrando..." : "Registrar"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={TabValue.HISTORY} className="space-y-4 mt-4">
          <Card className="border border-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Histórico de vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma venda registrada ainda.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Registrado em</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-semibold">
                            {item.id}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleString("pt-BR")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
