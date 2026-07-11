'use server';

import { eventDetailsManagerService } from '@/features/events/services/manager/eventDetailsManager/eventDetailsManagerService';
import type { EventDetailsManagerResponse } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';

/**
 * Action: Busca detalhes de um evento para gerenciamento (admin/manager)
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function eventDetailsManagerAction(
  eventId?: string,
): Promise<EventDetailsManagerResponse> {
  const data = await eventDetailsManagerService(eventId);

  // O service já retorna o objeto tipado ou lança erro com mensagem
  // Se precisar de normalização adicional, faça aqui
  // Exemplo: converter datas, formatar campos, etc.

  return data;
}
