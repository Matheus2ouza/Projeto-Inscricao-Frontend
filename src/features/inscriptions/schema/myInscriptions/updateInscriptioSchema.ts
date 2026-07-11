import z from 'zod/v3';

export const UpdateInscriptionSchema = z.object({
  responsible: z.string().min(1, 'O responsável é obrigatório'),
  email: z
    .string()
    .email({ message: 'Informe um e-mail válido' })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s9\d{4}-?\d{4}$/,
      'Informe um telefone válido no formato (DDD) 9XXXX-XXXX',
    ),
});

export type UpdateInscriptionSchemaType = z.infer<
  typeof UpdateInscriptionSchema
>;
