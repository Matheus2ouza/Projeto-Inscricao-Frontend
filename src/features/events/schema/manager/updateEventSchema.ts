import z from 'zod';

export const updateEventSchema = z.object({
  name: z
    .string({ error: 'O nome do evento é obrigatório' })
    .min(2, { error: 'O nome do evento é muito curto' })
    .max(80, { error: 'O nome do evento é muito longo' }),
  startDate: z.date({ error: 'A data de incio do evento é obrigatório' }),
  endDate: z.date({ error: 'A data de fim do evento é obrigatório' }),
  location: z
    .string({ error: 'A localização do evento é obrigatório' })
    .min(2, { error: 'A localização do é muito curto' })
    .max(80, { error: 'A localização do é muito longo' })
    .optional(),
  longitude: z
    .number()
    .min(-180, { error: 'Longitude inválida' })
    .max(180, { error: 'Longitude inválida' })
    .optional(),
  latitude: z
    .number()
    .min(-90, { error: 'Latitude inválida' })
    .max(90, { error: 'Latitude inválida' })
    .optional(),
});

export type UpdateEventFormType = z.infer<typeof updateEventSchema>;
