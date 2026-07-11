'use server';

import { listEventsToInscriptionService } from '@/features/events/services/listEvents/listEventsToInscription/listEventsToInscriptionService';
import type {
  ListEventsToInscriptionParams,
  ListEventsToInscriptionResponse,
} from '@/features/events/types/listEvents/listEventsToInscription/listEventsToInscriptionTypes';

/**
 * Action: Busca eventos para inscrição com paginação e filtros
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function listEventsToInscriptionAction(
  params: ListEventsToInscriptionParams,
): Promise<ListEventsToInscriptionResponse> {
  const data = await listEventsToInscriptionService(params);

  // O service já retorna o objeto tipado ou lança erro com mensagem
  // Se precisar de normalização adicional, faça aqui
  // Exemplo: converter datas, ordenar, filtrar, etc.

  return data;
}
