import { z } from 'zod';

export const updateGuestInscriptionSchema = z.object({
  locality: z.uuid(),
  guestName: z.string().min(1, 'Nome do responsável é obrigatório'),
  guestEmail: z.string().min(1, 'Email do responsável é obrigatório'),
  phone: z.string().min(1, 'Telefone do responsável é obrigatório'),
});

export type UpdateGuestInscriptionSchemaType = z.infer<
  typeof updateGuestInscriptionSchema
>;
