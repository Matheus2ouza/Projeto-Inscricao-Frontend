import { z } from "zod";

export const individualInscriptionSchema = z.object({
  responsible: z.string().min(1, "Nome do responsável é obrigatório"),
  email: z.string().optional(),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s9\d{4}-?\d{4}$/,
      "Informe um telefone válido no formato (DDD) 9XXXX-XXXX",
    ),
  participantName: z.string().min(1, "Nome do participante é obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z.string().min(1, "Gênero é obrigatório"),
  typeInscriptionId: z.string().min(1, "Tipo de inscrição é obrigatório"),
});

export type IndividualInscriptionFormInputs = z.infer<
  typeof individualInscriptionSchema
>;
