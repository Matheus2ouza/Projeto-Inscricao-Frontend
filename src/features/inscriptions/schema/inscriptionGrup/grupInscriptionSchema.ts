import { z } from "zod";

// Schema para membro individual
export const memberSchema = z.object({
  accountParticipantId: z.string().min(1, "ID do participante é obrigatório"),
  typeInscriptionId: z.string().min(1, "Tipo de inscrição é obrigatório"),
});

// Schema para o formulário principal
export const groupInscriptionSchema = z.object({
  responsible: z.string().min(1, "Nome do responsável é obrigatório"),
  email: z.string().optional(),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s9\d{4}-?\d{4}$/,
      "Informe um telefone válido no formato (DDD) 9XXXX-XXXX",
    ),
});

export type GroupInscriptionFormInputs = z.infer<typeof groupInscriptionSchema>;
export type MemberInput = z.infer<typeof memberSchema>;
