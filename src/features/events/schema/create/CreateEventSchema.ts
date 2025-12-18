import z from "zod";

export const CreateEventSchema = z.object({
  name: z.string().min(2, { message: "O nome do Evento deve ter pelo menos 2 Caracteres" }),
  image: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), {
      message: "A imagem deve ser JPEG, PNG ou WebP",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "A imagem deve ter no máximo 5MB",
    })
    .optional(),
  regionId: z.string().min(1, { message: "Região é obrigatória" }),
  accountIds: z.array(z.string()).optional(),
  location: z
    .object({
      lat: z.number().min(-90, { message: "Latitude mínima é -90" }).max(90, { message: "Latitude máxima é 90" }),
      lng: z.number().min(-180, { message: "Longitude mínima é -180" }).max(180, { message: "Longitude máxima é 180" }),
      address: z.string().optional(),
    })
    .optional(),
  openImmediately: z.boolean(),
});

export type CreateEventFormType = z.infer<typeof CreateEventSchema>;
