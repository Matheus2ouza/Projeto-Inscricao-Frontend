'use client';

import { ticketSaleRegisterSchema } from '@/features/tickets/schema/register-sale/sale/ticketSaleRegisterSchema';
import type {
  PaymentMethod,
  SaleGrupRequest,
  TicketSummary,
} from '@/features/tickets/types/register-sale/ticketSaleRegisterTypes';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const paymentMethods: PaymentMethod[] = ['DINHEIRO', 'PIX', 'CARTAO'];
const defaultQuantities: Record<PaymentMethod, number> = {
  DINHEIRO: 0,
  PIX: 0,
  CARTAO: 0,
};

interface TicketSaleRegisterTabProps {
  eventId: string;
  ticket: TicketSummary;
  onRegisterSubmit?: (payload: SaleGrupRequest) => void;
}

type RegisterFormValues = {
  name: string;
  quantities: Record<PaymentMethod, number>;
};

export default function TicketSaleRegisterTab({
  eventId,
  ticket,
  onRegisterSubmit,
}: TicketSaleRegisterTabProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<RegisterFormValues | null>(
    null,
  );

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(ticketSaleRegisterSchema),
    defaultValues: {
      name: '',
      quantities: defaultQuantities,
    },
  });

  const quantities =
    useWatch({
      control: form.control,
      name: 'quantities',
    }) ?? defaultQuantities;
  const buyerName =
    useWatch({
      control: form.control,
      name: 'name',
    }) ?? '';
  const totalUnits = useMemo(
    () =>
      paymentMethods.reduce(
        (total, method) => total + (Number(quantities[method]) || 0),
        0,
      ),
    [quantities],
  );
  const exceedsAvailability = totalUnits > ticket.available;
  const { isSubmitting } = form.formState;

  const buildPayload = (values: RegisterFormValues): SaleGrupRequest => {
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

    return payload;
  };

  const handleOpenConfirm = form.handleSubmit((values) => {
    setPendingValues(values);
    setConfirmOpen(true);
  });

  const confirmationItems = paymentMethods.map((method) => {
    const quantity = pendingValues?.quantities[method] ?? 0;
    const value = quantity * ticket.price;

    return {
      method,
      quantity,
      value,
    };
  });

  const confirmationTotalUnits = confirmationItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const confirmationTotalValue = confirmationItems.reduce(
    (total, item) => total + item.value,
    0,
  );

  const canOpenConfirm =
    Boolean(buyerName.trim()) &&
    totalUnits > 0 &&
    ticket.isActive !== false &&
    !exceedsAvailability &&
    !isSubmitting;

  const handleConfirmRegister = async () => {
    if (!onRegisterSubmit || !pendingValues) return;

    try {
      await onRegisterSubmit(buildPayload(pendingValues));
      form.reset();
      setConfirmOpen(false);
      setPendingValues(null);
    } catch {
      // o hook de registro já exibe feedback
    }
  };

  return (
    <>
      <Card className="border-muted/30 border shadow-sm">
        <CardContent className="space-y-4">
          <Form {...form}>
            <form className="space-y-4" onSubmit={handleOpenConfirm}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
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
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="glass-summary-tile rounded-xl px-4 py-3">
                        <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
                          Total de unidades
                        </p>
                        <p className="text-foreground text-lg font-bold">
                          {totalUnits}
                        </p>
                      </div>
                      <div className="glass-summary-tile rounded-xl px-4 py-3">
                        <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
                          Total da venda
                        </p>
                        <p className="text-foreground text-lg font-bold">
                          {currencyFormatter.format(totalUnits * ticket.price)}
                        </p>
                      </div>
                    </div>
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
                      <FormItem className="border-muted/30 bg-muted/40 dark:bg-muted/60 space-y-2 rounded-2xl border p-4">
                        <FormLabel className="text-sm font-semibold">
                          {method}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            placeholder="Quantidade"
                            value={field.value === 0 ? '' : field.value}
                            onChange={(event) => {
                              const next = event.target.value;
                              field.onChange(next === '' ? 0 : Number(next));
                            }}
                            className="bg-white dark:bg-zinc-900"
                          />
                        </FormControl>
                        <div className="glass-summary-value rounded-xl px-3 py-2">
                          <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
                            Valor total
                          </p>
                          <p className="text-foreground text-base font-bold">
                            {currencyFormatter.format(
                              field.value * ticket.price,
                            )}
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-end">
                  <Button type="submit" disabled={!canOpenConfirm}>
                    Registrar
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) {
            setPendingValues(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirmar registro de venda</DialogTitle>
            <DialogDescription>
              Confira os dados abaixo antes de registrar a venda.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Card principal com estilo glass */}
            <div className="glass-summary-tile rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">
                    Venda em análise
                  </p>
                  <p className="text-lg font-semibold">{ticket.name}</p>
                  <p className="text-muted-foreground text-sm">
                    Comprador: {pendingValues?.name?.trim() || '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">
                    Total da venda
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {currencyFormatter.format(confirmationTotalValue)}
                  </p>
                </div>
              </div>
            </div>

            {/* Itens por pagamento com estilo glass */}
            <div className="glass-summary-tile rounded-2xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Itens por pagamento</p>
                <p className="text-muted-foreground text-xs tracking-wide uppercase">
                  {confirmationTotalUnits} unidade(s)
                </p>
              </div>
              <div className="space-y-3">
                {confirmationItems.map((item) => (
                  <div
                    key={item.method}
                    className="glass-summary-value rounded-xl p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{item.method}</p>
                        <p className="text-muted-foreground text-xs">
                          {item.quantity} unidade(s) x{' '}
                          {currencyFormatter.format(ticket.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-xs uppercase">
                          Subtotal
                        </p>
                        <p className="text-sm font-semibold">
                          {currencyFormatter.format(item.value)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards de resumo com estilo glass */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass-summary-tile rounded-xl p-4">
                <p className="text-muted-foreground text-xs tracking-wide uppercase">
                  Total de unidades
                </p>
                <p className="text-lg font-semibold">
                  {confirmationTotalUnits}
                </p>
              </div>
              <div className="glass-summary-tile rounded-xl p-4">
                <p className="text-muted-foreground text-xs tracking-wide uppercase">
                  Preço unitário
                </p>
                <p className="text-lg font-semibold">
                  {currencyFormatter.format(ticket.price)}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfirmOpen(false);
                setPendingValues(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmRegister}
              disabled={!pendingValues || !onRegisterSubmit || isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
