'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createExpense } from '../../api/create/createExpense';
import {
  expenseSchema,
  type expenseFormData,
} from '../../schema/createExpense/createExpenseSchema';
import {
  CategoryExpense,
  CreateExpenseRequest,
  PaymentMethod,
} from '../../types/createExpense/createExpenseTypes';
import { useInvalidateListExpensesQuery } from '../listExpenses/useListExpensesQuery';

export function useCreateExpense(eventId?: string) {
  const { invalidateLists } = useInvalidateListExpensesQuery();

  const form = useForm<expenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      value: 0,
      paymentMethod: PaymentMethod.PIX,
      category: CategoryExpense.OUTROS,
      responsible: '',
      images: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: expenseFormData) => {
      const expenseData: CreateExpenseRequest = {
        eventId,
        description: data.description,
        value: data.value,
        paymentMethod: data.paymentMethod,
        category: data.category,
        images: data.images ?? [],
        responsible: data.responsible,
        createAt: data.createAt,
      };
      return await createExpense(expenseData);
    },
    onSuccess: () => {
      toast.success('Gasto criado com sucesso!');
      form.reset();
      // Invalidar queries relacionadas aos gastos do evento
      invalidateLists();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao registrar gasto');
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  });

  return {
    form,
    onSubmit,
    submitting: mutation.isPending,
  };
}
