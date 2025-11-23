import { z } from "zod";

export const schema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(60, "Nome deve ter no máximo 60 caracteres"),

  quantity: z
    .string()
    .transform((v) => Number(v))
    .refine((v) => Number.isInteger(v) && v >= 1, {
      message: "Quantidade deve ser um número inteiro maior ou igual a 1",
    }),

  price: z
    .string()
    .transform((v) => Number(v))
    .refine((v) => !isNaN(v) && v >= 0.01, {
      message: "Preço deve ser um número maior ou igual a 0,01",
    }),

  validity: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Data inválida",
    })
    .transform((value) => {
      const iso = new Date(`${value}T00:00:00`).toISOString();
      return iso;
    }),

  description: z.string().optional(),
});
