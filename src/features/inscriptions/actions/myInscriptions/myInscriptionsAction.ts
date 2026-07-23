'use server';

import { myInscriptionsService } from '../../services/myInscriptions/myInscriptionsService';
import { MyInscriptionsResponse } from '../../types/myInscriptions/myInscriptionsTypes';

/**
 * Action: Busca as inscrições de um evento
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function myInscriptionsAction(
  eventId: string,
  page: number = 0,
  pageSize: number = 10,
  localityId?: string,
  limitTime?: string,
): Promise<MyInscriptionsResponse> {
  const result = await myInscriptionsService(
    eventId,
    page,
    pageSize,
    localityId,
    limitTime,
  );
  return result;
}
