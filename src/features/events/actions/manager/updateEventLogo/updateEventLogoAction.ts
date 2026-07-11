'use server';

import { updateEventLogoService } from '@/features/events/services/manager/updateEventLogo/updateEventLogoService';
import type { UpdateEventLogoInput } from '@/features/events/types/manager/updateEventLogo/updateEventLogoTypes';

/**
 * Action: Atualiza o logo de um evento
 */
export async function updateEventLogoAction(
  input: UpdateEventLogoInput,
): Promise<void> {
  await updateEventLogoService(input);
}
