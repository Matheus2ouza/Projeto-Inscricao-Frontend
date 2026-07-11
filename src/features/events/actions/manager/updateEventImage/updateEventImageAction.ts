'use server';

import { updateEventImageService } from '@/features/events/services/manager/updateEventImage/updateEventImageService';
import type { UpdateEventImageInput } from '@/features/events/types/manager/updateEventImage/updateEventImageTypes';

/**
 * Action: Atualiza a imagem de um evento
 */
export async function updateEventImageAction(
  input: UpdateEventImageInput,
): Promise<void> {
  await updateEventImageService(input);
}
