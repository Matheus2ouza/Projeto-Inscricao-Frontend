import { z } from 'zod';

export const inscriptionStatusEnum = z.enum([
  'PENDING',
  'UNDER_REVIEW',
  'PAID',
  'EXPIRED',
  'CANCELLED',
]);

export const paymentMethodEnum = z.enum(['DINHEIRO', 'PIX', 'CARTAO']);

export const genderEnum = z.enum(['MASCULINO', 'FEMININO']);

export const shirtSizeEnum = z.enum(['PP', 'P', 'M', 'G', 'GG', 'XG']);

export const shirtTypeEnum = z.enum(['TRADICIONAL', 'BABYLOOK']);

/* PARTICIPANTE */

export const participantInscriptionSchema = z.object({
  accountParticipantId: z.string().uuid().optional(),

  name: z.string().optional(),
  preferredName: z.string().optional(),
  shirtSize: shirtSizeEnum.optional(),
  shirtType: shirtTypeEnum.optional(),
  birthDate: z.string().optional(),
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF inválido')
    .optional(),
  gender: genderEnum.optional(),

  typeInscriptionId: z.string().uuid({
    message: 'Tipo de inscrição inválido',
  }),
});

/* INSCRIÇÃO */

export const createInscriptionAdminSchema = z
  .object({
    eventId: z.uuid({ message: 'Evento inválido' }),
    status: inscriptionStatusEnum,
    isGuest: z.boolean(),
    accountId: z.string().uuid().optional(),
    responsible: z.string().min(3, 'Responsável obrigatório'),
    email: z.email('Email inválido').optional().or(z.literal('')),
    phone: z.string().min(8, 'Telefone inválido'),
    locality: z.string().optional(),
    participants: z
      .array(participantInscriptionSchema)
      .min(1, 'Deve haver pelo menos um participante'),
  })
  .superRefine((data, ctx) => {
    if (data.isGuest) {
      // guestLocality obrigatório para guests
      if (!data.locality || data.locality.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Localidade é obrigatória para inscrições sem conta',
          path: ['locality'],
        });
      }

      // Validar campos obrigatórios de cada participante guest
      data.participants.forEach((participant, index) => {
        if (!participant.name || participant.name.trim().length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Nome é obrigatório (mínimo 3 caracteres)',
            path: [`participants`, index, 'name'],
          });
        }

        if (!participant.cpf) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'CPF é obrigatório',
            path: [`participants`, index, 'cpf'],
          });
        }

        if (!participant.birthDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Data de nascimento é obrigatória',
            path: [`participants`, index, 'birthDate'],
          });
        }

        if (!participant.gender) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Gênero é obrigatório',
            path: [`participants`, index, 'gender'],
          });
        }

        if (!participant.shirtSize) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Tamanho da camiseta é obrigatório',
            path: [`participants`, index, 'shirtSize'],
          });
        }

        if (!participant.shirtType) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Tipo da camiseta é obrigatório',
            path: [`participants`, index, 'shirtType'],
          });
        }
      });
    } else {
      // accountId obrigatório para inscrições normais
      if (!data.accountId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Conta é obrigatória para inscrições normais',
          path: ['accountId'],
        });
      }
    }
  });

export type CreateInscriptionAdminForm = z.infer<
  typeof createInscriptionAdminSchema
>;
