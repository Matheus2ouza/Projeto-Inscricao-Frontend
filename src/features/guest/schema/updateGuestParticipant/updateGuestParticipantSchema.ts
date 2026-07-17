import {
  GenderType,
  ParticipantFieldsConfig,
  ShirtSize,
  ShirtType,
} from '@/features/guest/types/detailsInscription/detailsInscriptionType';
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
  return schema.optional();
}

export function buildGuestParticipantSchema(config: ParticipantFieldsConfig) {
  return z.object({
    // ---- Campos fixos: sempre obrigatórios, nunca variam ----
    name: z
      .string({ error: 'Nome é obrigatório' })
      .min(1, { error: 'Nome muito curto' })
      .max(60, { error: 'Tamanho máximo do nome atingido' })
      .optional(),
    gender: z
      .enum(GenderType, {
        error: 'Gênero inválido',
      })
      .optional(),
    birthDate: z.iso.date({ error: 'Data de nascimento inválida' }).optional(),

    // ---- Campos dinâmicos: dependem da participantFieldsConfig do evento ----
    cpf: fieldSchema(
      config.cpf,
      z
        .string()
        .transform((val) => unformat(val))
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
      z.enum(ShirtSize, {
        error: 'Tamanho de camiseta inválido',
      }),
    ),
    shirtType: fieldSchema(
      config.shirtType,
      z.enum(ShirtType, {
        error: 'Tipo de camiseta inválido',
      }),
    ),
  });
}

export type GuestParticipantSchemaType = z.infer<
  ReturnType<typeof buildGuestParticipantSchema>
>;
