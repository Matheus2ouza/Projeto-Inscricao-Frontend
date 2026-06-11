import z from 'zod';

export const CreateNewRegisterSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  method: z.enum(['DINHEIRO', 'PIX', 'CARTAO']),
  favorite: z.boolean().default(false),
  value: z
    .number({
      error: 'Valor é obrigatório',
    })
    .min(0, 'Valor não pode ser negativo'),
  description: z
    .string({ error: 'A descrição é obrigatório' })
    .min(5, { error: 'Descrição muito curta' })
    .max(300, {
      error: 'Descrição muito longa, tamanho maximo: 300 caractere',
    }),
  eventId: z.uuid(),
  responsible: z.string(),
  images: z
    .array(
      z.string({
        error: 'Um dos comprovantes enviados é inválido',
      }),
    )
    .default([]),
  createAt: z.iso.datetime().optional(),
});
