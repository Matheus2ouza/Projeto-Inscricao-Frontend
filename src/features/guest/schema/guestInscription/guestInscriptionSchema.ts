import z from "zod";

export const guestInscriptionSchema = z
  .object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z
      .string()
      .regex(
        /^\(\d{2}\)\s9\d{4}-?\d{4}$/,
        "Informe um telefone válido no formato (DDD) 9XXXX-XXXX",
      ),
    locality: z.string().trim().min(1, "Localidade é obrigatória"),
    participantName: z.string().trim().optional(),
    birthDate: z.string().trim().min(1, "Data de nascimento é obrigatória"),
    gender: z.string().trim().min(1, "Gênero é obrigatório"),
    typeInscriptionId: z
      .string()
      .trim()
      .min(1, "Tipo de inscrição é obrigatório"),
    isResponsibleParticipant: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.isResponsibleParticipant) {
      if (!data.participantName || data.participantName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nome do participante é obrigatório",
          path: ["participantName"],
        });
      }
    }
  });

export type GuestInscriptionSchemaFormInput = z.infer<
  typeof guestInscriptionSchema
>;
