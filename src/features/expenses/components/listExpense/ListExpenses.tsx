'use client';

import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Pagination } from 'antd';
import { Calendar, DollarSign, Eye, Plus, Trash, User } from 'lucide-react';
import type { BaseSyntheticEvent } from 'react';
import { useMemo, useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { expenseFormData } from '../../schema/createExpense/createExpenseSchema';
import { Expense, PaymentMethod } from '../../types/listExpenses/expensesTypes';
import CreateExpenseModal from './CreateExpenseModal';

interface ExpensesByEventProps {
  expenses: Expense[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  onViewDetails: (expenseId: string) => void;
  onPageChange: (page: number) => void;

  createForm: {
    form: UseFormReturn<expenseFormData>;
    onSubmit: (
      event?: BaseSyntheticEvent,
    ) => Promise<boolean | void> | boolean | void;
    submitting: boolean;
  };

  deleteExpense: {
    execute: (expenseId: string) => Promise<void>;
    loading: boolean;
  };
}
const paymentMethodLabels: Record<PaymentMethod, string> = {
  PIX: 'PIX',
  CARTAO: 'Cartão',
  DINHEIRO: 'Dinheiro',
};

const paymentMethodColors: Record<PaymentMethod, string> = {
  PIX: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
  CARTAO:
    'bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300',
  DINHEIRO:
    'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300',
};

export default function ListExpenses({
  expenses,
  total,
  page,
  pageSize,
  pageCount,
  onViewDetails,
  onPageChange,
  createForm,
  deleteExpense,
}: ExpensesByEventProps) {
  const [openCreate, setOpenCreate] = useState(false);
  const { form, onSubmit, submitting } = createForm;

  const expensesList = expenses ?? [];

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    [],
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
      }),
    [],
  );

  const getPaymentMethodBadgeClass = (method: PaymentMethod) => {
    return `${paymentMethodColors[method]} shrink-0`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Registrar Gasto
        </Button>
      </div>

      {expenses.length === 0 && (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <h3 className="text-lg font-semibold"> Nenhum gasto registrado </h3>
            <p className="text-muted-foreground mt-2 max-w-sm text-sm">
              Ainda não existem gastos cadastrados para este evento. Deseja
              registrar o primeiro gasto?
            </p>
            <Button
              onClick={() => setOpenCreate(true)}
              className="mt-6 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Registrar primeiro gasto
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateExpenseModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        form={form}
        onSubmit={onSubmit}
        submitting={submitting}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {expensesList.map((expense) => (
          <Card
            key={expense.id}
            className="group flex h-full flex-col overflow-hidden rounded-xl border-0 shadow-sm transition-all hover:shadow-md"
          >
            <CardContent className="flex-1 space-y-3 p-4 pb-2">
              {/* Conteúdo existente se mantém igual */}
              {/* Cabeçalho com título e badge */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 flex-1 text-base font-semibold text-gray-900 dark:text-white">
                  {expense.description}
                </h3>
                <Badge
                  variant="secondary"
                  className={getPaymentMethodBadgeClass(expense.paymentMethod)}
                >
                  {paymentMethodLabels[expense.paymentMethod]}
                </Badge>
              </div>

              {/* Informações em grid 2 colunas */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {dateFormatter.format(new Date(expense.createdAt))}
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 shrink-0" />
                  <span className="truncate">{expense.responsible}</span>
                </div>
              </div>

              {/* Valor em destaque */}
              <div className="pt-1">
                <p className="flex items-center gap-2 text-lg font-bold text-green-600 dark:text-green-400">
                  <DollarSign className="h-5 w-5" />
                  {currencyFormatter.format(expense.value)}
                </p>
              </div>
            </CardContent>

            <CardFooter className="mt-auto flex gap-2 p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => onViewDetails(expense.id)}
              >
                <Eye className="h-4 w-4" />
                Detalhes
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="aspect-square"
                onClick={() => deleteExpense.execute(expense.id)}
                disabled={deleteExpense.loading}
              >
                {deleteExpense.loading ? (
                  <Spinner
                    data-icon="inline-start"
                    variant="circle"
                    className="h-4 w-4"
                  />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="py-4">
          <div className="flex flex-col items-center gap-3">
            <Pagination
              current={page}
              total={total}
              pageSize={pageSize}
              showSizeChanger={false}
              onChange={(next) => onPageChange(next)}
              responsive
              size="middle"
            />
            <div className="text-foreground text-sm font-semibold">
              Página <span className="font-bold">{page}</span> de{' '}
              <span className="font-bold">{pageCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
