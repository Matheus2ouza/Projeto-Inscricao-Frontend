import { listEventsService } from '@/features/events/services/listEvents/listEventsService';
import type {
  ListEventsResponse,
  StatusEvent,
} from '@/features/events/types/listEvents/listEventsTypes';

export async function listEventsAction(params: {
  page: number;
  pageSize: number;
  status?: StatusEvent[];
}): Promise<ListEventsResponse> {
  const data = await listEventsService(params);
  return data;
}
