import { GenderType } from '@/features/members/types/createMember/createMemberTypes';
import z from 'zod';

const unformat = (value: string) => {
  return value.replace(/\D/g, '');
};

export const membersSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  birthDate: z.iso.date({ message: 'Data de nascimento inválida' }),
  gender: z.enum(GenderType, {
    message: 'Gênero inválido',
  }),
  cpf: z
    .string()
    .transform((val) => (val ? unformat(val) : ''))
    .refine((val) => val === '' || val.length === 11, {
      message: 'CPF deve conter 11 dígitos',
    })
    .refine((val) => val === '' || /^\d+$/.test(val), {
      message: 'CPF deve conter apenas números',
    }),
});

export type MembersSchemaType = z.infer<typeof membersSchema>;
