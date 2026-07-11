'use server';

import { getEventDetailsService } from '@/features/events/services/eventDetails/eventDetailsService';
import type { FindEventDetailsResponse } from '@/features/events/types/eventDetails/eventDetailsTypes';

/**
 * Action: Busca detalhes de um evento específico
 * Passa os dados adiante ou normaliza se necessário
 */
export async function getEventDetailsAction(
  eventId?: string,
): Promise<FindEventDetailsResponse> {
  const data = await getEventDetailsService(eventId);

  // O service já retorna o objeto tipado ou lança erro com mensagem
  // Se precisar de normalização adicional, faça aqui
  // Exemplo: converter datas, formatar campos, etc.

  return data;
}
