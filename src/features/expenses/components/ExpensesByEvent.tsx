'use client';

import type { CreateExpenseFormData } from '@/features/expenses/hooks/create/useCreateExpense';
import ImageUpload from '@/shared/components/ImageUpload';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { UploadFile } from 'antd';
import {
  Button as AntButton,
  Form as AntForm,
  Input,
  InputNumber,
  Modal,
  Select,
} from 'antd';
import { Calendar, DollarSign, Plus, User } from 'lucide-react';
import type { BaseSyntheticEvent } from 'react';
import { useMemo, useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import {
  CategoryExpense,
  FindAllPaginatedEventExpensesResponse,
  PaymentMethod,
} from '../types/expensesTypes';

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
  PIX: 'PIX',
  CARTAO: 'Cartão',
  DINHEIRO: 'Dinheiro',
};

const categoryLabels: Record<CategoryExpense, string> = {
  COZINHA: 'Cozinha',
  DECORACAO: 'Decoração',
  DECORACAO_ESTACAO: 'Decoração Estação',
  DECORACAO_COMPERADORES: 'Decoração Comperadores',
  MIDIA: 'Mídia',
  SOM: 'Som',
  MANUTENCAO: 'Manutenção',
  SEGURANCA: 'Segurança',
  OUTROS: 'Outros',
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
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const { form, onSubmit, submitting } = createForm;

  const expensesList = expensesData?.expenses ?? [];
  const hasExpenses = expensesList.length > 0;
  const totalExpenses = expensesData?.total ?? 0;

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

  const handleDialogClose = () => {
    setOpenCreate(false);
    form.reset();
    setUploadedFiles([]);
  };

  const handleFormSubmit = async (event?: BaseSyntheticEvent) => {
    const result = await onSubmit(event);
    if (result) {
      handleDialogClose();
    }
  };

  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : null;

  if (message) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="text-destructive p-6 text-center">
          {message}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-muted-foreground text-sm">
          {totalExpenses > 0
            ? `${totalExpenses} gasto(s) encontrado(s)`
            : 'Nenhum gasto encontrado'}
        </div>
        <Button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Novo Gasto
        </Button>
      </div>

      <Modal
        open={openCreate}
        onCancel={handleDialogClose}
        title="Novo Gasto"
        footer={null}
        destroyOnHidden
        centered
      >
        <AntForm layout="vertical" component={false}>
          <form
            onSubmit={handleFormSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Descrição"
                  validateStatus={fieldState.error ? 'error' : undefined}
                  help={fieldState.error?.message}
                  className="mb-0 md:col-span-2"
                >
                  <Input placeholder="Descrição do gasto" {...field} />
                </AntForm.Item>
              )}
            />

            <Controller
              control={form.control}
              name="value"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Valor (R$)"
                  validateStatus={fieldState.error ? 'error' : undefined}
                  help={fieldState.error?.message}
                  className="mb-0"
                >
                  <InputNumber
                    min={0}
                    step={0.01}
                    precision={2}
                    placeholder="0,00"
                    value={field.value}
                    onChange={(value) => field.onChange(value ?? 0)}
                    className="w-full"
                    style={{ width: '100%' }}
                    formatter={(value) => {
                      if (value === undefined || value === null) return '';
                      const normalized = `${value}`.replace('.', ',');
                      return `R$ ${normalized}`;
                    }}
                    parser={(value) => {
                      if (!value) return 0;
                      const cleaned = value
                        .replace('R$', '')
                        .replace(/\s/g, '')
                        .replace(/\./g, '')
                        .replace(',', '.');
                      const parsed = Number(cleaned);
                      return Number.isNaN(parsed) ? 0 : parsed;
                    }}
                  />
                </AntForm.Item>
              )}
            />

            <Controller
              control={form.control}
              name="paymentMethod"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Método de Pagamento"
                  validateStatus={fieldState.error ? 'error' : undefined}
                  help={fieldState.error?.message}
                  className="mb-0"
                >
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    options={Object.entries(paymentMethodLabels).map(
                      ([value, label]) => ({
                        value,
                        label,
                      }),
                    )}
                    placeholder="Selecione o método"
                  />
                </AntForm.Item>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
              <Controller
                control={form.control}
                name="category"
                render={({ field, fieldState }) => (
                  <AntForm.Item
                    label="Categoria"
                    validateStatus={fieldState.error ? 'error' : undefined}
                    help={fieldState.error?.message}
                    className="mb-0"
                  >
                    <Select
                      value={field.value ?? CategoryExpense.OUTROS}
                      onChange={(value) => field.onChange(value)}
                      options={Object.entries(categoryLabels).map(
                        ([value, label]) => ({
                          value,
                          label,
                        }),
                      )}
                      placeholder="Selecione a categoria"
                    />
                  </AntForm.Item>
                )}
              />

              <Controller
                control={form.control}
                name="responsible"
                render={({ field, fieldState }) => (
                  <AntForm.Item
                    label="Responsável"
                    validateStatus={fieldState.error ? 'error' : undefined}
                    help={fieldState.error?.message}
                    className="mb-0"
                  >
                    <Input placeholder="Nome do responsável" {...field} />
                  </AntForm.Item>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="image"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Imagem (opcional)"
                  validateStatus={fieldState.error ? 'error' : undefined}
                  help={fieldState.error?.message}
                  className="mb-0 md:col-span-2"
                >
                  <ImageUpload
                    value={uploadedFiles}
                    onChange={setUploadedFiles}
                    maxCount={1}
                    title="Selecione a imagem"
                    description="ou arraste e solte"
                    onDataUrlChange={(dataUrl) => {
                      field.onChange(dataUrl || '');
                    }}
                    className="hover:border-primary hover:bg-primary/5 dark:hover:border-primary rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-3 text-center transition-colors dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </AntForm.Item>
              )}
            />

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3 md:col-span-2">
              <AntButton onClick={handleDialogClose} disabled={submitting}>
                Cancelar
              </AntButton>
              <AntButton type="primary" htmlType="submit" loading={submitting}>
                {submitting ? 'Criando...' : 'Criar Gasto'}
              </AntButton>
            </div>
          </form>
        </AntForm>
      </Modal>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="rounded-xl border-0 shadow-sm">
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : hasExpenses ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {expensesList.map((expense) => (
            <Card
              key={expense.id}
              className="overflow-hidden rounded-xl border-0 shadow-sm"
            >
              <CardContent className="relative space-y-1.5 p-4">
                <h3 className="line-clamp-2 pr-24 text-base font-semibold text-gray-900 dark:text-white">
                  {expense.description}
                </h3>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {dateFormatter.format(new Date(expense.createdAt))}
                </p>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  {expense.responsible}
                </p>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4" />
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
            <p className="mt-2 text-gray-500 dark:text-gray-400">
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
                  href={page > 1 ? '#' : undefined}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
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
                  href={page < pageCount ? '#' : undefined}
                  className={
                    page === pageCount ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <p className="text-muted-foreground text-center text-sm">
            Página {page} de {pageCount}
          </p>
        </div>
      )}
    </div>
  );
}
