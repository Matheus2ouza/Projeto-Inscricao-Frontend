'use client';

import { useSaleGroupTicket } from '@/features/tickets/hooks/ticketSales/grup/useSaleGroupTicket';
import { TicketDetails } from '@/features/tickets/types/ticketDetails/ticketDetailsTypes';
import {
  PAYMENT_METHOD_OPTIONS,
  STATUS_PAYMENT_OPTIONS,
} from '@/features/tickets/types/ticketSales/grup/ticketSaleGroupTypes';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Loader2, RefreshCcw, Ticket, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface TicketSalesDetailsProps {
  ticketId: string;
  data: TicketDetails;
  isFetching: boolean;
  onRefresh: () => void | Promise<unknown>;
  title?: string;
  subtitle?: string;
}

export default function TicketSalesDetails({
  ticketId,
  data,
  isFetching,
  onRefresh,
}: TicketSalesDetailsProps) {
  const [openSaleDialog, setOpenSaleDialog] = useState(false);
  const {
    form: saleGroupForm,
    submit: submitSaleGroup,
    submitting: submittingSaleGroup,
    reset: resetSaleGroup,
  } = useSaleGroupTicket(ticketId);

  useEffect(() => {
    saleGroupForm.setValue('pricePerTicket', String(data.price));
  }, [data.price, saleGroupForm]);

  const handleSaleDialogChange = (open: boolean) => {
    setOpenSaleDialog(open);
    if (open) {
      saleGroupForm.setValue('pricePerTicket', String(data.price));
      return;
    }

    resetSaleGroup({
      pricePerTicket: String(data.price),
    });
  };

  const handleSaleGroupSubmit = saleGroupForm.handleSubmit(async (values) => {
    const success = await submitSaleGroup(values);
    if (success) {
      resetSaleGroup({
        pricePerTicket: String(data.price),
      });
      setOpenSaleDialog(false);
      onRefresh();
    }
  });

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
      }),
    [],
  );

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }),
    [],
  );

  const totalSoldQuantity = useMemo(() => {
    if (!data.ticketSaleItems?.length) return 0;
    return data.ticketSaleItems.reduce((acc, sale) => acc + sale.quantity, 0);
  }, [data.ticketSaleItems]);

  const totalRevenue = useMemo(() => {
    if (!data.ticketSaleItems?.length) return 0;
    return data.price * totalSoldQuantity;
  }, [data.price, data.ticketSaleItems, totalSoldQuantity]);

  function InfoBox({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="bg-card flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {children}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Atualizar
          </Button>
          <Button
            type="button"
            onClick={() => setOpenSaleDialog(true)}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Venda em grupo
          </Button>
        </div>
      </div>

      <Dialog open={openSaleDialog} onOpenChange={handleSaleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar venda em grupo</DialogTitle>
          </DialogHeader>
          <Form {...saleGroupForm}>
            <form
              onSubmit={handleSaleGroupSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <FormField
                control={saleGroupForm.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da conta</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nome da conta"
                        value={field.value ?? ''}
                        onChange={(event) => field.onChange(event.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={saleGroupForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        placeholder="0"
                        value={field.value ?? ''}
                        onChange={(event) => field.onChange(event.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={saleGroupForm.control}
                name="pricePerTicket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço por ticket (R$)</FormLabel>
                    <input
                      type="hidden"
                      value={field.value ?? ''}
                      name={field.name}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    <FormControl>
                      <Input
                        value={
                          field.value
                            ? currencyFormatter.format(Number(field.value))
                            : ''
                        }
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={saleGroupForm.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de pagamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a forma de pagamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_METHOD_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={saleGroupForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status do pagamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_PAYMENT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="md:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSaleDialogChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submittingSaleGroup}>
                  {submittingSaleGroup ? 'Registrando...' : 'Registrar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Estoque do Ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data.quantity}
              </p>
              <p className="text-muted-foreground text-xs">Quantidade criada</p>
            </div>
            <Ticket className="text-primary h-8 w-8" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalSoldQuantity}
              </p>
              <p className="text-muted-foreground text-xs">
                Quantidade total vendida
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Receita Gerada
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {currencyFormatter.format(totalRevenue)}
              </p>
              <p className="text-muted-foreground text-xs">
                Soma de todas as vendas
              </p>
            </div>
            <Ticket className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex w-full flex-col gap-2">
            <div className="flex min-w-[200px] flex-col">
              <p className="text-muted-foreground text-sm">Ticket</p>
              <CardTitle className="text-2xl leading-tight font-semibold text-gray-900 dark:text-white">
                {data.name}
              </CardTitle>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Status de venda
              </p>
              <span
                className={cn(
                  'inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
                  data.isActive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
                )}
              >
                {data.isActive ? 'ABERTO' : 'FECHADO'}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Grid com dados */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoBox label="Preço">
              {currencyFormatter.format(data.price)}
            </InfoBox>

            <InfoBox label="Disponíveis">{data.available}</InfoBox>

            <InfoBox label="Total Criado">{data.quantity}</InfoBox>

            <InfoBox label="Validade">
              {dateFormatter.format(new Date(data.expirationDate))}
            </InfoBox>
          </div>

          {data.description && (
            <div className="bg-card rounded-lg border p-4">
              <p className="text-muted-foreground mb-1 text-sm">Descrição</p>
              <p className="text-base leading-relaxed text-gray-900 dark:text-white">
                {data.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Vendas Realizadas
          </CardTitle>
          {isFetching && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Atualizando...
            </div>
          )}
        </CardHeader>
        <CardContent>
          {data.ticketSaleItems.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Nenhuma venda registrada para este ticket.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID da Venda</TableHead>
                    <TableHead>Nome da Conta</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-right">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.ticketSaleItems.map((sale) => {
                    const saleValue = sale.quantity * data.price;
                    return (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{sale.accountName}</TableCell>
                        <TableCell className="text-right">
                          {sale.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {currencyFormatter.format(saleValue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {dateFormatter.format(new Date(sale.createdAt))}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
