import { listEventsService } from '@/features/events/services/listEvents/listEventsToManager/listEventsToManagerService';
import type {
  ListEventsResponse,
  StatusEvent,
} from '@/features/events/types/listEvents/listEventsToManager/listEventsToManagerTypes';

export async function listEventsAction(params: {
  page: number;
  pageSize: number;
  status?: StatusEvent[];
}): Promise<ListEventsResponse> {
  const data = await listEventsService(params);
  return data;
}
