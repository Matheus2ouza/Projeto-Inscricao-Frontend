import { z } from 'zod';
import {
  CategoryExpense,
  PaymentMethod,
} from '../../types/createExpense/createExpenseTypes';

export const expenseSchema = z.object({
  description: z.string().min(5, { error: 'Descrição muito curta' }).max(300, {
    error: 'Descrição muito longa, tamanho maximo: 300 caractere',
  }),
  value: z
    .number({ error: 'O valor do gasto é obrigatório' })
    .positive({ error: 'O valor valor minimo do gasto é R$:0,01' }),
  paymentMethod: z.enum(PaymentMethod, {
    error: 'Selecione como o gasto foi realizado',
  }),
  category: z.enum(CategoryExpense, {
    error: 'Categoria é obrigatória',
  }),
  responsible: z
    .string({
      error: 'O responsavel pelo gasto é obrigatório',
    })
    .min(2, { error: 'Nome do responsavel muito curto' })
    .max(50, { error: 'Nome do Responsavel muito longo' }),
  images: z
    .array(
      z.string({
        error: 'Um dos comprovantes enviados é inválido',
      }),
    )
    .default([]),
  createAt: z.iso.datetime().optional(),
});

export type expenseFormData = z.input<typeof expenseSchema>;
