import { z } from "zod";

export const ticketSaleRegisterSchema = z.object({
  name: z.string().min(3, "Informe o nome do comprador"),
  quantities: z.object({
    DINHEIRO: z.number().min(0),
    PIX: z.number().min(0),
    CARTAO: z.number().min(0),
  }),
});

export type TicketSaleRegisterSchema = z.infer<
  typeof ticketSaleRegisterSchema
>;
