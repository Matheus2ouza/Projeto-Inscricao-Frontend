import z from 'zod';

export const registerPaymentPixSchema = (remainingValue: number) =>
  z.object({
    name: z
      .string({ error: 'O nome do pagador é obrigatório' })
      .min(2, { error: 'O nome do pagador deve ter pelo menos 2 caracteres' })
      .max(60, {
        error: 'O nome do pagador deve ter no máximo 60 caracteres',
      }),
    email: z.email({ error: 'Informe um e-mail válido' }),
    value: z
      .number({
        error: 'O valor do pagamento é obrigatório',
      })
      .min(1, {
        error: 'O valor mínimo para pagamento é R$ 1,00',
      })
      .max(remainingValue, {
        error: `O valor não pode ultrapassar ${remainingValue}`,
      })
      .refine((value) => Number.isInteger(value * 100), {
        error: 'O valor deve ter no máximo duas casas decimais (ex: 150,50)',
      }),
    date: z
      .string()
      .refine((val) => !isNaN(new Date(val).getTime()), {
        error: 'Data e horário inválidos',
      })
      .refine(
        (date) => {
          const informedDate = new Date(date);
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          return informedDate <= today;
        },
        {
          error: 'A data do pagamento não pode ser posterior à data de hoje',
        },
      ),
  });

export type RegisterPaymentPixSchemaType = z.infer<
  ReturnType<typeof registerPaymentPixSchema>
>;
