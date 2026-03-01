import { CashRegisterStatus } from "@/features/cashRegister/types/createCashRegister/createCashRegisterTypes";
import z from "zod";

export const CreateCashRegisterSchema = z.object({
  name: z
    .string("O nome tem do caixa é obrigatório")
    .min(3, "nome muito curto"),
  regionId: z.uuid("a região tem que ser uma região valida").optional(),
  status: z.enum(Object.values(CashRegisterStatus) as [string, ...string[]], {
    error: "Status invalido",
  }),
  balance: z
    .number({
      error: "Saldo é obrigatório",
    })
    .min(0, "Saldo não pode ser negativo"),
  allocationEvent: z.uuid("Evento é obrigatório"),
});

export type CreateCashRegisterFormInputs = z.infer<
  typeof CreateCashRegisterSchema
>;
