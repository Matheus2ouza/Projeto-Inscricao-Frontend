import z from 'zod';

export const registerExclusiveInscriptionLinkSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  preferredName: z.string().trim().optional(),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s9\d{4}-?\d{4}$/,
      'Informe um telefone válido no formato (DDD) 9XXXX-XXXX',
    ),
  cpf: z
    .string()
    .regex(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/, 'Informe um CPF válido'),
  gender: z.enum(['MASCULINO', 'FEMININO'], {
    error: 'Gênero inválido',
  }),
  locality: z.string().trim().min(1, 'Localidade é obrigatória'),
  birthDate: z.string().refine(
    (value) => {
      const date = new Date(value);
      return !Number.isNaN(date.getTime());
    },
    {
      message: 'Data de nascimento inválida',
    },
  ),
  observation: z.string().trim().optional(),
  termsAccepted: z.boolean().refine((value) => value, {
    message: 'Você deve confirmar que leu os termos',
  }),
  typeInscriptionId: z.string().trim().min(1, 'Selecione o tipo de inscrição'),
});

export type RegisterExclusiveInscriptionLinkSchemaType = z.infer<
  typeof registerExclusiveInscriptionLinkSchema
>;
