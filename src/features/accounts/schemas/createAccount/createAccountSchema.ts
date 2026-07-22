import { RoleType } from '@/features/accounts/types/createAccount/createAccountTypes';
import z from 'zod';

export const createAccountSchema = z.object({
  username: z
    .string({ error: 'Nome do usuário é obrigatório ' })
    .min(2, { error: 'Nome de usuário não atinge o mínimo de 2 caracteres' })
    .max(30, {
      error: 'Nome do usuário ultrapassou o limite máximo de 30 caracteres',
    }),
  password: z
    .string({ error: 'Senha do usuário é obrigatório.' })
    .min(6, { error: 'Senha do usuário não atinge o mínimo de 6 caracteres' })
    .max(30, {
      error: 'Senha do usuário ultrapassou o limite máximo de 30 caracteres',
    }),
  role: z.enum(RoleType, {
    error: 'Nível de permissão inválido',
  }),
  localityIds: z.array(z.uuid()).min(1, {
    error: 'É necessário escolher pelo menos uma localidade para o usuário',
  }),
  regionId: z.uuid().optional(),
});

export type CreateAccountSchemaType = z.infer<typeof createAccountSchema>;
