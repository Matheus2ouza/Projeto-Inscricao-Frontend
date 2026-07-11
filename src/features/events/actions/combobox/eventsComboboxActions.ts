'use server';

import { eventsComboboxService } from '@/features/events/services/combobox/eventsComboboxServices';
import type {
  EventResponse,
  StatusEvent,
} from '@/features/events/types/combobox/comboboxEventTypes';

/**
 * Action: Busca eventos para o combobox
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function eventsComboboxAction(
  status?: StatusEvent | StatusEvent[],
): Promise<EventResponse> {
  return await eventsComboboxService(status);
}
