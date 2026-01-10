import z from "zod";

export const membersSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  birthDate: z.iso.date({ message: "Data de nascimento inválida" }),
  gender: z.enum(["MASCULINO", "FEMININO"], {
    message: "Gênero inválido",
  }),
});

export type MembersSchemaType = z.infer<typeof membersSchema>;
