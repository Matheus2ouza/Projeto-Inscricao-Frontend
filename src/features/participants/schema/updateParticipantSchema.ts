import { z } from "zod";

export const UpdateParticipantSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z.string().min(1, "Gênero é obrigatório"),
  typeInscriptionId: z.string().min(1, "Tipo de inscrição é obrigatório"),
});

export type UpdateParticipantFormInputs = z.infer<
  typeof UpdateParticipantSchema
>;

