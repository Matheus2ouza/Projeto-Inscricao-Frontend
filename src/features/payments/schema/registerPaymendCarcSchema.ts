import z from "zod/v3";

export const registerPaymentCardSchema = z.object({
  name: z.string().min(10, "Nome inválido"),
  email: z.string().email("Email inválido"),
  telefone: z.string().regex(/^\d{11}$/, "Informe um telefone válido"),
  cpfCnpj: z.string().regex(/^\d{11}$/, "Informe um CPF válido"),
  address: z.string().min(10, "Endereço inválido"),
  addressNumber: z.string().min(1, "Número inválido"),
  complement: z.string().optional(),
  postalCode: z.string().min(8, "CEP inválido"),
  province: z.string().min(1, " província inválida"),
  city: z.string().regex(/^\d{7}$/, "Código IBGE inválido"),
});

export type RegisterPaymentCardSchema = z.infer<
  typeof registerPaymentCardSchema
>;
