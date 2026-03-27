import z from "zod";

export const guestInscriptionSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  preferredName: z
    .string()
    .trim()
    .min(1, "Como quer ser chamado é obrigatório"),
  email: z.email("Email inválido"),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s9\d{4}-?\d{4}$/,
      "Informe um telefone válido no formato (DDD) 9XXXX-XXXX",
    ),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Informe um CPF válido"),
  gender: z.enum(["MASCULINO", "FEMININO"], {
    error: "Gênero inválido",
  }),
  locality: z.string().trim().min(1, "Localidade é obrigatória"),
  birthDate: z.iso.date({ error: "Data de nascimento inválida" }),
  shirtSize: z.enum(["PP", "P", "M", "G", "GG", "XG"], {
    error: "Tamanho de camiseta inválido",
  }),
});

export type GuestInscriptionSchemaType = z.infer<typeof guestInscriptionSchema>;
