import z from "zod";
import { InscriptionMode } from "../../types/create/createEvent";

export const CreateEventSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome do Evento deve ter pelo menos 2 Caracteres" }),
  image: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "A imagem deve ser JPEG, PNG ou WebP",
      },
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "A imagem deve ter no máximo 5MB",
    })
    .optional(),
  regionId: z.string().min(1, { message: "Região é obrigatória" }),
  accountIds: z.array(z.string()).optional(),
  location: z
    .string()
    .min(2, { message: "Localização muito curta ou inválida" })
    .optional(),
  openImmediately: z.boolean(),
  allowedInscriptionModes: z.array(z.nativeEnum(InscriptionMode)).min(1, {
    message: "Selecione pelo menos um modo de inscrição",
  }),
});

export type CreateEventFormType = z.infer<typeof CreateEventSchema>;
