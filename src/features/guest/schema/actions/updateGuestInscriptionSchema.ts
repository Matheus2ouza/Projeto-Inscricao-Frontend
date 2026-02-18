import { z } from "zod";

export const UpdateGuestInscriptionSchema = z.object({
  guestName: z.string().min(1, "Nome do responsável é obrigatório"),
  guestEmail: z.string().min(1, "Email do responsável é obrigatório"),
  guestLocality: z.string().min(1, "Localidade é obrigatória"),
  phone: z.string().min(1, "Telefone do responsável é obrigatório"),
});

export type UpdateGuestInscriptionFormInputs = z.infer<
  typeof UpdateGuestInscriptionSchema
>;
