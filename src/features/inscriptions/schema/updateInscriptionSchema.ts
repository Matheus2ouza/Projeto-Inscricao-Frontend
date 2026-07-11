import { z } from 'zod';

export const UpdateInscriptionSchema = z.object({
  responsible: z.string().min(1, 'Nome do responsável é obrigatório'),
  email: z.email({ message: 'Informe um e-mail válido' }).optional(),
  phone: z.string().min(1, 'Telefone é obrigatório'),
});

export type UpdateInscriptionFormInputs = z.infer<
  typeof UpdateInscriptionSchema
>;
