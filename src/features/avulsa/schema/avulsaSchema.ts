import { z } from "zod";

export const participantPaymentSchema = z.object({
  paymentMethod: z.enum(["DINHEIRO", "PIX", "CARTAO"], {
    message: "Selecione uma forma de pagamento válida",
  }),
  value: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "Valor deve ser um número positivo"
    ),
});

export const participantSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  gender: z.enum(["MASCULINO", "FEMININO"], {
    message: "Selecione um gênero válido",
  }),
  payments: z
    .array(participantPaymentSchema)
    .min(1, "Adicione ao menos uma forma de pagamento")
    .max(3, "Máximo de 3 formas de pagamento por participante"),
});

export const createAvulsaFormSchema = z.object({
  responsible: z
    .string()
    .min(2, "Nome do responsável deve ter pelo menos 2 caracteres"),
  phone: z.union([
    z
      .string()
      .min(8, "Telefone deve ter pelo menos 8 caracteres")
      .regex(
        /^[\d\s\(\)\-\+]+$/,
        "Telefone deve conter apenas números e caracteres válidos"
      ),
    z.literal(""),
  ]),
  status: z.enum(["PENDING", "PAID", "CANCELLED", "UNDER_REVIEW"], {
    message: "Selecione um status válido",
  }),
  participants: z
    .array(participantSchema)
    .min(1, "Adicione ao menos um participante")
    .max(50, "Máximo de 50 participantes por inscrição"),
});

export type CreateAvulsaFormData = z.infer<typeof createAvulsaFormSchema>;
export type ParticipantFormData = z.infer<typeof participantSchema>;
export type ParticipantPaymentFormData = z.infer<
  typeof participantPaymentSchema
>;
