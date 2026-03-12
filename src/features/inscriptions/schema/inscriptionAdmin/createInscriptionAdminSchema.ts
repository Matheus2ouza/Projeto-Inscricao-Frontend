import { z } from "zod";

export const inscriptionStatusEnum = z.enum([
  "PENDING",
  "UNDER_REVIEW",
  "PAID",
  "EXPIRED",
  "CANCELLED",
]);

export const statusPaymentEnum = z.enum([
  "APPROVED",
  "UNDER_REVIEW",
  "REFUSED",
]);

export const paymentMethodEnum = z.enum(["DINHEIRO", "PIX", "CARTAO"]);

export const genderEnum = z.enum(["MASCULINO", "FEMININO"]);

export const shirtSizeEnum = z.enum(["PP", "P", "M", "G", "GG", "XG"]);

export const shirtTypeEnum = z.enum(["TRADICIONAL", "BABYLOOK"]);

/* PARTICIPANTE */

export const participantInscriptionSchema = z.object({
  accountParticipantId: z.uuid().optional(),

  name: z.string().min(3).optional(),
  preferredName: z.string().optional(),

  shirtSize: shirtSizeEnum.optional(),
  shirtType: shirtTypeEnum.optional(),

  birthDate: z.string().optional(),

  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF inválido")
    .optional(),

  gender: genderEnum.optional(),

  typeInscriptionId: z.uuid({
    message: "Tipo de inscrição inválido",
  }),
});

/* PAGAMENTO */

export const paymentInscriptionSchema = z.object({
  guestName: z.string().optional(),
  guestEmail: z.email().optional(),

  status: statusPaymentEnum,

  methodPayment: paymentMethodEnum,

  totalValue: z.number().optional(),
  totalPaid: z.number().optional(),

  installment: z.number().int().positive().optional(),

  image: z
    .file()
    .max(50_000)
    .mime(["image/jpeg", "image/jpg", "image/png", "image/webp"])
    .optional(),
});

/* INSCRIÇÃO */

export const createInscriptionAdminSchema = z.object({
  eventId: z.uuid({
    message: "Evento inválido",
  }),

  status: inscriptionStatusEnum,

  isGuest: z.boolean(),

  accountId: z.uuid().optional(),

  responsible: z.string().min(3, "Responsável obrigatório"),

  email: z.email("Email inválido"),

  phone: z.string().min(8, "Telefone inválido"),

  guestLocality: z.string().optional(),

  totalValue: z.number(),

  totalPaid: z.number(),

  participants: z
    .array(participantInscriptionSchema)
    .min(1, "Deve haver pelo menos um participante"),

  payment: paymentInscriptionSchema.optional(),
});

export type CreateInscriptionAdminForm = z.infer<
  typeof createInscriptionAdminSchema
>;
