'use server';

import { updateEventLocationService } from '@/features/events/services/manager/updateEventLocation/updateEventLocationService';
import type { UpdateEventLocationInput } from '@/features/events/types/manager/updateEventLocation/updateEventLocationTypes';

/**
 * Action: Atualiza a localização de um evento
 */
export async function updateEventLocationAction(
  input: UpdateEventLocationInput,
): Promise<void> {
  await updateEventLocationService(input);
}
