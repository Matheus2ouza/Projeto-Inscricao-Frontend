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
  description: z.string({ error: 'A descrição é obrigatória' }),
  eventId: z.uuid().optional(),
  responsible: z.string(),
  image: z.string().optional(),
  createAt: z.iso.datetime().optional(),
});
