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
import { CardBody, CardFooter, Skeleton } from "@heroui/react";
import { Badge, Calendar, DollarSign, Plus, User } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
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
    form: UseFormReturn<any>;
    onSubmit: (event?: React.BaseSyntheticEvent) => void;
    submitting: boolean;
  };
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  PIX: "PIX",
  CARTÃO: "Cartão",
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

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
  };

  const handleDialogClose = () => {
    setOpenCreate(false);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gastos do Evento
          </h1>
          <Button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Novo Gasto
          </Button>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Gasto</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={onSubmit}
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
                            )
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

        {error && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center text-red-600">
              {error instanceof Error ? error.message : error}
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardBody className="p-0">
                  <Skeleton className="w-full h-48 rounded-t-xl" />
                </CardBody>
                <CardFooter className="flex flex-col items-start p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expensesData?.expenses.map((expense) => (
                <Card
                  key={expense.id}
                  className="border-0 shadow-md rounded-xl overflow-hidden"
                >
                  <CardBody className="p-4 relative">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {expense.description}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(expense.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {expense.responsible}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      R$ {expense.value.toFixed(2)}
                    </p>
                    <Badge className="absolute top-4 right-4">
                      {expense.paymentMethod}
                    </Badge>
                  </CardBody>
                </Card>
              ))}
            </div>

            {expensesData?.expenses.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Nenhum gasto registrado
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Registre um gasto para aparecer aqui.
                </p>
              </div>
            )}

            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && handlePageChange(page - 1)}
                      href={page > 1 ? "#" : undefined}
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: pageCount }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i + 1}
                        href="#"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        page < pageCount && handlePageChange(page + 1)
                      }
                      href={page < pageCount ? "#" : undefined}
                      className={
                        page === pageCount
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
