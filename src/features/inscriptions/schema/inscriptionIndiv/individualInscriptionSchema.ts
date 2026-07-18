import { z } from 'zod';

const unformat = (value: string) => {
  return value.replace(/\D/g, '');
};

// Schema para membro individual
export const memberSchema = z.object({
  accountParticipantId: z.string().min(1, 'ID do participante é obrigatório'),
  typeInscriptionId: z.string().min(1, 'Tipo de inscrição é obrigatório'),
});

export const individualInscriptionSchema = z.object({
  responsible: z.string().min(1, 'Nome do responsável é obrigatório'),
  email: z.email({ error: 'Email invalido' }).optional(),
  phone: z
    .string()
    .transform((val) => unformat(val))
    .refine((val) => val.length >= 10 && val.length <= 11, {
      message: 'Formato do número de telefone inválido',
    })
    .refine((val) => /^\d+$/.test(val), {
      message: 'Telefone deve conter apenas números',
    }),
});

export type IndividualInscriptionSchemaType = z.infer<
  typeof individualInscriptionSchema
>;
export type MemberSchemaType = z.infer<typeof memberSchema>;
