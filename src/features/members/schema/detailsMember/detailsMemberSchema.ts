import z from "zod";

export const detailsMemberSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  birthDate: z.iso.date({ message: "Data de nascimento inválida" }),
  gender: z.enum(["MASCULINO", "FEMININO"], {
    message: "Gênero inválido",
  }),
  cpf: z
    .string()
    .optional()
    .refine((cpf) => {
      if (!cpf) return true;
      return isValidCPF(cpf);
    }, "CPF inválido"),
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

export type DetailsMemberSchemaType = z.infer<typeof detailsMemberSchema>;

function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  const digits = cleaned.split("").map(Number);

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }

  let first = (sum * 10) % 11;
  if (first === 10) first = 0;
  if (first !== digits[9]) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }

  let second = (sum * 10) % 11;
  if (second === 10) second = 0;

  return second === digits[10];
}
