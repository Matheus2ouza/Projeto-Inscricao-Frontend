import { z } from "zod";

export const checkoutBuyerSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Informe seu nome" })
    .max(60, { message: "Nome muito longo" }),
  lastName: z
    .string()
    .min(1, { message: "Informe seu sobrenome" })
    .max(80, { message: "Sobrenome muito longo" }),
  email: z
    .string()
    .min(1, { message: "Informe seu email" })
    .email({ message: "Email inválido" }),
  phone: z
    .string()
    .optional()
    .transform((value) => value?.trim() || "")
    .refine((value) => value.length === 0 || value.length >= 10, {
      message: "Número de telefone muito curto",
    }),
});

export type CheckoutBuyerFormValues = z.infer<typeof checkoutBuyerSchema>;

export const ticketsSelectionSchema = z.array(
  z.object({
    ticketId: z.string().min(1, { message: "Ticket inválido" }),
    quantity: z.number().int().positive({ message: "Quantidade deve ser maior que zero" }),
  })
);

export type TicketsSelectionItem = z.infer<typeof ticketsSelectionSchema>[number];

export const preSaleTicketSchema = z.object({
  ticketId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const preSaleSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  totalValue: z.number().positive(),
  image: z.string().min(1),
  tickets: z.array(preSaleTicketSchema).nonempty(),
});

export type PreSaleSchemaInput = z.infer<typeof preSaleSchema>;
