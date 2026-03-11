import z from "zod";

export const membersSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  birthDate: z.iso.date({ message: "Data de nascimento inválida" }),
  gender: z.enum(["MASCULINO", "FEMININO"], {
    message: "Gênero inválido",
  }),
  cpf: z.string().min(11, "CPF inválido").optional(),
  preferredName: z.string().optional(),
  shirtSize: z
    .enum(["PP", "P", "M", "G", "GG", "XG"], {
      message: "Tamanho de camiseta inválido",
    })
    .optional(),
  shirtType: z
    .enum(["TRADICIONAL", "BABYLOOK"], {
      message: "Tipo de camiseta inválido",
    })
    .optional(),
});

export type MembersSchemaType = z.infer<typeof membersSchema>;
