"use client";

import type { CreateExpenseFormData } from "@/features/expenses/hooks/create/useCreateExpense";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Calendar, DollarSign, Plus, User } from "lucide-react";
import { useMemo, useState } from "react";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FindAllPaginatedEventExpensesResponse,
  PaymentMethod,
} from "../types/expensesTypes";

interface ExpensesByEventProps {
  expensesData: FindAllPaginatedEventExpensesResponse | null;
  isLoading: boolean;
  error: string | Error | null;
  page: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  createForm: {
    form: UseFormReturn<CreateExpenseFormData>;
    onSubmit: (
      event?: BaseSyntheticEvent,
    ) => Promise<boolean | void> | boolean | void;
    submitting: boolean;
  };
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  PIX: "PIX",
  CARTAO: "Cartão",
  DINHEIRO: "Dinheiro",
};

export default function ExpensesByEvent({
  expensesData,
  isLoading,
  error,
  page,
  pageCount,
  onPageChange,
  createForm,
}: ExpensesByEventProps) {
  const [openCreate, setOpenCreate] = useState(false);
  const { form, onSubmit, submitting } = createForm;

  const expensesList = expensesData?.expenses ?? [];
  const hasExpenses = expensesList.length > 0;
  const totalExpenses = expensesData?.total ?? 0;

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    [],
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "medium",
      }),
    [],
  );

  const handleDialogClose = () => {
    setOpenCreate(false);
    form.reset();
  };

  const handleFormSubmit = async (event?: BaseSyntheticEvent) => {
    const result = await onSubmit(event);
    if (result) {
      setOpenCreate(false);
    }
  };

  const message =
    typeof error === "string" ? error : error instanceof Error ? error.message : null;

  if (message) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 text-center text-destructive">
          {message}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {totalExpenses > 0
            ? `${totalExpenses} gasto(s) encontrado(s)`
            : "Nenhum gasto encontrado"}
        </div>
        <Button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Gasto
        </Button>
      </div>

      <Dialog
        open={openCreate}
        onOpenChange={(open) => {
          setOpenCreate(open);
          if (!open) {
            form.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Gasto</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleFormSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição do gasto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(paymentMethodLabels).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="responsible"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="md:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Criando..." : "Criar Gasto"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border-0 shadow-sm rounded-xl">
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : hasExpenses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expensesList.map((expense) => (
            <Card
              key={expense.id}
              className="border-0 shadow-sm rounded-xl overflow-hidden"
            >
              <CardContent className="p-4 relative space-y-1.5">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 pr-24">
                  {expense.description}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {dateFormatter.format(new Date(expense.createdAt))}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {expense.responsible}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {currencyFormatter.format(expense.value)}
                </p>
                <Badge className="absolute top-4 right-4" variant="secondary">
                  {paymentMethodLabels[expense.paymentMethod]}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-10 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Nenhum gasto registrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Registre um gasto para aparecer aqui.
            </p>
          </CardContent>
        </Card>
      )}

      {pageCount > 1 && (
        <div className="flex flex-col items-center gap-4 pt-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  href={page > 1 ? "#" : undefined}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: pageCount }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    href="#"
                    onClick={() => onPageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < pageCount && onPageChange(page + 1)}
                  href={page < pageCount ? "#" : undefined}
                  className={
                    page === pageCount ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <p className="text-sm text-muted-foreground text-center">
            Página {page} de {pageCount}
          </p>
        </div>
      )}
    </div>
  );
}
