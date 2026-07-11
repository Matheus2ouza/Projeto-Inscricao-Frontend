import z from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .nonempty({ message: 'Localidade é obrigatória' })
    .min(2, { error: 'Localidade deve ter pelo menos 2 caracteres' }),
  password: z
    .string()
    .nonempty({ message: 'Senha é obrigatória' })
    .min(6, { error: 'Senha deve ter pelo menos 6 caracteres' }),
});

export type LoginType = z.infer<typeof loginSchema>;
