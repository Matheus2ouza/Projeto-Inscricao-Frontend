import { ParticipantFieldsConfig } from '@/features/guest/types/guestInscription/eventDetailsToGuestInscriptionTypes';
import z from 'zod';

// Função para remover máscara (apenas números)
const unformat = (value: string) => {
  return value.replace(/\D/g, '');
};

function fieldSchema<T extends z.ZodTypeAny>(
  rule: ParticipantFieldsConfig[keyof ParticipantFieldsConfig] | undefined,
  schema: T,
) {
  if (rule === 'required') return schema;
  return schema.optional().or(z.literal(''));
}

export function buildGuestInscriptionSchema(config: ParticipantFieldsConfig) {
  return z.object({
    // ---- Campos fixos: sempre obrigatórios, nunca variam ----
    name: z
      .string({ error: 'Nome é obrigatório' })
      .min(1, { error: 'Nome muito curto' })
      .max(60, { error: 'Tamanho máximo do nome atingido' }),
    email: z.email('Email inválido'),
    phone: z
      .string()
      .transform((val) => unformat(val)) // Remove máscara antes de validar
      .refine((val) => val.length >= 10 && val.length <= 11, {
        message: 'Formato do número de telefone inválido',
      })
      .refine((val) => /^\d+$/.test(val), {
        message: 'Telefone deve conter apenas números',
      }),
    gender: z.enum(['MASCULINO', 'FEMININO'], {
      error: 'Gênero inválido',
    }),
    localityId: z.uuid({ error: 'A localidade é obrigatória' }),
    birthDate: z.iso.date({ error: 'Data de nascimento inválida' }),
    typeInscriptionId: z.uuid({
      error: 'O tipo de inscrição é obrigatório',
    }),

    // ---- Campos dinâmicos: dependem da participantFieldsConfig do evento ----
    cpf: fieldSchema(
      config.cpf,
      z
        .string()
        .transform((val) => unformat(val)) // Remove máscara antes de validar
        .refine((val) => val.length === 11, {
          message: 'CPF deve ter 11 dígitos',
        })
        .refine((val) => /^\d+$/.test(val), {
          message: 'CPF deve conter apenas números',
        }),
    ),
    preferredName: fieldSchema(
      config.preferredName,
      z
        .string()
        .min(1, 'Como quer ser chamado é obrigatório')
        .max(60, { error: 'Tamanho máximo atingido' }),
    ),
    shirtSize: fieldSchema(
      config.shirtSize,
      z.enum(['PP', 'P', 'M', 'G', 'GG', 'XG'], {
        error: 'Tamanho de camiseta inválido',
      }),
    ),
    shirtType: fieldSchema(
      config.shirtType,
      z.enum(['TRADICIONAL', 'BABYLOOK'], {
        error: 'Tipo de camiseta inválido',
      }),
    ),
  });
}

export type GuestInscriptionSchemaType = z.infer<
  ReturnType<typeof buildGuestInscriptionSchema>
>;
