import { z } from "zod";

export const UpdateGuestParticipantSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  preferredName: z.string().min(1, "Nome preferido é obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  shirtSize: z.string().min(1, "Tamanho da camiseta é obrigatório"),
  shirtType: z.string().min(1, "Tipo de camiseta é obrigatório"),
  gender: z.string().min(1, "Gênero é obrigatório"),
});

export type UpdateGuestParticipantFormInputs = z.infer<
  typeof UpdateGuestParticipantSchema
>;
